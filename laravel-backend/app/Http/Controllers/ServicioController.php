<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ServicioController extends Controller
{
    public function index()
    {
        return response()->json([
            'Corte de cabello',
            'Tinte',
            'Peinado',
            'Manicure',
            'Depilación',
        ]);
    }
}
