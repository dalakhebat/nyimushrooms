<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produksi_baglogs', function (Blueprint $table) {
            $table->id();
            $table->string('kode_produksi')->unique();
            $table->date('tanggal');
            $table->integer('jumlah_baglog');
            $table->enum('tahap', ['mixing', 'sterilisasi', 'inokulasi', 'inkubasi', 'selesai'])->default('mixing');
            $table->dateTime('waktu_mixing')->nullable();
            $table->dateTime('waktu_sterilisasi_mulai')->nullable();
            $table->dateTime('waktu_sterilisasi_selesai')->nullable();
            $table->dateTime('waktu_inokulasi')->nullable();
            $table->foreignId('karyawan_id')->nullable()->constrained()->nullOnDelete();
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produksi_baglogs');
    }
};
