<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('panens', function (Blueprint $table) {
            $table->decimal('berat_layak_jual', 10, 2)->default(0)->after('berat_kg');
            $table->decimal('berat_reject', 10, 2)->default(0)->after('berat_layak_jual');
        });

        // Update existing data: set berat_layak_jual = berat_kg for existing records
        DB::table('panens')->update(['berat_layak_jual' => DB::raw('berat_kg')]);
    }

    public function down(): void
    {
        Schema::table('panens', function (Blueprint $table) {
            $table->dropColumn(['berat_layak_jual', 'berat_reject']);
        });
    }
};
