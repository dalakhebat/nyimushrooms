<?php

namespace App\Http\Controllers;

use App\Models\Kas;
use App\Models\KonfigurasiKeuangan;
use App\Models\MutasiBank;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardEksekutifController extends Controller
{
    public function index(Request $request)
    {
        $bulan = (int) $request->get('bulan', Carbon::now()->month);
        $tahun = (int) $request->get('tahun', Carbon::now()->year);

        $start = Carbon::create($tahun, $bulan, 1)->startOfMonth();
        $end = Carbon::create($tahun, $bulan, 1)->endOfMonth();
        $prevStart = (clone $start)->subMonth()->startOfMonth();
        $prevEnd = (clone $start)->subMonth()->endOfMonth();

        $saldoTotal = Kas::getSaldo();

        $masukBulanIni = Kas::where('tipe', 'masuk')
            ->whereBetween('tanggal', [$start, $end])->sum('jumlah');
        $keluarBulanIni = Kas::where('tipe', 'keluar')
            ->whereBetween('tanggal', [$start, $end])->sum('jumlah');
        $netBulanIni = $masukBulanIni - $keluarBulanIni;

        $masukBulanLalu = Kas::where('tipe', 'masuk')
            ->whereBetween('tanggal', [$prevStart, $prevEnd])->sum('jumlah');
        $keluarBulanLalu = Kas::where('tipe', 'keluar')
            ->whereBetween('tanggal', [$prevStart, $prevEnd])->sum('jumlah');
        $netBulanLalu = $masukBulanLalu - $keluarBulanLalu;

        $deltaPercent = function ($current, $previous) {
            if ($previous == 0) return $current > 0 ? 100 : 0;
            return round((($current - $previous) / abs($previous)) * 100, 1);
        };

        $cashFlowHarian = [];
        $period = collect();
        for ($d = $start->copy(); $d->lte($end); $d->addDay()) {
            $period->push($d->copy());
        }
        foreach ($period as $date) {
            $masuk = Kas::where('tipe', 'masuk')
                ->whereDate('tanggal', $date)->sum('jumlah');
            $keluar = Kas::where('tipe', 'keluar')
                ->whereDate('tanggal', $date)->sum('jumlah');
            $cashFlowHarian[] = [
                'tanggal' => $date->format('Y-m-d'),
                'label' => $date->format('d M'),
                'masuk' => (float) $masuk,
                'keluar' => (float) $keluar,
                'net' => (float) ($masuk - $keluar),
            ];
        }

        $perKategoriKeluar = Kas::where('tipe', 'keluar')
            ->whereBetween('tanggal', [$start, $end])
            ->selectRaw('kategori, SUM(jumlah) as total')
            ->groupBy('kategori')
            ->orderByDesc('total')
            ->get()
            ->map(fn($row) => [
                'kategori' => $row->kategori,
                'total' => (float) $row->total,
            ]);

        $perKategoriMasuk = Kas::where('tipe', 'masuk')
            ->whereBetween('tanggal', [$start, $end])
            ->selectRaw('kategori, SUM(jumlah) as total')
            ->groupBy('kategori')
            ->orderByDesc('total')
            ->get()
            ->map(fn($row) => [
                'kategori' => $row->kategori,
                'total' => (float) $row->total,
            ]);

        $konfigurasi = KonfigurasiKeuangan::getConfig();
        $pinjamanLimit = (float) $konfigurasi->kredit_investasi_limit;

        // Build aflopend (declining) loan schedule
        $tenor = (int) $konfigurasi->kredit_investasi_tenor;
        $bungaTahun = (float) $konfigurasi->kredit_investasi_bunga;
        $startCicilan = $konfigurasi->kredit_investasi_mulai_cicilan
            ? Carbon::parse($konfigurasi->kredit_investasi_mulai_cicilan)
            : null;

        // Aflopend (declining) BNI convention: bunga = sisa * (rate% * 31 / 360)
        $schedule = [];
        $totalPokokAll = 0;
        $totalBungaAll = 0;
        $cicilanBulanIni = null;
        $cicilanBerikutnya = null;
        $sisaHutangPokok = $pinjamanLimit;

        if ($tenor > 0 && $startCicilan) {
            $pokokPerBulan = $pinjamanLimit / $tenor;
            $sisa = $pinjamanLimit;
            $today = Carbon::now()->startOfDay();
            $bulanIni = Carbon::now()->startOfMonth();

            for ($i = 1; $i <= $tenor; $i++) {
                $bunga = $sisa * ($bungaTahun / 100) * 31 / 360;
                $tanggal = $startCicilan->copy()->addMonths($i - 1);
                $sisaSetelah = max($sisa - $pokokPerBulan, 0);
                $row = [
                    'periode' => $i,
                    'tanggal' => $tanggal->format('Y-m-d'),
                    'label' => $tanggal->format('M Y'),
                    'pokok' => round($pokokPerBulan, 2),
                    'bunga' => round($bunga, 2),
                    'total' => round($pokokPerBulan + $bunga, 2),
                    'sisa_pokok' => round($sisaSetelah, 2),
                ];
                $schedule[] = $row;
                $totalPokokAll += $row['pokok'];
                $totalBungaAll += $row['bunga'];

                $cicilanBulan = $tanggal->copy()->startOfMonth();
                if ($cicilanBulanIni === null && $cicilanBulan->equalTo($bulanIni)) {
                    $cicilanBulanIni = $row;
                }
                if ($cicilanBerikutnya === null && $cicilanBulan->gte($bulanIni)) {
                    $cicilanBerikutnya = $row;
                }

                $sisa = $sisaSetelah;
            }

            // Sisa hutang = posisi setelah pembayaran terakhir yang sudah lewat
            foreach ($schedule as $row) {
                if (Carbon::parse($row['tanggal'])->lt($bulanIni)) {
                    $sisaHutangPokok = $row['sisa_pokok'];
                }
            }
        }

        $periodeBerjalan = 0;
        if ($startCicilan) {
            foreach ($schedule as $row) {
                if (Carbon::parse($row['tanggal'])->lte(Carbon::now())) {
                    $periodeBerjalan = $row['periode'];
                }
            }
        }

        // Penggunaan aktual pinjaman = total kas keluar sejak tanggal cair
        $tanggalCair = $konfigurasi->kredit_investasi_tanggal_cair
            ? Carbon::parse($konfigurasi->kredit_investasi_tanggal_cair)
            : null;

        $penggunaanPerKategori = [];
        $totalTerpakai = 0;
        if ($tanggalCair) {
            $penggunaan = Kas::where('tipe', 'keluar')
                ->whereDate('tanggal', '>=', $tanggalCair)
                ->selectRaw('kategori, SUM(jumlah) as total, COUNT(*) as jumlah_transaksi')
                ->groupBy('kategori')
                ->orderByDesc('total')
                ->get();

            foreach ($penggunaan as $row) {
                $penggunaanPerKategori[] = [
                    'kategori' => $row->kategori,
                    'total' => (float) $row->total,
                    'jumlah_transaksi' => (int) $row->jumlah_transaksi,
                ];
                $totalTerpakai += (float) $row->total;
            }
        }
        $sisaPinjaman = max($pinjamanLimit - $totalTerpakai, 0);

        $transaksiTerbaru = Kas::orderBy('tanggal', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // === Mutasi BNI Giro ===
        $bniRekening = '2047423575';
        $latestMutasi = MutasiBank::forRekening($bniRekening)
            ->orderBy('tanggal', 'desc')
            ->orderBy('id', 'desc')
            ->first();
        $saldoBniGiro = (float) ($latestMutasi?->saldo ?? 0);
        $saldoUpdated = $latestMutasi?->tanggal?->format('Y-m-d');

        $bniDebitBulan = (float) MutasiBank::forRekening($bniRekening)->debit()
            ->whereBetween('tanggal', [$start, $end])->sum('nominal');
        $bniKreditBulan = (float) MutasiBank::forRekening($bniRekening)->kredit()
            ->whereBetween('tanggal', [$start, $end])->sum('nominal');

        $bniMutasiTerbaru = MutasiBank::forRekening($bniRekening)
            ->orderBy('tanggal', 'desc')
            ->orderBy('id', 'desc')
            ->limit(15)
            ->get();

        $bniPerKategori = MutasiBank::forRekening($bniRekening)->debit()
            ->whereBetween('tanggal', [$start, $end])
            ->selectRaw('kategori, SUM(nominal) as total, COUNT(*) as jumlah')
            ->groupBy('kategori')
            ->orderByDesc('total')
            ->get()
            ->map(fn($r) => [
                'kategori' => $r->kategori ?? 'Lainnya',
                'total' => (float) $r->total,
                'jumlah' => (int) $r->jumlah,
            ]);

        $tahunOptions = Kas::pluck('tanggal')
            ->map(fn($d) => (int) Carbon::parse($d)->year)
            ->unique()
            ->sortDesc()
            ->values();
        if ($tahunOptions->isEmpty()) {
            $tahunOptions = collect([(int) date('Y')]);
        }
        if (!$tahunOptions->contains((int) date('Y'))) {
            $tahunOptions = $tahunOptions->prepend((int) date('Y'))->values();
        }

        return Inertia::render('DashboardEksekutif', [
            'filters' => [
                'bulan' => $bulan,
                'tahun' => $tahun,
            ],
            'tahunOptions' => $tahunOptions->values(),
            'summary' => [
                'saldoTotal' => (float) $saldoTotal,
                'masukBulanIni' => (float) $masukBulanIni,
                'keluarBulanIni' => (float) $keluarBulanIni,
                'netBulanIni' => (float) $netBulanIni,
                'deltaMasuk' => $deltaPercent($masukBulanIni, $masukBulanLalu),
                'deltaKeluar' => $deltaPercent($keluarBulanIni, $keluarBulanLalu),
                'deltaNet' => $deltaPercent($netBulanIni, $netBulanLalu),
            ],
            'pinjaman' => [
                'limit' => $pinjamanLimit,
                'totalTerpakai' => $totalTerpakai,
                'sisaPinjaman' => $sisaPinjaman,
                'persentaseTerpakai' => $pinjamanLimit > 0
                    ? round(($totalTerpakai / $pinjamanLimit) * 100, 1)
                    : 0,
                'tenor' => $tenor,
                'bunga' => $bungaTahun,
                'bank' => $konfigurasi->kredit_investasi_bank,
                'tanggalCair' => $konfigurasi->kredit_investasi_tanggal_cair?->format('Y-m-d'),
                'mulaiCicilan' => $konfigurasi->kredit_investasi_mulai_cicilan?->format('Y-m-d'),
                'tipeBunga' => $konfigurasi->kredit_investasi_tipe_bunga,
                'penggunaanPerKategori' => $penggunaanPerKategori,
                'totalPokok' => round($totalPokokAll, 2),
                'totalBunga' => round($totalBungaAll, 2),
                'totalAngsuran' => round($totalPokokAll + $totalBungaAll, 2),
                'cicilanBulanIni' => $cicilanBulanIni,
                'cicilanBerikutnya' => $cicilanBerikutnya,
                'sisaHutangPokok' => round($sisaHutangPokok, 2),
                'periodeBerjalan' => $periodeBerjalan,
                'schedule' => $schedule,
            ],
            'cashFlowHarian' => $cashFlowHarian,
            'perKategoriKeluar' => $perKategoriKeluar,
            'perKategoriMasuk' => $perKategoriMasuk,
            'transaksiTerbaru' => $transaksiTerbaru,
            'mutasiBni' => [
                'rekening' => $bniRekening,
                'bank' => 'BNI Giro',
                'pemilik' => 'Defila Solusi Bersama Indonesia PT',
                'saldo' => $saldoBniGiro,
                'saldoUpdated' => $saldoUpdated,
                'debitBulan' => $bniDebitBulan,
                'kreditBulan' => $bniKreditBulan,
                'netBulan' => $bniKreditBulan - $bniDebitBulan,
                'recent' => $bniMutasiTerbaru,
                'perKategori' => $bniPerKategori,
            ],
            'serverTime' => now()->toIso8601String(),
        ]);
    }
}
