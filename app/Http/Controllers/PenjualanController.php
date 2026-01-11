<?php

namespace App\Http\Controllers;

use App\Models\Baglog;
use App\Models\Customer;
use App\Models\Kas;
use App\Models\Panen;
use App\Models\PenjualanBaglog;
use App\Models\PenjualanJamur;
use App\Models\StokJamur;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PenjualanController extends Controller
{
    /**
     * Get available baglog for sale (status: pembibitan)
     */
    private function getStockBaglog()
    {
        return Baglog::where('status', 'pembibitan')->sum('jumlah');
    }

    /**
     * Get available baglog records for dropdown
     */
    private function getAvailableBaglogs()
    {
        return Baglog::with('kumbung')
            ->where('status', 'pembibitan')
            ->where('jumlah', '>', 0)
            ->get();
    }

    /**
     * Get mushroom stock from StokJamur tracking
     */
    private function getStockJamur()
    {
        return StokJamur::getStokTersedia();
    }

    /**
     * Create Kas entry for sales income
     */
    private function createKasIncome($tanggal, $jumlah, $keterangan, $referensi, $kategori = 'penjualan')
    {
        // Generate kode transaksi
        $today = now()->format('Ymd');
        $lastKode = Kas::where('kode_transaksi', 'like', "KM{$today}%")
            ->orderBy('id', 'desc')
            ->first()?->kode_transaksi;

        if (!$lastKode) {
            $kodeTransaksi = "KM{$today}001";
        } else {
            $number = (int) substr($lastKode, -3) + 1;
            $kodeTransaksi = "KM{$today}" . str_pad($number, 3, '0', STR_PAD_LEFT);
        }

        return Kas::create([
            'kode_transaksi' => $kodeTransaksi,
            'tanggal' => $tanggal,
            'tipe' => 'masuk',
            'kategori' => $kategori,
            'jumlah' => $jumlah,
            'keterangan' => $keterangan,
            'referensi' => $referensi,
        ]);
    }

    public function index(Request $request)
    {
        $tipe = $request->get('tipe', 'baglog');

        // Penjualan Baglog
        $queryBaglog = PenjualanBaglog::with(['customer', 'baglog.kumbung']);
        if ($request->filled('status')) {
            $queryBaglog->where('status', $request->status);
        }
        if ($request->filled('search')) {
            $queryBaglog->whereHas('customer', function ($q) use ($request) {
                $q->where('nama', 'like', '%' . $request->search . '%');
            });
        }
        $penjualanBaglogs = $queryBaglog->orderBy('tanggal', 'desc')->paginate(15, ['*'], 'baglog_page');
        $penjualanBaglogs->getCollection()->transform(function ($item) {
            $item->tanggal_formatted = $item->tanggal->locale('id')->isoFormat('D MMM Y');
            return $item;
        });

        // Penjualan Jamur
        $queryJamur = PenjualanJamur::with('customer');
        if ($request->filled('status')) {
            $queryJamur->where('status', $request->status);
        }
        if ($request->filled('search')) {
            $queryJamur->whereHas('customer', function ($q) use ($request) {
                $q->where('nama', 'like', '%' . $request->search . '%');
            });
        }
        $penjualanJamurs = $queryJamur->orderBy('tanggal', 'desc')->paginate(15, ['*'], 'jamur_page');
        $penjualanJamurs->getCollection()->transform(function ($item) {
            $item->tanggal_formatted = $item->tanggal->locale('id')->isoFormat('D MMM Y');
            return $item;
        });

        // Summary
        $summary = [
            'totalBaglog' => PenjualanBaglog::where('status', 'lunas')->sum('total_harga'),
            'totalJamur' => PenjualanJamur::where('status', 'lunas')->sum('total_harga'),
            'pendingBaglog' => PenjualanBaglog::where('status', 'pending')->sum('total_harga'),
            'pendingJamur' => PenjualanJamur::where('status', 'pending')->sum('total_harga'),
            'countBaglog' => PenjualanBaglog::count(),
            'countJamur' => PenjualanJamur::count(),
            'stockBaglog' => $this->getStockBaglog(),
            'stockJamur' => $this->getStockJamur(),
        ];

        return Inertia::render('Penjualan/Index', [
            'penjualanBaglogs' => $penjualanBaglogs,
            'penjualanJamurs' => $penjualanJamurs,
            'summary' => $summary,
            'tipe' => $tipe,
            'filters' => $request->only(['status', 'search', 'tipe']),
        ]);
    }

    // === BAGLOG ===
    public function createBaglog()
    {
        $customers = Customer::orderBy('nama')->get();
        $baglogs = $this->getAvailableBaglogs();

        return Inertia::render('Penjualan/CreateBaglog', [
            'customers' => $customers,
            'baglogs' => $baglogs,
            'stockBaglog' => $this->getStockBaglog(),
        ]);
    }

    public function storeBaglog(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'baglog_id' => 'required|exists:baglogs,id',
            'tanggal' => 'required|date',
            'jumlah_baglog' => 'required|integer|min:1',
            'harga_satuan' => 'required|numeric|min:0',
            'status' => 'required|in:pending,lunas',
            'catatan' => 'nullable|string',
        ]);

        // Get the baglog record
        $baglog = Baglog::findOrFail($validated['baglog_id']);

        // Validate stock from specific baglog
        if ($validated['jumlah_baglog'] > $baglog->jumlah) {
            return back()->withErrors(['jumlah_baglog' => 'Stock tidak cukup. Tersedia: ' . $baglog->jumlah . ' baglog dari batch ini']);
        }

        // Validate baglog status
        if ($baglog->status !== 'pembibitan') {
            return back()->withErrors(['baglog_id' => 'Baglog ini tidak tersedia untuk dijual (status: ' . $baglog->status . ')']);
        }

        $validated['total_harga'] = $validated['jumlah_baglog'] * $validated['harga_satuan'];

        $penjualan = PenjualanBaglog::create($validated);

        // Update baglog stock
        $sisaJumlah = $baglog->jumlah - $validated['jumlah_baglog'];
        if ($sisaJumlah <= 0) {
            $baglog->update(['jumlah' => 0, 'status' => 'dijual']);
        } else {
            $baglog->update(['jumlah' => $sisaJumlah]);
        }

        // Create Kas entry if status is lunas
        if ($validated['status'] === 'lunas') {
            $customerName = $penjualan->customer ? $penjualan->customer->nama : 'Umum';
            $this->createKasIncome(
                $validated['tanggal'],
                $validated['total_harga'],
                "Penjualan Baglog - {$customerName} ({$validated['jumlah_baglog']} baglog)",
                'penjualan_baglog:' . $penjualan->id,
                'penjualan_baglog'
            );
        }

        return redirect('/penjualan?tipe=baglog')->with('success', 'Penjualan baglog berhasil ditambahkan');
    }

    public function editBaglog(PenjualanBaglog $penjualanBaglog)
    {
        $customers = Customer::orderBy('nama')->get();
        $baglogs = $this->getAvailableBaglogs();

        // Add current baglog if not in list
        if ($penjualanBaglog->baglog && !$baglogs->contains('id', $penjualanBaglog->baglog_id)) {
            $baglogs->push($penjualanBaglog->baglog);
        }

        return Inertia::render('Penjualan/EditBaglog', [
            'penjualan' => [
                'id' => $penjualanBaglog->id,
                'customer_id' => $penjualanBaglog->customer_id,
                'baglog_id' => $penjualanBaglog->baglog_id,
                'tanggal' => $penjualanBaglog->tanggal->format('Y-m-d'),
                'jumlah_baglog' => $penjualanBaglog->jumlah_baglog,
                'harga_satuan' => $penjualanBaglog->harga_satuan,
                'status' => $penjualanBaglog->status,
                'catatan' => $penjualanBaglog->catatan,
            ],
            'customers' => $customers,
            'baglogs' => $baglogs,
            'stockBaglog' => $this->getStockBaglog(),
        ]);
    }

    public function updateBaglog(Request $request, PenjualanBaglog $penjualanBaglog)
    {
        $validated = $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'tanggal' => 'required|date',
            'harga_satuan' => 'required|numeric|min:0',
            'status' => 'required|in:pending,lunas',
            'catatan' => 'nullable|string',
        ]);

        $validated['total_harga'] = $penjualanBaglog->jumlah_baglog * $validated['harga_satuan'];

        $oldStatus = $penjualanBaglog->status;
        $penjualanBaglog->update($validated);

        // Create Kas entry if status changed to lunas
        if ($oldStatus === 'pending' && $validated['status'] === 'lunas') {
            $customerName = $penjualanBaglog->customer ? $penjualanBaglog->customer->nama : 'Umum';
            $this->createKasIncome(
                $validated['tanggal'],
                $validated['total_harga'],
                "Penjualan Baglog - {$customerName} ({$penjualanBaglog->jumlah_baglog} baglog)",
                'penjualan_baglog:' . $penjualanBaglog->id,
                'penjualan_baglog'
            );
        }

        return redirect('/penjualan?tipe=baglog')->with('success', 'Penjualan baglog berhasil diupdate');
    }

    public function destroyBaglog(PenjualanBaglog $penjualanBaglog)
    {
        // Return stock to baglog
        if ($penjualanBaglog->baglog) {
            $baglog = $penjualanBaglog->baglog;
            $baglog->update([
                'jumlah' => $baglog->jumlah + $penjualanBaglog->jumlah_baglog,
                'status' => 'pembibitan'
            ]);
        }

        // Delete related Kas entry if exists
        Kas::where('referensi', 'penjualan_baglog:' . $penjualanBaglog->id)->delete();

        $penjualanBaglog->delete();

        return redirect('/penjualan?tipe=baglog')->with('success', 'Penjualan baglog berhasil dihapus');
    }

    // === JAMUR ===
    public function createJamur()
    {
        $customers = Customer::orderBy('nama')->get();

        return Inertia::render('Penjualan/CreateJamur', [
            'customers' => $customers,
            'stockJamur' => $this->getStockJamur(),
        ]);
    }

    public function storeJamur(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'tanggal' => 'required|date',
            'berat_kg' => 'required|numeric|min:0.1',
            'harga_per_kg' => 'required|numeric|min:0',
            'status' => 'required|in:pending,lunas',
            'catatan' => 'nullable|string',
        ]);

        // Validate stock from StokJamur
        $stockTersedia = $this->getStockJamur();
        if ($validated['berat_kg'] > $stockTersedia) {
            return back()->withErrors(['berat_kg' => 'Stock tidak cukup. Tersedia: ' . number_format($stockTersedia, 2) . ' kg']);
        }

        $validated['total_harga'] = $validated['berat_kg'] * $validated['harga_per_kg'];

        $penjualan = PenjualanJamur::create($validated);

        // Create StokJamur movement (keluar)
        StokJamur::create([
            'penjualan_jamur_id' => $penjualan->id,
            'tipe' => 'keluar',
            'berat_kg' => $validated['berat_kg'],
            'stok_sebelum' => $stockTersedia,
            'stok_sesudah' => $stockTersedia - $validated['berat_kg'],
            'keterangan' => 'Penjualan Jamur #' . $penjualan->id,
            'tanggal' => $validated['tanggal'],
        ]);

        // Create Kas entry if status is lunas
        if ($validated['status'] === 'lunas') {
            $customerName = $penjualan->customer ? $penjualan->customer->nama : 'Umum';
            $this->createKasIncome(
                $validated['tanggal'],
                $validated['total_harga'],
                "Penjualan Jamur - {$customerName} ({$validated['berat_kg']} kg)",
                'penjualan_jamur:' . $penjualan->id,
                'penjualan_jamur'
            );
        }

        return redirect('/penjualan?tipe=jamur')->with('success', 'Penjualan jamur berhasil ditambahkan');
    }

    public function editJamur(PenjualanJamur $penjualanJamur)
    {
        $customers = Customer::orderBy('nama')->get();

        // Stock tersedia = stock saat ini + berat yang sudah di-record (untuk edit)
        $stockTersedia = $this->getStockJamur() + $penjualanJamur->berat_kg;

        return Inertia::render('Penjualan/EditJamur', [
            'penjualan' => [
                'id' => $penjualanJamur->id,
                'customer_id' => $penjualanJamur->customer_id,
                'tanggal' => $penjualanJamur->tanggal->format('Y-m-d'),
                'berat_kg' => $penjualanJamur->berat_kg,
                'harga_per_kg' => $penjualanJamur->harga_per_kg,
                'status' => $penjualanJamur->status,
                'catatan' => $penjualanJamur->catatan,
            ],
            'customers' => $customers,
            'stockJamur' => $stockTersedia,
        ]);
    }

    public function updateJamur(Request $request, PenjualanJamur $penjualanJamur)
    {
        $validated = $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'tanggal' => 'required|date',
            'berat_kg' => 'required|numeric|min:0.1',
            'harga_per_kg' => 'required|numeric|min:0',
            'status' => 'required|in:pending,lunas',
            'catatan' => 'nullable|string',
        ]);

        // Validasi stock (stock tersedia + berat lama yang dikembalikan)
        $stockTersedia = $this->getStockJamur() + $penjualanJamur->berat_kg;
        if ($validated['berat_kg'] > $stockTersedia) {
            return back()->withErrors(['berat_kg' => 'Stock tidak cukup. Tersedia: ' . number_format($stockTersedia, 2) . ' kg']);
        }

        $validated['total_harga'] = $validated['berat_kg'] * $validated['harga_per_kg'];

        $oldStatus = $penjualanJamur->status;
        $oldBerat = $penjualanJamur->berat_kg;

        $penjualanJamur->update($validated);

        // Update StokJamur if berat changed
        if ($oldBerat != $validated['berat_kg']) {
            // Delete old movement and create new one
            StokJamur::where('penjualan_jamur_id', $penjualanJamur->id)->delete();

            $currentStock = $this->getStockJamur() + $validated['berat_kg']; // Add back because we're re-deducting
            StokJamur::create([
                'penjualan_jamur_id' => $penjualanJamur->id,
                'tipe' => 'keluar',
                'berat_kg' => $validated['berat_kg'],
                'stok_sebelum' => $currentStock,
                'stok_sesudah' => $currentStock - $validated['berat_kg'],
                'keterangan' => 'Penjualan Jamur #' . $penjualanJamur->id . ' (updated)',
                'tanggal' => $validated['tanggal'],
            ]);
        }

        // Create Kas entry if status changed to lunas
        if ($oldStatus === 'pending' && $validated['status'] === 'lunas') {
            $customerName = $penjualanJamur->customer ? $penjualanJamur->customer->nama : 'Umum';
            $this->createKasIncome(
                $validated['tanggal'],
                $validated['total_harga'],
                "Penjualan Jamur - {$customerName} ({$validated['berat_kg']} kg)",
                'penjualan_jamur:' . $penjualanJamur->id,
                'penjualan_jamur'
            );
        }

        return redirect('/penjualan?tipe=jamur')->with('success', 'Penjualan jamur berhasil diupdate');
    }

    public function destroyJamur(PenjualanJamur $penjualanJamur)
    {
        // Return stock via StokJamur
        $currentStock = $this->getStockJamur();
        StokJamur::create([
            'penjualan_jamur_id' => $penjualanJamur->id,
            'tipe' => 'masuk',
            'berat_kg' => $penjualanJamur->berat_kg,
            'stok_sebelum' => $currentStock,
            'stok_sesudah' => $currentStock + $penjualanJamur->berat_kg,
            'keterangan' => 'Pembatalan Penjualan Jamur #' . $penjualanJamur->id,
            'tanggal' => now(),
        ]);

        // Delete related Kas entry if exists
        Kas::where('referensi', 'penjualan_jamur:' . $penjualanJamur->id)->delete();

        $penjualanJamur->delete();

        return redirect('/penjualan?tipe=jamur')->with('success', 'Penjualan jamur berhasil dihapus');
    }

    // Update status
    public function updateStatusBaglog(Request $request, PenjualanBaglog $penjualanBaglog)
    {
        $request->validate([
            'status' => 'required|in:pending,lunas',
        ]);

        $oldStatus = $penjualanBaglog->status;
        $newStatus = $request->status;

        // Cegah perubahan dari lunas ke pending
        if ($oldStatus === 'lunas' && $newStatus === 'pending') {
            return back()->withErrors(['status' => 'Status yang sudah lunas tidak dapat diubah kembali ke pending']);
        }

        $penjualanBaglog->update(['status' => $newStatus]);

        // Create Kas entry if status changed to lunas
        if ($oldStatus === 'pending' && $newStatus === 'lunas') {
            $customerName = $penjualanBaglog->customer ? $penjualanBaglog->customer->nama : 'Umum';
            $this->createKasIncome(
                $penjualanBaglog->tanggal,
                $penjualanBaglog->total_harga,
                "Penjualan Baglog - {$customerName} ({$penjualanBaglog->jumlah_baglog} baglog)",
                'penjualan_baglog:' . $penjualanBaglog->id,
                'penjualan_baglog'
            );
        }

        return redirect()->back()->with('success', 'Status berhasil diupdate menjadi lunas');
    }

    public function updateStatusJamur(Request $request, PenjualanJamur $penjualanJamur)
    {
        $request->validate([
            'status' => 'required|in:pending,lunas',
        ]);

        $oldStatus = $penjualanJamur->status;
        $newStatus = $request->status;

        // Cegah perubahan dari lunas ke pending
        if ($oldStatus === 'lunas' && $newStatus === 'pending') {
            return back()->withErrors(['status' => 'Status yang sudah lunas tidak dapat diubah kembali ke pending']);
        }

        $penjualanJamur->update(['status' => $newStatus]);

        // Create Kas entry if status changed to lunas
        if ($oldStatus === 'pending' && $newStatus === 'lunas') {
            $customerName = $penjualanJamur->customer ? $penjualanJamur->customer->nama : 'Umum';
            $this->createKasIncome(
                $penjualanJamur->tanggal,
                $penjualanJamur->total_harga,
                "Penjualan Jamur - {$customerName} ({$penjualanJamur->berat_kg} kg)",
                'penjualan_jamur:' . $penjualanJamur->id,
                'penjualan_jamur'
            );
        }

        return redirect()->back()->with('success', 'Status berhasil diupdate menjadi lunas');
    }
}
