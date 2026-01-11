<?php

namespace App\Http\Controllers;

use App\Models\Baglog;
use App\Models\Kumbung;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class BaglogController extends Controller
{
    /**
     * Status progression rules (state machine)
     * produksi → inkubasi → pembibitan → masuk_kumbung → selesai
     * Any status can go to → dijual (when selling baglog)
     */
    private const STATUS_TRANSITIONS = [
        'produksi' => ['inkubasi', 'dijual'],
        'inkubasi' => ['pembibitan', 'dijual'],
        'pembibitan' => ['masuk_kumbung', 'dijual'],
        'masuk_kumbung' => ['selesai', 'dijual'],
        'dijual' => [], // Final state
        'selesai' => [], // Final state
    ];

    /**
     * Get allowed next statuses for a given status
     */
    private function getAllowedStatuses(string $currentStatus): array
    {
        return self::STATUS_TRANSITIONS[$currentStatus] ?? [];
    }

    /**
     * Check if a status transition is valid
     */
    private function isValidTransition(string $from, string $to): bool
    {
        // Same status is always valid
        if ($from === $to) {
            return true;
        }
        return in_array($to, self::STATUS_TRANSITIONS[$from] ?? []);
    }
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

        $kumbungs = Kumbung::where('status', 'aktif')->orderBy('nama')->get()->map(function ($k) {
            $terisi = Baglog::where('kumbung_id', $k->id)
                ->where('status', 'masuk_kumbung')
                ->sum('jumlah');
            return [
                'id' => $k->id,
                'nama' => $k->nama,
                'kapasitas' => $k->kapasitas_baglog,
                'terisi' => $terisi,
                'tersedia' => $k->kapasitas_baglog - $terisi,
                'status' => $k->status,
            ];
        });

        return Inertia::render('Baglog/Index', [
            'baglogs' => $baglogs,
            'kumbungs' => $kumbungs,
            'summary' => $summary,
            'filters' => $request->only(['status', 'kumbung_id', 'search']),
        ]);
    }

    public function create()
    {
        $kumbungs = Kumbung::where('status', 'aktif')->orderBy('nama')->get()->map(function ($k) {
            $terisi = Baglog::where('kumbung_id', $k->id)
                ->where('status', 'masuk_kumbung')
                ->sum('jumlah');
            return [
                'id' => $k->id,
                'nama' => $k->nama,
                'kapasitas' => $k->kapasitas_baglog,
                'terisi' => $terisi,
                'tersedia' => $k->kapasitas_baglog - $terisi,
            ];
        });

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

        // New baglog must start with 'produksi' status
        if ($validated['status'] !== 'produksi') {
            return back()->withErrors(['status' => 'Baglog baru harus dimulai dengan status "produksi"']);
        }

        // Validate: masuk_kumbung requires kumbung_id
        if ($validated['status'] === 'masuk_kumbung' && empty($validated['kumbung_id'])) {
            return back()->withErrors(['kumbung_id' => 'Pilih kumbung untuk status masuk_kumbung']);
        }

        // Validate kumbung capacity if assigning to kumbung
        if (!empty($validated['kumbung_id'])) {
            $kumbung = Kumbung::find($validated['kumbung_id']);
            $currentBaglogs = Baglog::where('kumbung_id', $validated['kumbung_id'])
                ->where('status', 'masuk_kumbung')
                ->sum('jumlah');
            $availableCapacity = $kumbung->kapasitas_baglog - $currentBaglogs;

            if ($validated['jumlah'] > $availableCapacity) {
                return back()->withErrors([
                    'jumlah' => "Kapasitas kumbung tidak cukup. Tersedia: {$availableCapacity} baglog (kapasitas: {$kumbung->kapasitas_baglog}, terisi: {$currentBaglogs})"
                ]);
            }
        }

        // Calculate estimated completion date (5 months from masuk kumbung)
        if ($validated['tanggal_tanam']) {
            $validated['tanggal_estimasi_selesai'] = Carbon::parse($validated['tanggal_tanam'])->addMonths(5);
        }

        Baglog::create($validated);

        return redirect('/baglog')->with('success', 'Baglog berhasil ditambahkan');
    }

    public function edit(Baglog $baglog)
    {
        $kumbungs = Kumbung::where('status', 'aktif')->orderBy('nama')->get()->map(function ($k) use ($baglog) {
            $terisi = Baglog::where('kumbung_id', $k->id)
                ->where('status', 'masuk_kumbung')
                ->where('id', '!=', $baglog->id) // Exclude current baglog
                ->sum('jumlah');
            return [
                'id' => $k->id,
                'nama' => $k->nama,
                'kapasitas' => $k->kapasitas_baglog,
                'terisi' => $terisi,
                'tersedia' => $k->kapasitas_baglog - $terisi,
            ];
        });

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

        // Validate status transition
        if (!$this->isValidTransition($baglog->status, $validated['status'])) {
            $allowedNext = implode(', ', $this->getAllowedStatuses($baglog->status));
            return back()->withErrors([
                'status' => "Tidak dapat mengubah status dari '{$baglog->status}' ke '{$validated['status']}'. Status yang diperbolehkan: {$allowedNext}"
            ]);
        }

        // Validate: masuk_kumbung requires kumbung_id
        if ($validated['status'] === 'masuk_kumbung' && empty($validated['kumbung_id'])) {
            return back()->withErrors(['kumbung_id' => 'Pilih kumbung untuk status masuk_kumbung']);
        }

        // Validate kumbung capacity if status is masuk_kumbung
        $newKumbungId = $validated['kumbung_id'] ?? null;

        if ($newKumbungId && $validated['status'] === 'masuk_kumbung') {
            $kumbung = Kumbung::find($newKumbungId);
            // Hitung baglog lain di kumbung ini (exclude current baglog)
            $currentBaglogs = Baglog::where('kumbung_id', $newKumbungId)
                ->where('status', 'masuk_kumbung')
                ->where('id', '!=', $baglog->id)
                ->sum('jumlah');
            $availableCapacity = $kumbung->kapasitas_baglog - $currentBaglogs;

            if ($validated['jumlah'] > $availableCapacity) {
                return back()->withErrors([
                    'jumlah' => "Kapasitas kumbung tidak cukup. Tersedia: {$availableCapacity} baglog (kapasitas: {$kumbung->kapasitas_baglog}, terisi: {$currentBaglogs})"
                ]);
            }
        }

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
            'kumbung_id' => 'nullable|exists:kumbungs,id',
        ]);

        // Validate status transition
        if (!$this->isValidTransition($baglog->status, $validated['status'])) {
            $allowedNext = implode(', ', $this->getAllowedStatuses($baglog->status));
            return redirect()->back()->withErrors([
                'status' => "Tidak dapat mengubah status dari '{$baglog->status}' ke '{$validated['status']}'. Status yang diperbolehkan: {$allowedNext}"
            ]);
        }

        // If changing to masuk_kumbung, require kumbung_id
        if ($validated['status'] === 'masuk_kumbung') {
            $kumbungId = $validated['kumbung_id'] ?? $baglog->kumbung_id;
            if (!$kumbungId) {
                return redirect()->back()->withErrors([
                    'kumbung_id' => 'Pilih kumbung untuk status masuk_kumbung'
                ]);
            }

            // Validate kumbung capacity
            $kumbung = Kumbung::find($kumbungId);
            $currentBaglogs = Baglog::where('kumbung_id', $kumbungId)
                ->where('status', 'masuk_kumbung')
                ->where('id', '!=', $baglog->id)
                ->sum('jumlah');
            $availableCapacity = $kumbung->kapasitas_baglog - $currentBaglogs;

            if ($baglog->jumlah > $availableCapacity) {
                return redirect()->back()->withErrors([
                    'kumbung_id' => "Kapasitas kumbung tidak cukup. Tersedia: {$availableCapacity} baglog"
                ]);
            }

            // Set kumbung_id
            $baglog->kumbung_id = $kumbungId;

            // Set tanggal_tanam (tanggal masuk kumbung) if not set
            if (!$baglog->tanggal_tanam) {
                $baglog->tanggal_tanam = now();
                $baglog->tanggal_estimasi_selesai = now()->addMonths(5);
            }
        }

        $baglog->status = $validated['status'];
        $baglog->save();

        return redirect()->back()->with('success', 'Status baglog berhasil diupdate');
    }

    /**
     * Get allowed next statuses for frontend
     */
    public function getAllowedNextStatuses(Baglog $baglog)
    {
        return response()->json([
            'current_status' => $baglog->status,
            'allowed_statuses' => $this->getAllowedStatuses($baglog->status),
        ]);
    }
}
