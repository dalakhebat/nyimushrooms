<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::rename('investasi_transolidos', 'investasi_transolindos');
        Schema::rename('return_bulanan_transolidos', 'return_bulanan_transolindos');
        Schema::rename('panen_transolidos', 'panen_transolindos');
        Schema::rename('kas_transolido', 'kas_transolindo');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::rename('investasi_transolindos', 'investasi_transolidos');
        Schema::rename('return_bulanan_transolindos', 'return_bulanan_transolidos');
        Schema::rename('panen_transolindos', 'panen_transolidos');
        Schema::rename('kas_transolindo', 'kas_transolido');
    }
};
