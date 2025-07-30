<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BloqueoEstilista extends Model
{
    protected $table = 'bloqueos_estilista';
    protected $fillable = ['estilista_id', 'fecha'];

    public function estilista()
    {
        return $this->belongsTo(Usuario::class, 'estilista_id');
    }
}
