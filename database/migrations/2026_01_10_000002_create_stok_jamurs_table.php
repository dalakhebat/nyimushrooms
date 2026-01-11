<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stok_jamurs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kumbung_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('panen_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('penjualan_jamur_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('tipe', ['masuk', 'keluar']);
            $table->decimal('berat_kg', 10, 2);
            $table->decimal('stok_sebelum', 10, 2)->default(0);
            $table->decimal('stok_sesudah', 10, 2)->default(0);
            $table->string('keterangan')->nullable();
            $table->date('tanggal');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stok_jamurs');
    }
};
