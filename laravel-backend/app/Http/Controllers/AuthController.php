<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;
use App\Models\Perfil;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function registro(Request $request)
    {
        $messages = [
            'nombre.required' => 'El nombre es obligatorio',
            'correo.required' => 'El correo es obligatorio',
            'correo.email' => 'El correo debe ser un email válido',
            'correo.unique' => 'Este correo ya está registrado',
            'password.required' => 'La contraseña es obligatoria',
            'password.min' => 'La contraseña debe tener al menos 6 caracteres',
        ];

        $validated = $request->validate([
            'nombre' => 'required|string',
            'correo' => 'required|email|unique:usuarios',
            'password' => 'required|min:6'
        ], $messages);

        $usuario = Usuario::create([
            'nombre' => $validated['nombre'],
            'correo' => $validated['correo'],
            'password' => bcrypt($validated['password']),
        ]);

        return response()->json([
            'message' => 'Registro exitoso',
            'usuario' => $usuario,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'correo' => 'required|email',
            'password' => 'required',
        ]);

        $usuario = Usuario::where('correo', $request->correo)->first();

        if (!$usuario || !Hash::check($request->password, $usuario->password)) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401);
        }

        $token = $usuario->createToken('token_app')->plainTextToken;

        return response()->json([
            'mensaje' => 'Login exitoso',
            'usuario' => $usuario,
            'perfil' => $usuario->perfil,
            'token' => $token
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada con éxito'], 200);
    }
}
