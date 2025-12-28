<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('penggajians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('karyawan_id')->constrained()->cascadeOnDelete();
            $table->date('periode_mulai');
            $table->date('periode_selesai');
            $table->integer('jumlah_hadir')->default(0);
            $table->integer('jumlah_izin')->default(0);
            $table->integer('jumlah_sakit')->default(0);
            $table->integer('jumlah_alpha')->default(0);
            $table->decimal('gaji_pokok', 15, 2)->default(0);
            $table->decimal('bonus', 15, 2)->default(0);
            $table->decimal('potongan', 15, 2)->default(0);
            $table->decimal('total', 15, 2)->default(0);
            $table->enum('status', ['pending', 'dibayar'])->default('pending');
            $table->date('tanggal_bayar')->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps();

            $table->index(['periode_mulai', 'periode_selesai']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penggajians');
    }
};
