<?php

namespace App\Http\Controllers;

use App\Models\Karyawan;
use App\Models\AbsensiScan;
use App\Models\Absensi;
use App\Models\Panen;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class KpiController extends Controller
{
    public function index(Request $request)
    {
        $bulan = $request->get('bulan', Carbon::now()->month);
        $tahun = $request->get('tahun', Carbon::now()->year);

        $startOfMonth = Carbon::create($tahun, $bulan, 1)->startOfMonth();
        $endOfMonth = Carbon::create($tahun, $bulan, 1)->endOfMonth();
        $totalHariKerja = $this->getHariKerja($startOfMonth, $endOfMonth);

        $karyawans = Karyawan::where('status', 'aktif')->get();

        $kpiData = [];
        foreach ($karyawans as $karyawan) {
            // Data dari AbsensiScan (QR)
            $scanData = AbsensiScan::where('karyawan_id', $karyawan->id)
                ->whereBetween('tanggal', [$startOfMonth, $endOfMonth])
                ->get();

            // Data dari Absensi biasa
            $absensiData = Absensi::where('karyawan_id', $karyawan->id)
                ->whereBetween('tanggal', [$startOfMonth, $endOfMonth])
                ->get();

            // Hitung kehadiran
            $hadirScan = $scanData->whereNotNull('jam_masuk')->count();
            $hadirAbsensi = $absensiData->where('status', 'hadir')->count();
            $totalHadir = $hadirScan + $hadirAbsensi;

            // Hitung keterlambatan
            $terlambatScan = $scanData->where('status', 'terlambat')->count();
            $terlambatAbsensi = $absensiData->where('terlambat', true)->count();
            $totalTerlambat = $terlambatScan + $terlambatAbsensi;

            // Rata-rata jam masuk (dari scan)
            $avgJamMasuk = null;
            if ($hadirScan > 0) {
                $totalMinutes = 0;
                foreach ($scanData->whereNotNull('jam_masuk') as $scan) {
                    $time = Carbon::parse($scan->jam_masuk);
                    $totalMinutes += $time->hour * 60 + $time->minute;
                }
                $avgMinutes = $totalMinutes / $hadirScan;
                $avgJamMasuk = sprintf('%02d:%02d', floor($avgMinutes / 60), $avgMinutes % 60);
            }

            // Rata-rata jam keluar
            $avgJamKeluar = null;
            $scanWithKeluar = $scanData->whereNotNull('jam_keluar');
            if ($scanWithKeluar->count() > 0) {
                $totalMinutes = 0;
                foreach ($scanWithKeluar as $scan) {
                    $time = Carbon::parse($scan->jam_keluar);
                    $totalMinutes += $time->hour * 60 + $time->minute;
                }
                $avgMinutes = $totalMinutes / $scanWithKeluar->count();
                $avgJamKeluar = sprintf('%02d:%02d', floor($avgMinutes / 60), $avgMinutes % 60);
            }

            // Rata-rata durasi kerja (menit)
            $avgDurasiKerja = 0;
            if ($scanWithKeluar->count() > 0) {
                $totalDurasi = 0;
                foreach ($scanWithKeluar as $scan) {
                    $masuk = Carbon::parse($scan->jam_masuk);
                    $keluar = Carbon::parse($scan->jam_keluar);
                    $totalDurasi += $masuk->diffInMinutes($keluar);
                }
                $avgDurasiKerja = round($totalDurasi / $scanWithKeluar->count());
            }

            // Persentase kehadiran
            $persentaseHadir = $totalHariKerja > 0 ? round(($totalHadir / $totalHariKerja) * 100, 1) : 0;

            // Persentase tepat waktu
            $persentaseTepatWaktu = $totalHadir > 0 ? round((($totalHadir - $totalTerlambat) / $totalHadir) * 100, 1) : 0;

            // Skor KPI (weighted)
            // 60% kehadiran + 40% tepat waktu
            $skorKpi = round(($persentaseHadir * 0.6) + ($persentaseTepatWaktu * 0.4), 1);

            $kpiData[] = [
                'karyawan' => $karyawan,
                'total_hadir' => $totalHadir,
                'total_terlambat' => $totalTerlambat,
                'total_hari_kerja' => $totalHariKerja,
                'avg_jam_masuk' => $avgJamMasuk,
                'avg_jam_keluar' => $avgJamKeluar,
                'avg_durasi_kerja' => $avgDurasiKerja,
                'persentase_hadir' => $persentaseHadir,
                'persentase_tepat_waktu' => $persentaseTepatWaktu,
                'skor_kpi' => $skorKpi,
            ];
        }

        // Sort by KPI score descending
        usort($kpiData, function ($a, $b) {
            return $b['skor_kpi'] <=> $a['skor_kpi'];
        });

        // Add ranking
        foreach ($kpiData as $index => &$data) {
            $data['ranking'] = $index + 1;
        }

        // Summary
        $summary = [
            'totalKaryawan' => count($kpiData),
            'avgSkorKpi' => count($kpiData) > 0 ? round(array_sum(array_column($kpiData, 'skor_kpi')) / count($kpiData), 1) : 0,
            'avgKehadiran' => count($kpiData) > 0 ? round(array_sum(array_column($kpiData, 'persentase_hadir')) / count($kpiData), 1) : 0,
            'avgTepatWaktu' => count($kpiData) > 0 ? round(array_sum(array_column($kpiData, 'persentase_tepat_waktu')) / count($kpiData), 1) : 0,
            'topPerformer' => count($kpiData) > 0 ? $kpiData[0] : null,
        ];

        return Inertia::render('Kpi/Index', [
            'kpiData' => $kpiData,
            'summary' => $summary,
            'bulan' => (int) $bulan,
            'tahun' => (int) $tahun,
            'totalHariKerja' => $totalHariKerja,
        ]);
    }

    public function detail(Request $request, Karyawan $karyawan)
    {
        $bulan = $request->get('bulan', Carbon::now()->month);
        $tahun = $request->get('tahun', Carbon::now()->year);

        $startOfMonth = Carbon::create($tahun, $bulan, 1)->startOfMonth();
        $endOfMonth = Carbon::create($tahun, $bulan, 1)->endOfMonth();

        // Data scan harian
        $scanData = AbsensiScan::where('karyawan_id', $karyawan->id)
            ->whereBetween('tanggal', [$startOfMonth, $endOfMonth])
            ->orderBy('tanggal')
            ->get()
            ->map(function ($scan) {
                return [
                    'tanggal' => $scan->tanggal->format('Y-m-d'),
                    'tanggal_formatted' => $scan->tanggal->locale('id')->isoFormat('D MMM Y'),
                    'jam_masuk' => $scan->jam_masuk,
                    'jam_keluar' => $scan->jam_keluar,
                    'status' => $scan->status,
                    'durasi' => $scan->durasi_kerja,
                ];
            });

        // Data absensi biasa
        $absensiData = Absensi::where('karyawan_id', $karyawan->id)
            ->whereBetween('tanggal', [$startOfMonth, $endOfMonth])
            ->orderBy('tanggal')
            ->get()
            ->map(function ($absensi) {
                return [
                    'tanggal' => $absensi->tanggal->format('Y-m-d'),
                    'tanggal_formatted' => $absensi->tanggal->locale('id')->isoFormat('D MMM Y'),
                    'status' => $absensi->status,
                    'keterangan' => $absensi->keterangan,
                ];
            });

        return Inertia::render('Kpi/Detail', [
            'karyawan' => $karyawan,
            'scanData' => $scanData,
            'absensiData' => $absensiData,
            'bulan' => (int) $bulan,
            'tahun' => (int) $tahun,
        ]);
    }

    private function getHariKerja(Carbon $start, Carbon $end): int
    {
        $count = 0;
        $current = $start->copy();

        while ($current <= $end) {
            // Skip Saturday (6) and Sunday (0)
            if (!in_array($current->dayOfWeek, [0, 6])) {
                $count++;
            }
            $current->addDay();
        }

        return $count;
    }
}
