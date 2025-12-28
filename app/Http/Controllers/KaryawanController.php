<?php

namespace App\Http\Controllers;

use App\Models\Karyawan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KaryawanController extends Controller
{
    public function index(Request $request)
    {
        $query = Karyawan::query();

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by tipe gaji
        if ($request->filled('tipe_gaji')) {
            $query->where('tipe_gaji', $request->tipe_gaji);
        }

        // Search by nama
        if ($request->filled('search')) {
            $query->where('nama', 'like', '%' . $request->search . '%');
        }

        // Filter by bagian
        if ($request->filled('bagian')) {
            $query->where('bagian', $request->bagian);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'nama');
        $sortDir = $request->get('sort_dir', 'asc');

        // Validate sort parameters
        $allowedSortBy = ['nama', 'nominal_gaji', 'tanggal_masuk'];
        $allowedSortDir = ['asc', 'desc'];

        if (!in_array($sortBy, $allowedSortBy)) {
            $sortBy = 'nama';
        }
        if (!in_array($sortDir, $allowedSortDir)) {
            $sortDir = 'asc';
        }

        $karyawans = $query->orderBy($sortBy, $sortDir)->paginate(10)->withQueryString();

        // Format tanggal untuk display
        $karyawans->getCollection()->transform(function ($karyawan) {
            $karyawan->tanggal_masuk_formatted = $karyawan->tanggal_masuk
                ? $karyawan->tanggal_masuk->format('d M Y')
                : '-';
            return $karyawan;
        });

        // Summary stats
        $summary = [
            'totalAktif' => Karyawan::where('status', 'aktif')->count(),
            'totalNonaktif' => Karyawan::where('status', 'nonaktif')->count(),
        ];

        return Inertia::render('Karyawan/Index', [
            'karyawans' => $karyawans,
            'filters' => $request->only(['status', 'tipe_gaji', 'search', 'bagian', 'sort_by', 'sort_dir']),
            'summary' => $summary,
        ]);
    }

    public function create()
    {
        return Inertia::render('Karyawan/Create', [
            'today' => now()->format('Y-m-d'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'no_hp' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'bagian' => 'nullable|string|max:100',
            'tanggal_masuk' => 'nullable|date',
            'tipe_gaji' => 'required|in:mingguan,bulanan,borongan',
            'nominal_gaji' => 'required|numeric|min:0',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        Karyawan::create($validated);

        return redirect('/karyawan')->with('success', 'Karyawan berhasil ditambahkan');
    }

    public function edit(Karyawan $karyawan)
    {
        return Inertia::render('Karyawan/Edit', [
            'karyawan' => [
                'id' => $karyawan->id,
                'nama' => $karyawan->nama,
                'no_hp' => $karyawan->no_hp,
                'alamat' => $karyawan->alamat,
                'bagian' => $karyawan->bagian,
                'tanggal_masuk' => $karyawan->tanggal_masuk?->format('Y-m-d'),
                'tipe_gaji' => $karyawan->tipe_gaji,
                'nominal_gaji' => $karyawan->nominal_gaji,
                'status' => $karyawan->status,
            ],
        ]);
    }

    public function update(Request $request, Karyawan $karyawan)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'no_hp' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'bagian' => 'nullable|string|max:100',
            'tanggal_masuk' => 'nullable|date',
            'tipe_gaji' => 'required|in:mingguan,bulanan,borongan',
            'nominal_gaji' => 'required|numeric|min:0',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        $karyawan->update($validated);

        return redirect('/karyawan')->with('success', 'Karyawan berhasil diupdate');
    }

    public function destroy(Karyawan $karyawan)
    {
        $karyawan->delete();

        return redirect('/karyawan')->with('success', 'Karyawan berhasil dihapus');
    }
}
