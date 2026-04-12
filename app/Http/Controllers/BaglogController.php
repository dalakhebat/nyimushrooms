<?php

namespace App\Http\Controllers;

use App\Models\Baglog;
use App\Models\Customer;
use App\Models\Kas;
use App\Models\Kumbung;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class BaglogController extends Controller
{
    /**
     * Status progression rules (state machine)
     * produksi → siap_tanam → masuk_kumbung → selesai
     * Any status can go to → dijual (when selling baglog)
     */
    private const STATUS_TRANSITIONS = [
        'produksi' => ['masuk_kumbung', 'dijual'],
        'masuk_kumbung' => ['selesai', 'dijual'],
        'dijual' => [],
        'selesai' => [],
    ];

    private const STATUS_LABELS = [
        'produksi' => 'Produksi',
        'masuk_kumbung' => 'Masuk Kumbung',
        'dijual' => 'Dijual',
        'selesai' => 'Selesai',
    ];

    private function getAllowedStatuses(string $currentStatus): array
    {
        return self::STATUS_TRANSITIONS[$currentStatus] ?? [];
    }

    private function isValidTransition(string $from, string $to): bool
    {
        if ($from === $to) {
            return true;
        }
        return in_array($to, self::STATUS_TRANSITIONS[$from] ?? []);
    }

    public function index(Request $request)
    {
        $query = Baglog::with('kumbung');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('kumbung_id')) {
            $query->where('kumbung_id', $request->kumbung_id);
        }

        if ($request->filled('search')) {
            $query->where('kode_batch', 'like', '%' . $request->search . '%');
        }

        $baglogs = $query->orderBy('tanggal_produksi', 'desc')->paginate(15)->withQueryString();

        $baglogs->getCollection()->transform(function ($baglog) {
            $baglog->tanggal_produksi_formatted = $baglog->tanggal_produksi->locale('id')->isoFormat('D MMM Y');
            $baglog->tanggal_masuk_kumbung_formatted = $baglog->tanggal_tanam?->locale('id')->isoFormat('D MMM Y');
            $baglog->tanggal_estimasi_selesai_formatted = $baglog->tanggal_estimasi_selesai?->locale('id')->isoFormat('D MMM Y');
            if ($baglog->tanggal_tanam && $baglog->tanggal_tanam->lte(now())) {
                $hari = $baglog->tanggal_tanam->startOfDay()->diffInDays(now()->startOfDay());
                $baglog->umur = $hari . ' hari';
            } else {
                $baglog->umur = null;
            }
            return $baglog;
        });

        $summary = [
            'produksi' => Baglog::where('status', 'produksi')->sum('jumlah'),
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

        $customers = Customer::orderBy('nama')->get(['id', 'nama']);

        return Inertia::render('Baglog/Index', [
            'baglogs' => $baglogs,
            'kumbungs' => $kumbungs,
            'customers' => $customers,
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
            'sumber' => 'required|in:produksi_sendiri,beli_jadi,stok_awal',
            'supplier_nama' => 'nullable|string|max:255',
            'harga_satuan' => 'nullable|numeric|min:0',
            'jumlah' => 'required|integer|min:1',
            'tanggal_produksi' => 'required|date',
            'kumbung_id' => 'nullable|exists:kumbungs,id',
            'tanggal_tanam' => 'nullable|date',
            'status' => 'required|in:produksi,masuk_kumbung',
        ]);

        // Kalau sumber beli_jadi, supplier & harga wajib
        if ($validated['sumber'] === 'beli_jadi') {
            if (empty($validated['supplier_nama'])) {
                return back()->withErrors(['supplier_nama' => 'Nama supplier wajib diisi untuk sumber "Beli Jadi"']);
            }
            if (empty($validated['harga_satuan']) || $validated['harga_satuan'] <= 0) {
                return back()->withErrors(['harga_satuan' => 'Harga satuan wajib diisi untuk sumber "Beli Jadi"']);
            }
        } else {
            // Sumber lain tidak pakai supplier/harga
            $validated['supplier_nama'] = null;
            $validated['harga_satuan'] = null;
        }

        if ($validated['status'] === 'masuk_kumbung' && empty($validated['kumbung_id'])) {
            return back()->withErrors(['kumbung_id' => 'Pilih kumbung untuk status masuk_kumbung']);
        }

        if (!empty($validated['kumbung_id']) && $validated['status'] === 'masuk_kumbung') {
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

        if ($validated['tanggal_tanam']) {
            $validated['tanggal_estimasi_selesai'] = Carbon::parse($validated['tanggal_tanam'])->addMonths(5);
        }

        DB::transaction(function () use ($validated) {
            $baglog = Baglog::create($validated);

            // Auto catat kas keluar kalau beli jadi
            if ($validated['sumber'] === 'beli_jadi') {
                $totalBiaya = $validated['jumlah'] * $validated['harga_satuan'];
                $this->createKasKeluar(
                    tanggal: $validated['tanggal_produksi'],
                    jumlah: $totalBiaya,
                    keterangan: "Pembelian baglog jadi - {$validated['supplier_nama']} ({$validated['jumlah']} baglog)",
                    referensi: 'baglog_beli_jadi:' . $baglog->id,
                );
            }
        });

        return redirect('/baglog')->with('success', 'Baglog berhasil ditambahkan');
    }

    /**
     * Generate kas keluar transaction for baglog purchase.
     */
    private function createKasKeluar(string $tanggal, float $jumlah, string $keterangan, string $referensi): Kas
    {
        $today = now()->format('Ymd');
        $lastKode = Kas::where('kode_transaksi', 'like', "KK{$today}%")
            ->orderBy('id', 'desc')
            ->first()?->kode_transaksi;

        if (!$lastKode) {
            $kodeTransaksi = "KK{$today}001";
        } else {
            $number = (int) substr($lastKode, -3) + 1;
            $kodeTransaksi = "KK{$today}" . str_pad($number, 3, '0', STR_PAD_LEFT);
        }

        return Kas::create([
            'kode_transaksi' => $kodeTransaksi,
            'tanggal' => $tanggal,
            'tipe' => 'keluar',
            'kategori' => 'pembelian_baglog',
            'jumlah' => $jumlah,
            'keterangan' => $keterangan,
            'referensi' => $referensi,
        ]);
    }

    public function edit(Baglog $baglog)
    {
        $kumbungs = Kumbung::where('status', 'aktif')->orderBy('nama')->get()->map(function ($k) use ($baglog) {
            $terisi = Baglog::where('kumbung_id', $k->id)
                ->where('status', 'masuk_kumbung')
                ->where('id', '!=', $baglog->id)
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
            'status' => 'required|in:produksi,masuk_kumbung,dijual,selesai',
        ]);

        if (!$this->isValidTransition($baglog->status, $validated['status'])) {
            $allowedNext = implode(', ', $this->getAllowedStatuses($baglog->status));
            return back()->withErrors([
                'status' => "Tidak dapat mengubah status dari '{$baglog->status}' ke '{$validated['status']}'. Status yang diperbolehkan: {$allowedNext}"
            ]);
        }

        if ($validated['status'] === 'masuk_kumbung' && empty($validated['kumbung_id'])) {
            return back()->withErrors(['kumbung_id' => 'Pilih kumbung untuk status masuk_kumbung']);
        }

        $newKumbungId = $validated['kumbung_id'] ?? null;

        if ($newKumbungId && $validated['status'] === 'masuk_kumbung') {
            $kumbung = Kumbung::find($newKumbungId);
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

    public function updateStatus(Request $request, Baglog $baglog)
    {
        $validated = $request->validate([
            'status' => 'required|in:produksi,masuk_kumbung,dijual,selesai',
            'kumbung_id' => 'nullable|exists:kumbungs,id',
        ]);

        if (!$this->isValidTransition($baglog->status, $validated['status'])) {
            $allowedNext = implode(', ', $this->getAllowedStatuses($baglog->status));
            return redirect()->back()->withErrors([
                'status' => "Tidak dapat mengubah status dari '{$baglog->status}' ke '{$validated['status']}'. Status yang diperbolehkan: {$allowedNext}"
            ]);
        }

        if ($validated['status'] === 'masuk_kumbung') {
            $kumbungId = $validated['kumbung_id'] ?? $baglog->kumbung_id;
            if (!$kumbungId) {
                return redirect()->back()->withErrors([
                    'kumbung_id' => 'Pilih kumbung untuk status masuk_kumbung'
                ]);
            }

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

            $baglog->kumbung_id = $kumbungId;

            if (!$baglog->tanggal_tanam) {
                $baglog->tanggal_tanam = now();
                $baglog->tanggal_estimasi_selesai = now()->addMonths(5);
            }
        }

        $baglog->status = $validated['status'];
        $baglog->save();

        return redirect()->back()->with('success', 'Status baglog berhasil diupdate');
    }

    public function getAllowedNextStatuses(Baglog $baglog)
    {
        return response()->json([
            'current_status' => $baglog->status,
            'allowed_statuses' => $this->getAllowedStatuses($baglog->status),
        ]);
    }

    /**
     * Distribusikan baglog produksi ke beberapa kumbung sekaligus.
     * Contoh: batch 80.000 → Kumbung A 40k, Kumbung B 25k, Kumbung C 15k.
     * Akan membuat N baglog baru dengan status 'masuk_kumbung' per kumbung,
     * dan mengurangi parent baglog. Kalau total distribusi == parent.jumlah,
     * parent baglog dihapus.
     */
    public function distribute(Request $request, Baglog $baglog)
    {
        if ($baglog->status !== 'produksi') {
            return back()->withErrors([
                'distributions' => 'Hanya baglog berstatus "produksi" yang bisa didistribusi.',
            ]);
        }

        $validated = $request->validate([
            'tanggal_tanam' => 'nullable|date',
            'distributions' => 'required|array|min:1',
            'distributions.*.kumbung_id' => 'required|exists:kumbungs,id',
            'distributions.*.jumlah' => 'required|integer|min:1',
        ]);

        $distributions = collect($validated['distributions']);
        $tanggalTanam = $validated['tanggal_tanam'] ?? now()->format('Y-m-d');

        // Cegah kumbung duplikat — gabungkan aja jumlahnya kalau emang mau ke kumbung sama
        if ($distributions->pluck('kumbung_id')->duplicates()->count() > 0) {
            return back()->withErrors([
                'distributions' => 'Tidak boleh pilih kumbung yang sama dua kali. Gabungkan jumlahnya jadi satu baris.',
            ]);
        }

        // Total tidak boleh melebihi jumlah parent
        $totalDistribusi = (int) $distributions->sum('jumlah');
        if ($totalDistribusi > $baglog->jumlah) {
            return back()->withErrors([
                'distributions' => "Total distribusi ({$totalDistribusi}) melebihi jumlah baglog yang tersedia ({$baglog->jumlah}).",
            ]);
        }

        // Cek kapasitas setiap kumbung (berdasarkan baglog yang udah masuk_kumbung)
        foreach ($distributions as $dist) {
            $kumbung = Kumbung::find($dist['kumbung_id']);
            if (!$kumbung || $kumbung->status !== 'aktif') {
                return back()->withErrors([
                    'distributions' => "Kumbung '{$kumbung?->nama}' tidak aktif.",
                ]);
            }

            $terisi = Baglog::where('kumbung_id', $dist['kumbung_id'])
                ->where('status', 'masuk_kumbung')
                ->sum('jumlah');
            $tersedia = $kumbung->kapasitas_baglog - $terisi;

            if ($dist['jumlah'] > $tersedia) {
                return back()->withErrors([
                    'distributions' => "Kapasitas kumbung {$kumbung->nama} tidak cukup. Tersedia: {$tersedia}, diminta: {$dist['jumlah']}.",
                ]);
            }
        }

        DB::transaction(function () use ($baglog, $distributions, $tanggalTanam, $totalDistribusi) {
            // Suffix dimulai dari child yang udah ada (aman kalau distribute dipanggil berkali-kali)
            $existingChildCount = Baglog::where('kode_batch', 'like', $baglog->kode_batch . '-%')->count();

            foreach ($distributions as $i => $dist) {
                $kumbung = Kumbung::find($dist['kumbung_id']);
                $suffix = $existingChildCount + $i + 1;
                $kodeBatch = $baglog->kode_batch . '-' . $suffix;

                // Safety: kalau ternyata masih bentrok (edge case), tambahin nomor kumbung
                while (Baglog::where('kode_batch', $kodeBatch)->exists()) {
                    $suffix++;
                    $kodeBatch = $baglog->kode_batch . '-' . $suffix;
                }

                Baglog::create([
                    'kode_batch' => $kodeBatch,
                    'jumlah' => $dist['jumlah'],
                    'tanggal_produksi' => $baglog->tanggal_produksi,
                    'kumbung_id' => $dist['kumbung_id'],
                    'tanggal_tanam' => $tanggalTanam,
                    'tanggal_estimasi_selesai' => Carbon::parse($tanggalTanam)->addMonths(5),
                    'status' => 'masuk_kumbung',
                ]);
            }

            $sisa = $baglog->jumlah - $totalDistribusi;
            if ($sisa <= 0) {
                $baglog->delete();
            } else {
                $baglog->update(['jumlah' => $sisa]);
            }
        });

        $sisa = $baglog->jumlah - $totalDistribusi;
        $msg = $sisa > 0
            ? "Baglog berhasil didistribusi. Sisa {$sisa} masih di produksi."
            : 'Baglog berhasil didistribusi ke semua kumbung.';

        return redirect('/baglog')->with('success', $msg);
    }
}
