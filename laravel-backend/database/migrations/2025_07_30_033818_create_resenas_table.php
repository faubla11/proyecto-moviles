<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('resenas', function (Blueprint $table) {
        $table->id();
        $table->foreignId('usuario_id')->constrained('usuarios')->onDelete('cascade'); // cliente
        $table->foreignId('estilista_id')->constrained('usuarios')->onDelete('cascade');
        $table->foreignId('cita_id')->constrained('citas')->onDelete('cascade');
        $table->tinyInteger('estrellas'); // 1 a 5
        $table->text('comentario')->nullable();
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resenas');
    }
};
