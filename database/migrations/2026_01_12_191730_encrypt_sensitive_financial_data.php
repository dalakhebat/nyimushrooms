<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;

return new class extends Migration
{
    /**
     * Run the migrations.
     * This migration converts DECIMAL columns to TEXT for encrypted storage
     * and encrypts existing data.
     */
    public function up(): void
    {
        // 1. InvestasiTransolido - encrypt modal, return_bulanan, roi_tahunan
        $this->encryptTable('investasi_transolindos', ['modal', 'return_bulanan', 'roi_tahunan']);

        // 2. ReturnBulananTransolido - encrypt financial fields
        $this->encryptTable('return_bulanan_transolindos', ['jamur_kering', 'share_transolindo', 'share_defila', 'kumbung', 'total']);

        // 3. PanenTransolido - encrypt financial fields
        $this->encryptTable('panen_transolindos', ['volume_kg', 'pendapatan_kotor', 'tabungan_baglog', 'profit']);

        // 4. KasTransolido - encrypt jumlah
        $this->encryptTable('kas_transolindo', ['jumlah']);
    }

    /**
     * Encrypt existing data and change column type to TEXT
     */
    private function encryptTable(string $table, array $columns): void
    {
        // Check if table exists
        if (!Schema::hasTable($table)) {
            return;
        }

        // Get all existing data
        $records = DB::table($table)->get();

        // Change column types to TEXT
        Schema::table($table, function (Blueprint $t) use ($columns) {
            foreach ($columns as $column) {
                $t->text($column)->nullable()->change();
            }
        });

        // Encrypt existing data
        foreach ($records as $record) {
            $updates = [];
            foreach ($columns as $column) {
                $value = $record->$column;
                if (!is_null($value) && $value !== '') {
                    // Check if already encrypted (base64 JSON starts with eyJ)
                    if (!str_starts_with((string) $value, 'eyJ')) {
                        $updates[$column] = Crypt::encryptString((string) $value);
                    }
                }
            }

            if (!empty($updates)) {
                DB::table($table)->where('id', $record->id)->update($updates);
            }
        }
    }

    /**
     * Reverse the migrations.
     * WARNING: This will decrypt all data. Make sure APP_KEY hasn't changed!
     */
    public function down(): void
    {
        // Decrypt and change back to DECIMAL
        $this->decryptTable('investasi_transolindos', [
            'modal' => 'decimal(15,2)',
            'return_bulanan' => 'decimal(15,2)',
            'roi_tahunan' => 'decimal(5,2)',
        ]);

        $this->decryptTable('return_bulanan_transolindos', [
            'jamur_kering' => 'decimal(15,2)',
            'share_transolindo' => 'decimal(15,2)',
            'share_defila' => 'decimal(15,2)',
            'kumbung' => 'decimal(15,2)',
            'total' => 'decimal(15,2)',
        ]);

        $this->decryptTable('panen_transolindos', [
            'volume_kg' => 'decimal(10,2)',
            'pendapatan_kotor' => 'decimal(15,2)',
            'tabungan_baglog' => 'decimal(15,2)',
            'profit' => 'decimal(15,2)',
        ]);

        $this->decryptTable('kas_transolindo', [
            'jumlah' => 'decimal(15,2)',
        ]);
    }

    /**
     * Decrypt data and change column type back to original
     */
    private function decryptTable(string $table, array $columnTypes): void
    {
        if (!Schema::hasTable($table)) {
            return;
        }

        // Get all existing data and decrypt
        $records = DB::table($table)->get();

        // First decrypt the data
        foreach ($records as $record) {
            $updates = [];
            foreach (array_keys($columnTypes) as $column) {
                $value = $record->$column;
                if (!is_null($value) && $value !== '' && str_starts_with((string) $value, 'eyJ')) {
                    try {
                        $updates[$column] = Crypt::decryptString($value);
                    } catch (\Exception $e) {
                        // If decryption fails, keep the value as-is
                        $updates[$column] = $value;
                    }
                }
            }

            if (!empty($updates)) {
                DB::table($table)->where('id', $record->id)->update($updates);
            }
        }

        // Then change column types back
        Schema::table($table, function (Blueprint $t) use ($columnTypes) {
            foreach ($columnTypes as $column => $type) {
                // Parse type
                if (str_starts_with($type, 'decimal')) {
                    preg_match('/decimal\((\d+),(\d+)\)/', $type, $matches);
                    $t->decimal($column, $matches[1], $matches[2])->nullable()->change();
                }
            }
        });
    }
};
