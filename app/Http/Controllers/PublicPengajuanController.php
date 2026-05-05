<?php

namespace App\Http\Controllers;

use App\Models\PengajuanPengeluaran;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicPengajuanController extends Controller
{
    private array $kategoris = [
        'operasional',
        'gaji',
        'pembelian',
        'kasbon',
        'investasi',
        'lainnya',
    ];

    public function showForm()
    {
        return Inertia::render('Public/Pengajuan/Form', [
            'kategoris' => $this->kategoris,
        ]);
    }

    public function submit(Request $request)
    {
        $validated = $request->validate([
            'pemohon_nama' => 'required|string|max:255',
            'tanggal_pengajuan' => 'required|date',
            'kategori' => 'required|string|in:' . implode(',', $this->kategoris),
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

        $pengajuan = PengajuanPengeluaran::create([
            'nomor' => PengajuanPengeluaran::generateNomor(),
            'tanggal_pengajuan' => $validated['tanggal_pengajuan'],
            'pemohon_id' => null,
            'pemohon_nama' => $validated['pemohon_nama'],
            'kategori' => $validated['kategori'],
            'jumlah' => $validated['jumlah'],
            'tujuan_penerima' => $validated['tujuan_penerima'],
            'keterangan' => $validated['keterangan'],
            'ttd_pemohon' => $validated['ttd_pemohon'],
            'lampiran_path' => $lampiranPath,
            'status' => 'diajukan',
        ]);

        return redirect()->route('public.pengajuan.sukses', ['nomor' => $pengajuan->nomor]);
    }

    public function sukses(string $nomor)
    {
        $pengajuan = PengajuanPengeluaran::where('nomor', $nomor)->firstOrFail();

        return Inertia::render('Public/Pengajuan/Sukses', [
            'pengajuan' => $pengajuan,
        ]);
    }

    public function pdf(string $nomor)
    {
        $pengajuan = PengajuanPengeluaran::with(['pemohon', 'approver'])
            ->where('nomor', $nomor)
            ->firstOrFail();

        $pdf = Pdf::loadView('pdf.pengajuan-pengeluaran', [
            'pengajuan' => $pengajuan,
            'namaMengetahui' => config('defila.mengetahui.nama'),
            'jabatanMengetahui' => config('defila.mengetahui.jabatan'),
            'ttdMengetahui' => $this->signatureBase64(config('defila.mengetahui.ttd_path')),
            'namaDisetujui' => config('defila.disetujui.nama'),
            'jabatanDisetujui' => config('defila.disetujui.jabatan'),
            'ttdDisetujui' => $this->signatureBase64(config('defila.disetujui.ttd_path')),
            'cetakPada' => Carbon::now()->locale('id')->isoFormat('D MMM Y HH:mm'),
        ])->setPaper('a4', 'portrait');

        return $pdf->stream("Pengajuan-{$pengajuan->nomor}.pdf");
    }

    private function signatureBase64(?string $relativePath): ?string
    {
        if (!$relativePath) return null;
        $absolute = public_path($relativePath);
        if (!file_exists($absolute)) return null;
        $mime = mime_content_type($absolute) ?: 'image/png';
        return 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($absolute));
    }
}
