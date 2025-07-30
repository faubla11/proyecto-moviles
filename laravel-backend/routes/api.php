<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\ServicioController;
use App\Http\Controllers\EstilistaController;
use App\Http\Controllers\CitaController;
use App\Http\Controllers\CodigoEstilistaController;
use App\Http\Controllers\ResenaController;
use App\Http\Controllers\BloqueoEstilistaController;

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
    
    Route::post('/citas/{id}/cancelar', [CitaController::class, 'cancelar']);

    Route::get('/codigos-estilista', [CodigoEstilistaController::class, 'index']);
    Route::post('/codigos-estilista', [CodigoEstilistaController::class, 'generar']);


    Route::get('/estilista/citas/pendientes', [CitaController::class, 'citasEstilistaPendientes']);
    Route::get('/estilista/citas/atendidas', [CitaController::class, 'citasEstilistaAtendidas']);
    Route::post('/estilista/citas/{id}/atender', [CitaController::class, 'marcarComoAtendida']);

    
    Route::get('/resenas', [ResenaController::class, 'index']);
    Route::post('/resenas', [ResenaController::class, 'store']);
    Route::get('/resenas/filtrar', [ResenaController::class, 'filtrar']);


    Route::post('/bloquear-estilista', [BloqueoEstilistaController::class, 'bloquear']);
    Route::delete('/bloquear-estilista/{id}', [BloqueoEstilistaController::class, 'desbloquear']);
    Route::get('/bloquear-estilista', [BloqueoEstilistaController::class, 'listar']);
    Route::get('/dias-bloqueados', [BloqueoEstilistaController::class, 'diasBloqueados']);

});
