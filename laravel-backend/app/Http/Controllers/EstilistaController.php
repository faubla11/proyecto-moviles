<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;

class EstilistaController extends Controller
{
    public function index()
{
    $estilistas = Usuario::where('es_estilista', true)->get(['id', 'nombre']);
    return response()->json($estilistas);
}
}
