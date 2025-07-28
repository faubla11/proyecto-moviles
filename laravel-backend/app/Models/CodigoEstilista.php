<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CodigoEstilista extends Model
{
    protected $fillable = ['codigo', 'usado'];
    public $timestamps = true;
}
