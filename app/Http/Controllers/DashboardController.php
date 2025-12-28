<?php

namespace App\Http\Controllers;

use App\Models\Kumbung;
use App\Models\Panen;
use App\Models\Karyawan;
use App\Models\Transaksi;
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

        $stats = [
            'totalPanenHariIni' => Panen::whereDate('tanggal', $today)->sum('berat_kg'),
            'totalPanenBulanIni' => Panen::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->sum('berat_kg'),
            'totalKumbungAktif' => Kumbung::where('status', 'aktif')->count(),
            'totalBaglog' => Kumbung::where('status', 'aktif')->sum('kapasitas_baglog'),
            'totalKaryawan' => Karyawan::where('status', 'aktif')->count(),
            'incomeBulanIni' => Transaksi::where('tipe', 'income')
                ->whereBetween('tanggal', [$startOfMonth, $endOfMonth])
                ->sum('jumlah'),
            'outcomeBulanIni' => Transaksi::where('tipe', 'outcome')
                ->whereBetween('tanggal', [$startOfMonth, $endOfMonth])
                ->sum('jumlah'),
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
