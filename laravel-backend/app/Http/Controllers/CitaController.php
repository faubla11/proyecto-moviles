<?php
namespace App\Http\Controllers;

use App\Models\Cita;
use Illuminate\Http\Request;

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

    // ✅ Verifica si ya hay una cita en ese horario con ese estilista
    $existe = Cita::where('fecha', $validated['fecha'])
                  ->where('hora', $validated['hora'])
                  ->where('estilista', $validated['estilista'])
                  ->exists();

    if ($existe) {
        return response()->json(['error' => 'Esa hora ya está ocupada para ese estilista.'], 409);
    }

    // ✅ Si no existe, crea la cita
    $cita = Cita::create([
        'usuario_id' => $usuario->id,
        'servicio' => $validated['servicio'],
        'estilista' => $validated['estilista'],
        'fecha' => $validated['fecha'],
        'hora' => $validated['hora'],
    ]);

    return response()->json(['message' => 'Cita creada', 'cita' => $cita], 201);
}


    public function citasPorEstado($estado)
    {
        $usuario = auth()->user();
        $query = Cita::where('usuario_id', $usuario->id);

        switch ($estado) {
            case 'agendadas':
                $query->where('cancelada', false)->where('atendida', false);
                break;
            case 'canceladas':
                $query->where('cancelada', true);
                break;
            case 'atendidas':
                $query->where('atendida', true);
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
}
