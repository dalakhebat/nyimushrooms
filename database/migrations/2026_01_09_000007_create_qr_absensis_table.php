<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('qr_absensis', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal')->unique();
            $table->string('kode_qr')->unique();
            $table->time('berlaku_mulai')->default('06:00:00');
            $table->time('berlaku_sampai')->default('23:59:59');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('qr_absensis');
    }
};
