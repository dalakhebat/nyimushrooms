<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('investasi_transolidos', function (Blueprint $table) {
            $table->id();
            $table->string('nama'); // e.g., "Jamur Kering", "Kumbung Transol 1"
            $table->string('tipe'); // "jamur_kering" atau "kumbung"
            $table->decimal('modal', 15, 2); // Amount invested
            $table->decimal('return_bulanan', 15, 2); // Monthly return
            $table->decimal('roi_tahunan', 5, 2)->nullable(); // Annual ROI percentage
            $table->date('tanggal_mulai')->nullable();
            $table->string('status')->default('active'); // active, inactive
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('investasi_transolidos');
    }
};
