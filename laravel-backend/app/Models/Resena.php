<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resena extends Model
{
    protected $fillable = ['usuario_id', 'estilista_id', 'cita_id', 'estrellas', 'comentario'];

    public function usuario() {
        return $this->belongsTo(Usuario::class);
    }

    public function estilista() {
        return $this->belongsTo(Usuario::class, 'estilista_id');
    }

    public function cita() {
        return $this->belongsTo(Cita::class);
    }
}

