<?php

namespace App\Http\Controllers;

use App\Models\Kumbung;
use App\Models\Panen;
use App\Models\Karyawan;
use App\Models\PenjualanJamur;
use App\Models\Kas;
use App\Models\Penggajian;
use App\Models\PembayaranKredit;
use App\Models\KonfigurasiKeuangan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class KeuanganController extends Controller
{
    public function simulasiKredit()
    {
        // Get konfigurasi keuangan (shared data)
        $konfigurasi = KonfigurasiKeuangan::getConfig();

        // Get some real data for context
        $currentMonth = Carbon::now();
        $lastMonth = Carbon::now()->subMonth();

        // Data panen bulan ini dan bulan lalu
        $panenBulanIni = Panen::whereMonth('tanggal', $currentMonth->month)
            ->whereYear('tanggal', $currentMonth->year)
            ->sum('berat_layak_jual');

        $panenBulanLalu = Panen::whereMonth('tanggal', $lastMonth->month)
            ->whereYear('tanggal', $lastMonth->year)
            ->sum('berat_layak_jual');

        // Rata-rata harga jual per kg
        $avgHargaJual = PenjualanJamur::avg('harga_per_kg') ?? 15000;

        // Data karyawan
        $totalKaryawan = Karyawan::where('status', 'aktif')->count();

        // Total gaji dari sistem
        $totalGaji = Karyawan::where('status', 'aktif')->sum('nominal_gaji');

        // Total gaji bulan lalu
        $totalGajiBulanLalu = Penggajian::whereMonth('created_at', $lastMonth->month)
            ->whereYear('created_at', $lastMonth->year)
            ->sum('total');

        // Jumlah kumbung aktif
        $kumbungAktif = Kumbung::where('status', 'aktif')->count();

        return Inertia::render('Keuangan/SimulasiKredit', [
            'konfigurasi' => $konfigurasi,
            'totalGaji' => $totalGaji,
            'contextData' => [
                'panenBulanIni' => $panenBulanIni,
                'panenBulanLalu' => $panenBulanLalu,
                'avgHargaJual' => $avgHargaJual,
                'totalKaryawan' => $totalKaryawan,
                'totalGajiBulanLalu' => $totalGajiBulanLalu,
                'kumbungAktif' => $kumbungAktif,
            ],
        ]);
    }

    public function targetOperasional()
    {
        // Get konfigurasi keuangan
        $konfigurasi = KonfigurasiKeuangan::getConfig();

        // Get karyawan dengan bagian untuk jobdesk
        $karyawans = Karyawan::where('status', 'aktif')
            ->orderBy('bagian')
            ->orderBy('nama')
            ->get(['id', 'nama', 'bagian', 'tipe_gaji', 'nominal_gaji']);

        // Total gaji dari sistem
        $totalGaji = Karyawan::where('status', 'aktif')->sum('nominal_gaji');

        // Summary per bagian
        $summaryPerBagian = Karyawan::where('status', 'aktif')
            ->selectRaw('bagian, COUNT(*) as jumlah, SUM(nominal_gaji) as total_gaji')
            ->groupBy('bagian')
            ->get();

        // Data kumbung untuk target produksi
        $kumbungs = Kumbung::where('status', 'aktif')
            ->withCount(['baglogs as baglog_aktif' => function ($query) {
                $query->where('status', 'masuk_kumbung');
            }])
            ->get(['id', 'nomor', 'nama', 'kapasitas_baglog', 'target_panen_kg', 'harga_jual_per_kg']);

        // Rata-rata panen per kumbung
        $avgPanenPerKumbung = Panen::selectRaw('kumbung_id, AVG(berat_layak_jual) as avg_panen')
            ->groupBy('kumbung_id')
            ->pluck('avg_panen', 'kumbung_id');

        return Inertia::render('Keuangan/TargetOperasional', [
            'konfigurasi' => $konfigurasi,
            'totalGaji' => $totalGaji,
            'karyawans' => $karyawans,
            'summaryPerBagian' => $summaryPerBagian,
            'kumbungs' => $kumbungs,
            'avgPanenPerKumbung' => $avgPanenPerKumbung,
        ]);
    }

    public function updateKonfigurasi(Request $request)
    {
        $validated = $request->validate([
            // Kredit
            'kredit_investasi_limit' => 'nullable|numeric|min:0',
            'kredit_investasi_tenor' => 'nullable|integer|min:1',
            'kredit_investasi_bunga' => 'nullable|numeric|min:0|max:100',
            'kredit_modal_kerja_limit' => 'nullable|numeric|min:0',
            'kredit_modal_kerja_tenor' => 'nullable|integer|min:1',
            'kredit_modal_kerja_bunga' => 'nullable|numeric|min:0|max:100',

            // Alokasi
            'alokasi_pembangunan_kumbung' => 'nullable|numeric|min:0',
            'alokasi_pembangunan_inkubasi' => 'nullable|numeric|min:0',
            'alokasi_pembelian_bahan_baku' => 'nullable|numeric|min:0',
            'alokasi_renovasi_kumbung' => 'nullable|numeric|min:0',
            'alokasi_pembelian_mesin' => 'nullable|numeric|min:0',
            'alokasi_pembelian_lahan' => 'nullable|numeric|min:0',
            'alokasi_dana_cadangan' => 'nullable|numeric|min:0',

            // Overhead
            'overhead_sewa' => 'nullable|numeric|min:0',
            'overhead_listrik' => 'nullable|numeric|min:0',
            'overhead_air' => 'nullable|numeric|min:0',
            'overhead_telepon' => 'nullable|numeric|min:0',
            'overhead_cicilan_kendaraan' => 'nullable|numeric|min:0',
            'overhead_lainnya' => 'nullable|numeric|min:0',

            // Harga
            'harga_jamur_per_kg' => 'nullable|numeric|min:0',
            'harga_baglog_per_unit' => 'nullable|numeric|min:0',

            // Target
            'target_profit_bulanan' => 'nullable|numeric|min:0',
        ]);

        $konfigurasi = KonfigurasiKeuangan::getConfig();
        $konfigurasi->update($validated);

        return redirect()->route('keuangan.target-operasional')
            ->with('success', 'Konfigurasi berhasil disimpan');
    }

    public function rekapPembayaran()
    {
        // Get konfigurasi keuangan (shared data)
        $konfigurasi = KonfigurasiKeuangan::getConfig();

        $pembayarans = PembayaranKredit::with('user')
            ->orderBy('periode_ke', 'asc')
            ->get();

        // Calculate summary
        $totalPokok = $pembayarans->sum('jumlah_pokok');
        $totalBunga = $pembayarans->sum('jumlah_bunga');
        $totalBayar = $pembayarans->sum('total_bayar');
        $periodeTerakhir = $pembayarans->max('periode_ke') ?? 0;

        // Use shared konfigurasi for loan parameters
        $loanAmount = $konfigurasi->kredit_investasi_limit;
        $tenorMonths = $konfigurasi->kredit_investasi_tenor;
        $interestRate = $konfigurasi->kredit_investasi_bunga;

        $monthlyPrincipal = $loanAmount / $tenorMonths;
        $monthlyInterest = ($loanAmount * ($interestRate / 100)) / 12;
        $monthlyPayment = $monthlyPrincipal + $monthlyInterest;

        $sisaPokok = $loanAmount - $totalPokok;
        $sisaPeriode = $tenorMonths - $periodeTerakhir;

        return Inertia::render('Keuangan/RekapPembayaran', [
            'konfigurasi' => $konfigurasi,
            'pembayarans' => $pembayarans,
            'summary' => [
                'totalPokok' => $totalPokok,
                'totalBunga' => $totalBunga,
                'totalBayar' => $totalBayar,
                'periodeTerakhir' => $periodeTerakhir,
                'sisaPokok' => $sisaPokok,
                'sisaPeriode' => $sisaPeriode,
                'loanAmount' => $loanAmount,
                'tenorMonths' => $tenorMonths,
                'interestRate' => $interestRate,
                'monthlyPayment' => $monthlyPayment,
                'monthlyPrincipal' => $monthlyPrincipal,
                'monthlyInterest' => $monthlyInterest,
            ],
        ]);
    }

    public function storePembayaran(Request $request)
    {
        $validated = $request->validate([
            'tanggal_bayar' => 'required|date',
            'periode_ke' => 'required|integer|min:1',
            'jumlah_pokok' => 'required|numeric|min:0',
            'jumlah_bunga' => 'required|numeric|min:0',
            'metode_pembayaran' => 'nullable|string|max:50',
            'nomor_referensi' => 'nullable|string|max:100',
            'keterangan' => 'nullable|string|max:500',
        ]);

        $validated['total_bayar'] = $validated['jumlah_pokok'] + $validated['jumlah_bunga'];
        $validated['user_id'] = auth()->id();

        PembayaranKredit::create($validated);

        return redirect()->route('keuangan.rekap-pembayaran')
            ->with('success', 'Pembayaran berhasil dicatat');
    }

    public function destroyPembayaran(PembayaranKredit $pembayaranKredit)
    {
        $pembayaranKredit->delete();

        return redirect()->route('keuangan.rekap-pembayaran')
            ->with('success', 'Data pembayaran berhasil dihapus');
    }
}
