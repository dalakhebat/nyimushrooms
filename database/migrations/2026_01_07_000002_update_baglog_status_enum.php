<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Update existing 'ditanam' status to 'masuk_kumbung'
        DB::table('baglogs')
            ->where('status', 'ditanam')
            ->update(['status' => 'masuk_kumbung']);

        // Only run MySQL-specific ENUM modification for MySQL/MariaDB
        // SQLite doesn't support ENUM type anyway - it stores as TEXT
        if (DB::connection()->getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE baglogs MODIFY COLUMN status ENUM('produksi', 'inkubasi', 'pembibitan', 'masuk_kumbung', 'dijual', 'selesai') DEFAULT 'produksi'");
        }
    }

    public function down(): void
    {
        // Revert status changes
        DB::table('baglogs')
            ->where('status', 'masuk_kumbung')
            ->update(['status' => 'ditanam']);

        // Only run MySQL-specific ENUM modification for MySQL/MariaDB
        if (DB::connection()->getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE baglogs MODIFY COLUMN status ENUM('produksi', 'ditanam', 'dijual', 'selesai') DEFAULT 'produksi'");
        }
    }
};
