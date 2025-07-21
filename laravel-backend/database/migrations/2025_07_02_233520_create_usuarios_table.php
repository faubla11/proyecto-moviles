<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsuariosTable extends Migration
{
    public function up()
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('correo')->unique();
            $table->string('password'); // ← cambiado
            $table->boolean('activo')->default(false);
            $table->boolean('tiene_recargo_pendiente')->default(false);
            $table->boolean('es_estilista')->default(false);
            $table->boolean('es_admin')->default(false);
            $table->string('foto_uri')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('usuarios');
    }
}
