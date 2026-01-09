<?php

namespace App\Http\Controllers;

use App\Models\BahanBaku;
use App\Models\StokMovement;
use App\Models\Notifikasi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BahanBakuController extends Controller
{
    public function index(Request $request)
    {
        $query = BahanBaku::query();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('nama', 'like', '%' . $request->search . '%')
                  ->orWhere('kode', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('kategori')) {
            $query->where('kategori', $request->kategori);
        }

        if ($request->filled('low_stock')) {
            $query->whereColumn('stok', '<=', 'stok_minimum');
        }

        $bahanBakus = $query->orderBy('nama')->paginate(15);

        $summary = [
            'total' => BahanBaku::count(),
            'lowStock' => BahanBaku::whereColumn('stok', '<=', 'stok_minimum')->count(),
            'totalNilai' => BahanBaku::selectRaw('SUM(stok * harga_terakhir) as total')->first()->total ?? 0,
        ];

        $kategoris = ['serbuk', 'nutrisi', 'kemasan', 'bibit', 'lainnya'];

        return Inertia::render('BahanBaku/Index', [
            'bahanBakus' => $bahanBakus,
            'summary' => $summary,
            'kategoris' => $kategoris,
            'filters' => $request->only(['search', 'kategori', 'low_stock']),
        ]);
    }

    public function create()
    {
        $kategoris = ['serbuk', 'nutrisi', 'kemasan', 'bibit', 'lainnya'];
        $satuans = ['kg', 'gram', 'liter', 'ml', 'pcs', 'lembar', 'roll', 'pak', 'karung'];

        return Inertia::render('BahanBaku/Create', [
            'nextKode' => BahanBaku::generateKode(),
            'kategoris' => $kategoris,
            'satuans' => $satuans,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:100',
            'satuan' => 'required|string|max:20',
            'kategori' => 'required|string',
            'stok_minimum' => 'required|integer|min:0',
            'harga_terakhir' => 'nullable|numeric|min:0',
            'keterangan' => 'nullable|string',
        ]);

        $validated['kode'] = BahanBaku::generateKode();
        $validated['stok'] = 0;
        $validated['harga_terakhir'] = $validated['harga_terakhir'] ?? 0;

        BahanBaku::create($validated);

        return redirect()->route('bahan-baku.index')
            ->with('success', 'Bahan baku berhasil ditambahkan');
    }

    public function edit(BahanBaku $bahanBaku)
    {
        $kategoris = ['serbuk', 'nutrisi', 'kemasan', 'bibit', 'lainnya'];
        $satuans = ['kg', 'gram', 'liter', 'ml', 'pcs', 'lembar', 'roll', 'pak', 'karung'];

        return Inertia::render('BahanBaku/Edit', [
            'bahanBaku' => $bahanBaku,
            'kategoris' => $kategoris,
            'satuans' => $satuans,
        ]);
    }

    public function update(Request $request, BahanBaku $bahanBaku)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:100',
            'satuan' => 'required|string|max:20',
            'kategori' => 'required|string',
            'stok_minimum' => 'required|integer|min:0',
            'harga_terakhir' => 'nullable|numeric|min:0',
            'keterangan' => 'nullable|string',
        ]);

        $bahanBaku->update($validated);

        return redirect()->route('bahan-baku.index')
            ->with('success', 'Bahan baku berhasil diupdate');
    }

    public function destroy(BahanBaku $bahanBaku)
    {
        $bahanBaku->delete();

        return redirect()->route('bahan-baku.index')
            ->with('success', 'Bahan baku berhasil dihapus');
    }

    public function adjustment(Request $request, BahanBaku $bahanBaku)
    {
        $validated = $request->validate([
            'jumlah' => 'required|integer',
            'keterangan' => 'required|string',
        ]);

        $stokSebelum = $bahanBaku->stok;
        $stokSesudah = $stokSebelum + $validated['jumlah'];

        if ($stokSesudah < 0) {
            return back()->withErrors(['jumlah' => 'Stok tidak boleh negatif']);
        }

        StokMovement::create([
            'bahan_baku_id' => $bahanBaku->id,
            'tipe' => 'adjustment',
            'jumlah' => $validated['jumlah'],
            'stok_sebelum' => $stokSebelum,
            'stok_sesudah' => $stokSesudah,
            'keterangan' => $validated['keterangan'],
            'tanggal' => now(),
        ]);

        $bahanBaku->update(['stok' => $stokSesudah]);

        // Check low stock
        if ($bahanBaku->isLowStock()) {
            Notifikasi::createStokAlert($bahanBaku);
        }

        return back()->with('success', 'Adjustment stok berhasil');
    }

    public function movements(BahanBaku $bahanBaku)
    {
        $movements = StokMovement::where('bahan_baku_id', $bahanBaku->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('BahanBaku/Movements', [
            'bahanBaku' => $bahanBaku,
            'movements' => $movements,
        ]);
    }
}
