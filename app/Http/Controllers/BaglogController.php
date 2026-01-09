<?php

namespace App\Http\Controllers;

use App\Models\Baglog;
use App\Models\Kumbung;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class BaglogController extends Controller
{
    public function index(Request $request)
    {
        $query = Baglog::with('kumbung');

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by kumbung
        if ($request->filled('kumbung_id')) {
            $query->where('kumbung_id', $request->kumbung_id);
        }

        // Search by kode_batch
        if ($request->filled('search')) {
            $query->where('kode_batch', 'like', '%' . $request->search . '%');
        }

        $baglogs = $query->orderBy('tanggal_produksi', 'desc')->paginate(15)->withQueryString();

        // Format dates
        $baglogs->getCollection()->transform(function ($baglog) {
            $baglog->tanggal_produksi_formatted = $baglog->tanggal_produksi->locale('id')->isoFormat('D MMM Y');
            $baglog->tanggal_masuk_kumbung_formatted = $baglog->tanggal_tanam?->locale('id')->isoFormat('D MMM Y');
            $baglog->tanggal_estimasi_selesai_formatted = $baglog->tanggal_estimasi_selesai?->locale('id')->isoFormat('D MMM Y');
            // Umur dihitung dari tanggal masuk kumbung (tanggal_tanam) sampai sekarang
            if ($baglog->tanggal_tanam && $baglog->tanggal_tanam->lte(now())) {
                $hari = $baglog->tanggal_tanam->startOfDay()->diffInDays(now()->startOfDay());
                $baglog->umur = $hari . ' hari';
            } else {
                $baglog->umur = null;
            }
            return $baglog;
        });

        // Summary
        $summary = [
            'produksi' => Baglog::where('status', 'produksi')->sum('jumlah'),
            'inkubasi' => Baglog::where('status', 'inkubasi')->sum('jumlah'),
            'pembibitan' => Baglog::where('status', 'pembibitan')->sum('jumlah'),
            'masuk_kumbung' => Baglog::where('status', 'masuk_kumbung')->sum('jumlah'),
            'dijual' => Baglog::where('status', 'dijual')->sum('jumlah'),
            'selesai' => Baglog::where('status', 'selesai')->sum('jumlah'),
        ];

        $kumbungs = Kumbung::where('status', 'aktif')->orderBy('nama')->get();

        return Inertia::render('Baglog/Index', [
            'baglogs' => $baglogs,
            'kumbungs' => $kumbungs,
            'summary' => $summary,
            'filters' => $request->only(['status', 'kumbung_id', 'search']),
        ]);
    }

    public function create()
    {
        $kumbungs = Kumbung::where('status', 'aktif')->orderBy('nama')->get();

        return Inertia::render('Baglog/Create', [
            'kumbungs' => $kumbungs,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_batch' => 'required|string|max:50|unique:baglogs,kode_batch',
            'jumlah' => 'required|integer|min:1',
            'tanggal_produksi' => 'required|date',
            'kumbung_id' => 'nullable|exists:kumbungs,id',
            'tanggal_tanam' => 'nullable|date',
            'status' => 'required|in:produksi,inkubasi,pembibitan,masuk_kumbung,dijual,selesai',
        ]);

        // Calculate estimated completion date (5 months from masuk kumbung)
        if ($validated['tanggal_tanam']) {
            $validated['tanggal_estimasi_selesai'] = Carbon::parse($validated['tanggal_tanam'])->addMonths(5);
        }

        Baglog::create($validated);

        return redirect('/baglog')->with('success', 'Baglog berhasil ditambahkan');
    }

    public function edit(Baglog $baglog)
    {
        $kumbungs = Kumbung::where('status', 'aktif')->orderBy('nama')->get();

        return Inertia::render('Baglog/Edit', [
            'baglog' => [
                'id' => $baglog->id,
                'kode_batch' => $baglog->kode_batch,
                'jumlah' => $baglog->jumlah,
                'tanggal_produksi' => $baglog->tanggal_produksi->format('Y-m-d'),
                'kumbung_id' => $baglog->kumbung_id,
                'tanggal_tanam' => $baglog->tanggal_tanam?->format('Y-m-d'),
                'tanggal_estimasi_selesai' => $baglog->tanggal_estimasi_selesai?->format('Y-m-d'),
                'status' => $baglog->status,
            ],
            'kumbungs' => $kumbungs,
        ]);
    }

    public function update(Request $request, Baglog $baglog)
    {
        $validated = $request->validate([
            'kode_batch' => 'required|string|max:50|unique:baglogs,kode_batch,' . $baglog->id,
            'jumlah' => 'required|integer|min:1',
            'tanggal_produksi' => 'required|date',
            'kumbung_id' => 'nullable|exists:kumbungs,id',
            'tanggal_tanam' => 'nullable|date',
            'tanggal_estimasi_selesai' => 'nullable|date',
            'status' => 'required|in:produksi,inkubasi,pembibitan,masuk_kumbung,dijual,selesai',
        ]);

        // Auto-calculate if tanggal_tanam changed and no manual estimasi
        if ($validated['tanggal_tanam'] && !$request->filled('tanggal_estimasi_selesai')) {
            $validated['tanggal_estimasi_selesai'] = Carbon::parse($validated['tanggal_tanam'])->addMonths(5);
        }

        $baglog->update($validated);

        return redirect('/baglog')->with('success', 'Baglog berhasil diupdate');
    }

    public function destroy(Baglog $baglog)
    {
        $baglog->delete();

        return redirect('/baglog')->with('success', 'Baglog berhasil dihapus');
    }

    /**
     * Update status (quick action)
     */
    public function updateStatus(Request $request, Baglog $baglog)
    {
        $validated = $request->validate([
            'status' => 'required|in:produksi,inkubasi,pembibitan,masuk_kumbung,dijual,selesai',
        ]);

        // If changing to masuk_kumbung, set tanggal_tanam (tanggal masuk kumbung) if not set
        if ($validated['status'] === 'masuk_kumbung' && !$baglog->tanggal_tanam) {
            $baglog->tanggal_tanam = now();
            $baglog->tanggal_estimasi_selesai = now()->addMonths(5);
        }

        $baglog->status = $validated['status'];
        $baglog->save();

        return redirect()->back()->with('success', 'Status baglog berhasil diupdate');
    }
}
