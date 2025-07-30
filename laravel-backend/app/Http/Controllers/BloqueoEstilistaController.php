<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BloqueoEstilista;
use App\Models\Usuario;

class BloqueoEstilistaController extends Controller
{


public function bloquear(Request $request)
{
    $request->validate([
        'estilista_id' => 'required|exists:usuarios,id',
        'fechas' => 'required|array',
        'fechas.*' => 'date'
    ]);

    foreach ($request->fechas as $fecha) {
        BloqueoEstilista::firstOrCreate([
            'estilista_id' => $request->estilista_id,
            'fecha' => $fecha
        ]);
    }

    return response()->json(['message' => 'Días bloqueados']);
}

public function desbloquear($id)
{
    $bloqueo = BloqueoEstilista::findOrFail($id);
    $bloqueo->delete();
    return response()->json(['message' => 'Día desbloqueado']);
}

public function listar()
{
    return BloqueoEstilista::with('estilista')->get();
}

public function diasBloqueados(Request $request)
{
    $estilista = request()->query('estilista');

if (!$estilista) {
    return response()->json(['error' => 'Falta el nombre del estilista.'], 400);
}

$usuario = \App\Models\Usuario::where('nombre', $estilista)->first();

if (!$usuario) {
    return response()->json(['error' => 'Estilista no encontrado'], 404);
}


    $bloqueos = BloqueoEstilista::where('estilista_id', $usuario->id)
        ->pluck('fecha')
        ->toArray();

    return response()->json($bloqueos);
}

}
