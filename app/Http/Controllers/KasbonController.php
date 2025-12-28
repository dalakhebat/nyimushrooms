<?php

namespace App\Http\Controllers;

use App\Models\Kasbon;
use App\Models\Karyawan;
use App\Models\PembayaranKasbon;
use App\Models\Penggajian;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KasbonController extends Controller
{
    public function index(Request $request)
    {
        $query = Kasbon::with('karyawan');

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by karyawan
        if ($request->filled('karyawan_id')) {
            $query->where('karyawan_id', $request->karyawan_id);
        }

        // Search
        if ($request->filled('search')) {
            $query->whereHas('karyawan', function ($q) use ($request) {
                $q->where('nama', 'like', '%' . $request->search . '%');
            });
        }

        $kasbons = $query->orderBy('tanggal', 'desc')->paginate(15)->withQueryString();

        // Summary
        $summary = [
            'totalKasbon' => Kasbon::count(),
            'totalBelumLunas' => Kasbon::where('status', 'belum_lunas')->count(),
            'totalNominalBelumLunas' => Kasbon::where('status', 'belum_lunas')->sum('sisa'),
        ];

        $karyawans = Karyawan::where('status', 'aktif')->orderBy('nama')->get();

        return Inertia::render('Kasbon/Index', [
            'kasbons' => $kasbons,
            'karyawans' => $karyawans,
            'filters' => $request->only(['status', 'karyawan_id', 'search']),
            'summary' => $summary,
        ]);
    }

    public function create()
    {
        $karyawans = Karyawan::where('status', 'aktif')->orderBy('nama')->get();

        return Inertia::render('Kasbon/Create', [
            'karyawans' => $karyawans,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'karyawan_id' => 'required|exists:karyawans,id',
            'tanggal' => 'required|date',
            'jumlah' => 'required|numeric|min:1',
            'keterangan' => 'nullable|string|max:500',
        ]);

        Kasbon::create([
            'karyawan_id' => $validated['karyawan_id'],
            'tanggal' => $validated['tanggal'],
            'jumlah' => $validated['jumlah'],
            'sisa' => $validated['jumlah'], // Sisa = jumlah awal
            'keterangan' => $validated['keterangan'] ?? null,
            'status' => 'belum_lunas',
        ]);

        // Auto-sync dengan pending penggajian
        $this->syncPendingPenggajian($validated['karyawan_id']);

        return redirect()->route('kasbon.index')->with('success', 'Kasbon berhasil ditambahkan');
    }

    /**
     * Sync kasbon dengan semua pending penggajian untuk karyawan tertentu
     */
    private function syncPendingPenggajian(int $karyawanId): void
    {
        // Get total sisa kasbon terbaru
        $totalSisaKasbon = Kasbon::getTotalSisaByKaryawan($karyawanId);

        // Get semua pending penggajian untuk karyawan ini
        $pendingPenggajians = Penggajian::where('karyawan_id', $karyawanId)
            ->where('status', 'pending')
            ->get();

        foreach ($pendingPenggajians as $penggajian) {
            // Hitung maksimal potongan kasbon (tidak boleh lebih dari gaji bersih)
            $gajiBersih = $penggajian->gaji_pokok + $penggajian->bonus - $penggajian->potongan;
            $maxPotonganKasbon = min($totalSisaKasbon, $gajiBersih);

            // Update potongan kasbon dan total
            $newTotal = $gajiBersih - $maxPotonganKasbon;

            $penggajian->update([
                'potongan_kasbon' => $maxPotonganKasbon,
                'total' => max(0, $newTotal),
            ]);

            // Kurangi sisa kasbon yang akan dipotong dari penggajian ini
            // untuk penggajian berikutnya (jika ada multiple pending)
            $totalSisaKasbon -= $maxPotonganKasbon;
            if ($totalSisaKasbon <= 0) break;
        }
    }

    public function show(Kasbon $kasbon)
    {
        $kasbon->load(['karyawan', 'pembayarans.penggajian']);

        return Inertia::render('Kasbon/Show', [
            'kasbon' => $kasbon,
        ]);
    }

    public function edit(Kasbon $kasbon)
    {
        $karyawans = Karyawan::where('status', 'aktif')->orderBy('nama')->get();

        return Inertia::render('Kasbon/Edit', [
            'kasbon' => $kasbon->load('karyawan'),
            'karyawans' => $karyawans,
        ]);
    }

    public function update(Request $request, Kasbon $kasbon)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'jumlah' => 'required|numeric|min:1',
            'keterangan' => 'nullable|string|max:500',
        ]);

        // Calculate new sisa based on jumlah change
        $sudahDibayar = $kasbon->jumlah - $kasbon->sisa;
        $newSisa = $validated['jumlah'] - $sudahDibayar;

        $kasbon->update([
            'tanggal' => $validated['tanggal'],
            'jumlah' => $validated['jumlah'],
            'sisa' => max(0, $newSisa),
            'keterangan' => $validated['keterangan'] ?? null,
            'status' => $newSisa <= 0 ? 'lunas' : 'belum_lunas',
        ]);

        // Auto-sync dengan pending penggajian
        $this->syncPendingPenggajian($kasbon->karyawan_id);

        return redirect()->route('kasbon.index')->with('success', 'Kasbon berhasil diperbarui');
    }

    public function destroy(Kasbon $kasbon)
    {
        $karyawanId = $kasbon->karyawan_id;

        // Delete related pembayaran first
        $kasbon->pembayarans()->delete();
        $kasbon->delete();

        // Auto-sync dengan pending penggajian (kasbon berkurang)
        $this->syncPendingPenggajian($karyawanId);

        return redirect()->route('kasbon.index')->with('success', 'Kasbon berhasil dihapus');
    }

    /**
     * Bayar kasbon langsung (bukan dari potong gaji)
     */
    public function bayar(Request $request, Kasbon $kasbon)
    {
        $validated = $request->validate([
            'jumlah' => 'required|numeric|min:1|max:' . $kasbon->sisa,
            'tanggal' => 'required|date',
            'keterangan' => 'nullable|string|max:255',
        ]);

        // Create pembayaran record
        PembayaranKasbon::create([
            'kasbon_id' => $kasbon->id,
            'penggajian_id' => null,
            'tanggal' => $validated['tanggal'],
            'jumlah' => $validated['jumlah'],
            'metode' => 'bayar_langsung',
            'keterangan' => $validated['keterangan'] ?? null,
        ]);

        // Update kasbon sisa
        $kasbon->bayar($validated['jumlah']);

        return redirect()->back()->with('success', 'Pembayaran kasbon berhasil dicatat');
    }
}
