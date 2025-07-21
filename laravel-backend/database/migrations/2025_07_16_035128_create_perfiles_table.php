<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('perfiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('usuarios')->onDelete('cascade');

            $table->string('nombre');
            $table->string('apellido');
            $table->integer('edad');
            $table->string('cedula', 10)->unique();
            $table->string('direccion');
            $table->string('telefono', 10);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('perfiles');
    }
};
