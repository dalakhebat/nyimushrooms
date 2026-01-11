<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('kumbungs', function (Blueprint $table) {
            $table->decimal('biaya_pembangunan', 15, 2)->default(0)->after('kapasitas_baglog');
            $table->decimal('biaya_baglog', 15, 2)->default(0)->after('biaya_pembangunan');
            $table->decimal('total_investasi', 15, 2)->default(0)->after('biaya_baglog');
            $table->decimal('target_panen_kg', 10, 2)->default(0)->after('total_investasi');
            $table->decimal('harga_jual_per_kg', 12, 2)->default(15000)->after('target_panen_kg');
            $table->integer('umur_baglog_bulan')->default(5)->after('harga_jual_per_kg');
        });
    }

    public function down(): void
    {
        Schema::table('kumbungs', function (Blueprint $table) {
            $table->dropColumn(['biaya_pembangunan', 'biaya_baglog', 'total_investasi', 'target_panen_kg', 'harga_jual_per_kg', 'umur_baglog_bulan']);
        });
    }
};
