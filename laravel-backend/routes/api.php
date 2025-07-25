<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\ServicioController;
use App\Http\Controllers\EstilistaController;
use App\Http\Controllers\CitaController;


// Rutas públicas
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'registro']);

// Rutas protegidas con Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // CRUD de usuario
    Route::get('/user', [UsuarioController::class, 'index']);
    Route::post('/user', [UsuarioController::class, 'store']);
    Route::get('/user/{id}', [UsuarioController::class, 'registroUser']);
    Route::put('/user/{id}', [UsuarioController::class, 'update']);
    Route::delete('/user/{id}', [UsuarioController::class, 'destroy']);

    Route::get('/perfil', [UsuarioController::class, 'obtenerPerfil']);
    Route::put('/perfil', [UsuarioController::class, 'actualizarPerfil']);

    //Citas Agendadas, Canceladas y Atendidas
    Route::get('/citas', [CitaController::class, 'index']);
    Route::post('/citas', [CitaController::class, 'store']);
    Route::get('/citas/estado/{estado}', [CitaController::class, 'citasPorEstado']); // agendadas, canceladas, atendidas

    Route::get('/servicios', [ServicioController::class, 'index']);
    Route::get('/estilistas', [EstilistaController::class, 'index']);
    Route::post('/agendar-cita', [CitaController::class, 'agendar']);
    Route::get('/horas-ocupadas', [CitaController::class, 'horasOcupadas']);
    

});
