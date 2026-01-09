<?php

namespace App\Http\Controllers;

use App\Models\Kas;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class KasController extends Controller
{
    public function index(Request $request)
    {
        $query = Kas::query();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('kode_transaksi', 'like', '%' . $request->search . '%')
                  ->orWhere('keterangan', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('tipe')) {
            $query->where('tipe', $request->tipe);
        }

        if ($request->filled('kategori')) {
            $query->where('kategori', $request->kategori);
        }

        if ($request->filled('bulan')) {
            $query->whereMonth('tanggal', $request->bulan);
        }

        if ($request->filled('tahun')) {
            $query->whereYear('tanggal', $request->tahun);
        }

        $transactions = $query->orderBy('tanggal', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        // Summary
        $saldoTotal = Kas::getSaldo();
        $saldoBulanIni = Kas::getSaldoBulanIni();

        // Per kategori bulan ini
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        $perKategori = Kas::whereBetween('tanggal', [$startOfMonth, $endOfMonth])
            ->selectRaw('kategori, tipe, SUM(jumlah) as total')
            ->groupBy('kategori', 'tipe')
            ->get()
            ->groupBy('kategori');

        $kategoris = ['operasional', 'gaji', 'pembelian', 'penjualan', 'kasbon', 'lainnya'];

        return Inertia::render('Kas/Index', [
            'transactions' => $transactions,
            'saldoTotal' => $saldoTotal,
            'saldoBulanIni' => $saldoBulanIni,
            'perKategori' => $perKategori,
            'kategoris' => $kategoris,
            'filters' => $request->only(['search', 'tipe', 'kategori', 'bulan', 'tahun']),
        ]);
    }

    public function create()
    {
        $kategoris = ['operasional', 'gaji', 'pembelian', 'penjualan', 'kasbon', 'lainnya'];

        return Inertia::render('Kas/Create', [
            'kategoris' => $kategoris,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'tipe' => 'required|in:masuk,keluar',
            'kategori' => 'required|string',
            'jumlah' => 'required|numeric|min:1',
            'keterangan' => 'required|string',
        ]);

        $validated['kode_transaksi'] = Kas::generateKode();

        Kas::create($validated);

        return redirect()->route('kas.index')
            ->with('success', 'Transaksi kas berhasil ditambahkan');
    }

    public function edit(Kas $ka)
    {
        $kategoris = ['operasional', 'gaji', 'pembelian', 'penjualan', 'kasbon', 'lainnya'];

        return Inertia::render('Kas/Edit', [
            'transaksi' => $ka,
            'kategoris' => $kategoris,
        ]);
    }

    public function update(Request $request, Kas $ka)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'tipe' => 'required|in:masuk,keluar',
            'kategori' => 'required|string',
            'jumlah' => 'required|numeric|min:1',
            'keterangan' => 'required|string',
        ]);

        $ka->update($validated);

        return redirect()->route('kas.index')
            ->with('success', 'Transaksi kas berhasil diupdate');
    }

    public function destroy(Kas $ka)
    {
        $ka->delete();

        return redirect()->route('kas.index')
            ->with('success', 'Transaksi kas berhasil dihapus');
    }

    public function report(Request $request)
    {
        $bulan = $request->get('bulan', Carbon::now()->month);
        $tahun = $request->get('tahun', Carbon::now()->year);

        $startOfMonth = Carbon::create($tahun, $bulan, 1)->startOfMonth();
        $endOfMonth = Carbon::create($tahun, $bulan, 1)->endOfMonth();

        // Daily summary
        $dailyData = Kas::whereBetween('tanggal', [$startOfMonth, $endOfMonth])
            ->selectRaw('DATE(tanggal) as date, tipe, SUM(jumlah) as total')
            ->groupBy('date', 'tipe')
            ->orderBy('date')
            ->get()
            ->groupBy('date');

        // Per kategori
        $perKategori = Kas::whereBetween('tanggal', [$startOfMonth, $endOfMonth])
            ->selectRaw('kategori, tipe, SUM(jumlah) as total')
            ->groupBy('kategori', 'tipe')
            ->get();

        // Total
        $totalMasuk = Kas::whereBetween('tanggal', [$startOfMonth, $endOfMonth])
            ->where('tipe', 'masuk')
            ->sum('jumlah');

        $totalKeluar = Kas::whereBetween('tanggal', [$startOfMonth, $endOfMonth])
            ->where('tipe', 'keluar')
            ->sum('jumlah');

        return Inertia::render('Kas/Report', [
            'dailyData' => $dailyData,
            'perKategori' => $perKategori,
            'totalMasuk' => $totalMasuk,
            'totalKeluar' => $totalKeluar,
            'saldo' => $totalMasuk - $totalKeluar,
            'bulan' => (int) $bulan,
            'tahun' => (int) $tahun,
        ]);
    }
}
