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
                return [
                    'id' => $kumbung->id,
                    'nomor' => $kumbung->nomor,
                    'nama' => $kumbung->nama,
                    'kapasitas_baglog' => $kumbung->kapasitas_baglog,
                    'baglog_aktif' => $kumbung->baglog_aktif,
                    'kapasitas_tersedia' => $kumbung->kapasitas_tersedia,
                    'status' => $kumbung->status,
                    'tanggal_mulai' => $kumbung->tanggal_mulai?->format('Y-m-d'),
                    'umur_hari' => $kumbung->umur,
                    // Investment fields
                    'biaya_pembangunan' => $kumbung->biaya_pembangunan,
                    'biaya_baglog' => $kumbung->biaya_baglog,
                    'total_investasi' => $kumbung->total_investasi,
                    'target_panen_kg' => $kumbung->target_panen_kg,
                    'harga_jual_per_kg' => $kumbung->harga_jual_per_kg,
                    'umur_baglog_bulan' => $kumbung->umur_baglog_bulan,
                    // Calculated fields
                    'total_panen' => $kumbung->total_panen,
                    'pendapatan_panen' => $kumbung->pendapatan_panen,
                    'roi' => $kumbung->roi,
                    'progress_target' => $kumbung->progress_target,
                    'sisa_target_bep' => $kumbung->sisa_target_bep,
                    'estimasi_profit' => $kumbung->estimasi_profit,
                ];
            });

        // Summary stats
        $summary = [
            'total_kumbung' => $kumbungs->count(),
            'total_kapasitas' => $kumbungs->sum('kapasitas_baglog'),
            'total_baglog_aktif' => $kumbungs->sum('baglog_aktif'),
            'total_investasi' => $kumbungs->sum('total_investasi'),
            'total_panen' => $kumbungs->sum('total_panen'),
            'total_pendapatan' => $kumbungs->sum('pendapatan_panen'),
        ];

        return Inertia::render('Kumbung/Index', [
            'kumbungs' => $kumbungs,
            'summary' => $summary,
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
            'kapasitas_baglog' => 'required|integer|min:1',
            'status' => 'required|in:aktif,nonaktif',
            'tanggal_mulai' => 'nullable|date',
            'biaya_pembangunan' => 'nullable|numeric|min:0',
            'biaya_baglog' => 'nullable|numeric|min:0',
            'target_panen_kg' => 'nullable|numeric|min:0',
            'harga_jual_per_kg' => 'nullable|numeric|min:0',
            'umur_baglog_bulan' => 'nullable|integer|min:1|max:24',
        ]);

        // Auto-generate nomor
        $validated['nomor'] = Kumbung::generateNomor();

        // Calculate total_investasi
        $validated['total_investasi'] = ($validated['biaya_pembangunan'] ?? 0) + ($validated['biaya_baglog'] ?? 0);

        // Set defaults for nullable fields that database doesn't allow null
        $validated['target_panen_kg'] = $validated['target_panen_kg'] ?? 0;
        $validated['harga_jual_per_kg'] = $validated['harga_jual_per_kg'] ?? 15000;
        $validated['umur_baglog_bulan'] = $validated['umur_baglog_bulan'] ?? 5;

        Kumbung::create($validated);

        return redirect()->route('kumbung.index')
            ->with('success', 'Kumbung berhasil ditambahkan');
    }

    public function show(Kumbung $kumbung)
    {
        // Get baglog statistics
        $baglogStats = [
            'produksi' => Baglog::where('kumbung_id', $kumbung->id)->where('status', 'produksi')->sum('jumlah'),
            'inkubasi' => Baglog::where('kumbung_id', $kumbung->id)->where('status', 'inkubasi')->sum('jumlah'),
            'pembibitan' => Baglog::where('kumbung_id', $kumbung->id)->where('status', 'pembibitan')->sum('jumlah'),
            'masuk_kumbung' => Baglog::where('kumbung_id', $kumbung->id)->where('status', 'masuk_kumbung')->sum('jumlah'),
            'selesai' => Baglog::where('kumbung_id', $kumbung->id)->where('status', 'selesai')->sum('jumlah'),
        ];

        // Get panen history
        $panenHistory = $kumbung->panens()
            ->orderBy('tanggal', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($panen) {
                return [
                    'id' => $panen->id,
                    'tanggal' => $panen->tanggal->format('Y-m-d'),
                    'tanggal_formatted' => $panen->tanggal->locale('id')->isoFormat('D MMM Y'),
                    'berat_kg' => $panen->berat_kg,
                    'berat_layak_jual' => $panen->berat_layak_jual,
                    'berat_reject' => $panen->berat_reject,
                ];
            });

        return Inertia::render('Kumbung/Show', [
            'kumbung' => [
                'id' => $kumbung->id,
                'nomor' => $kumbung->nomor,
                'nama' => $kumbung->nama,
                'kapasitas_baglog' => $kumbung->kapasitas_baglog,
                'baglog_aktif' => $kumbung->baglog_aktif,
                'kapasitas_tersedia' => $kumbung->kapasitas_tersedia,
                'status' => $kumbung->status,
                'tanggal_mulai' => $kumbung->tanggal_mulai?->format('Y-m-d'),
                'umur_hari' => $kumbung->umur,
                // Investment fields
                'biaya_pembangunan' => $kumbung->biaya_pembangunan,
                'biaya_baglog' => $kumbung->biaya_baglog,
                'total_investasi' => $kumbung->total_investasi,
                'target_panen_kg' => $kumbung->target_panen_kg,
                'harga_jual_per_kg' => $kumbung->harga_jual_per_kg,
                'umur_baglog_bulan' => $kumbung->umur_baglog_bulan,
                // Calculated fields
                'total_panen' => $kumbung->total_panen,
                'pendapatan_panen' => $kumbung->pendapatan_panen,
                'roi' => $kumbung->roi,
                'progress_target' => $kumbung->progress_target,
                'sisa_target_bep' => $kumbung->sisa_target_bep,
                'estimasi_profit' => $kumbung->estimasi_profit,
            ],
            'baglogStats' => $baglogStats,
            'panenHistory' => $panenHistory,
        ]);
    }

    public function edit(Kumbung $kumbung)
    {
        return Inertia::render('Kumbung/Edit', [
            'kumbung' => [
                'id' => $kumbung->id,
                'nomor' => $kumbung->nomor,
                'nama' => $kumbung->nama,
                'kapasitas_baglog' => $kumbung->kapasitas_baglog,
                'baglog_aktif' => $kumbung->baglog_aktif,
                'kapasitas_tersedia' => $kumbung->kapasitas_tersedia,
                'status' => $kumbung->status,
                'tanggal_mulai' => $kumbung->tanggal_mulai?->format('Y-m-d'),
                // Investment fields
                'biaya_pembangunan' => $kumbung->biaya_pembangunan,
                'biaya_baglog' => $kumbung->biaya_baglog,
                'total_investasi' => $kumbung->total_investasi,
                'target_panen_kg' => $kumbung->target_panen_kg,
                'harga_jual_per_kg' => $kumbung->harga_jual_per_kg,
                'umur_baglog_bulan' => $kumbung->umur_baglog_bulan,
            ],
        ]);
    }

    public function update(Request $request, Kumbung $kumbung)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:100',
            'kapasitas_baglog' => 'required|integer|min:1',
            'status' => 'required|in:aktif,nonaktif',
            'tanggal_mulai' => 'nullable|date',
            'biaya_pembangunan' => 'nullable|numeric|min:0',
            'biaya_baglog' => 'nullable|numeric|min:0',
            'target_panen_kg' => 'nullable|numeric|min:0',
            'harga_jual_per_kg' => 'nullable|numeric|min:0',
            'umur_baglog_bulan' => 'nullable|integer|min:1|max:24',
        ]);

        // Validate capacity against current baglogs
        $currentBaglogs = $kumbung->baglog_aktif;
        if ($validated['kapasitas_baglog'] < $currentBaglogs) {
            return back()->withErrors([
                'kapasitas_baglog' => "Kapasitas tidak boleh kurang dari jumlah baglog aktif saat ini ({$currentBaglogs})"
            ]);
        }

        // Calculate total_investasi
        $validated['total_investasi'] = ($validated['biaya_pembangunan'] ?? 0) + ($validated['biaya_baglog'] ?? 0);

        // Set default values for nullable fields that database doesn't allow null
        $validated['target_panen_kg'] = $validated['target_panen_kg'] ?? 0;
        $validated['harga_jual_per_kg'] = $validated['harga_jual_per_kg'] ?? 0;
        $validated['umur_baglog_bulan'] = $validated['umur_baglog_bulan'] ?? 5;

        $kumbung->update($validated);

        return redirect()->route('kumbung.index')
            ->with('success', 'Kumbung berhasil diupdate');
    }

    public function destroy(Kumbung $kumbung)
    {
        // Check if kumbung has active baglogs
        if ($kumbung->baglog_aktif > 0) {
            return redirect()->route('kumbung.index')
                ->with('error', 'Tidak dapat menghapus kumbung yang masih memiliki baglog aktif');
        }

        $kumbung->delete();

        return redirect()->route('kumbung.index')
            ->with('success', 'Kumbung berhasil dihapus');
    }

    /**
     * Calculate profitability for a kumbung
     */
    public function calculateProfitability(Kumbung $kumbung)
    {
        $yieldPerBaglog = 0.3; // kg per baglog per cycle
        $cyclesPerYear = 12 / ($kumbung->umur_baglog_bulan ?? 5);

        $estimasiPanenPerCycle = $kumbung->kapasitas_baglog * $yieldPerBaglog;
        $estimasiPanenPerTahun = $estimasiPanenPerCycle * $cyclesPerYear;
        $estimasiPendapatanPerTahun = $estimasiPanenPerTahun * ($kumbung->harga_jual_per_kg ?? 15000);

        $waktuBepBulan = $kumbung->total_investasi > 0
            ? ($kumbung->total_investasi / ($estimasiPendapatanPerTahun / 12))
            : 0;

        // Calculate target panen for BEP
        $targetPanenBep = $kumbung->total_investasi / ($kumbung->harga_jual_per_kg ?? 15000);

        return response()->json([
            'kumbung' => $kumbung->nama,
            'kapasitas_baglog' => $kumbung->kapasitas_baglog,
            'total_investasi' => $kumbung->total_investasi,
            'harga_jual_per_kg' => $kumbung->harga_jual_per_kg,
            'umur_baglog_bulan' => $kumbung->umur_baglog_bulan,
            'estimasi' => [
                'panen_per_cycle_kg' => round($estimasiPanenPerCycle, 2),
                'panen_per_tahun_kg' => round($estimasiPanenPerTahun, 2),
                'pendapatan_per_cycle' => round($estimasiPanenPerCycle * ($kumbung->harga_jual_per_kg ?? 15000)),
                'pendapatan_per_tahun' => round($estimasiPendapatanPerTahun),
                'waktu_bep_bulan' => round($waktuBepBulan, 1),
                'target_panen_bep_kg' => round($targetPanenBep, 2),
            ],
            'aktual' => [
                'total_panen_kg' => $kumbung->total_panen,
                'pendapatan' => $kumbung->pendapatan_panen,
                'sisa_target_bep_kg' => $kumbung->sisa_target_bep,
                'progress_bep_percent' => $targetPanenBep > 0
                    ? round(($kumbung->total_panen / $targetPanenBep) * 100, 1)
                    : 0,
                'roi_percent' => $kumbung->roi,
            ],
        ]);
    }
}
