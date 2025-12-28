<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kumbungs', function (Blueprint $table) {
            $table->id();
            $table->string('nomor')->unique();
            $table->string('nama');
            $table->integer('kapasitas_baglog')->default(0);
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
            $table->date('tanggal_mulai')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kumbungs');
    }
};
