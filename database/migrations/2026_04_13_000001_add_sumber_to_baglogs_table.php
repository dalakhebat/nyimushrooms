<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('baglogs', function (Blueprint $table) {
            // Sumber baglog:
            // - produksi_sendiri: dibikin sendiri (idealnya lewat ProduksiBaglog flow)
            // - beli_jadi: beli baglog jadi dari supplier luar (catat kas keluar)
            // - stok_awal: stok initial saat onboarding / migrasi data lama
            $table->enum('sumber', ['produksi_sendiri', 'beli_jadi', 'stok_awal'])
                ->default('produksi_sendiri')
                ->after('kode_batch');

            // Untuk sumber=beli_jadi: nama supplier (free text) + harga per baglog
            $table->string('supplier_nama')->nullable()->after('sumber');
            $table->decimal('harga_satuan', 15, 2)->nullable()->after('supplier_nama');
        });
    }

    public function down(): void
    {
        Schema::table('baglogs', function (Blueprint $table) {
            $table->dropColumn(['sumber', 'supplier_nama', 'harga_satuan']);
        });
    }
};
