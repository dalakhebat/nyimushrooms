<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('baglogs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kumbung_id')->nullable()->constrained()->nullOnDelete();
            $table->string('kode_batch');
            $table->integer('jumlah');
            $table->date('tanggal_produksi');
            $table->date('tanggal_tanam')->nullable();
            $table->date('tanggal_estimasi_selesai')->nullable();
            $table->enum('status', ['produksi', 'ditanam', 'dijual', 'selesai'])->default('produksi');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('baglogs');
    }
};
