<?php

namespace App\Http\Controllers;
use App\Models\Resena;
use App\Models\Cita;
use App\Models\Usuario;
use Illuminate\Http\Request;

class ResenaController extends Controller
{
    public function index()
    {
        return Resena::with('usuario', 'estilista')->latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'cita_id' => 'required|exists:citas,id',
            'estrellas' => 'required|integer|min:1|max:5',
            'comentario' => 'nullable|string|max:1000',
        ]);

        $cita = Cita::findOrFail($request->cita_id);

        if ($cita->estado !== 'atendida') {
            return response()->json(['error' => 'Solo puedes calificar una cita atendida'], 403);
        }

        $estilista = Usuario::where('nombre', $cita->estilista)->first();

        $resena = Resena::create([
            'usuario_id' => auth()->id(),
            'estilista_id' => $estilista?->id,
            'cita_id' => $cita->id,
            'estrellas' => $request->estrellas,
            'comentario' => $request->comentario,
        ]);

        return response()->json(['message' => 'Reseña guardada correctamente', 'resena' => $resena]);
    }

    public function filtrar(Request $request)
    {
        $query = Resena::with('usuario', 'estilista');

        if ($request->has('estilista_id')) {
            $query->where('estilista_id', $request->estilista_id);
        }

        if ($request->has('estrellas')) {
            $query->where('estrellas', $request->estrellas);
        }

        return $query->get();
    }
}
