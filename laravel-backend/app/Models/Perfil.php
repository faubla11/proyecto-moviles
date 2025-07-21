<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Perfil extends Model
{
    use HasFactory;
    protected $table = 'perfiles';
    protected $fillable = [
        'usuario_id',
        'nombre',
        'apellido',
        'edad',
        'cedula',
        'direccion',
        'telefono'
    ];

    public function usuario()
    {
         return $this->belongsTo(Usuario::class, 'usuario_id');
    }
}
