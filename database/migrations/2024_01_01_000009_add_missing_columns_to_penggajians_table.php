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
        Schema::table('penggajians', function (Blueprint $table) {
            if (!Schema::hasColumn('penggajians', 'jumlah_izin')) {
                $table->integer('jumlah_izin')->default(0)->after('jumlah_hadir');
            }
            if (!Schema::hasColumn('penggajians', 'jumlah_sakit')) {
                $table->integer('jumlah_sakit')->default(0)->after('jumlah_izin');
            }
            if (!Schema::hasColumn('penggajians', 'jumlah_alpha')) {
                $table->integer('jumlah_alpha')->default(0)->after('jumlah_sakit');
            }
            if (!Schema::hasColumn('penggajians', 'catatan')) {
                $table->text('catatan')->nullable()->after('tanggal_bayar');
            }
            if (!Schema::hasColumn('penggajians', 'potongan_kasbon')) {
                $table->decimal('potongan_kasbon', 15, 2)->default(0)->after('potongan');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('penggajians', function (Blueprint $table) {
            $columns = ['jumlah_izin', 'jumlah_sakit', 'jumlah_alpha', 'catatan', 'potongan_kasbon'];
            foreach ($columns as $column) {
                if (Schema::hasColumn('penggajians', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
