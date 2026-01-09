<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Update existing 'ditanam' status to 'masuk_kumbung'
        DB::table('baglogs')
            ->where('status', 'ditanam')
            ->update(['status' => 'produksi']); // Temporarily set to produksi

        // Modify the ENUM column to include new statuses
        DB::statement("ALTER TABLE baglogs MODIFY COLUMN status ENUM('produksi', 'inkubasi', 'pembibitan', 'masuk_kumbung', 'dijual', 'selesai') DEFAULT 'produksi'");
    }

    public function down(): void
    {
        // Revert to original ENUM values
        DB::statement("ALTER TABLE baglogs MODIFY COLUMN status ENUM('produksi', 'ditanam', 'dijual', 'selesai') DEFAULT 'produksi'");
    }
};
