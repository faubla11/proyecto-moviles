<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Cita;

class PagoController extends Controller
{
    public function iniciarPago(Request $request, $id)
    {
        Log::info('🔍 Entrando al método iniciarPago', ['cita_id' => $id]);

        $cita = Cita::findOrFail($id);
        $usuario = $request->user();

        if ($cita->usuario_id !== $usuario->id) {
            Log::warning('🚫 Usuario no autorizado para pagar esta cita.', [
                'cita_id' => $id,
                'usuario_id' => $usuario->id
            ]);
            return response()->json(['error' => 'No autorizado.'], 403);
        }

        if ($cita->estado !== 'agendada') {
            Log::warning('⚠️ La cita no está en estado agendada.', [
                'estado' => $cita->estado
            ]);
            return response()->json(['error' => 'La cita no puede ser pagada.'], 400);
        }

        $token = 'cprlRJHoZNiqkxKobf36SklEGSQ7Aod_MXjhrcmabIO7K73zWyK73X2vY88oNOa9DaqfoBBI8BXy53-_Ei45_96DOMd7QLiswOcge-ru-1JeO0S5YbFOz7unnxZwNzEGUc9uI4933mR42pM76gIKXAkCpUcFUdcLnItafvNFRbK9-SbFET_6s__wo6fWKnAbF2fw2aKugG65uzyHO4qAlyG8zKhlx_p4dgDrJQbl4pAgDEx1_yaqA8qTsu-2va0x8c_Io0vY1x5iqcNTzgcE0ztBucl8QZDJU89SeFwrYsESZ1BgAqoYD8H-7kv9JhU05vVaefl0KC2iGo-qSRAFtE3VKbI';
        $clientId = '0d8792de-848c-4dfc-95d3-b85c4d9a0072';

        $telefono = preg_replace('/[^0-9]/', '', $usuario->telefono ?? '0980518380');
        if (strlen($telefono) < 9) {
            Log::error('📵 Teléfono inválido para el pago', ['telefono' => $telefono]);
            return response()->json(['error' => 'Teléfono inválido'], 400);
        }

        $montoCentavos = intval($cita->precio * 100);

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $token,
            'Content-Type' => 'application/json',
        ])->post('https://pay.payphonetodoesposible.com/api/Sale', [
            'amount' => $montoCentavos,
            'amountWithoutTax' => $montoCentavos,
            'tax' => 0,
            'clientTransactionId' => uniqid(),
            'phoneNumber' => $telefono,
            'countryCode' => '593',
            'reference' => 'Pago cita #' . $cita->id,
            'responseUrl' => 'miapp://pago-exitoso',
            'cancelUrl' => 'miapp://pago-cancelado'
        ]);

        Log::info('📡 Respuesta de PayPhone', [
            'status' => $response->status(),
            'body' => $response->body()
        ]);

        if ($response->failed()) {
            Log::error('❌ Error al iniciar pago con PayPhone', [
                'response' => $response->body()
            ]);
            return response()->json([
                'error' => 'Error al iniciar pago',
                'detalles' => $response->body()
            ], 500);
        }

        // ✅ Añadir paymentUrl manualmente
        $data = $response->json();
        $transactionId = $data['transactionId'] ?? null;

        if (!$transactionId) {
            return response()->json(['error' => 'No se pudo obtener transactionId'], 500);
        }

        $paymentUrl = "https://pay.payphonetodoesposible.com/payment/$transactionId";

        return response()->json([
            'transactionId' => $transactionId,
            'paymentUrl' => $paymentUrl
        ]);
    }

    public function marcarComoPagada(Request $request, $id)
    {
        $cita = Cita::findOrFail($id);

        if ($cita->usuario_id !== $request->user()->id) {
            return response()->json(['error' => 'No autorizado.'], 403);
        }

        if ($cita->estado !== 'agendada') {
            return response()->json(['error' => 'La cita no se puede marcar como pagada.'], 400);
        }

        $cita->estado = 'pagada';
        $cita->save();
        Log::info('✅ Cita marcada como pagada', ['cita_id' => $cita->id]);

        return response()->json(['message' => 'Cita marcada como pagada con éxito.']);
    }

public function verificarPago(Request $request)
{
$transactionId = $request->input('transactionId');

if (!$transactionId) {
    return response()->json(['error' => 'transactionId es requerido'], 400);
}

$token = 'cprlRJHoZNiqkxKobf36SklEGSQ7Aod_MXjhrcmabIO7K73zWyK73X2vY88oNOa9DaqfoBBI8BXy53-_Ei45_96DOMd7QLiswOcge-ru-1JeO0S5YbFOz7unnxZwNzEGUc9uI4933mR42pM76gIKXAkCpUcFUdcLnItafvNFRbK9-SbFET_6s__wo6fWKnAbF2fw2aKugG65uzyHO4qAlyG8zKhlx_p4dgDrJQbl4pAgDEx1_yaqA8qTsu-2va0x8c_Io0vY1x5iqcNTzgcE0ztBucl8QZDJU89SeFwrYsESZ1BgAqoYD8H-7kv9JhU05vVaefl0KC2iGo-qSRAFtE3VKbI';

$response = Http::withHeaders([
    'Authorization' => 'Bearer ' . $token,
    'Content-Type' => 'application/json',
])->post('https://pay.payphonetodoesposible.com/api/sale/infoPayments', [
    'id' => $transactionId,
]);

if ($response->failed()) {
    Log::error('❌ Error al consultar PayPhone con transactionId', [
        'transactionId' => $transactionId,
        'respuesta' => $response->body()
    ]);
    return response()->json(['error' => 'Error al consultar PayPhone'], 500);
}

$data = $response->json();

if (($data['transactionStatus'] ?? '') === 'Approved') {
    // Extraer ID de la cita desde el campo reference
    $reference = $data['reference'] ?? '';
    preg_match('/#(\d+)/', $reference, $matches);
    $citaId = $matches[1] ?? null;

    if (!$citaId) {
        return response()->json(['error' => 'No se encontró ID de cita en la referencia'], 404);
    }

    $cita = Cita::find($citaId);

    if (!$cita) {
        return response()->json(['error' => 'Cita no encontrada'], 404);
    }

    if ($cita->estado !== 'agendada') {
        return response()->json(['message' => 'La cita ya no está agendada'], 200);
    }

    $cita->estado = 'pagada';
    $cita->save();

    Log::info('✅ Cita confirmada como pagada', ['cita_id' => $citaId]);

    return response()->json(['message' => 'Cita marcada como pagada con éxito.']);
}

return response()->json(['message' => 'El pago no ha sido aprobado aún.'], 200);
}

}
