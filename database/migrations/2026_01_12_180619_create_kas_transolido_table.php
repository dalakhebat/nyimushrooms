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
        Schema::create('kas_transolido', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal');
            $table->enum('tipe', ['masuk', 'keluar', 'reimburse']);
            $table->decimal('jumlah', 15, 2);
            $table->string('keterangan');
            $table->string('kategori')->nullable(); // return_jk, return_autoclave, operasional, pribadi, dll
            $table->foreignId('return_bulanan_id')->nullable()->constrained('return_bulanan_transolidos')->nullOnDelete();
            $table->foreignId('reimburse_ref_id')->nullable(); // reference ke transaksi keluar yang di-reimburse
            $table->enum('status', ['settled', 'pending_reimburse'])->default('settled');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kas_transolido');
    }
};
