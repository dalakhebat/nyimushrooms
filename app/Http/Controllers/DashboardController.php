<?php

namespace App\Http\Controllers;

use App\Models\Baglog;
use App\Models\BahanBaku;
use App\Models\Kas;
use App\Models\Kumbung;
use App\Models\MonitoringKumbung;
use App\Models\Notifikasi;
use App\Models\Panen;
use App\Models\Karyawan;
use App\Models\PenjualanBaglog;
use App\Models\PenjualanJamur;
use App\Models\Penggajian;
use App\Models\ProduksiBaglog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        // Income = Penjualan Baglog (lunas) + Penjualan Jamur (lunas) bulan ini
        $incomeBaglog = PenjualanBaglog::where('status', 'lunas')
            ->whereBetween('tanggal', [$startOfMonth, $endOfMonth])
            ->sum('total_harga');

        $incomeJamur = PenjualanJamur::where('status', 'lunas')
            ->whereBetween('tanggal', [$startOfMonth, $endOfMonth])
            ->sum('total_harga');

        // Outcome = Penggajian + Kas Keluar bulan ini
        $outcomePenggajian = Penggajian::where('status', 'dibayar')
            ->whereBetween('tanggal_bayar', [$startOfMonth, $endOfMonth])
            ->sum('total');

        $outcomeKas = Kas::where('tipe', 'keluar')
            ->whereBetween('tanggal', [$startOfMonth, $endOfMonth])
            ->sum('jumlah');

        $incomeKas = Kas::where('tipe', 'masuk')
            ->whereBetween('tanggal', [$startOfMonth, $endOfMonth])
            ->sum('jumlah');

        // Total baglog yang ada di kumbung (status: masuk_kumbung)
        $totalBaglog = Baglog::where('status', 'masuk_kumbung')->sum('jumlah');

        // Bahan baku dengan stok rendah
        $bahanBakuLowStock = BahanBaku::whereColumn('stok', '<=', 'stok_minimum')->count();

        // Produksi dalam proses
        $produksiDalamProses = ProduksiBaglog::whereNotIn('tahap', ['selesai'])->count();

        // Notifikasi belum dibaca
        $notifikasiBelumDibaca = Notifikasi::where('is_read', false)->count();

        // Saldo kas total
        $saldoKas = Kas::where('tipe', 'masuk')->sum('jumlah') - Kas::where('tipe', 'keluar')->sum('jumlah');

        // Monitoring kumbung hari ini
        $monitoringHariIni = MonitoringKumbung::whereDate('tanggal', $today)->count();

        $stats = [
            'totalPanenHariIni' => Panen::whereDate('tanggal', $today)->sum('berat_kg'),
            'totalPanenBulanIni' => Panen::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->sum('berat_kg'),
            'totalKumbungAktif' => Kumbung::where('status', 'aktif')->count(),
            'totalBaglog' => $totalBaglog,
            'totalKaryawan' => Karyawan::where('status', 'aktif')->count(),
            'incomeBulanIni' => $incomeBaglog + $incomeJamur + $incomeKas,
            'outcomeBulanIni' => $outcomePenggajian + $outcomeKas,
            'bahanBakuLowStock' => $bahanBakuLowStock,
            'produksiDalamProses' => $produksiDalamProses,
            'notifikasiBelumDibaca' => $notifikasiBelumDibaca,
            'saldoKas' => $saldoKas,
            'monitoringHariIni' => $monitoringHariIni,
        ];

        $recentPanen = Panen::with('kumbung')
            ->orderBy('tanggal', 'desc')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Recent Notifications
        $recentNotifikasi = Notifikasi::where('is_read', false)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentPanen' => $recentPanen,
            'recentNotifikasi' => $recentNotifikasi,
        ]);
    }
}
