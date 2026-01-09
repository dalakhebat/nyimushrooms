<?php

namespace App\Http\Controllers;

use App\Models\Baglog;
use App\Models\Kumbung;
use App\Models\Panen;
use App\Models\Karyawan;
use App\Models\PenjualanBaglog;
use App\Models\PenjualanJamur;
use App\Models\Penggajian;
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

        // Outcome = Penggajian yang sudah dibayar bulan ini
        $outcomePenggajian = Penggajian::where('status', 'dibayar')
            ->whereBetween('tanggal_bayar', [$startOfMonth, $endOfMonth])
            ->sum('total');

        // Total baglog yang ada di kumbung (status: masuk_kumbung)
        $totalBaglog = Baglog::where('status', 'masuk_kumbung')->sum('jumlah');

        $stats = [
            'totalPanenHariIni' => Panen::whereDate('tanggal', $today)->sum('berat_kg'),
            'totalPanenBulanIni' => Panen::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->sum('berat_kg'),
            'totalKumbungAktif' => Kumbung::where('status', 'aktif')->count(),
            'totalBaglog' => $totalBaglog,
            'totalKaryawan' => Karyawan::where('status', 'aktif')->count(),
            'incomeBulanIni' => $incomeBaglog + $incomeJamur,
            'outcomeBulanIni' => $outcomePenggajian,
        ];

        $recentPanen = Panen::with('kumbung')
            ->orderBy('tanggal', 'desc')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentPanen' => $recentPanen,
        ]);
    }
}
