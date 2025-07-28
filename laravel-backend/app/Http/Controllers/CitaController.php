<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use Illuminate\Http\Request;
use Carbon\Carbon;

class CitaController extends Controller
{
    public function index()
    {
        $usuario = auth()->user();
        $citas = Cita::where('usuario_id', $usuario->id)->get();
        return response()->json($citas);
    }

    public function store(Request $request)
    {
        $usuario = auth()->user();

        $validated = $request->validate([
            'servicio' => 'required|string',
            'estilista' => 'required|string',
            'fecha' => 'required|date',
            'hora' => 'required|string',
        ]);

        $existe = Cita::where('fecha', $validated['fecha'])
            ->where('hora', $validated['hora'])
            ->where('estilista', $validated['estilista'])
            ->exists();

        if ($existe) {
            return response()->json(['error' => 'Esa hora ya está ocupada para ese estilista.'], 409);
        }

        // Crear la cita con o sin recargo
        $cita = Cita::create([
            'usuario_id' => $usuario->id,
            'servicio' => $validated['servicio'],
            'estilista' => $validated['estilista'],
            'fecha' => $validated['fecha'],
            'hora' => $validated['hora'],
            'estado' => 'agendada',
            'con_recargo' => $usuario->tiene_recargo_pendiente ? true : false,
        ]);

        // Limpiar el recargo pendiente si ya se aplicó
        if ($usuario->tiene_recargo_pendiente) {
            $usuario->tiene_recargo_pendiente = false;
            $usuario->save();
        }

        return response()->json(['message' => 'Cita creada', 'cita' => $cita], 201);
    }

    public function citasPorEstado($estado)
    {
        $usuario = auth()->user();
        $query = Cita::where('usuario_id', $usuario->id);

        switch (strtolower($estado)) {
            case 'agendadas':
                $query->where('estado', 'agendada');
                break;
            case 'canceladas':
                $query->where('estado', 'cancelada');
                break;
            case 'atendidas':
                $query->where('estado', 'atendida');
                break;
            default:
                return response()->json(['message' => 'Estado inválido'], 400);
        }

        return response()->json($query->get());
    }

    public function horasOcupadas(Request $request)
    {
        $fecha = $request->query('fecha');
        $estilista = $request->query('estilista');

        if (!$fecha || !$estilista) {
            return response()->json(['error' => 'Fecha y estilista son requeridos'], 400);
        }

        $horas = Cita::where('fecha', $fecha)
            ->where('estilista', $estilista)
            ->pluck('hora')
            ->toArray();

        return response()->json($horas);
    }

    public function cancelar($id)
    {
        $usuario = auth()->user();
        $cita = Cita::findOrFail($id);

        // Verificar que sea su cita
        if ($cita->usuario_id !== $usuario->id) {
            return response()->json(['message' => 'No autorizado para cancelar esta cita.'], 403);
        }

        if ($cita->estado !== 'agendada') {
            return response()->json(['message' => 'La cita no se puede cancelar.'], 400);
        }

        $fechaHoraCita = Carbon::parse($cita->fecha . ' ' . $cita->hora);
        $ahora = Carbon::now();

        if ($fechaHoraCita->diffInMinutes($ahora, false) > -60) {
            $usuario->tiene_recargo_pendiente = true;
            $usuario->save();
        }

        $cita->estado = 'cancelada';
        $cita->save();

        return response()->json(['message' => 'Cita cancelada con éxito.']);
    }

    // Mostrar citas agendadas del estilista autenticado
public function citasEstilistaPendientes()
{
    $usuario = auth()->user();
    if (!$usuario->es_estilista) {
        return response()->json(['error' => 'No autorizado'], 403);
    }

    $citas = Cita::where('estilista', $usuario->nombre)
                ->where('estado', 'agendada')
                ->get();

    return response()->json($citas);
}

// Mostrar citas atendidas por el estilista autenticado
public function citasEstilistaAtendidas()
{
    $usuario = auth()->user();
    if (!$usuario->es_estilista) {
        return response()->json(['error' => 'No autorizado'], 403);
    }

    $citas = Cita::where('estilista', $usuario->nombre)
                ->where('estado', 'atendida')
                ->get();

    return response()->json($citas);
}

// Marcar una cita como atendida
public function marcarComoAtendida($id)
{
    $usuario = auth()->user();
    $cita = Cita::findOrFail($id);

    if ($cita->estilista !== $usuario->nombre) {
        return response()->json(['error' => 'No autorizado'], 403);
    }

    if ($cita->estado !== 'agendada') {
        return response()->json(['error' => 'Solo se pueden atender citas agendadas'], 400);
    }

    $cita->estado = 'atendida';
    $cita->save();

    return response()->json(['message' => 'Cita marcada como atendida']);
}

}
