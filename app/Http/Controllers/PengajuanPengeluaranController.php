<?php

namespace App\Http\Controllers;

use App\Models\Kas;
use App\Models\PengajuanPengeluaran;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PengajuanPengeluaranController extends Controller
{
    private array $kategoris = [
        'operasional',
        'gaji',
        'pembelian',
        'kasbon',
        'investasi',
        'lainnya',
    ];

    public function index(Request $request)
    {
        $query = PengajuanPengeluaran::with(['pemohon', 'approver']);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('nomor', 'like', '%' . $request->search . '%')
                  ->orWhere('tujuan_penerima', 'like', '%' . $request->search . '%')
                  ->orWhere('keterangan', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('kategori')) {
            $query->where('kategori', $request->kategori);
        }

        $pengajuans = $query->orderBy('tanggal_pengajuan', 'desc')
            ->orderBy('id', 'desc')
            ->paginate(20)
            ->withQueryString();

        $summary = [
            'diajukan' => PengajuanPengeluaran::where('status', 'diajukan')->count(),
            'disetujui' => PengajuanPengeluaran::where('status', 'disetujui')->count(),
            'cair' => PengajuanPengeluaran::where('status', 'cair')->count(),
            'ditolak' => PengajuanPengeluaran::where('status', 'ditolak')->count(),
            'totalCairBulanIni' => PengajuanPengeluaran::where('status', 'cair')
                ->whereMonth('cair_at', now()->month)
                ->whereYear('cair_at', now()->year)
                ->sum('jumlah'),
        ];

        return Inertia::render('Pengajuan/Index', [
            'pengajuans' => $pengajuans,
            'summary' => $summary,
            'kategoris' => $this->kategoris,
            'filters' => $request->only(['search', 'status', 'kategori']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Pengajuan/Create', [
            'kategoris' => $this->kategoris,
            'pemohonName' => auth()->user()->name,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal_pengajuan' => 'required|date',
            'kategori' => 'required|string',
            'jumlah' => 'required|numeric|min:1',
            'tujuan_penerima' => 'required|string|max:255',
            'keterangan' => 'required|string',
            'ttd_pemohon' => 'required|string',
            'lampiran' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        $lampiranPath = null;
        if ($request->hasFile('lampiran')) {
            $lampiranPath = $request->file('lampiran')->store('pengajuan/lampiran', 'public');
        }

        PengajuanPengeluaran::create([
            'nomor' => PengajuanPengeluaran::generateNomor(),
            'tanggal_pengajuan' => $validated['tanggal_pengajuan'],
            'pemohon_id' => auth()->id(),
            'kategori' => $validated['kategori'],
            'jumlah' => $validated['jumlah'],
            'tujuan_penerima' => $validated['tujuan_penerima'],
            'keterangan' => $validated['keterangan'],
            'ttd_pemohon' => $validated['ttd_pemohon'],
            'lampiran_path' => $lampiranPath,
            'status' => 'diajukan',
        ]);

        return redirect()->route('pengajuan.index')
            ->with('success', 'Pengajuan berhasil dibuat. Silakan tunggu persetujuan.');
    }

    public function show(PengajuanPengeluaran $pengajuan)
    {
        $pengajuan->load(['pemohon', 'approver', 'kas']);

        return Inertia::render('Pengajuan/Show', [
            'pengajuan' => $pengajuan,
        ]);
    }

    public function approve(Request $request, PengajuanPengeluaran $pengajuan)
    {
        if ($pengajuan->status !== 'diajukan') {
            return back()->with('error', 'Pengajuan ini sudah diproses sebelumnya.');
        }

        $validated = $request->validate([
            'ttd_disetujui' => 'required|string',
        ]);

        $pengajuan->update([
            'status' => 'disetujui',
            'ttd_disetujui' => $validated['ttd_disetujui'],
            'disetujui_oleh' => auth()->id(),
            'disetujui_at' => now(),
        ]);

        return back()->with('success', 'Pengajuan berhasil disetujui.');
    }

    public function reject(Request $request, PengajuanPengeluaran $pengajuan)
    {
        if ($pengajuan->status !== 'diajukan') {
            return back()->with('error', 'Pengajuan ini sudah diproses sebelumnya.');
        }

        $validated = $request->validate([
            'catatan_tolak' => 'required|string',
        ]);

        $pengajuan->update([
            'status' => 'ditolak',
            'catatan_tolak' => $validated['catatan_tolak'],
            'disetujui_oleh' => auth()->id(),
            'disetujui_at' => now(),
        ]);

        return back()->with('success', 'Pengajuan ditolak.');
    }

    public function cairkan(PengajuanPengeluaran $pengajuan)
    {
        if ($pengajuan->status !== 'disetujui') {
            return back()->with('error', 'Hanya pengajuan berstatus disetujui yang bisa dicairkan.');
        }

        $kas = Kas::create([
            'kode_transaksi' => Kas::generateKode(),
            'tanggal' => now()->toDateString(),
            'tipe' => 'keluar',
            'kategori' => $pengajuan->kategori,
            'jumlah' => $pengajuan->jumlah,
            'keterangan' => "Pencairan {$pengajuan->nomor} - {$pengajuan->tujuan_penerima}: {$pengajuan->keterangan}",
            'referensi' => $pengajuan->nomor,
        ]);

        $pengajuan->update([
            'status' => 'cair',
            'kas_id' => $kas->id,
            'cair_at' => now(),
        ]);

        return back()->with('success', 'Pengajuan berhasil dicairkan & tercatat di Kas.');
    }

    public function exportPdf(PengajuanPengeluaran $pengajuan)
    {
        $pengajuan->load(['pemohon', 'approver']);

        $pdf = Pdf::loadView('pdf.pengajuan-pengeluaran', [
            'pengajuan' => $pengajuan,
            'namaMengetahui' => 'Retno',
            'cetakPada' => Carbon::now()->locale('id')->isoFormat('D MMM Y HH:mm'),
        ])->setPaper('a4', 'portrait');

        $filename = "Pengajuan-{$pengajuan->nomor}.pdf";
        return $pdf->stream($filename);
    }

    public function destroy(PengajuanPengeluaran $pengajuan)
    {
        if ($pengajuan->status === 'cair') {
            return back()->with('error', 'Pengajuan yang sudah cair tidak bisa dihapus.');
        }

        if ($pengajuan->lampiran_path) {
            Storage::disk('public')->delete($pengajuan->lampiran_path);
        }

        $pengajuan->delete();

        return redirect()->route('pengajuan.index')
            ->with('success', 'Pengajuan berhasil dihapus.');
    }
}
