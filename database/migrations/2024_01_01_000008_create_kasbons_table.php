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
        Schema::create('kasbons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('karyawan_id')->constrained()->cascadeOnDelete();
            $table->date('tanggal');
            $table->decimal('jumlah', 15, 2);
            $table->decimal('sisa', 15, 2); // Sisa yang belum dibayar
            $table->text('keterangan')->nullable();
            $table->enum('status', ['belum_lunas', 'lunas'])->default('belum_lunas');
            $table->timestamps();

            $table->index(['karyawan_id', 'status']);
        });

        // Tabel untuk mencatat pembayaran kasbon (bisa dari gaji atau bayar langsung)
        Schema::create('pembayaran_kasbons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kasbon_id')->constrained()->cascadeOnDelete();
            $table->foreignId('penggajian_id')->nullable()->constrained()->nullOnDelete(); // Jika dari potong gaji
            $table->date('tanggal');
            $table->decimal('jumlah', 15, 2);
            $table->enum('metode', ['potong_gaji', 'bayar_langsung'])->default('potong_gaji');
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayaran_kasbons');
        Schema::dropIfExists('kasbons');
    }
};
