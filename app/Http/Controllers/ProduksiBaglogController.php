<?php

namespace App\Http\Controllers;

use App\Models\ProduksiBaglog;
use App\Models\ProduksiBahanBaku;
use App\Models\BahanBaku;
use App\Models\Karyawan;
use App\Models\StokMovement;
use App\Models\Baglog;
use App\Models\Kumbung;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ProduksiBaglogController extends Controller
{
    public function index(Request $request)
    {
        $query = ProduksiBaglog::with(['karyawan']);

        if ($request->filled('search')) {
            $query->where('kode_produksi', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('tahap')) {
            $query->where('tahap', $request->tahap);
        }

        if ($request->filled('bulan')) {
            $query->whereMonth('tanggal', $request->bulan);
        }

        if ($request->filled('tahun')) {
            $query->whereYear('tanggal', $request->tahun);
        }

        $produksis = $query->orderBy('tanggal', 'desc')->paginate(15);

        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        $summary = [
            'totalBulanIni' => ProduksiBaglog::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->sum('jumlah_baglog'),
            'mixing' => ProduksiBaglog::where('tahap', 'mixing')->count(),
            'sterilisasi' => ProduksiBaglog::where('tahap', 'sterilisasi')->count(),
            'inokulasi' => ProduksiBaglog::where('tahap', 'inokulasi')->count(),
            'inkubasi' => ProduksiBaglog::where('tahap', 'inkubasi')->count(),
            'selesai' => ProduksiBaglog::where('tahap', 'selesai')->count(),
        ];

        $tahaps = ['mixing', 'sterilisasi', 'inokulasi', 'inkubasi', 'selesai'];

        return Inertia::render('ProduksiBaglog/Index', [
            'produksis' => $produksis,
            'summary' => $summary,
            'tahaps' => $tahaps,
            'filters' => $request->only(['search', 'tahap', 'bulan', 'tahun']),
        ]);
    }

    public function create()
    {
        $karyawans = Karyawan::where('status', 'aktif')->orderBy('nama')->get();
        $bahanBakus = BahanBaku::where('stok', '>', 0)->orderBy('nama')->get();

        return Inertia::render('ProduksiBaglog/Create', [
            'nextKode' => ProduksiBaglog::generateKode(),
            'karyawans' => $karyawans,
            'bahanBakus' => $bahanBakus,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'jumlah_baglog' => 'required|integer|min:1',
            'karyawan_id' => 'nullable|exists:karyawans,id',
            'catatan' => 'nullable|string',
            'bahan_bakus' => 'required|array|min:1',
            'bahan_bakus.*.bahan_baku_id' => 'required|exists:bahan_bakus,id',
            'bahan_bakus.*.jumlah' => 'required|integer|min:1',
        ]);

        // Validasi stok bahan baku
        foreach ($validated['bahan_bakus'] as $item) {
            $bahanBaku = BahanBaku::find($item['bahan_baku_id']);
            if ($bahanBaku->stok < $item['jumlah']) {
                return back()->withErrors([
                    'bahan_bakus' => "Stok {$bahanBaku->nama} tidak cukup. Tersedia: {$bahanBaku->stok} {$bahanBaku->satuan}"
                ]);
            }
        }

        $produksi = ProduksiBaglog::create([
            'kode_produksi' => ProduksiBaglog::generateKode(),
            'tanggal' => $validated['tanggal'],
            'jumlah_baglog' => $validated['jumlah_baglog'],
            'tahap' => 'mixing',
            'waktu_mixing' => now(),
            'karyawan_id' => $validated['karyawan_id'],
            'catatan' => $validated['catatan'],
        ]);

        // Kurangi stok bahan baku
        foreach ($validated['bahan_bakus'] as $item) {
            $bahanBaku = BahanBaku::find($item['bahan_baku_id']);
            $stokSebelum = $bahanBaku->stok;
            $stokSesudah = $stokSebelum - $item['jumlah'];

            ProduksiBahanBaku::create([
                'produksi_baglog_id' => $produksi->id,
                'bahan_baku_id' => $item['bahan_baku_id'],
                'jumlah_digunakan' => $item['jumlah'],
            ]);

            StokMovement::create([
                'bahan_baku_id' => $bahanBaku->id,
                'tipe' => 'keluar',
                'jumlah' => $item['jumlah'],
                'stok_sebelum' => $stokSebelum,
                'stok_sesudah' => $stokSesudah,
                'referensi' => 'produksi:' . $produksi->id,
                'keterangan' => 'Produksi baglog ' . $produksi->kode_produksi,
                'tanggal' => $validated['tanggal'],
            ]);

            $bahanBaku->update(['stok' => $stokSesudah]);
        }

        return redirect()->route('produksi-baglog.index')
            ->with('success', 'Produksi baglog berhasil ditambahkan');
    }

    public function show(ProduksiBaglog $produksiBaglog)
    {
        $produksiBaglog->load(['karyawan', 'bahanBakus.bahanBaku']);

        return Inertia::render('ProduksiBaglog/Show', [
            'produksi' => $produksiBaglog,
        ]);
    }

    public function updateTahap(Request $request, ProduksiBaglog $produksiBaglog)
    {
        $validated = $request->validate([
            'tahap' => 'required|in:mixing,sterilisasi,inokulasi,inkubasi,selesai',
        ]);

        $updates = ['tahap' => $validated['tahap']];

        // Set waktu berdasarkan tahap
        switch ($validated['tahap']) {
            case 'sterilisasi':
                $updates['waktu_sterilisasi_mulai'] = now();
                break;
            case 'inokulasi':
                $updates['waktu_sterilisasi_selesai'] = now();
                $updates['waktu_inokulasi'] = now();
                break;
            case 'selesai':
                // Buat record baglog baru
                $this->createBaglogFromProduksi($produksiBaglog);
                break;
        }

        $produksiBaglog->update($updates);

        return back()->with('success', 'Tahap produksi berhasil diupdate');
    }

    private function createBaglogFromProduksi(ProduksiBaglog $produksi)
    {
        // Generate kode batch
        $today = now()->format('Ymd');
        $lastKode = Baglog::where('kode_batch', 'like', "BL{$today}%")
            ->orderBy('id', 'desc')
            ->first()?->kode_batch;

        if (!$lastKode) {
            $kodeBatch = "BL{$today}001";
        } else {
            $number = (int) substr($lastKode, -3) + 1;
            $kodeBatch = "BL{$today}" . str_pad($number, 3, '0', STR_PAD_LEFT);
        }

        Baglog::create([
            'kumbung_id' => null,
            'kode_batch' => $kodeBatch,
            'jumlah' => $produksi->jumlah_baglog,
            'tanggal_produksi' => $produksi->tanggal,
            'status' => 'produksi',
        ]);
    }

    public function destroy(ProduksiBaglog $produksiBaglog)
    {
        // Kembalikan stok bahan baku
        foreach ($produksiBaglog->bahanBakus as $item) {
            $bahanBaku = $item->bahanBaku;
            $stokSebelum = $bahanBaku->stok;
            $stokSesudah = $stokSebelum + $item->jumlah_digunakan;

            StokMovement::create([
                'bahan_baku_id' => $bahanBaku->id,
                'tipe' => 'masuk',
                'jumlah' => $item->jumlah_digunakan,
                'stok_sebelum' => $stokSebelum,
                'stok_sesudah' => $stokSesudah,
                'referensi' => 'hapus_produksi:' . $produksiBaglog->id,
                'keterangan' => 'Hapus produksi ' . $produksiBaglog->kode_produksi,
                'tanggal' => now(),
            ]);

            $bahanBaku->update(['stok' => $stokSesudah]);
        }

        $produksiBaglog->delete();

        return redirect()->route('produksi-baglog.index')
            ->with('success', 'Produksi baglog berhasil dihapus');
    }
}
