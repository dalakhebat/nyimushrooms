<?php

namespace App\Http\Controllers;

use App\Models\BahanBaku;
use App\Models\PembelianBahanBaku;
use App\Models\StokMovement;
use App\Models\Supplier;
use App\Models\Kas;
use App\Models\Notifikasi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class PembelianBahanBakuController extends Controller
{
    public function index(Request $request)
    {
        $query = PembelianBahanBaku::with(['supplier', 'bahanBaku']);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('kode_transaksi', 'like', '%' . $request->search . '%')
                  ->orWhereHas('bahanBaku', function ($q2) use ($request) {
                      $q2->where('nama', 'like', '%' . $request->search . '%');
                  });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('bulan')) {
            $query->whereMonth('tanggal', $request->bulan);
        }

        if ($request->filled('tahun')) {
            $query->whereYear('tanggal', $request->tahun);
        }

        $pembelians = $query->orderBy('tanggal', 'desc')->paginate(15);

        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        $summary = [
            'totalBulanIni' => PembelianBahanBaku::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->sum('total_harga'),
            'pendingBulanIni' => PembelianBahanBaku::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->where('status', 'pending')->sum('total_harga'),
            'lunasBulanIni' => PembelianBahanBaku::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->where('status', 'lunas')->sum('total_harga'),
            'countBulanIni' => PembelianBahanBaku::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->count(),
        ];

        return Inertia::render('PembelianBahanBaku/Index', [
            'pembelians' => $pembelians,
            'summary' => $summary,
            'filters' => $request->only(['search', 'status', 'bulan', 'tahun']),
        ]);
    }

    public function create()
    {
        $suppliers = Supplier::orderBy('nama')->get();
        $bahanBakus = BahanBaku::orderBy('nama')->get();

        return Inertia::render('PembelianBahanBaku/Create', [
            'suppliers' => $suppliers,
            'bahanBakus' => $bahanBakus,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'nullable|exists:suppliers,id',
            'bahan_baku_id' => 'required|exists:bahan_bakus,id',
            'tanggal' => 'required|date',
            'jumlah' => 'required|integer|min:1',
            'harga_satuan' => 'required|numeric|min:0',
            'status' => 'required|in:pending,lunas',
            'catatan' => 'nullable|string',
        ]);

        // Generate kode transaksi
        $today = now()->format('Ymd');
        $lastKode = PembelianBahanBaku::where('kode_transaksi', 'like', "PBB{$today}%")
            ->orderBy('id', 'desc')
            ->first()?->kode_transaksi;

        if (!$lastKode) {
            $kodeTransaksi = "PBB{$today}001";
        } else {
            $number = (int) substr($lastKode, -3) + 1;
            $kodeTransaksi = "PBB{$today}" . str_pad($number, 3, '0', STR_PAD_LEFT);
        }

        $validated['kode_transaksi'] = $kodeTransaksi;
        $validated['total_harga'] = $validated['jumlah'] * $validated['harga_satuan'];

        $pembelian = PembelianBahanBaku::create($validated);

        $bahanBaku = BahanBaku::find($validated['bahan_baku_id']);

        // Update stok bahan baku HANYA jika status lunas
        if ($validated['status'] === 'lunas') {
            $stokSebelum = $bahanBaku->stok;
            $stokSesudah = $stokSebelum + $validated['jumlah'];

            StokMovement::create([
                'bahan_baku_id' => $bahanBaku->id,
                'tipe' => 'masuk',
                'jumlah' => $validated['jumlah'],
                'stok_sebelum' => $stokSebelum,
                'stok_sesudah' => $stokSesudah,
                'referensi' => 'pembelian:' . $pembelian->id,
                'keterangan' => 'Pembelian ' . $kodeTransaksi,
                'tanggal' => $validated['tanggal'],
            ]);

            $bahanBaku->update([
                'stok' => $stokSesudah,
                'harga_terakhir' => $validated['harga_satuan'],
            ]);
        } else {
            // Jika pending, hanya update harga terakhir
            $bahanBaku->update([
                'harga_terakhir' => $validated['harga_satuan'],
            ]);
        }

        // Jika lunas, catat ke kas
        if ($validated['status'] === 'lunas') {
            Kas::create([
                'kode_transaksi' => Kas::generateKode(),
                'tanggal' => $validated['tanggal'],
                'tipe' => 'keluar',
                'kategori' => 'pembelian',
                'jumlah' => $validated['total_harga'],
                'keterangan' => "Pembelian {$bahanBaku->nama} - {$kodeTransaksi}",
                'referensi' => 'pembelian:' . $pembelian->id,
            ]);
        }

        return redirect()->route('pembelian-bahan-baku.index')
            ->with('success', 'Pembelian berhasil ditambahkan');
    }

    public function edit(PembelianBahanBaku $pembelianBahanBaku)
    {
        $suppliers = Supplier::orderBy('nama')->get();
        $bahanBakus = BahanBaku::orderBy('nama')->get();

        return Inertia::render('PembelianBahanBaku/Edit', [
            'pembelian' => $pembelianBahanBaku->load(['supplier', 'bahanBaku']),
            'suppliers' => $suppliers,
            'bahanBakus' => $bahanBakus,
        ]);
    }

    public function update(Request $request, PembelianBahanBaku $pembelianBahanBaku)
    {
        $validated = $request->validate([
            'supplier_id' => 'nullable|exists:suppliers,id',
            'tanggal' => 'required|date',
            'harga_satuan' => 'required|numeric|min:0',
            'status' => 'required|in:pending,lunas',
            'catatan' => 'nullable|string',
        ]);

        $validated['total_harga'] = $pembelianBahanBaku->jumlah * $validated['harga_satuan'];

        $oldStatus = $pembelianBahanBaku->status;
        $bahanBaku = $pembelianBahanBaku->bahanBaku;

        // Cegah perubahan dari lunas ke pending
        if ($oldStatus === 'lunas' && $validated['status'] === 'pending') {
            return back()->withErrors(['status' => 'Status yang sudah lunas tidak dapat diubah kembali ke pending']);
        }

        $pembelianBahanBaku->update($validated);

        // Update harga terakhir bahan baku
        $bahanBaku->update([
            'harga_terakhir' => $validated['harga_satuan'],
        ]);

        // Jika status berubah dari pending ke lunas
        if ($oldStatus === 'pending' && $validated['status'] === 'lunas') {
            // Tambah stok bahan baku
            $stokSebelum = $bahanBaku->stok;
            $stokSesudah = $stokSebelum + $pembelianBahanBaku->jumlah;

            StokMovement::create([
                'bahan_baku_id' => $bahanBaku->id,
                'tipe' => 'masuk',
                'jumlah' => $pembelianBahanBaku->jumlah,
                'stok_sebelum' => $stokSebelum,
                'stok_sesudah' => $stokSesudah,
                'referensi' => 'pembelian:' . $pembelianBahanBaku->id,
                'keterangan' => 'Pelunasan pembelian ' . $pembelianBahanBaku->kode_transaksi,
                'tanggal' => $validated['tanggal'],
            ]);

            $bahanBaku->update(['stok' => $stokSesudah]);

            // Catat ke kas
            Kas::create([
                'kode_transaksi' => Kas::generateKode(),
                'tanggal' => $validated['tanggal'],
                'tipe' => 'keluar',
                'kategori' => 'pembelian',
                'jumlah' => $validated['total_harga'],
                'keterangan' => "Pembelian {$bahanBaku->nama} - {$pembelianBahanBaku->kode_transaksi}",
                'referensi' => 'pembelian:' . $pembelianBahanBaku->id,
            ]);
        }

        return redirect()->route('pembelian-bahan-baku.index')
            ->with('success', 'Pembelian berhasil diupdate');
    }

    public function destroy(PembelianBahanBaku $pembelianBahanBaku)
    {
        $bahanBaku = $pembelianBahanBaku->bahanBaku;

        // Rollback stok hanya jika pembelian sudah lunas (stok sudah masuk)
        if ($pembelianBahanBaku->status === 'lunas') {
            $stokSebelum = $bahanBaku->stok;
            $stokSesudah = $stokSebelum - $pembelianBahanBaku->jumlah;

            if ($stokSesudah < 0) {
                return back()->withErrors(['error' => 'Tidak dapat menghapus, stok akan menjadi negatif']);
            }

            StokMovement::create([
                'bahan_baku_id' => $bahanBaku->id,
                'tipe' => 'keluar',
                'jumlah' => $pembelianBahanBaku->jumlah,
                'stok_sebelum' => $stokSebelum,
                'stok_sesudah' => $stokSesudah,
                'referensi' => 'hapus_pembelian:' . $pembelianBahanBaku->id,
                'keterangan' => 'Hapus pembelian ' . $pembelianBahanBaku->kode_transaksi,
                'tanggal' => now(),
            ]);

            $bahanBaku->update(['stok' => $stokSesudah]);

            // Check low stock
            if ($bahanBaku->isLowStock()) {
                Notifikasi::createStokAlert($bahanBaku);
            }
        }

        $pembelianBahanBaku->delete();

        return redirect()->route('pembelian-bahan-baku.index')
            ->with('success', 'Pembelian berhasil dihapus');
    }

    public function updateStatus(Request $request, PembelianBahanBaku $pembelianBahanBaku)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,lunas',
        ]);

        $oldStatus = $pembelianBahanBaku->status;

        // Cegah perubahan dari lunas ke pending
        if ($oldStatus === 'lunas' && $validated['status'] === 'pending') {
            return back()->withErrors(['status' => 'Status yang sudah lunas tidak dapat diubah kembali ke pending']);
        }

        $pembelianBahanBaku->update($validated);

        // Jika status berubah dari pending ke lunas
        if ($oldStatus === 'pending' && $validated['status'] === 'lunas') {
            // Tambah stok bahan baku
            $bahanBaku = $pembelianBahanBaku->bahanBaku;
            $stokSebelum = $bahanBaku->stok;
            $stokSesudah = $stokSebelum + $pembelianBahanBaku->jumlah;

            StokMovement::create([
                'bahan_baku_id' => $bahanBaku->id,
                'tipe' => 'masuk',
                'jumlah' => $pembelianBahanBaku->jumlah,
                'stok_sebelum' => $stokSebelum,
                'stok_sesudah' => $stokSesudah,
                'referensi' => 'pembelian:' . $pembelianBahanBaku->id,
                'keterangan' => 'Pelunasan pembelian ' . $pembelianBahanBaku->kode_transaksi,
                'tanggal' => now(),
            ]);

            $bahanBaku->update(['stok' => $stokSesudah]);

            // Catat ke kas
            Kas::create([
                'kode_transaksi' => Kas::generateKode(),
                'tanggal' => now(),
                'tipe' => 'keluar',
                'kategori' => 'pembelian',
                'jumlah' => $pembelianBahanBaku->total_harga,
                'keterangan' => "Pembelian {$bahanBaku->nama} - {$pembelianBahanBaku->kode_transaksi}",
                'referensi' => 'pembelian:' . $pembelianBahanBaku->id,
            ]);
        }

        return back()->with('success', 'Status berhasil diupdate menjadi lunas');
    }
}
