<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Usuario;
use App\Models\Perfil;

class UsuarioController extends Controller
{
    // Devuelve todos los registros de la tabla usuarios
    public function index()
    {
        $usuarios = Usuario::all();
        return response()->json($usuarios);
    }

    // Devuelve un usuario específico por ID
    public function registroUser($id)
    {
        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        return response()->json($usuario);
    }

    // Crear un nuevo usuario
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required',
            'correo' => 'required|email|unique:usuarios',
            'password' => 'required|min:6'
        ]);

        $usuario = Usuario::create([
            'nombre' => $request->nombre,
            'correo' => $request->correo,
            'password' => bcrypt($request->password),
        ]);

        return response()->json($usuario, 201);
    }

    // Actualizar un usuario existente
    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required',
            'correo' => 'required|email|unique:usuarios,correo,' . $id
        ]);

        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $usuario->update([
            'nombre' => $request->nombre,
            'correo' => $request->correo,
        ]);

        return response()->json($usuario);
    }

    // Eliminar un usuario
    public function destroy($id)
    {
        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $usuario->delete();

        return response()->json(['message' => 'Usuario eliminado con éxito'], 200);
    }

    
    public function obtenerPerfil(Request $request)
{
    $usuario = $request->user();
    $perfil = $usuario->perfil;

    if (!$perfil) {
        return response()->json(['message' => 'Perfil no encontrado'], 404);
        
    }

    return response()->json([
        'perfil' => $perfil,
        'recargo_pendiente' => $usuario->tiene_recargo_pendiente,
    ]);
}

public function actualizarPerfil(Request $request)
{
    $usuario = $request->user();

    $validated = $request->validate([
        'nombre' => 'required|string',
        'apellido' => 'required|string',
        'edad' => 'required|integer',
        'cedula' => 'required|digits:10',
        'direccion' => 'required|string',
        'telefono' => 'required|string|min:7|max:10',
    ]);

    $perfil = $usuario->perfil;

    if ($perfil) {
        $perfil->update($validated);
    } else {
        $perfil = $usuario->perfil()->create($validated);
    }

    return response()->json([
        'message' => 'Perfil actualizado correctamente',
        'perfil' => $perfil
    ]);
}
}
