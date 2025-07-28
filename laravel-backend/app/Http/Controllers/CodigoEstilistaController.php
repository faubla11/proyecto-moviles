<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CodigoEstilista;
use Illuminate\Support\Str;

class CodigoEstilistaController extends Controller
{
    // Mostrar todos los códigos
    public function index()
    {
        return CodigoEstilista::orderBy('created_at', 'desc')->get();
    }

    // Generar un nuevo código aleatorio
    public function generar()
    {
        $codigo = Str::upper(Str::random(8));

        $nuevoCodigo = CodigoEstilista::create([
            'codigo' => $codigo,
            'usado' => false,
        ]);

        return response()->json($nuevoCodigo, 201);
    }
}
