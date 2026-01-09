<?php

namespace App\Http\Controllers;

use App\Models\Notifikasi;
use App\Models\BahanBaku;
use App\Models\Baglog;
use App\Models\Penggajian;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class NotifikasiController extends Controller
{
    public function index(Request $request)
    {
        $query = Notifikasi::query();

        if ($request->filled('kategori')) {
            $query->where('kategori', $request->kategori);
        }

        if ($request->filled('is_read')) {
            $query->where('is_read', $request->is_read === 'true');
        }

        $notifikasis = $query->orderBy('created_at', 'desc')->paginate(20);

        $summary = [
            'total' => Notifikasi::count(),
            'unread' => Notifikasi::where('is_read', false)->count(),
            'stok' => Notifikasi::where('kategori', 'stok')->where('is_read', false)->count(),
            'panen' => Notifikasi::where('kategori', 'panen')->where('is_read', false)->count(),
            'gaji' => Notifikasi::where('kategori', 'gaji')->where('is_read', false)->count(),
        ];

        $kategoris = ['stok', 'panen', 'gaji', 'produksi', 'umum'];

        return Inertia::render('Notifikasi/Index', [
            'notifikasis' => $notifikasis,
            'summary' => $summary,
            'kategoris' => $kategoris,
            'filters' => $request->only(['kategori', 'is_read']),
        ]);
    }

    public function markAsRead(Notifikasi $notifikasi)
    {
        $notifikasi->markAsRead();

        return back();
    }

    public function markAllAsRead()
    {
        Notifikasi::where('is_read', false)->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return back()->with('success', 'Semua notifikasi telah ditandai sebagai dibaca');
    }

    public function destroy(Notifikasi $notifikasi)
    {
        $notifikasi->delete();

        return back()->with('success', 'Notifikasi berhasil dihapus');
    }

    public function destroyAll()
    {
        Notifikasi::truncate();

        return back()->with('success', 'Semua notifikasi berhasil dihapus');
    }

    public function getUnreadCount()
    {
        return response()->json([
            'count' => Notifikasi::getUnreadCount(),
        ]);
    }

    public function generateAlerts()
    {
        $alerts = [];

        // 1. Cek stok menipis
        $lowStockItems = BahanBaku::whereColumn('stok', '<=', 'stok_minimum')->get();
        foreach ($lowStockItems as $item) {
            // Cek apakah sudah ada notifikasi yang sama dalam 24 jam terakhir
            $existing = Notifikasi::where('kategori', 'stok')
                ->where('judul', 'Stok Menipis')
                ->where('pesan', 'like', "%{$item->nama}%")
                ->where('created_at', '>=', now()->subDay())
                ->first();

            if (!$existing) {
                Notifikasi::createStokAlert($item);
                $alerts[] = "Stok {$item->nama} menipis";
            }
        }

        // 2. Cek baglog yang mendekati panen (5 bulan dari tanggal tanam)
        $nearHarvest = Baglog::whereNotNull('tanggal_tanam')
            ->where('status', 'masuk_kumbung')
            ->whereRaw('DATEDIFF(NOW(), tanggal_tanam) >= 140') // 140 hari = ~4.5 bulan
            ->whereRaw('DATEDIFF(NOW(), tanggal_tanam) <= 160') // 160 hari = ~5.3 bulan
            ->get();

        foreach ($nearHarvest as $baglog) {
            $existing = Notifikasi::where('kategori', 'panen')
                ->where('pesan', 'like', "%{$baglog->kode_batch}%")
                ->where('created_at', '>=', now()->subWeek())
                ->first();

            if (!$existing) {
                Notifikasi::createPanenReminder($baglog);
                $alerts[] = "Baglog {$baglog->kode_batch} mendekati panen";
            }
        }

        // 3. Cek reminder gaji (tanggal 25-30)
        $today = Carbon::now();
        if ($today->day >= 25 && $today->day <= 30) {
            $existing = Notifikasi::where('kategori', 'gaji')
                ->where('judul', 'Reminder Penggajian')
                ->whereMonth('created_at', $today->month)
                ->whereYear('created_at', $today->year)
                ->first();

            if (!$existing) {
                Notifikasi::createGajiReminder();
                $alerts[] = "Reminder penggajian bulan ini";
            }
        }

        return response()->json([
            'success' => true,
            'alerts' => $alerts,
            'count' => count($alerts),
        ]);
    }
}
