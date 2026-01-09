<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kas', function (Blueprint $table) {
            $table->id();
            $table->string('kode_transaksi')->unique();
            $table->date('tanggal');
            $table->enum('tipe', ['masuk', 'keluar']);
            $table->string('kategori'); // operasional, gaji, pembelian, penjualan, lainnya
            $table->decimal('jumlah', 15, 2);
            $table->text('keterangan');
            $table->string('referensi')->nullable(); // ID dari transaksi terkait
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kas');
    }
};
