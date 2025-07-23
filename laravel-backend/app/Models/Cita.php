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
        'con_recargo',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }
}
