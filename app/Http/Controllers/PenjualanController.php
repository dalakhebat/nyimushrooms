<?php

namespace App\Http\Controllers;

use App\Models\Baglog;
use App\Models\Customer;
use App\Models\Panen;
use App\Models\PenjualanBaglog;
use App\Models\PenjualanJamur;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PenjualanController extends Controller
{
    /**
     * Hitung stock baglog yang tersedia untuk dijual (status: pembibitan)
     */
    private function getStockBaglog()
    {
        return Baglog::where('status', 'pembibitan')->sum('jumlah');
    }

    /**
     * Hitung stock jamur layak jual yang tersedia
     * = Total panen layak jual - Total sudah terjual
     */
    private function getStockJamur()
    {
        $totalLayakJual = Panen::sum('berat_layak_jual');
        $totalTerjual = PenjualanJamur::sum('berat_kg');
        return max(0, $totalLayakJual - $totalTerjual);
    }
    public function index(Request $request)
    {
        $tipe = $request->get('tipe', 'baglog');

        // Penjualan Baglog
        $queryBaglog = PenjualanBaglog::with('customer');
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
            'totalBaglog' => PenjualanBaglog::sum('total_harga'),
            'totalJamur' => PenjualanJamur::sum('total_harga'),
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

        return Inertia::render('Penjualan/CreateBaglog', [
            'customers' => $customers,
            'stockBaglog' => $this->getStockBaglog(),
        ]);
    }

    public function storeBaglog(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'tanggal' => 'required|date',
            'jumlah_baglog' => 'required|integer|min:1',
            'harga_satuan' => 'required|numeric|min:0',
            'status' => 'required|in:pending,lunas',
            'catatan' => 'nullable|string',
        ]);

        // Validasi stock
        $stockTersedia = $this->getStockBaglog();
        if ($validated['jumlah_baglog'] > $stockTersedia) {
            return back()->withErrors(['jumlah_baglog' => 'Stock tidak cukup. Tersedia: ' . $stockTersedia . ' baglog']);
        }

        $validated['total_harga'] = $validated['jumlah_baglog'] * $validated['harga_satuan'];

        PenjualanBaglog::create($validated);

        return redirect('/penjualan?tipe=baglog')->with('success', 'Penjualan baglog berhasil ditambahkan');
    }

    public function editBaglog(PenjualanBaglog $penjualanBaglog)
    {
        $customers = Customer::orderBy('nama')->get();

        // Stock tersedia = stock saat ini + jumlah yang sudah di-record (untuk edit)
        $stockTersedia = $this->getStockBaglog() + $penjualanBaglog->jumlah_baglog;

        return Inertia::render('Penjualan/EditBaglog', [
            'penjualan' => [
                'id' => $penjualanBaglog->id,
                'customer_id' => $penjualanBaglog->customer_id,
                'tanggal' => $penjualanBaglog->tanggal->format('Y-m-d'),
                'jumlah_baglog' => $penjualanBaglog->jumlah_baglog,
                'harga_satuan' => $penjualanBaglog->harga_satuan,
                'status' => $penjualanBaglog->status,
                'catatan' => $penjualanBaglog->catatan,
            ],
            'customers' => $customers,
            'stockBaglog' => $stockTersedia,
        ]);
    }

    public function updateBaglog(Request $request, PenjualanBaglog $penjualanBaglog)
    {
        $validated = $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'tanggal' => 'required|date',
            'jumlah_baglog' => 'required|integer|min:1',
            'harga_satuan' => 'required|numeric|min:0',
            'status' => 'required|in:pending,lunas',
            'catatan' => 'nullable|string',
        ]);

        // Validasi stock (stock tersedia + jumlah lama yang dikembalikan)
        $stockTersedia = $this->getStockBaglog() + $penjualanBaglog->jumlah_baglog;
        if ($validated['jumlah_baglog'] > $stockTersedia) {
            return back()->withErrors(['jumlah_baglog' => 'Stock tidak cukup. Tersedia: ' . $stockTersedia . ' baglog']);
        }

        $validated['total_harga'] = $validated['jumlah_baglog'] * $validated['harga_satuan'];

        $penjualanBaglog->update($validated);

        return redirect('/penjualan?tipe=baglog')->with('success', 'Penjualan baglog berhasil diupdate');
    }

    public function destroyBaglog(PenjualanBaglog $penjualanBaglog)
    {
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

        // Validasi stock
        $stockTersedia = $this->getStockJamur();
        if ($validated['berat_kg'] > $stockTersedia) {
            return back()->withErrors(['berat_kg' => 'Stock tidak cukup. Tersedia: ' . number_format($stockTersedia, 2) . ' kg']);
        }

        $validated['total_harga'] = $validated['berat_kg'] * $validated['harga_per_kg'];

        PenjualanJamur::create($validated);

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

        $penjualanJamur->update($validated);

        return redirect('/penjualan?tipe=jamur')->with('success', 'Penjualan jamur berhasil diupdate');
    }

    public function destroyJamur(PenjualanJamur $penjualanJamur)
    {
        $penjualanJamur->delete();

        return redirect('/penjualan?tipe=jamur')->with('success', 'Penjualan jamur berhasil dihapus');
    }

    // Update status
    public function updateStatusBaglog(Request $request, PenjualanBaglog $penjualanBaglog)
    {
        $penjualanBaglog->update(['status' => $request->status]);
        return redirect()->back();
    }

    public function updateStatusJamur(Request $request, PenjualanJamur $penjualanJamur)
    {
        $penjualanJamur->update(['status' => $request->status]);
        return redirect()->back();
    }
}
