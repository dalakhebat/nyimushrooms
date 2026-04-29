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
        Schema::table('konfigurasi_keuangans', function (Blueprint $table) {
            $table->string('kredit_investasi_bank', 100)->nullable()->after('kredit_investasi_bunga');
            $table->date('kredit_investasi_tanggal_cair')->nullable()->after('kredit_investasi_bank');
            $table->date('kredit_investasi_mulai_cicilan')->nullable()->after('kredit_investasi_tanggal_cair');
            $table->string('kredit_investasi_tipe_bunga', 20)->default('aflopend')->after('kredit_investasi_mulai_cicilan');
        });
    }

    public function down(): void
    {
        Schema::table('konfigurasi_keuangans', function (Blueprint $table) {
            $table->dropColumn([
                'kredit_investasi_bank',
                'kredit_investasi_tanggal_cair',
                'kredit_investasi_mulai_cicilan',
                'kredit_investasi_tipe_bunga',
            ]);
        });
    }
};
