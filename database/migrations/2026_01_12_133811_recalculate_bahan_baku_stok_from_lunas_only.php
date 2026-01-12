<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Recalculate bahan_baku stok based on lunas purchases only.
     *
     * Formula: stok = total pembelian lunas - total penggunaan produksi
     */
    public function up(): void
    {
        // Get all bahan baku
        $bahanBakus = DB::table('bahan_bakus')->get();

        foreach ($bahanBakus as $bahanBaku) {
            // Total masuk dari pembelian LUNAS saja
            $totalMasuk = DB::table('pembelian_bahan_bakus')
                ->where('bahan_baku_id', $bahanBaku->id)
                ->where('status', 'lunas')
                ->sum('jumlah');

            // Total keluar dari produksi baglog
            $totalKeluar = DB::table('produksi_bahan_bakus')
                ->where('bahan_baku_id', $bahanBaku->id)
                ->sum('jumlah_digunakan');

            // Hitung stok baru
            $stokBaru = $totalMasuk - $totalKeluar;

            // Pastikan tidak negatif
            $stokBaru = max(0, $stokBaru);

            // Update stok
            DB::table('bahan_bakus')
                ->where('id', $bahanBaku->id)
                ->update(['stok' => $stokBaru]);
        }
    }

    /**
     * Reverse is not practical - we'd need to restore old values.
     */
    public function down(): void
    {
        // Cannot reverse - old stock values are not stored
    }
};
