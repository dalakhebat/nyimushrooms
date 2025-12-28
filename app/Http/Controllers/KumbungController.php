<?php

namespace App\Http\Controllers;

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
                return [
                    'id' => $kumbung->id,
                    'nomor' => $kumbung->nomor,
                    'nama' => $kumbung->nama,
                    'kapasitas_baglog' => $kumbung->kapasitas_baglog,
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
            'kapasitas_baglog' => 'required|integer|min:0',
            'status' => 'required|in:aktif,nonaktif',
            'tanggal_mulai' => 'nullable|date',
        ]);

        // Auto-generate nomor
        $validated['nomor'] = Kumbung::generateNomor();

        Kumbung::create($validated);

        return redirect()->route('kumbung.index')
            ->with('success', 'Kumbung berhasil ditambahkan');
    }

    public function edit(Kumbung $kumbung)
    {
        return Inertia::render('Kumbung/Edit', [
            'kumbung' => [
                'id' => $kumbung->id,
                'nomor' => $kumbung->nomor,
                'nama' => $kumbung->nama,
                'kapasitas_baglog' => $kumbung->kapasitas_baglog,
                'status' => $kumbung->status,
                'tanggal_mulai' => $kumbung->tanggal_mulai?->format('Y-m-d'),
            ],
        ]);
    }

    public function update(Request $request, Kumbung $kumbung)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:100',
            'kapasitas_baglog' => 'required|integer|min:0',
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
