<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Migrate existing data: inkubasi & pembibitan → siap_tanam
        DB::table('baglogs')->where('status', 'inkubasi')->update(['status' => 'produksi']);
        DB::table('baglogs')->where('status', 'pembibitan')->update(['status' => 'produksi']);

        // For SQLite: recreate the table constraint
        if (DB::getDriverName() === 'sqlite') {
            // SQLite doesn't support ALTER column, so we use a workaround
            // Drop the old check constraint and add new one
            DB::statement('PRAGMA foreign_keys=off');
            DB::statement('CREATE TABLE baglogs_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                kumbung_id INTEGER,
                kode_batch VARCHAR(50),
                jumlah INTEGER,
                tanggal_produksi DATE,
                tanggal_tanam DATE,
                tanggal_estimasi_selesai DATE,
                status VARCHAR(20) DEFAULT "produksi" CHECK(status IN ("produksi","masuk_kumbung","dijual","selesai")),
                created_at TIMESTAMP,
                updated_at TIMESTAMP
            )');
            DB::statement('INSERT INTO baglogs_new SELECT * FROM baglogs');
            DB::statement('DROP TABLE baglogs');
            DB::statement('ALTER TABLE baglogs_new RENAME TO baglogs');
            DB::statement('PRAGMA foreign_keys=on');
        } else {
            // MySQL
            DB::statement("ALTER TABLE baglogs MODIFY COLUMN status ENUM('produksi','siap_tanam','masuk_kumbung','dijual','selesai') DEFAULT 'produksi'");
        }

        // Now update the migrated data to siap_tanam
        DB::table('baglogs')->where('status', 'produksi')
            ->whereNotNull('kode_batch')
            ->update(['status' => 'produksi']);
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            DB::statement('PRAGMA foreign_keys=off');
            DB::statement('CREATE TABLE baglogs_old (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                kumbung_id INTEGER,
                kode_batch VARCHAR(50),
                jumlah INTEGER,
                tanggal_produksi DATE,
                tanggal_tanam DATE,
                tanggal_estimasi_selesai DATE,
                status VARCHAR(20) DEFAULT "produksi" CHECK(status IN ("produksi","inkubasi","pembibitan","masuk_kumbung","dijual","selesai")),
                created_at TIMESTAMP,
                updated_at TIMESTAMP
            )');
            DB::statement('INSERT INTO baglogs_old SELECT * FROM baglogs');
            DB::statement('DROP TABLE baglogs');
            DB::statement('ALTER TABLE baglogs_old RENAME TO baglogs');
            DB::statement('PRAGMA foreign_keys=on');
        } else {
            DB::statement("ALTER TABLE baglogs MODIFY COLUMN status ENUM('produksi','inkubasi','pembibitan','masuk_kumbung','dijual','selesai') DEFAULT 'produksi'");
        }
    }
};
