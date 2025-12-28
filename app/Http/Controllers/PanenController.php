<?php

namespace App\Http\Controllers;

use App\Models\Kumbung;
use App\Models\Panen;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class PanenController extends Controller
{
    public function index(Request $request)
    {
        $query = Panen::with('kumbung');

        // Filter by date range
        if ($request->filled('tanggal_dari')) {
            $query->whereDate('tanggal', '>=', $request->tanggal_dari);
        }
        if ($request->filled('tanggal_sampai')) {
            $query->whereDate('tanggal', '<=', $request->tanggal_sampai);
        }

        // Filter by kumbung
        if ($request->filled('kumbung_id')) {
            $query->where('kumbung_id', $request->kumbung_id);
        }

        $panens = $query->orderBy('tanggal', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(function ($panen) {
                return [
                    'id' => $panen->id,
                    'kumbung' => $panen->kumbung ? [
                        'id' => $panen->kumbung->id,
                        'nomor' => $panen->kumbung->nomor,
                        'nama' => $panen->kumbung->nama,
                    ] : null,
                    'tanggal' => $panen->tanggal->format('Y-m-d'),
                    'tanggal_formatted' => $panen->tanggal->format('d M Y'),
                    'berat_kg' => $panen->berat_kg,
                    'catatan' => $panen->catatan,
                ];
            });

        $kumbungs = Kumbung::where('status', 'aktif')
            ->orderBy('nomor')
            ->get(['id', 'nomor', 'nama']);

        // Summary stats
        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        $summary = [
            'totalHariIni' => Panen::whereDate('tanggal', $today)->sum('berat_kg'),
            'totalBulanIni' => Panen::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->sum('berat_kg'),
        ];

        return Inertia::render('Panen/Index', [
            'panens' => $panens,
            'kumbungs' => $kumbungs,
            'filters' => $request->only(['tanggal_dari', 'tanggal_sampai', 'kumbung_id']),
            'summary' => $summary,
        ]);
    }

    public function create()
    {
        $kumbungs = Kumbung::where('status', 'aktif')
            ->orderBy('nomor')
            ->get(['id', 'nomor', 'nama']);

        return Inertia::render('Panen/Create', [
            'kumbungs' => $kumbungs,
            'today' => Carbon::today()->format('Y-m-d'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kumbung_id' => 'required|exists:kumbungs,id',
            'tanggal' => 'required|date',
            'berat_kg' => 'required|numeric|min:0.01',
            'catatan' => 'nullable|string|max:500',
        ]);

        Panen::create($validated);

        return redirect()->route('panen.index')
            ->with('success', 'Data panen berhasil ditambahkan');
    }

    public function edit(Panen $panen)
    {
        $kumbungs = Kumbung::where('status', 'aktif')
            ->orderBy('nomor')
            ->get(['id', 'nomor', 'nama']);

        return Inertia::render('Panen/Edit', [
            'panen' => [
                'id' => $panen->id,
                'kumbung_id' => $panen->kumbung_id,
                'tanggal' => $panen->tanggal->format('Y-m-d'),
                'berat_kg' => $panen->berat_kg,
                'catatan' => $panen->catatan,
            ],
            'kumbungs' => $kumbungs,
        ]);
    }

    public function update(Request $request, Panen $panen)
    {
        $validated = $request->validate([
            'kumbung_id' => 'required|exists:kumbungs,id',
            'tanggal' => 'required|date',
            'berat_kg' => 'required|numeric|min:0.01',
            'catatan' => 'nullable|string|max:500',
        ]);

        $panen->update($validated);

        return redirect()->route('panen.index')
            ->with('success', 'Data panen berhasil diupdate');
    }

    public function destroy(Panen $panen)
    {
        $panen->delete();

        return redirect()->route('panen.index')
            ->with('success', 'Data panen berhasil dihapus');
    }
}
