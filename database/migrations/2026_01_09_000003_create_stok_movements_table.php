<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stok_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bahan_baku_id')->constrained()->cascadeOnDelete();
            $table->enum('tipe', ['masuk', 'keluar', 'adjustment']);
            $table->integer('jumlah');
            $table->integer('stok_sebelum');
            $table->integer('stok_sesudah');
            $table->string('referensi')->nullable(); // pembelian_id, produksi_id, dll
            $table->text('keterangan')->nullable();
            $table->date('tanggal');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stok_movements');
    }
};
