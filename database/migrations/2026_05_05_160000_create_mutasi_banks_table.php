<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mutasi_banks', function (Blueprint $table) {
            $table->id();
            $table->string('rekening')->index();
            $table->string('bank')->default('BNI');
            $table->date('tanggal')->index();
            $table->time('jam')->nullable();
            $table->string('journal_no')->nullable();
            $table->text('deskripsi');
            $table->decimal('nominal', 18, 2);
            $table->enum('tipe', ['D', 'C']);
            $table->decimal('saldo', 18, 2)->nullable();
            $table->string('kategori')->nullable()->index();
            $table->string('counterparty')->nullable();
            $table->timestamps();

            $table->unique(
                ['rekening', 'tanggal', 'journal_no', 'nominal', 'tipe'],
                'unique_mutasi'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mutasi_banks');
    }
};
