<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('monitoring_kumbungs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kumbung_id')->constrained()->cascadeOnDelete();
            $table->date('tanggal');
            $table->time('waktu');
            $table->decimal('suhu', 5, 2)->nullable(); // Celcius
            $table->decimal('kelembaban', 5, 2)->nullable(); // Percentage
            $table->enum('kondisi_baglog', ['baik', 'cukup', 'buruk'])->default('baik');
            $table->boolean('sudah_spray')->default(false);
            $table->boolean('sudah_siram')->default(false);
            $table->text('catatan')->nullable();
            $table->foreignId('karyawan_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('monitoring_kumbungs');
    }
};
