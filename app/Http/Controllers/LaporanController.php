<?php

namespace App\Http\Controllers;

use App\Models\Kumbung;
use App\Models\Panen;
use App\Models\PenjualanBaglog;
use App\Models\PenjualanJamur;
use App\Models\Baglog;
use App\Models\Penggajian;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class LaporanController extends Controller
{
    public function index(Request $request)
    {
        $tipe = $request->get('tipe', 'panen');
        $bulan = $request->get('bulan', Carbon::now()->month);
        $tahun = $request->get('tahun', Carbon::now()->year);

        $startDate = Carbon::create($tahun, $bulan, 1)->startOfMonth();
        $endDate = Carbon::create($tahun, $bulan, 1)->endOfMonth();

        // Laporan Panen
        $laporanPanen = $this->getLaporanPanen($startDate, $endDate);

        // Laporan Penjualan
        $laporanPenjualan = $this->getLaporanPenjualan($startDate, $endDate);

        // Laporan Keuangan
        $laporanKeuangan = $this->getLaporanKeuangan($startDate, $endDate);

        // Summary
        $summary = [
            'totalPanen' => Panen::whereBetween('tanggal', [$startDate, $endDate])->sum('berat_kg'),
            'totalPenjualanBaglog' => PenjualanBaglog::whereBetween('tanggal', [$startDate, $endDate])->sum('total_harga'),
            'totalPenjualanJamur' => PenjualanJamur::whereBetween('tanggal', [$startDate, $endDate])->sum('total_harga'),
            'totalPenggajian' => Penggajian::whereBetween('periode_mulai', [$startDate, $endDate])->sum('total'),
        ];

        return Inertia::render('Laporan/Index', [
            'laporanPanen' => $laporanPanen,
            'laporanPenjualan' => $laporanPenjualan,
            'laporanKeuangan' => $laporanKeuangan,
            'summary' => $summary,
            'tipe' => $tipe,
            'filters' => [
                'bulan' => (int) $bulan,
                'tahun' => (int) $tahun,
                'tipe' => $tipe,
            ],
        ]);
    }

    private function getLaporanPanen($startDate, $endDate)
    {
        // Per Kumbung
        $kumbungs = Kumbung::with(['panens' => function ($query) use ($startDate, $endDate) {
            $query->whereBetween('tanggal', [$startDate, $endDate]);
        }])->get();

        $perKumbung = $kumbungs->map(function ($kumbung) {
            return [
                'id' => $kumbung->id,
                'nama' => $kumbung->nama,
                'total_panen' => $kumbung->panens->sum('berat_kg'),
                'jumlah_hari' => $kumbung->panens->count(),
            ];
        })->sortByDesc('total_panen')->values();

        // Per Hari
        $perHari = Panen::selectRaw('DATE(tanggal) as tanggal, SUM(berat_kg) as total')
            ->whereBetween('tanggal', [$startDate, $endDate])
            ->groupBy('tanggal')
            ->orderBy('tanggal')
            ->get()
            ->map(function ($item) {
                return [
                    'tanggal' => Carbon::parse($item->tanggal)->locale('id')->isoFormat('D MMM'),
                    'total' => (float) $item->total,
                ];
            });

        return [
            'perKumbung' => $perKumbung,
            'perHari' => $perHari,
            'total' => Panen::whereBetween('tanggal', [$startDate, $endDate])->sum('berat_kg'),
        ];
    }

    private function getLaporanPenjualan($startDate, $endDate)
    {
        // Penjualan Baglog per hari
        $baglogPerHari = PenjualanBaglog::selectRaw('DATE(tanggal) as tanggal, SUM(total_harga) as total, SUM(jumlah_baglog) as jumlah')
            ->whereBetween('tanggal', [$startDate, $endDate])
            ->groupBy('tanggal')
            ->orderBy('tanggal')
            ->get();

        // Penjualan Jamur per hari
        $jamurPerHari = PenjualanJamur::selectRaw('DATE(tanggal) as tanggal, SUM(total_harga) as total, SUM(berat_kg) as berat')
            ->whereBetween('tanggal', [$startDate, $endDate])
            ->groupBy('tanggal')
            ->orderBy('tanggal')
            ->get();

        // Status pembayaran
        $statusBaglog = [
            'lunas' => PenjualanBaglog::whereBetween('tanggal', [$startDate, $endDate])->where('status', 'lunas')->sum('total_harga'),
            'pending' => PenjualanBaglog::whereBetween('tanggal', [$startDate, $endDate])->where('status', 'pending')->sum('total_harga'),
        ];

        $statusJamur = [
            'lunas' => PenjualanJamur::whereBetween('tanggal', [$startDate, $endDate])->where('status', 'lunas')->sum('total_harga'),
            'pending' => PenjualanJamur::whereBetween('tanggal', [$startDate, $endDate])->where('status', 'pending')->sum('total_harga'),
        ];

        return [
            'baglog' => [
                'total' => PenjualanBaglog::whereBetween('tanggal', [$startDate, $endDate])->sum('total_harga'),
                'jumlah' => PenjualanBaglog::whereBetween('tanggal', [$startDate, $endDate])->sum('jumlah_baglog'),
                'count' => PenjualanBaglog::whereBetween('tanggal', [$startDate, $endDate])->count(),
                'status' => $statusBaglog,
            ],
            'jamur' => [
                'total' => PenjualanJamur::whereBetween('tanggal', [$startDate, $endDate])->sum('total_harga'),
                'berat' => PenjualanJamur::whereBetween('tanggal', [$startDate, $endDate])->sum('berat_kg'),
                'count' => PenjualanJamur::whereBetween('tanggal', [$startDate, $endDate])->count(),
                'status' => $statusJamur,
            ],
        ];
    }

    private function getLaporanKeuangan($startDate, $endDate)
    {
        // Pemasukan
        $pemasukanBaglog = PenjualanBaglog::whereBetween('tanggal', [$startDate, $endDate])->where('status', 'lunas')->sum('total_harga');
        $pemasukanJamur = PenjualanJamur::whereBetween('tanggal', [$startDate, $endDate])->where('status', 'lunas')->sum('total_harga');

        // Pengeluaran
        $penggajian = Penggajian::whereBetween('periode_mulai', [$startDate, $endDate])->where('status', 'dibayar')->sum('total');

        return [
            'pemasukan' => [
                'baglog' => (float) $pemasukanBaglog,
                'jamur' => (float) $pemasukanJamur,
                'total' => (float) ($pemasukanBaglog + $pemasukanJamur),
            ],
            'pengeluaran' => [
                'gaji' => (float) $penggajian,
                'total' => (float) $penggajian,
            ],
            'laba' => (float) ($pemasukanBaglog + $pemasukanJamur - $penggajian),
        ];
    }

    public function exportPdf(Request $request)
    {
        $bulan = $request->get('bulan', Carbon::now()->month);
        $tahun = $request->get('tahun', Carbon::now()->year);
        $tipe = $request->get('tipe', 'panen');

        $startDate = Carbon::create($tahun, $bulan, 1)->startOfMonth();
        $endDate = Carbon::create($tahun, $bulan, 1)->endOfMonth();

        $periodLabel = Carbon::create($tahun, $bulan, 1)->locale('id')->isoFormat('MMMM Y');

        $data = [
            'periode' => $periodLabel,
            'tipe' => $tipe,
            'laporanPanen' => $this->getLaporanPanen($startDate, $endDate),
            'laporanPenjualan' => $this->getLaporanPenjualan($startDate, $endDate),
            'laporanKeuangan' => $this->getLaporanKeuangan($startDate, $endDate),
            'cetakPada' => Carbon::now()->locale('id')->isoFormat('D MMMM Y HH:mm'),
        ];

        $pdf = Pdf::loadView('pdf.laporan', $data);
        $pdf->setPaper('A4', 'portrait');

        $filename = 'laporan-' . $tipe . '-' . $tahun . '-' . str_pad($bulan, 2, '0', STR_PAD_LEFT) . '.pdf';

        return $pdf->download($filename);
    }
}
