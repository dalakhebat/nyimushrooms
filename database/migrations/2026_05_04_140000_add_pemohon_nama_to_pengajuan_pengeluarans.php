<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pengajuan_pengeluarans', function (Blueprint $table) {
            $table->string('pemohon_nama')->nullable()->after('pemohon_id');
        });

        // Make pemohon_id nullable for public submissions
        Schema::table('pengajuan_pengeluarans', function (Blueprint $table) {
            $table->foreignId('pemohon_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('pengajuan_pengeluarans', function (Blueprint $table) {
            $table->dropColumn('pemohon_nama');
        });
    }
};
