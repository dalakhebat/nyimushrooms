<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('panen_transolidos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('investasi_transolido_id')->nullable()->constrained()->nullOnDelete();
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->string('minggu_bulan'); // e.g., "Minggu ke 1 / Bulan ke 1"
            $table->decimal('volume_kg', 10, 2); // Volume panen dalam kg
            $table->decimal('pendapatan_kotor', 15, 2); // Gross revenue
            $table->decimal('tabungan_baglog', 15, 2)->default(0); // 80% untuk baglog
            $table->decimal('profit', 15, 2)->default(0); // 20% profit
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('panen_transolidos');
    }
};
