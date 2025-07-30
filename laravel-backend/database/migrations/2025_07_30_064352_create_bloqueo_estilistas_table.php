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
            Schema::create('bloqueos_estilista', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('estilista_id');
                $table->date('fecha');
                $table->timestamps();

                $table->foreign('estilista_id')->references('id')->on('usuarios')->onDelete('cascade');
            });
        }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bloqueo_estilistas');
    }
};
