<?php

namespace Database\Seeders;

use App\Models\Baglog;
use App\Models\Kumbung;
use App\Models\Panen;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class PetaKumbungDemoSeeder extends Seeder
{
    public function run(): void
    {
        // Wipe existing kumbung-related data (current state: only 2 placeholder kumbungs, no baglog/panen)
        Panen::query()->delete();
        Baglog::query()->delete();
        Kumbung::query()->delete();

        // 7 kumbung — satu untuk tiap status, biar gampang demo visual case-nya
        $plan = [
            'siap_panen',
            'panen_aktif',
            'growing',
            'baru',
            'kosong',
            'lewat',
            'nonaktif',
        ];

        $statusLabels = [
            'siap_panen'  => 'Siap Panen',
            'panen_aktif' => 'Lagi Panen',
            'growing'     => 'Growing',
            'baru'        => 'Baru Tanam',
            'kosong'      => 'Kosong',
            'lewat'       => 'Lewat Estimasi',
            'nonaktif'    => 'Nonaktif',
        ];

        $kumbungIndex = 1;

        foreach ($plan as $status) {
            // Selang-seling 25k vs 40k biar dua tipe kapasitas kelihatan
            $kapasitas = $kumbungIndex % 2 === 1 ? 25000 : 40000;

            $tanggalMulai = Carbon::now()->subDays(mt_rand(180, 730));
            $biayaBangun = $kapasitas == 25000 ? 35_000_000 : 55_000_000;
            $biayaBaglog = $kapasitas * 3500;

            $kumbung = Kumbung::create([
                'nomor'              => 'K' . str_pad($kumbungIndex, 3, '0', STR_PAD_LEFT),
                'nama'               => 'Demo — ' . $statusLabels[$status],
                'kapasitas_baglog'   => $kapasitas,
                'status'             => $status === 'nonaktif' ? 'nonaktif' : 'aktif',
                'tanggal_mulai'      => $tanggalMulai,
                'biaya_pembangunan'  => $biayaBangun,
                'biaya_baglog'       => $biayaBaglog,
                'total_investasi'    => $biayaBangun + $biayaBaglog,
                'target_panen_kg'    => $kapasitas * 0.35,
                'harga_jual_per_kg'  => 15000,
                'umur_baglog_bulan'  => 5,
            ]);

            $this->seedBaglogsAndPanen($kumbung, $status, $kapasitas);

            $kumbungIndex++;
        }

        $this->command?->info("Seeded 7 demo kumbungs (one per status).");
    }

    /**
     * Buat baglog (dan panen jika perlu) sesuai status target.
     * Status visual ditentukan oleh KumbungController::peta() dari data ini, jadi data
     * harus konsisten dengan logic-nya.
     */
    private function seedBaglogsAndPanen(Kumbung $kumbung, string $status, int $kapasitas): void
    {
        // Kosong & Nonaktif: tidak ada baglog aktif sama sekali
        if ($status === 'kosong' || $status === 'nonaktif') {
            return;
        }

        // Tentukan tanggal_tanam berdasarkan target status visual.
        // Rule controller: siap_panen butuh days_until_harvest dalam [-30, 7].
        // umur_baglog_bulan = 5 (≈150 hari), jadi:
        //   tanggal_tanam = now - X → estimasi_selesai = now + (150 - X)
        //   target days_until_harvest 0..7 → X = 143..150 (campur dengan beberapa overdue 151..170)
        $tanggalTanam = match ($status) {
            'siap_panen'  => Carbon::now()->subDays(mt_rand(146, 168)), // estimasi -18..+4 hari
            'panen_aktif' => Carbon::now()->subDays(mt_rand(70, 95)),
            'growing'     => Carbon::now()->subDays(mt_rand(35, 80)),
            'baru'        => Carbon::now()->subDays(mt_rand(3, 25)),
            'lewat'       => Carbon::now()->subDays(mt_rand(195, 240)),
            default       => Carbon::now()->subDays(60),
        };

        $tanggalProduksi = $tanggalTanam->copy()->subDays(mt_rand(7, 14));
        $tanggalEstimasiSelesai = $tanggalTanam->copy()->addMonths(5);

        // Isi 70-95% kapasitas
        $jumlah = (int) ($kapasitas * (mt_rand(70, 95) / 100));

        $baglog = Baglog::create([
            'kumbung_id'                => $kumbung->id,
            'kode_batch'                => 'BL-' . $kumbung->nomor . '-' . $tanggalTanam->format('ym'),
            'jumlah'                    => $jumlah,
            'tanggal_produksi'          => $tanggalProduksi,
            'tanggal_tanam'             => $tanggalTanam,
            'tanggal_estimasi_selesai'  => $tanggalEstimasiSelesai,
            'status'                    => 'masuk_kumbung',
        ]);

        // Untuk panen_aktif: bikin 2-5 panen dalam 14 hari terakhir
        if ($status === 'panen_aktif') {
            $panenCount = mt_rand(2, 5);
            $usedDates = [];
            for ($p = 0; $p < $panenCount; $p++) {
                // Spread panen ke berbagai tanggal unik dalam 14 hari terakhir
                do {
                    $daysAgo = mt_rand(0, 13);
                } while (in_array($daysAgo, $usedDates) && count($usedDates) < 14);
                $usedDates[] = $daysAgo;

                $panenDate = Carbon::now()->subDays($daysAgo);
                // Yield realistis: 30-80kg per panen untuk kumbung 25k, 50-130kg untuk 40k
                $beratKg = $kapasitas == 25000
                    ? mt_rand(3000, 8000) / 100  // 30-80 kg
                    : mt_rand(5000, 13000) / 100; // 50-130 kg
                $beratLayak = round($beratKg * (mt_rand(88, 96) / 100), 2);
                $beratReject = round($beratKg - $beratLayak, 2);

                Panen::create([
                    'kumbung_id'        => $kumbung->id,
                    'baglog_id'         => $baglog->id,
                    'tanggal'           => $panenDate,
                    'berat_kg'          => $beratKg,
                    'berat_layak_jual'  => $beratLayak,
                    'berat_reject'      => $beratReject,
                    'catatan'           => 'Demo data — panen rutin',
                ]);
            }
        }

        // Untuk siap_panen: bisa juga ada 1-2 panen ringan biar terasa "udah mulai panen sedikit"
        if ($status === 'siap_panen' && mt_rand(1, 100) <= 40) {
            $beratKg = mt_rand(1000, 3000) / 100;
            $beratLayak = round($beratKg * 0.93, 2);
            Panen::create([
                'kumbung_id'        => $kumbung->id,
                'baglog_id'         => $baglog->id,
                'tanggal'           => Carbon::now()->subDays(mt_rand(15, 25)),
                'berat_kg'          => $beratKg,
                'berat_layak_jual'  => $beratLayak,
                'berat_reject'      => round($beratKg - $beratLayak, 2),
                'catatan'           => 'Demo data — panen pertama',
            ]);
        }
    }
}
