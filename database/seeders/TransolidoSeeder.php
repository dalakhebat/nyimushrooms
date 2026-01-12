<?php

namespace Database\Seeders;

use App\Models\InvestasiTransolido;
use App\Models\ReturnBulananTransolido;
use App\Models\PanenTransolido;
use Illuminate\Database\Seeder;

class TransolidoSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing data
        PanenTransolido::truncate();
        ReturnBulananTransolido::truncate();
        InvestasiTransolido::truncate();

        // === INVESTASI ===

        // 1. Jamur Kering
        $jamurKering = InvestasiTransolido::create([
            'nama' => 'Jamur Kering',
            'tipe' => 'jamur_kering',
            'modal' => 765000000,
            'return_bulanan' => 5000000,
            'roi_tahunan' => 7.84,
            'tanggal_mulai' => '2024-12-28',
            'status' => 'active',
            'keterangan' => '50% split revenue',
        ]);

        // 2. Autoclave (Invest Produksi) - Starting Dec 2025
        $autoclave = InvestasiTransolido::create([
            'nama' => 'Mesin Autoclave',
            'tipe' => 'jamur_kering',
            'modal' => 150000000,
            'return_bulanan' => 1875000, // 150jt x 15%/thn = 22.5jt/thn = 1.875jt/bln
            'roi_tahunan' => 15,
            'tanggal_mulai' => '2025-12-01',
            'status' => 'active',
            'keterangan' => 'Invest produksi autoclave, hasil mulai Des 2025',
        ]);

        // 3. Kumbung Transol 1
        $kumbung1 = InvestasiTransolido::create([
            'nama' => 'Kumbung Transol 1',
            'tipe' => 'kumbung',
            'modal' => 388000000,
            'return_bulanan' => 3500000,
            'roi_tahunan' => 10.82,
            'tanggal_mulai' => '2025-07-30',
            'status' => 'active',
            'fase' => 'inkubasi',
            'minggu_fase' => 2,
            'tanggal_mulai_fase' => '2025-12-24',
            'siklus_ke' => 2,
            'keterangan' => 'Siklus 2 - Baglog LUNAS 88jt (24/12/25)',
        ]);

        // 4. Kumbung Transol 2
        $kumbung2 = InvestasiTransolido::create([
            'nama' => 'Kumbung Transol 2',
            'tipe' => 'kumbung',
            'modal' => 388000000,
            'return_bulanan' => 3500000,
            'roi_tahunan' => 10.82,
            'tanggal_mulai' => '2025-11-01',
            'status' => 'active',
            'fase' => 'panen',
            'minggu_fase' => 4,
            'tanggal_mulai_fase' => '2025-12-10',
            'siklus_ke' => 1,
            'keterangan' => 'Siklus 1 - Panen aktif',
        ]);

        // === RETURN BULANAN ===
        // Jamur Kering = 10jt total, dibagi 50:50 (5jt Transolido, 5jt Defila)
        // Autoclave = 1.875jt/bulan mulai Des 2025 (100% ke Transolido)
        $returnData = [
            ['bulan' => '2025-03', 'tanggal_terima' => '2025-03-03', 'jamur_kering' => 10000000, 'autoclave' => 0],
            ['bulan' => '2025-04', 'tanggal_terima' => '2025-04-03', 'jamur_kering' => 10000000, 'autoclave' => 0],
            ['bulan' => '2025-05', 'tanggal_terima' => '2025-05-03', 'jamur_kering' => 10000000, 'autoclave' => 0],
            ['bulan' => '2025-06', 'tanggal_terima' => '2025-06-03', 'jamur_kering' => 10000000, 'autoclave' => 0],
            ['bulan' => '2025-07', 'tanggal_terima' => '2025-07-03', 'jamur_kering' => 10000000, 'autoclave' => 0],
            ['bulan' => '2025-08', 'tanggal_terima' => '2025-08-04', 'jamur_kering' => 10000000, 'autoclave' => 0],
            ['bulan' => '2025-09', 'tanggal_terima' => '2025-09-03', 'jamur_kering' => 10000000, 'autoclave' => 0],
            ['bulan' => '2025-10', 'tanggal_terima' => '2025-10-03', 'jamur_kering' => 10000000, 'autoclave' => 0],
            ['bulan' => '2025-11', 'tanggal_terima' => '2025-11-03', 'jamur_kering' => 10000000, 'autoclave' => 0],
            ['bulan' => '2025-12', 'tanggal_terima' => '2025-12-05', 'jamur_kering' => 10000000, 'autoclave' => 1875000],
            ['bulan' => '2026-01', 'tanggal_terima' => '2026-01-03', 'jamur_kering' => 10000000, 'autoclave' => 1875000],
        ];

        foreach ($returnData as $data) {
            $shareTransolido = ($data['jamur_kering'] / 2) + $data['autoclave']; // 50% JK (5jt) + autoclave
            $shareDefila = $data['jamur_kering'] / 2; // 50% JK (5jt)

            ReturnBulananTransolido::create([
                'bulan' => $data['bulan'],
                'jamur_kering' => $data['jamur_kering'],
                'share_transolido' => $shareTransolido,
                'share_defila' => $shareDefila,
                'kumbung' => 0,
                'total' => $shareTransolido,
                'diterima' => $data['bulan'] !== '2026-01',
                'tanggal_terima' => $data['bulan'] !== '2026-01' ? $data['tanggal_terima'] : null,
                'keterangan' => $data['autoclave'] > 0 ? 'Termasuk return Autoclave' : null,
            ]);
        }

        // === PANEN TRANSOL 1 (Siklus 1 - SELESAI) ===
        $panenT1 = [
            ['tgl_mulai' => '2025-09-10', 'tgl_selesai' => '2025-09-16', 'minggu' => 'M1/B1', 'volume' => 58, 'harga' => 10200],
            ['tgl_mulai' => '2025-09-17', 'tgl_selesai' => '2025-09-23', 'minggu' => 'M2/B1', 'volume' => 244, 'harga' => 10200],
            ['tgl_mulai' => '2025-09-24', 'tgl_selesai' => '2025-09-30', 'minggu' => 'M3/B1', 'volume' => 450, 'harga' => 10200],
            ['tgl_mulai' => '2025-10-01', 'tgl_selesai' => '2025-10-07', 'minggu' => 'M4/B1', 'volume' => 491, 'harga' => 10200],
            ['tgl_mulai' => '2025-10-08', 'tgl_selesai' => '2025-10-14', 'minggu' => 'M5/B2', 'volume' => 600, 'harga' => 10200],
            ['tgl_mulai' => '2025-10-15', 'tgl_selesai' => '2025-10-21', 'minggu' => 'M6/B2', 'volume' => 756, 'harga' => 10200],
            ['tgl_mulai' => '2025-10-22', 'tgl_selesai' => '2025-10-28', 'minggu' => 'M7/B2', 'volume' => 801, 'harga' => 10200],
            ['tgl_mulai' => '2025-10-29', 'tgl_selesai' => '2025-11-04', 'minggu' => 'M8/B2', 'volume' => 825, 'harga' => 10200],
            ['tgl_mulai' => '2025-11-05', 'tgl_selesai' => '2025-11-11', 'minggu' => 'M9/B3', 'volume' => 1025, 'harga' => 7000],
            ['tgl_mulai' => '2025-11-12', 'tgl_selesai' => '2025-11-18', 'minggu' => 'M10/B3', 'volume' => 704, 'harga' => 10200],
            ['tgl_mulai' => '2025-11-19', 'tgl_selesai' => '2025-11-25', 'minggu' => 'M11/B3', 'volume' => 811, 'harga' => 10200],
            ['tgl_mulai' => '2025-11-26', 'tgl_selesai' => '2025-12-02', 'minggu' => 'M12/B3', 'volume' => 808, 'harga' => 10200],
            ['tgl_mulai' => '2025-12-03', 'tgl_selesai' => '2025-12-09', 'minggu' => 'M13/B4', 'volume' => 800, 'harga' => 10200],
            ['tgl_mulai' => '2025-12-10', 'tgl_selesai' => '2025-12-16', 'minggu' => 'M14/B4', 'volume' => 752, 'harga' => 10200],
            ['tgl_mulai' => '2025-12-17', 'tgl_selesai' => '2025-12-23', 'minggu' => 'M15/B4', 'volume' => 625, 'harga' => 10200],
            ['tgl_mulai' => '2025-12-24', 'tgl_selesai' => '2025-12-30', 'minggu' => 'M16/B4', 'volume' => 250, 'harga' => 10200, 'keterangan' => 'HABIS - Bayar Baglog 88jt'],
        ];

        foreach ($panenT1 as $data) {
            $pendapatan = $data['volume'] * $data['harga'];
            PanenTransolido::create([
                'investasi_transolido_id' => $kumbung1->id,
                'tanggal_mulai' => $data['tgl_mulai'],
                'tanggal_selesai' => $data['tgl_selesai'],
                'minggu_bulan' => $data['minggu'],
                'volume_kg' => $data['volume'],
                'pendapatan_kotor' => $pendapatan,
                'tabungan_baglog' => $pendapatan * 0.8,
                'profit' => $pendapatan * 0.2,
                'keterangan' => $data['keterangan'] ?? null,
            ]);
        }

        // === PANEN TRANSOL 2 (Siklus 1 - ONGOING) ===
        $panenT2 = [
            ['tgl_mulai' => '2025-12-10', 'tgl_selesai' => '2025-12-16', 'minggu' => 'M1/B1', 'volume' => 87, 'harga' => 10200],
            ['tgl_mulai' => '2025-12-17', 'tgl_selesai' => '2025-12-23', 'minggu' => 'M2/B1', 'volume' => 400, 'harga' => 10200],
            ['tgl_mulai' => '2025-12-24', 'tgl_selesai' => '2025-12-30', 'minggu' => 'M3/B1', 'volume' => 562, 'harga' => 10200],
            ['tgl_mulai' => '2025-12-31', 'tgl_selesai' => '2026-01-06', 'minggu' => 'M4/B1', 'volume' => 912, 'harga' => 7000],
        ];

        foreach ($panenT2 as $data) {
            $pendapatan = $data['volume'] * $data['harga'];
            PanenTransolido::create([
                'investasi_transolido_id' => $kumbung2->id,
                'tanggal_mulai' => $data['tgl_mulai'],
                'tanggal_selesai' => $data['tgl_selesai'],
                'minggu_bulan' => $data['minggu'],
                'volume_kg' => $data['volume'],
                'pendapatan_kotor' => $pendapatan,
                'tabungan_baglog' => $pendapatan * 0.8,
                'profit' => $pendapatan * 0.2,
                'keterangan' => null,
            ]);
        }
    }
}
