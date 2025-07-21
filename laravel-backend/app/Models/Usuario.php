<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Perfil;

class Usuario extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'usuarios';

    protected $fillable = [
        'nombre',
        'correo',
        'password', 
        'activo',
        'tiene_recargo_pendiente',
        'es_estilista',
        'es_admin',
        'foto_uri'
    ];

    protected $hidden = [
        'password', 
    ];

    protected $casts = [
        'password' => 'hashed',
    ];

    public $timestamps = true;

    public function perfil()
{
    return $this->hasOne(Perfil::class, 'usuario_id');
}

}
