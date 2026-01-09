<?php

namespace App\Http\Controllers;

use App\Models\Baglog;
use App\Models\Kumbung;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KumbungController extends Controller
{
    public function index()
    {
        $kumbungs = Kumbung::orderBy('nomor')
            ->get()
            ->map(function ($kumbung) {
                // Hitung jumlah baglog yang ada di kumbung ini (status: masuk_kumbung)
                $jumlahBaglog = Baglog::where('kumbung_id', $kumbung->id)
                    ->where('status', 'masuk_kumbung')
                    ->sum('jumlah');

                return [
                    'id' => $kumbung->id,
                    'nomor' => $kumbung->nomor,
                    'nama' => $kumbung->nama,
                    'kapasitas_baglog' => $jumlahBaglog,
                    'status' => $kumbung->status,
                    'tanggal_mulai' => $kumbung->tanggal_mulai?->format('Y-m-d'),
                    'umur_hari' => $kumbung->umur,
                ];
            });

        return Inertia::render('Kumbung/Index', [
            'kumbungs' => $kumbungs,
        ]);
    }

    public function create()
    {
        return Inertia::render('Kumbung/Create', [
            'nextNomor' => Kumbung::generateNomor(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:100',
            'status' => 'required|in:aktif,nonaktif',
            'tanggal_mulai' => 'nullable|date',
        ]);

        // Auto-generate nomor
        $validated['nomor'] = Kumbung::generateNomor();
        // kapasitas_baglog akan dihitung otomatis dari data baglog
        $validated['kapasitas_baglog'] = 0;

        Kumbung::create($validated);

        return redirect()->route('kumbung.index')
            ->with('success', 'Kumbung berhasil ditambahkan');
    }

    public function edit(Kumbung $kumbung)
    {
        // Hitung jumlah baglog yang ada di kumbung ini (status: masuk_kumbung)
        $jumlahBaglog = Baglog::where('kumbung_id', $kumbung->id)
            ->where('status', 'masuk_kumbung')
            ->sum('jumlah');

        return Inertia::render('Kumbung/Edit', [
            'kumbung' => [
                'id' => $kumbung->id,
                'nomor' => $kumbung->nomor,
                'nama' => $kumbung->nama,
                'kapasitas_baglog' => $jumlahBaglog,
                'status' => $kumbung->status,
                'tanggal_mulai' => $kumbung->tanggal_mulai?->format('Y-m-d'),
            ],
        ]);
    }

    public function update(Request $request, Kumbung $kumbung)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:100',
            'status' => 'required|in:aktif,nonaktif',
            'tanggal_mulai' => 'nullable|date',
        ]);

        $kumbung->update($validated);

        return redirect()->route('kumbung.index')
            ->with('success', 'Kumbung berhasil diupdate');
    }

    public function destroy(Kumbung $kumbung)
    {
        $kumbung->delete();

        return redirect()->route('kumbung.index')
            ->with('success', 'Kumbung berhasil dihapus');
    }
}
