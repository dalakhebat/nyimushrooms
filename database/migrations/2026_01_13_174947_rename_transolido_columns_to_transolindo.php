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
        // Rename column in return_bulanan_transolindos
        Schema::table('return_bulanan_transolindos', function (Blueprint $table) {
            $table->renameColumn('share_transolido', 'share_transolindo');
        });

        // Rename column in panen_transolindos
        Schema::table('panen_transolindos', function (Blueprint $table) {
            $table->renameColumn('investasi_transolido_id', 'investasi_transolindo_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('return_bulanan_transolindos', function (Blueprint $table) {
            $table->renameColumn('share_transolindo', 'share_transolido');
        });

        Schema::table('panen_transolindos', function (Blueprint $table) {
            $table->renameColumn('investasi_transolindo_id', 'investasi_transolido_id');
        });
    }
};
