<?php

namespace App\Http\Controllers;

use App\Models\Baglog;
use App\Models\Kumbung;
use App\Models\Panen;
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
            'masuk_kumbung' => Baglog::where('kumbung_id', $kumbung->id)->where('status', 'masuk_kumbung')->sum('jumlah'),
            'selesai' => Baglog::where('kumbung_id', $kumbung->id)->where('status', 'selesai')->sum('jumlah'),
        ];

        // Get siklus data (grouped by baglog batch)
        $siklusList = Baglog::where('kumbung_id', $kumbung->id)
            ->orderBy('tanggal_tanam', 'asc')
            ->get()
            ->map(function ($baglog, $index) {
                $panens = Panen::where('baglog_id', $baglog->id)
                    ->orderBy('tanggal', 'asc')
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

                $totalKg = $panens->sum('berat_kg');
                $hargaPerKg = $baglog->kumbung->harga_jual_per_kg ?? 10200;
                $biayaBaglog = $baglog->kumbung->biaya_baglog ?? 88000000;
                $pendapatan = $totalKg * $hargaPerKg;
                $profit = $pendapatan - $biayaBaglog;

                return [
                    'siklus' => $index + 1,
                    'kode_batch' => $baglog->kode_batch,
                    'jumlah_baglog' => $baglog->jumlah,
                    'status' => $baglog->status,
                    'tanggal_tanam' => $baglog->tanggal_tanam?->format('Y-m-d'),
                    'tanggal_tanam_formatted' => $baglog->tanggal_tanam?->locale('id')->isoFormat('MMM Y'),
                    'total_kg' => $totalKg,
                    'total_pendapatan' => $pendapatan,
                    'biaya_baglog' => $biayaBaglog,
                    'profit' => $profit,
                    'minggu_panen' => $panens->count(),
                    'panens' => $panens,
                ];
            });

        // Hitung akumulasi profit semua siklus yang selesai
        $totalProfitSiklus = $siklusList
            ->filter(fn($s) => $s['status'] === 'selesai')
            ->sum('profit');

        // BEP berdasarkan biaya pembangunan saja (Opsi B)
        $biayaPembangunan = $kumbung->biaya_pembangunan ?? 0;
        $jumlahSiklusSelesai = $siklusList->where('status', 'selesai')->count();
        $avgProfitPerSiklus = $jumlahSiklusSelesai > 0
            ? $totalProfitSiklus / $jumlahSiklusSelesai
            : 0;
        $siklusBep = $avgProfitPerSiklus > 0
            ? ceil($biayaPembangunan / $avgProfitPerSiklus)
            : null;
        $bulanBep = $siklusBep ? $siklusBep * ($kumbung->umur_baglog_bulan ?? 4) : null;

        $bepProgress = $biayaPembangunan > 0
            ? min(($totalProfitSiklus / $biayaPembangunan) * 100, 100)
            : 0;
        $sisaBep = max($biayaPembangunan - $totalProfitSiklus, 0);

        // Legacy: panen tanpa baglog_id (untuk backward compat)
        $panenTanpaBaglog = Panen::where('kumbung_id', $kumbung->id)
            ->whereNull('baglog_id')
            ->orderBy('tanggal', 'desc')
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
                // BEP Opsi B: berdasarkan biaya pembangunan
                'bep_target' => $biayaPembangunan,
                'bep_progress' => round($bepProgress, 1),
                'bep_sisa' => $sisaBep,
                'bep_siklus' => $siklusBep,
                'bep_bulan' => $bulanBep,
                'total_profit_akumulasi' => $totalProfitSiklus,
                'avg_profit_per_siklus' => round($avgProfitPerSiklus),
                'estimasi_profit' => $kumbung->estimasi_profit,
            ],
            'baglogStats' => $baglogStats,
            'siklusList' => $siklusList,
            'panenTanpaBaglog' => $panenTanpaBaglog,
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
     * Peta Kumbung — visual map view (CoC war room style)
     */
    public function peta()
    {
        $kumbungs = Kumbung::with([
            'baglogs' => fn($q) => $q->where('status', 'masuk_kumbung'),
            'panens' => fn($q) => $q->orderBy('tanggal', 'desc')->limit(1),
        ])->orderBy('nomor')->get()->map(function ($kumbung) {
            $baglogAktif = $kumbung->baglogs->sum('jumlah');
            $usagePercent = $kumbung->kapasitas_baglog > 0
                ? round(($baglogAktif / $kumbung->kapasitas_baglog) * 100)
                : 0;

            $latestPanen = $kumbung->panens->first();
            $daysSincePanen = $latestPanen
                ? (int) now()->diffInDays($latestPanen->tanggal, false) * -1
                : null;

            $latestBaglog = $kumbung->baglogs->sortByDesc('tanggal_tanam')->first();
            $umurBaglog = $latestBaglog && $latestBaglog->tanggal_tanam
                ? (int) $latestBaglog->tanggal_tanam->diffInDays(now())
                : null;

            $estimasiSelesai = $latestBaglog?->tanggal_estimasi_selesai;
            $daysUntilHarvest = $estimasiSelesai
                ? (int) now()->diffInDays($estimasiSelesai, false)
                : null;

            // Status logic
            $status = 'kosong';
            if ($kumbung->status === 'nonaktif') {
                $status = 'nonaktif';
            } elseif ($baglogAktif === 0) {
                $status = 'kosong';
            } elseif ($daysSincePanen !== null && $daysSincePanen <= 14 && $daysSincePanen >= 0) {
                $status = 'panen_aktif';
            } elseif ($daysUntilHarvest !== null && $daysUntilHarvest <= 7 && $daysUntilHarvest >= -30) {
                $status = 'siap_panen';
            } elseif ($umurBaglog !== null && $umurBaglog > 180) {
                $status = 'lewat';
            } elseif ($umurBaglog !== null && $umurBaglog < 30) {
                $status = 'baru';
            } else {
                $status = 'growing';
            }

            return [
                'id' => $kumbung->id,
                'nomor' => $kumbung->nomor,
                'nama' => $kumbung->nama,
                'kapasitas_baglog' => $kumbung->kapasitas_baglog,
                'baglog_aktif' => $baglogAktif,
                'usage_percent' => $usagePercent,
                'status_kumbung' => $kumbung->status,
                'status' => $status,
                'umur_baglog' => $umurBaglog,
                'days_until_harvest' => $daysUntilHarvest,
                'days_since_panen' => $daysSincePanen,
                'last_panen_date' => $latestPanen?->tanggal?->format('Y-m-d'),
                'last_panen_kg' => $latestPanen?->berat_layak_jual,
            ];
        });

        $stats = [
            'total' => $kumbungs->count(),
            'kosong' => $kumbungs->where('status', 'kosong')->count(),
            'baru' => $kumbungs->where('status', 'baru')->count(),
            'growing' => $kumbungs->where('status', 'growing')->count(),
            'siap_panen' => $kumbungs->where('status', 'siap_panen')->count(),
            'panen_aktif' => $kumbungs->where('status', 'panen_aktif')->count(),
            'lewat' => $kumbungs->where('status', 'lewat')->count(),
            'nonaktif' => $kumbungs->where('status', 'nonaktif')->count(),
            'total_kapasitas' => $kumbungs->sum('kapasitas_baglog'),
            'total_baglog_aktif' => $kumbungs->sum('baglog_aktif'),
        ];

        return Inertia::render('Kumbung/Peta', [
            'kumbungs' => $kumbungs,
            'stats' => $stats,
        ]);
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
