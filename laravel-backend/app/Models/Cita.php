<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cita extends Model
{
    use HasFactory;

    protected $fillable = [
        'usuario_id',
        'servicio',
        'estilista',
        'fecha',
        'hora',
        'cancelada',
        'atendida',
        'precio',
        'con_recargo',
        'estado',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }
}
