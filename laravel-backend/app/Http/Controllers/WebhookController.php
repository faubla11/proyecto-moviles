<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Cita;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    public function notificarPago(Request $request)
    {
        Log::info('📬 Webhook recibido de PayPhone', ['payload' => $request->all()]);

        $transactionId = $request->input('transactionId');

        if (!$transactionId) {
            return response()->json(['error' => 'transactionId faltante'], 400);
        }

        // Consulta a PayPhone para verificar el estado real de la transacción
        $token = 'cprlRJHoZNiqkxKobf36SklEGSQ7Aod_MXjhrcmabIO7K73zWyK73X2vY88oNOa9DaqfoBBI8BXy53-_Ei45_96DOMd7QLiswOcge-ru-1JeO0S5YbFOz7unnxZwNzEGUc9uI4933mR42pM76gIKXAkCpUcFUdcLnItafvNFRbK9-SbFET_6s__wo6fWKnAbF2fw2aKugG65uzyHO4qAlyG8zKhlx_p4dgDrJQbl4pAgDEx1_yaqA8qTsu-2va0x8c_Io0vY1x5iqcNTzgcE0ztBucl8QZDJU89SeFwrYsESZ1BgAqoYD8H-7kv9JhU05vVaefl0KC2iGo-qSRAFtE3VKbI';
        $clientId = '0d8792de-848c-4dfc-95d3-b85c4d9a0072';

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $token,
            'Content-Type' => 'application/json',
        ])->post('https://pay.payphonetodoesposible.com/api/consult', [
            'id' => $transactionId,
        ]);

        if ($response->failed()) {
            Log::error('❌ Error al consultar PayPhone', ['transactionId' => $transactionId, 'body' => $response->body()]);
            return response()->json(['error' => 'No se pudo verificar el pago'], 500);
        }

        $data = $response->json();

        if (($data['transactionStatus'] ?? '') === 'Approved') {
            // Extrae el ID de la cita desde el campo reference
            $reference = $data['reference'] ?? '';
            preg_match('/#(\d+)/', $reference, $matches);
            $citaId = $matches[1] ?? null;

            if ($citaId) {
                $cita = Cita::find($citaId);
                if ($cita && $cita->estado === 'agendada') {
                    $cita->estado = 'pagada';
                    $cita->save();
                    Log::info('✅ Cita marcada como pagada desde webhook', ['cita_id' => $citaId]);
                }
            }

            return response()->json(['message' => 'Pago confirmado'], 200);
        }

        return response()->json(['message' => 'Pago no aprobado'], 200);
    }
}
