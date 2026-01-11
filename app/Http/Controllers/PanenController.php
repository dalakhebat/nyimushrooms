<?php

namespace App\Http\Controllers;

use App\Models\Baglog;
use App\Models\Kumbung;
use App\Models\Panen;
use App\Models\StokJamur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class PanenController extends Controller
{
    public function index(Request $request)
    {
        $query = Panen::with(['kumbung', 'baglog']);

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
                    'baglog' => $panen->baglog ? [
                        'id' => $panen->baglog->id,
                        'kode_batch' => $panen->baglog->kode_batch,
                        'jumlah' => $panen->baglog->jumlah,
                    ] : null,
                    'tanggal' => $panen->tanggal->format('Y-m-d'),
                    'tanggal_formatted' => $panen->tanggal->locale('id')->isoFormat('D MMM Y'),
                    'berat_kg' => $panen->berat_kg,
                    'berat_layak_jual' => $panen->berat_layak_jual,
                    'berat_reject' => $panen->berat_reject,
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
            'layakJualBulanIni' => Panen::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->sum('berat_layak_jual'),
            'rejectBulanIni' => Panen::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->sum('berat_reject'),
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

        // Get baglogs that are in kumbung (masuk_kumbung status)
        $baglogs = Baglog::where('status', 'masuk_kumbung')
            ->whereNotNull('kumbung_id')
            ->with('kumbung:id,nomor,nama')
            ->orderBy('kode_batch')
            ->get()
            ->map(function ($baglog) {
                return [
                    'id' => $baglog->id,
                    'kode_batch' => $baglog->kode_batch,
                    'jumlah' => $baglog->jumlah,
                    'kumbung_id' => $baglog->kumbung_id,
                    'kumbung_nama' => $baglog->kumbung ? $baglog->kumbung->nama : null,
                ];
            });

        return Inertia::render('Panen/Create', [
            'kumbungs' => $kumbungs,
            'baglogs' => $baglogs,
            'stokTersedia' => StokJamur::getStokTersedia(),
            'today' => Carbon::today()->format('Y-m-d'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kumbung_id' => 'required|exists:kumbungs,id',
            'baglog_id' => 'nullable|exists:baglogs,id',
            'tanggal' => 'required|date',
            'berat_kg' => 'required|numeric|min:0.01',
            'berat_layak_jual' => 'required|numeric|min:0',
            'berat_reject' => 'required|numeric|min:0',
            'catatan' => 'nullable|string|max:500',
        ]);

        // Validasi: layak_jual + reject harus sama dengan total
        $totalSortir = $validated['berat_layak_jual'] + $validated['berat_reject'];
        if (abs($totalSortir - $validated['berat_kg']) > 0.01) {
            return back()->withErrors(['berat_layak_jual' => 'Total layak jual + reject harus sama dengan berat total']);
        }

        // Validate baglog belongs to the selected kumbung
        if (!empty($validated['baglog_id'])) {
            $baglog = Baglog::find($validated['baglog_id']);
            if ($baglog->kumbung_id != $validated['kumbung_id']) {
                return back()->withErrors(['baglog_id' => 'Baglog tidak berada di kumbung yang dipilih']);
            }
            if ($baglog->status !== 'masuk_kumbung') {
                return back()->withErrors(['baglog_id' => 'Baglog harus berstatus masuk_kumbung untuk dipanen']);
            }
        }

        DB::transaction(function () use ($validated) {
            // Create panen record
            $panen = Panen::create($validated);

            // Create StokJamur entry (masuk) for berat_layak_jual only
            if ($validated['berat_layak_jual'] > 0) {
                $stokSebelum = StokJamur::getStokTersedia();
                $stokSesudah = $stokSebelum + $validated['berat_layak_jual'];

                StokJamur::create([
                    'kumbung_id' => $validated['kumbung_id'],
                    'panen_id' => $panen->id,
                    'tipe' => 'masuk',
                    'berat_kg' => $validated['berat_layak_jual'],
                    'stok_sebelum' => $stokSebelum,
                    'stok_sesudah' => $stokSesudah,
                    'keterangan' => 'Hasil panen - ' . ($validated['catatan'] ?? 'Tanpa catatan'),
                    'tanggal' => $validated['tanggal'],
                ]);
            }
        });

        return redirect()->route('panen.index')
            ->with('success', 'Data panen berhasil ditambahkan. Stok jamur bertambah ' . number_format($validated['berat_layak_jual'], 2) . ' kg');
    }

    public function edit(Panen $panen)
    {
        $kumbungs = Kumbung::where('status', 'aktif')
            ->orderBy('nomor')
            ->get(['id', 'nomor', 'nama']);

        // Get baglogs that are in kumbung (masuk_kumbung status) + current baglog
        $baglogs = Baglog::where(function ($query) use ($panen) {
                $query->where('status', 'masuk_kumbung')
                    ->whereNotNull('kumbung_id');
                if ($panen->baglog_id) {
                    $query->orWhere('id', $panen->baglog_id);
                }
            })
            ->with('kumbung:id,nomor,nama')
            ->orderBy('kode_batch')
            ->get()
            ->map(function ($baglog) {
                return [
                    'id' => $baglog->id,
                    'kode_batch' => $baglog->kode_batch,
                    'jumlah' => $baglog->jumlah,
                    'kumbung_id' => $baglog->kumbung_id,
                    'kumbung_nama' => $baglog->kumbung ? $baglog->kumbung->nama : null,
                ];
            });

        return Inertia::render('Panen/Edit', [
            'panen' => [
                'id' => $panen->id,
                'kumbung_id' => $panen->kumbung_id,
                'baglog_id' => $panen->baglog_id,
                'tanggal' => $panen->tanggal->format('Y-m-d'),
                'berat_kg' => $panen->berat_kg,
                'berat_layak_jual' => $panen->berat_layak_jual,
                'berat_reject' => $panen->berat_reject,
                'catatan' => $panen->catatan,
            ],
            'kumbungs' => $kumbungs,
            'baglogs' => $baglogs,
        ]);
    }

    public function update(Request $request, Panen $panen)
    {
        $validated = $request->validate([
            'kumbung_id' => 'required|exists:kumbungs,id',
            'baglog_id' => 'nullable|exists:baglogs,id',
            'tanggal' => 'required|date',
            'berat_kg' => 'required|numeric|min:0.01',
            'berat_layak_jual' => 'required|numeric|min:0',
            'berat_reject' => 'required|numeric|min:0',
            'catatan' => 'nullable|string|max:500',
        ]);

        // Validasi: layak_jual + reject harus sama dengan total
        $totalSortir = $validated['berat_layak_jual'] + $validated['berat_reject'];
        if (abs($totalSortir - $validated['berat_kg']) > 0.01) {
            return back()->withErrors(['berat_layak_jual' => 'Total layak jual + reject harus sama dengan berat total']);
        }

        // Validate baglog belongs to the selected kumbung
        if (!empty($validated['baglog_id'])) {
            $baglog = Baglog::find($validated['baglog_id']);
            if ($baglog->kumbung_id != $validated['kumbung_id']) {
                return back()->withErrors(['baglog_id' => 'Baglog tidak berada di kumbung yang dipilih']);
            }
        }

        $oldBeratLayakJual = $panen->berat_layak_jual;

        DB::transaction(function () use ($validated, $panen, $oldBeratLayakJual) {
            // Update panen record
            $panen->update($validated);

            // Update StokJamur if berat_layak_jual changed
            $newBeratLayakJual = $validated['berat_layak_jual'];
            $selisih = $newBeratLayakJual - $oldBeratLayakJual;

            if (abs($selisih) > 0.01) {
                // Delete old StokJamur entry
                StokJamur::where('panen_id', $panen->id)->delete();

                // Create new StokJamur entry if there's berat_layak_jual
                if ($newBeratLayakJual > 0) {
                    $stokSebelum = StokJamur::getStokTersedia();
                    $stokSesudah = $stokSebelum + $newBeratLayakJual;

                    StokJamur::create([
                        'kumbung_id' => $validated['kumbung_id'],
                        'panen_id' => $panen->id,
                        'tipe' => 'masuk',
                        'berat_kg' => $newBeratLayakJual,
                        'stok_sebelum' => $stokSebelum,
                        'stok_sesudah' => $stokSesudah,
                        'keterangan' => 'Hasil panen (update) - ' . ($validated['catatan'] ?? 'Tanpa catatan'),
                        'tanggal' => $validated['tanggal'],
                    ]);
                }
            }
        });

        return redirect()->route('panen.index')
            ->with('success', 'Data panen berhasil diupdate');
    }

    public function destroy(Panen $panen)
    {
        DB::transaction(function () use ($panen) {
            // Delete related StokJamur entry
            StokJamur::where('panen_id', $panen->id)->delete();

            $panen->delete();
        });

        return redirect()->route('panen.index')
            ->with('success', 'Data panen berhasil dihapus. Stok jamur telah disesuaikan.');
    }
}
