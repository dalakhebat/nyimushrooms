<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produksi_bahan_bakus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('produksi_baglog_id')->constrained()->cascadeOnDelete();
            $table->foreignId('bahan_baku_id')->constrained()->cascadeOnDelete();
            $table->integer('jumlah_digunakan');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produksi_bahan_bakus');
    }
};
