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
        Schema::create('konfigurasi_keuangans', function (Blueprint $table) {
            $table->id();

            // Kredit Investasi (28M)
            $table->decimal('kredit_investasi_limit', 20, 2)->default(28000000000);
            $table->integer('kredit_investasi_tenor')->default(120); // bulan
            $table->decimal('kredit_investasi_bunga', 5, 2)->default(6); // persen

            // Kredit Modal Kerja (2M)
            $table->decimal('kredit_modal_kerja_limit', 20, 2)->default(2000000000);
            $table->integer('kredit_modal_kerja_tenor')->default(12); // bulan
            $table->decimal('kredit_modal_kerja_bunga', 5, 2)->default(6); // persen

            // Alokasi Dana Kredit Investasi
            $table->decimal('alokasi_pembangunan_kumbung', 20, 2)->default(0);
            $table->decimal('alokasi_pembangunan_inkubasi', 20, 2)->default(0);
            $table->decimal('alokasi_pembelian_bahan_baku', 20, 2)->default(0);
            $table->decimal('alokasi_renovasi_kumbung', 20, 2)->default(0);
            $table->decimal('alokasi_pembelian_mesin', 20, 2)->default(0);
            $table->decimal('alokasi_pembelian_lahan', 20, 2)->default(0);
            $table->decimal('alokasi_dana_cadangan', 20, 2)->default(0);

            // Biaya Overhead Bulanan
            $table->decimal('overhead_sewa', 20, 2)->default(0);
            $table->decimal('overhead_listrik', 20, 2)->default(0);
            $table->decimal('overhead_air', 20, 2)->default(0);
            $table->decimal('overhead_telepon', 20, 2)->default(0);
            $table->decimal('overhead_cicilan_kendaraan', 20, 2)->default(0);
            $table->decimal('overhead_lainnya', 20, 2)->default(0);

            // Harga Jual
            $table->decimal('harga_jamur_per_kg', 20, 2)->default(15000);
            $table->decimal('harga_baglog_per_unit', 20, 2)->default(2500);

            // Target
            $table->decimal('target_profit_bulanan', 20, 2)->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('konfigurasi_keuangans');
    }
};
