<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pembayaran_kredits', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal_bayar');
            $table->integer('periode_ke'); // Bulan ke-1, 2, 3, dst
            $table->decimal('jumlah_pokok', 20, 2);
            $table->decimal('jumlah_bunga', 20, 2);
            $table->decimal('total_bayar', 20, 2);
            $table->string('metode_pembayaran')->nullable(); // transfer, tunai, dll
            $table->string('bukti_pembayaran')->nullable(); // file path
            $table->string('nomor_referensi')->nullable();
            $table->text('keterangan')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayaran_kredits');
    }
};
