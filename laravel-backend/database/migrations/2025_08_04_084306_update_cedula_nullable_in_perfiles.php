<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        // Paso 1: Eliminar la restricción UNIQUE anterior
        Schema::table('perfiles', function (Blueprint $table) {
            $table->dropUnique('perfiles_cedula_unique'); // <- nombre del índice
        });

        // Paso 2: Cambiar la columna a nullable y máximo 10 caracteres
        Schema::table('perfiles', function (Blueprint $table) {
            $table->string('cedula', 10)->nullable()->change();
        });

        // Paso 3: Volver a aplicar la restricción UNIQUE
        Schema::table('perfiles', function (Blueprint $table) {
            $table->unique('cedula');
        });
    }

    public function down()
    {
        // Reversión opcional
        Schema::table('perfiles', function (Blueprint $table) {
            $table->dropUnique(['cedula']);
            $table->string('cedula')->nullable(false)->change(); // vuelve a no permitir nulos si deseas
            $table->unique('cedula');
        });
    }
};
