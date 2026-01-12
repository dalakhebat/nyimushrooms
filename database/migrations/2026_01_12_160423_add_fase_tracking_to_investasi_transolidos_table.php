<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('investasi_transolidos', function (Blueprint $table) {
            $table->enum('fase', ['persiapan', 'inkubasi', 'panen', 'istirahat'])->default('persiapan')->after('status');
            $table->integer('minggu_fase')->default(1)->after('fase');
            $table->date('tanggal_mulai_fase')->nullable()->after('minggu_fase');
            $table->integer('siklus_ke')->default(1)->after('tanggal_mulai_fase');
        });
    }

    public function down(): void
    {
        Schema::table('investasi_transolidos', function (Blueprint $table) {
            $table->dropColumn(['fase', 'minggu_fase', 'tanggal_mulai_fase', 'siklus_ke']);
        });
    }
};
