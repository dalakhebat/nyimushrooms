<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pengaturan_gajis', function (Blueprint $table) {
            $table->id();
            $table->enum('tipe_gaji', ['bulanan', 'mingguan', 'borongan']);
            $table->enum('status_absensi', ['hadir', 'izin', 'sakit', 'alpha']);
            $table->decimal('persentase_potongan', 5, 2)->default(0); // Persentase dari gaji harian
            $table->text('keterangan')->nullable();
            $table->timestamps();

            $table->unique(['tipe_gaji', 'status_absensi']);
        });

        // Insert default values
        $defaults = [
            // Bulanan: gaji / 30 hari
            ['tipe_gaji' => 'bulanan', 'status_absensi' => 'hadir', 'persentase_potongan' => 0, 'keterangan' => 'Tidak ada potongan'],
            ['tipe_gaji' => 'bulanan', 'status_absensi' => 'izin', 'persentase_potongan' => 0, 'keterangan' => 'Izin dengan surat, tidak dipotong'],
            ['tipe_gaji' => 'bulanan', 'status_absensi' => 'sakit', 'persentase_potongan' => 0, 'keterangan' => 'Sakit dengan surat dokter, tidak dipotong'],
            ['tipe_gaji' => 'bulanan', 'status_absensi' => 'alpha', 'persentase_potongan' => 100, 'keterangan' => 'Tidak hadir tanpa keterangan, potong 1 hari'],

            // Mingguan: gaji / 7 hari
            ['tipe_gaji' => 'mingguan', 'status_absensi' => 'hadir', 'persentase_potongan' => 0, 'keterangan' => 'Tidak ada potongan'],
            ['tipe_gaji' => 'mingguan', 'status_absensi' => 'izin', 'persentase_potongan' => 0, 'keterangan' => 'Izin dengan surat, tidak dipotong'],
            ['tipe_gaji' => 'mingguan', 'status_absensi' => 'sakit', 'persentase_potongan' => 0, 'keterangan' => 'Sakit dengan surat dokter, tidak dipotong'],
            ['tipe_gaji' => 'mingguan', 'status_absensi' => 'alpha', 'persentase_potongan' => 100, 'keterangan' => 'Tidak hadir tanpa keterangan, potong 1 hari'],

            // Borongan: dihitung per hari hadir, jadi tidak ada potongan konsepnya
            ['tipe_gaji' => 'borongan', 'status_absensi' => 'hadir', 'persentase_potongan' => 0, 'keterangan' => 'Dihitung per kehadiran'],
            ['tipe_gaji' => 'borongan', 'status_absensi' => 'izin', 'persentase_potongan' => 0, 'keterangan' => 'Tidak dihitung, tidak dipotong'],
            ['tipe_gaji' => 'borongan', 'status_absensi' => 'sakit', 'persentase_potongan' => 0, 'keterangan' => 'Tidak dihitung, tidak dipotong'],
            ['tipe_gaji' => 'borongan', 'status_absensi' => 'alpha', 'persentase_potongan' => 0, 'keterangan' => 'Tidak dihitung, tidak dipotong'],
        ];

        foreach ($defaults as $default) {
            DB::table('pengaturan_gajis')->insert(array_merge($default, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengaturan_gajis');
    }
};
