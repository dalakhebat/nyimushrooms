<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('return_bulanan_transolidos', function (Blueprint $table) {
            $table->id();
            $table->string('bulan'); // e.g., "2025-03" format YYYY-MM
            $table->decimal('jamur_kering', 15, 2)->default(0); // Gross dari jamur kering
            $table->decimal('share_transolido', 15, 2)->default(0); // 50% dari jamur kering
            $table->decimal('share_defila', 15, 2)->default(0); // 50% untuk Defila
            $table->decimal('kumbung', 15, 2)->default(0); // Return dari kumbung
            $table->decimal('total', 15, 2)->default(0); // share_transolido + kumbung
            $table->boolean('diterima')->default(false); // Sudah diterima atau belum
            $table->date('tanggal_terima')->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('return_bulanan_transolidos');
    }
};
