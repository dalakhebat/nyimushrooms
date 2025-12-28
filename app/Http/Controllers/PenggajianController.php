<?php

namespace App\Http\Controllers;

use App\Models\Absensi;
use App\Models\Karyawan;
use App\Models\Kasbon;
use App\Models\PembayaranKasbon;
use App\Models\Penggajian;
use App\Models\PengaturanGaji;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class PenggajianController extends Controller
{
    public function index(Request $request)
    {
        $query = Penggajian::with('karyawan');

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by bulan (periode)
        if ($request->filled('bulan')) {
            $bulan = Carbon::parse($request->bulan . '-01');
            $query->where(function ($q) use ($bulan) {
                $q->whereMonth('periode_mulai', $bulan->month)
                    ->whereYear('periode_mulai', $bulan->year);
            });
        }

        // Search by karyawan nama
        if ($request->filled('search')) {
            $query->whereHas('karyawan', function ($q) use ($request) {
                $q->where('nama', 'like', '%' . $request->search . '%');
            });
        }

        $penggajians = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        // Format untuk display
        $penggajians->getCollection()->transform(function ($penggajian) {
            $penggajian->periode_formatted = $penggajian->periode_mulai->format('d M') . ' - ' . $penggajian->periode_selesai->format('d M Y');
            $penggajian->tanggal_bayar_formatted = $penggajian->tanggal_bayar?->format('d M Y');
            return $penggajian;
        });

        // Summary
        $summary = [
            'totalPending' => Penggajian::where('status', 'pending')->count(),
            'totalDibayar' => Penggajian::where('status', 'dibayar')->count(),
            'totalNominalPending' => Penggajian::where('status', 'pending')->sum('total'),
        ];

        return Inertia::render('Penggajian/Index', [
            'penggajians' => $penggajians,
            'filters' => $request->only(['status', 'bulan', 'search']),
            'summary' => $summary,
        ]);
    }

    public function create(Request $request)
    {
        $tipe = $request->get('tipe', 'bulanan'); // bulanan atau mingguan
        $bulan = $request->get('bulan', now()->format('Y-m'));

        // Parse bulan
        $bulanDate = Carbon::parse($bulan . '-01');

        // Get weeks for this month (for selector)
        $weeks = $this->getWeeksInMonth($bulanDate);

        if ($tipe === 'mingguan') {
            $minggu = $request->get('minggu', 1);
            // Calculate week dates
            $periodeData = $this->getWeekPeriode($bulanDate, $minggu);
        } else {
            $periodeData = [
                'mulai' => $bulanDate->copy()->startOfMonth(),
                'selesai' => $bulanDate->copy()->endOfMonth(),
            ];
        }

        // Get karyawan based on tipe gaji
        if ($tipe === 'mingguan') {
            $karyawans = Karyawan::where('status', 'aktif')
                ->whereIn('tipe_gaji', ['mingguan', 'borongan'])
                ->orderBy('bagian', 'asc')
                ->orderBy('nama', 'asc')
                ->get();
        } else {
            $karyawans = Karyawan::where('status', 'aktif')
                ->orderBy('bagian', 'asc')
                ->orderBy('nama', 'asc')
                ->get();
        }

        // Calculate absensi dan gaji untuk setiap karyawan
        $karyawansWithGaji = $karyawans->map(function ($karyawan) use ($periodeData) {
            return $this->calculateGaji($karyawan, $periodeData['mulai'], $periodeData['selesai']);
        });

        // Get existing penggajian untuk periode ini
        $existingIds = Penggajian::where('periode_mulai', $periodeData['mulai']->format('Y-m-d'))
            ->where('periode_selesai', $periodeData['selesai']->format('Y-m-d'))
            ->pluck('karyawan_id')
            ->toArray();

        return Inertia::render('Penggajian/Create', [
            'karyawans' => $karyawansWithGaji,
            'existingIds' => $existingIds,
            'tipe' => $tipe,
            'bulan' => $bulan,
            'minggu' => $minggu ?? 1,
            'weeks' => $weeks,
            'periode' => [
                'mulai' => $periodeData['mulai']->format('Y-m-d'),
                'selesai' => $periodeData['selesai']->format('Y-m-d'),
                'label' => $periodeData['mulai']->format('d M') . ' - ' . $periodeData['selesai']->format('d M Y'),
            ],
        ]);
    }

    /**
     * Get week periode (Sunday to Saturday) - synced with AbsensiMingguan
     */
    private function getWeekPeriode(Carbon $bulanDate, int $minggu): array
    {
        $weeks = $this->getWeeksInMonth($bulanDate);
        $selectedWeek = $weeks[$minggu - 1] ?? $weeks[0];

        return [
            'mulai' => Carbon::parse($selectedWeek['start']),
            'selesai' => Carbon::parse($selectedWeek['end']),
        ];
    }

    /**
     * Get all weeks in a month (Sunday to Saturday) - same logic as AbsensiController
     */
    private function getWeeksInMonth(Carbon $bulanDate): array
    {
        $weeks = [];
        $firstDay = $bulanDate->copy()->startOfMonth();
        $lastDay = $bulanDate->copy()->endOfMonth();

        // Find first Sunday (could be in previous month)
        $startOfWeek = $firstDay->copy();
        if ($startOfWeek->dayOfWeek !== Carbon::SUNDAY) {
            $startOfWeek->previous(Carbon::SUNDAY);
        }

        $weekNum = 1;
        while ($startOfWeek <= $lastDay) {
            $endOfWeek = $startOfWeek->copy()->addDays(6); // Saturday

            $weeks[] = [
                'week' => $weekNum,
                'start' => $startOfWeek->format('Y-m-d'),
                'end' => $endOfWeek->format('Y-m-d'),
                'label' => 'Minggu ' . $weekNum . ' (' . $startOfWeek->format('d') . '-' . $endOfWeek->format('d M') . ')',
            ];

            $startOfWeek->addDays(7);
            $weekNum++;
        }

        return $weeks;
    }

    private function calculateGaji(Karyawan $karyawan, Carbon $mulai, Carbon $selesai): array
    {
        // Get pengaturan potongan
        $pengaturan = PengaturanGaji::getByTipeGaji($karyawan->tipe_gaji);

        // Get absensi dalam periode
        $absensis = Absensi::where('karyawan_id', $karyawan->id)
            ->whereDate('tanggal', '>=', $mulai->format('Y-m-d'))
            ->whereDate('tanggal', '<=', $selesai->format('Y-m-d'))
            ->get();

        $jumlahHadir = $absensis->where('status', 'hadir')->count();
        $jumlahIzin = $absensis->where('status', 'izin')->count();
        $jumlahSakit = $absensis->where('status', 'sakit')->count();
        $jumlahAlpha = $absensis->where('status', 'alpha')->count();

        // Get sisa kasbon
        $sisaKasbon = Kasbon::getTotalSisaByKaryawan($karyawan->id);

        // Calculate gaji pokok dan potongan berdasarkan tipe dan pengaturan
        $gajiPokok = 0;
        $potongan = 0;

        switch ($karyawan->tipe_gaji) {
            case 'bulanan':
                $gajiPokok = $karyawan->nominal_gaji;
                $potonganPerHari = $karyawan->nominal_gaji / 30;

                // Hitung potongan berdasarkan pengaturan
                $potonganIzin = $potonganPerHari * ($pengaturan['izin']['persentase_potongan'] ?? 0) / 100 * $jumlahIzin;
                $potonganSakit = $potonganPerHari * ($pengaturan['sakit']['persentase_potongan'] ?? 0) / 100 * $jumlahSakit;
                $potonganAlpha = $potonganPerHari * ($pengaturan['alpha']['persentase_potongan'] ?? 100) / 100 * $jumlahAlpha;

                $potongan = $potonganIzin + $potonganSakit + $potonganAlpha;
                break;

            case 'mingguan':
                // Untuk mingguan, nominal_gaji adalah upah per hari
                // Gaji pokok = upah harian * jumlah hari hadir
                $gajiPokok = $karyawan->nominal_gaji * $jumlahHadir;

                // Potongan berdasarkan pengaturan untuk izin/sakit (alpha tidak masuk hitungan karena tidak hadir = tidak dibayar)
                $potonganIzin = $karyawan->nominal_gaji * ($pengaturan['izin']['persentase_potongan'] ?? 0) / 100 * $jumlahIzin;
                $potonganSakit = $karyawan->nominal_gaji * ($pengaturan['sakit']['persentase_potongan'] ?? 0) / 100 * $jumlahSakit;
                // Alpha tidak perlu potongan karena memang tidak dihitung di gaji pokok

                $potongan = $potonganIzin + $potonganSakit;
                break;

            case 'borongan':
                // Gaji per hari hadir
                $gajiPokok = $karyawan->nominal_gaji * $jumlahHadir;
                // Borongan umumnya tidak ada potongan, tapi tetap gunakan pengaturan jika ada
                $potongan = 0;
                break;
        }

        $total = $gajiPokok - $potongan;

        return [
            'id' => $karyawan->id,
            'nama' => $karyawan->nama,
            'tipe_gaji' => $karyawan->tipe_gaji,
            'nominal_gaji' => $karyawan->nominal_gaji,
            'jumlah_hadir' => $jumlahHadir,
            'jumlah_izin' => $jumlahIzin,
            'jumlah_sakit' => $jumlahSakit,
            'jumlah_alpha' => $jumlahAlpha,
            'gaji_pokok' => round($gajiPokok, 0),
            'potongan' => round($potongan, 0),
            'sisa_kasbon' => round($sisaKasbon, 0),
            'potongan_kasbon' => 0, // Default, bisa diubah oleh admin
            'bonus' => 0,
            'total' => round($total, 0),
        ];
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'periode_mulai' => 'required|date',
            'periode_selesai' => 'required|date',
            'penggajian' => 'required|array',
            'penggajian.*.karyawan_id' => 'required|exists:karyawans,id',
            'penggajian.*.jumlah_hadir' => 'required|integer|min:0',
            'penggajian.*.jumlah_izin' => 'required|integer|min:0',
            'penggajian.*.jumlah_sakit' => 'required|integer|min:0',
            'penggajian.*.jumlah_alpha' => 'required|integer|min:0',
            'penggajian.*.gaji_pokok' => 'required|numeric|min:0',
            'penggajian.*.bonus' => 'required|numeric|min:0',
            'penggajian.*.potongan' => 'required|numeric|min:0',
            'penggajian.*.potongan_kasbon' => 'required|numeric|min:0',
            'penggajian.*.total' => 'required|numeric|min:0',
            'penggajian.*.catatan' => 'nullable|string',
        ]);

        foreach ($validated['penggajian'] as $item) {
            Penggajian::create([
                'karyawan_id' => $item['karyawan_id'],
                'periode_mulai' => $validated['periode_mulai'],
                'periode_selesai' => $validated['periode_selesai'],
                'jumlah_hadir' => $item['jumlah_hadir'],
                'jumlah_izin' => $item['jumlah_izin'],
                'jumlah_sakit' => $item['jumlah_sakit'],
                'jumlah_alpha' => $item['jumlah_alpha'],
                'gaji_pokok' => $item['gaji_pokok'],
                'bonus' => $item['bonus'],
                'potongan' => $item['potongan'],
                'potongan_kasbon' => $item['potongan_kasbon'],
                'total' => $item['total'],
                'catatan' => $item['catatan'] ?? null,
                'status' => 'pending',
            ]);
        }

        return redirect('/penggajian')->with('success', 'Penggajian berhasil diproses');
    }

    public function show(Penggajian $penggajian)
    {
        $penggajian->load('karyawan');

        // Get attendance details for the periode
        $absensis = Absensi::where('karyawan_id', $penggajian->karyawan_id)
            ->whereDate('tanggal', '>=', $penggajian->periode_mulai)
            ->whereDate('tanggal', '<=', $penggajian->periode_selesai)
            ->orderBy('tanggal', 'asc')
            ->get();

        // Group by status
        $detailKehadiran = [
            'hadir' => $absensis->where('status', 'hadir')->map(fn($a) => [
                'id' => $a->id,
                'tanggal' => $a->tanggal->format('d M'),
                'tanggal_full' => $a->tanggal->format('Y-m-d'),
            ])->values(),
            'izin' => $absensis->where('status', 'izin')->map(fn($a) => [
                'id' => $a->id,
                'tanggal' => $a->tanggal->format('d M'),
                'tanggal_full' => $a->tanggal->format('Y-m-d'),
                'catatan' => $a->catatan,
            ])->values(),
            'sakit' => $absensis->where('status', 'sakit')->map(fn($a) => [
                'id' => $a->id,
                'tanggal' => $a->tanggal->format('d M'),
                'tanggal_full' => $a->tanggal->format('Y-m-d'),
                'catatan' => $a->catatan,
            ])->values(),
            'alpha' => $absensis->where('status', 'alpha')->map(fn($a) => [
                'id' => $a->id,
                'tanggal' => $a->tanggal->format('d M'),
                'tanggal_full' => $a->tanggal->format('Y-m-d'),
            ])->values(),
        ];

        return Inertia::render('Penggajian/Show', [
            'penggajian' => [
                'id' => $penggajian->id,
                'karyawan' => [
                    'id' => $penggajian->karyawan->id,
                    'nama' => $penggajian->karyawan->nama,
                    'tipe_gaji' => $penggajian->karyawan->tipe_gaji,
                    'no_hp' => $penggajian->karyawan->no_hp,
                    'alamat' => $penggajian->karyawan->alamat,
                ],
                'periode_mulai' => $penggajian->periode_mulai->format('Y-m-d'),
                'periode_selesai' => $penggajian->periode_selesai->format('Y-m-d'),
                'periode_formatted' => $penggajian->periode_mulai->format('d M') . ' - ' . $penggajian->periode_selesai->format('d M Y'),
                'jumlah_hadir' => $penggajian->jumlah_hadir,
                'jumlah_izin' => $penggajian->jumlah_izin,
                'jumlah_sakit' => $penggajian->jumlah_sakit,
                'jumlah_alpha' => $penggajian->jumlah_alpha,
                'gaji_pokok' => $penggajian->gaji_pokok,
                'bonus' => $penggajian->bonus,
                'potongan' => $penggajian->potongan,
                'potongan_kasbon' => $penggajian->potongan_kasbon,
                'total' => $penggajian->total,
                'status' => $penggajian->status,
                'tanggal_bayar' => $penggajian->tanggal_bayar?->format('Y-m-d'),
                'tanggal_bayar_formatted' => $penggajian->tanggal_bayar?->format('d M Y'),
                'catatan' => $penggajian->catatan,
                'created_at' => $penggajian->created_at->format('d M Y H:i'),
                'updated_at' => $penggajian->updated_at->format('d M Y H:i'),
                'detail_kehadiran' => $detailKehadiran,
            ],
        ]);
    }

    public function bayar(Request $request, Penggajian $penggajian)
    {
        $validated = $request->validate([
            'tanggal_bayar' => 'required|date',
        ]);

        $penggajian->update([
            'status' => 'dibayar',
            'tanggal_bayar' => $validated['tanggal_bayar'],
        ]);

        // Process kasbon payment if any
        if ($penggajian->potongan_kasbon > 0) {
            $this->processKasbonPayment($penggajian);
        }

        return redirect()->back()->with('success', 'Gaji berhasil dibayarkan');
    }

    /**
     * Process kasbon payment from salary deduction
     */
    private function processKasbonPayment(Penggajian $penggajian): void
    {
        $remaining = $penggajian->potongan_kasbon;
        $kasbons = Kasbon::getBelumLunasByKaryawan($penggajian->karyawan_id);

        foreach ($kasbons as $kasbon) {
            if ($remaining <= 0) break;

            $dibayar = $kasbon->bayar($remaining);

            if ($dibayar > 0) {
                PembayaranKasbon::create([
                    'kasbon_id' => $kasbon->id,
                    'penggajian_id' => $penggajian->id,
                    'tanggal' => $penggajian->tanggal_bayar,
                    'jumlah' => $dibayar,
                    'metode' => 'potong_gaji',
                    'keterangan' => 'Potong dari gaji periode ' . $penggajian->periode_mulai->format('d M') . ' - ' . $penggajian->periode_selesai->format('d M Y'),
                ]);

                $remaining -= $dibayar;
            }
        }
    }

    public function bayarBulk(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:penggajians,id',
            'tanggal_bayar' => 'required|date',
        ]);

        $penggajians = Penggajian::whereIn('id', $validated['ids'])
            ->where('status', 'pending')
            ->get();

        foreach ($penggajians as $penggajian) {
            $penggajian->update([
                'status' => 'dibayar',
                'tanggal_bayar' => $validated['tanggal_bayar'],
            ]);

            // Process kasbon payment if any
            if ($penggajian->potongan_kasbon > 0) {
                $this->processKasbonPayment($penggajian);
            }
        }

        return redirect()->back()->with('success', 'Gaji berhasil dibayarkan');
    }

    public function edit(Penggajian $penggajian)
    {
        // Only allow editing pending penggajian
        if ($penggajian->status !== 'pending') {
            return redirect('/penggajian')->with('error', 'Hanya penggajian pending yang bisa diedit');
        }

        $penggajian->load('karyawan');

        // Get updated sisa kasbon (might have changed since penggajian was created)
        $sisaKasbon = Kasbon::getTotalSisaByKaryawan($penggajian->karyawan_id);

        return Inertia::render('Penggajian/Edit', [
            'penggajian' => [
                'id' => $penggajian->id,
                'karyawan' => [
                    'id' => $penggajian->karyawan->id,
                    'nama' => $penggajian->karyawan->nama,
                    'tipe_gaji' => $penggajian->karyawan->tipe_gaji,
                    'nominal_gaji' => $penggajian->karyawan->nominal_gaji,
                ],
                'periode_mulai' => $penggajian->periode_mulai->format('Y-m-d'),
                'periode_selesai' => $penggajian->periode_selesai->format('Y-m-d'),
                'periode_formatted' => $penggajian->periode_mulai->format('d M') . ' - ' . $penggajian->periode_selesai->format('d M Y'),
                'jumlah_hadir' => $penggajian->jumlah_hadir,
                'jumlah_izin' => $penggajian->jumlah_izin,
                'jumlah_sakit' => $penggajian->jumlah_sakit,
                'jumlah_alpha' => $penggajian->jumlah_alpha,
                'gaji_pokok' => $penggajian->gaji_pokok,
                'bonus' => $penggajian->bonus,
                'potongan' => $penggajian->potongan,
                'potongan_kasbon' => $penggajian->potongan_kasbon,
                'sisa_kasbon' => round($sisaKasbon, 0), // Updated sisa kasbon
                'total' => $penggajian->total,
                'catatan' => $penggajian->catatan,
            ],
        ]);
    }

    public function update(Request $request, Penggajian $penggajian)
    {
        // Only allow updating pending penggajian
        if ($penggajian->status !== 'pending') {
            return redirect('/penggajian')->with('error', 'Hanya penggajian pending yang bisa diedit');
        }

        $validated = $request->validate([
            'bonus' => 'required|numeric|min:0',
            'potongan_kasbon' => 'required|numeric|min:0',
            'catatan' => 'nullable|string',
        ]);

        // Recalculate total
        $total = $penggajian->gaji_pokok + $validated['bonus'] - $penggajian->potongan - $validated['potongan_kasbon'];

        $penggajian->update([
            'bonus' => $validated['bonus'],
            'potongan_kasbon' => $validated['potongan_kasbon'],
            'total' => max(0, $total),
            'catatan' => $validated['catatan'],
        ]);

        return redirect('/penggajian/' . $penggajian->id)->with('success', 'Penggajian berhasil diupdate');
    }

    public function destroy(Penggajian $penggajian)
    {
        $penggajian->delete();

        return redirect('/penggajian')->with('success', 'Penggajian berhasil dihapus');
    }

    public function destroyAll(Request $request)
    {
        $validated = $request->validate([
            'confirmation_code' => 'required|string',
        ]);

        // Check confirmation code
        if ($validated['confirmation_code'] !== 'ikh123wan') {
            return redirect('/penggajian')->with('error', 'Kode konfirmasi salah');
        }

        // Delete all penggajian records (with related pembayaran_kasbon)
        $count = Penggajian::count();

        // First, delete related pembayaran_kasbons that reference penggajian
        PembayaranKasbon::whereNotNull('penggajian_id')->delete();

        // Then delete all penggajian
        Penggajian::query()->delete();

        return redirect('/penggajian')->with('success', "Berhasil menghapus {$count} data penggajian");
    }

    public function exportSlipPdf(Penggajian $penggajian)
    {
        $penggajian->load('karyawan');

        $pdf = Pdf::loadView('pdf.slip-gaji', [
            'penggajian' => $penggajian,
        ]);

        $filename = 'slip-gaji-' . $penggajian->karyawan->nama . '-' . $penggajian->periode_mulai->format('Y-m-d') . '.pdf';

        return $pdf->download($filename);
    }
}
