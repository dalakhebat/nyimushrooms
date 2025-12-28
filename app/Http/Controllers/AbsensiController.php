<?php

namespace App\Http\Controllers;

use App\Models\Absensi;
use App\Models\Karyawan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class AbsensiController extends Controller
{
    public function index(Request $request)
    {
        $tanggal = $request->get('tanggal', now()->format('Y-m-d'));

        $query = Absensi::with('karyawan');

        // Filter by tanggal
        if ($request->filled('tanggal')) {
            $query->whereDate('tanggal', $request->tanggal);
        } else {
            $query->whereDate('tanggal', now());
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by nama karyawan
        if ($request->filled('search')) {
            $query->whereHas('karyawan', function ($q) use ($request) {
                $q->where('nama', 'like', '%' . $request->search . '%');
            });
        }

        $absensis = $query->orderBy('created_at', 'desc')->get();

        // Format tanggal untuk display
        $absensis->transform(function ($absensi) {
            $absensi->tanggal_formatted = $absensi->tanggal->format('d M Y');
            return $absensi;
        });

        // Summary untuk tanggal yang dipilih
        $summaryDate = Carbon::parse($tanggal);
        $summary = [
            'hadir' => Absensi::whereDate('tanggal', $summaryDate)->where('status', 'hadir')->count(),
            'izin' => Absensi::whereDate('tanggal', $summaryDate)->where('status', 'izin')->count(),
            'sakit' => Absensi::whereDate('tanggal', $summaryDate)->where('status', 'sakit')->count(),
            'alpha' => Absensi::whereDate('tanggal', $summaryDate)->where('status', 'alpha')->count(),
            'totalKaryawanAktif' => Karyawan::where('status', 'aktif')->count(),
        ];
        $summary['belumAbsen'] = $summary['totalKaryawanAktif'] - ($summary['hadir'] + $summary['izin'] + $summary['sakit'] + $summary['alpha']);

        return Inertia::render('Absensi/Index', [
            'absensis' => $absensis,
            'filters' => $request->only(['tanggal', 'status', 'search']),
            'summary' => $summary,
            'today' => now()->format('Y-m-d'),
        ]);
    }

    public function create(Request $request)
    {
        $tanggal = $request->get('tanggal', now()->format('Y-m-d'));

        // Get all active karyawan
        $karyawans = Karyawan::where('status', 'aktif')
            ->orderBy('nama', 'asc')
            ->get();

        // Get existing absensi for the date
        $existingAbsensi = Absensi::whereDate('tanggal', $tanggal)
            ->pluck('status', 'karyawan_id')
            ->toArray();

        // Merge karyawan with existing absensi status
        $karyawans->transform(function ($karyawan) use ($existingAbsensi) {
            $karyawan->absensi_status = $existingAbsensi[$karyawan->id] ?? null;
            return $karyawan;
        });

        return Inertia::render('Absensi/Create', [
            'karyawans' => $karyawans,
            'tanggal' => $tanggal,
            'today' => now()->format('Y-m-d'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'absensi' => 'required|array',
            'absensi.*.karyawan_id' => 'required|exists:karyawans,id',
            'absensi.*.status' => 'required|in:hadir,izin,sakit,alpha',
            'absensi.*.catatan' => 'nullable|string',
        ]);

        $tanggal = $validated['tanggal'];

        foreach ($validated['absensi'] as $item) {
            Absensi::updateOrCreate(
                [
                    'karyawan_id' => $item['karyawan_id'],
                    'tanggal' => $tanggal,
                ],
                [
                    'status' => $item['status'],
                    'catatan' => $item['catatan'] ?? null,
                ]
            );
        }

        return redirect('/absensi?tanggal=' . $tanggal)->with('success', 'Absensi berhasil disimpan');
    }

    public function edit(Absensi $absensi)
    {
        return Inertia::render('Absensi/Edit', [
            'absensi' => [
                'id' => $absensi->id,
                'karyawan_id' => $absensi->karyawan_id,
                'karyawan_nama' => $absensi->karyawan->nama,
                'tanggal' => $absensi->tanggal->format('Y-m-d'),
                'status' => $absensi->status,
                'catatan' => $absensi->catatan,
            ],
        ]);
    }

    public function update(Request $request, Absensi $absensi)
    {
        $validated = $request->validate([
            'status' => 'required|in:hadir,izin,sakit,alpha',
            'catatan' => 'nullable|string',
        ]);

        $absensi->update($validated);

        // Update any pending penggajian that covers this absensi date
        $this->recalculatePendingPenggajian($absensi->karyawan_id, $absensi->tanggal);

        return redirect()->back()->with('success', 'Absensi berhasil diupdate');
    }

    /**
     * Recalculate pending penggajian after absensi correction
     */
    private function recalculatePendingPenggajian(int $karyawanId, $tanggal): void
    {
        $penggajians = \App\Models\Penggajian::where('karyawan_id', $karyawanId)
            ->where('status', 'pending')
            ->whereDate('periode_mulai', '<=', $tanggal)
            ->whereDate('periode_selesai', '>=', $tanggal)
            ->get();

        foreach ($penggajians as $penggajian) {
            // Get fresh absensi data for this period
            $absensis = Absensi::where('karyawan_id', $karyawanId)
                ->whereDate('tanggal', '>=', $penggajian->periode_mulai)
                ->whereDate('tanggal', '<=', $penggajian->periode_selesai)
                ->get();

            $jumlahHadir = $absensis->where('status', 'hadir')->count();
            $jumlahIzin = $absensis->where('status', 'izin')->count();
            $jumlahSakit = $absensis->where('status', 'sakit')->count();
            $jumlahAlpha = $absensis->where('status', 'alpha')->count();

            // Get karyawan for gaji calculation
            $karyawan = \App\Models\Karyawan::find($karyawanId);
            $pengaturan = \App\Models\PengaturanGaji::getByTipeGaji($karyawan->tipe_gaji);

            // Recalculate gaji based on tipe
            $gajiPokok = 0;
            $potongan = 0;

            switch ($karyawan->tipe_gaji) {
                case 'mingguan':
                    $gajiPokok = $karyawan->nominal_gaji * $jumlahHadir;
                    $potonganIzin = $karyawan->nominal_gaji * ($pengaturan['izin']['persentase_potongan'] ?? 0) / 100 * $jumlahIzin;
                    $potonganSakit = $karyawan->nominal_gaji * ($pengaturan['sakit']['persentase_potongan'] ?? 0) / 100 * $jumlahSakit;
                    $potongan = $potonganIzin + $potonganSakit;
                    break;

                case 'bulanan':
                    $gajiPokok = $karyawan->nominal_gaji;
                    $potonganPerHari = $karyawan->nominal_gaji / 30;
                    $potonganIzin = $potonganPerHari * ($pengaturan['izin']['persentase_potongan'] ?? 0) / 100 * $jumlahIzin;
                    $potonganSakit = $potonganPerHari * ($pengaturan['sakit']['persentase_potongan'] ?? 0) / 100 * $jumlahSakit;
                    $potonganAlpha = $potonganPerHari * ($pengaturan['alpha']['persentase_potongan'] ?? 100) / 100 * $jumlahAlpha;
                    $potongan = $potonganIzin + $potonganSakit + $potonganAlpha;
                    break;

                case 'borongan':
                    $gajiPokok = $karyawan->nominal_gaji * $jumlahHadir;
                    $potongan = 0;
                    break;
            }

            $total = $gajiPokok + $penggajian->bonus - $potongan - $penggajian->potongan_kasbon;

            $penggajian->update([
                'jumlah_hadir' => $jumlahHadir,
                'jumlah_izin' => $jumlahIzin,
                'jumlah_sakit' => $jumlahSakit,
                'jumlah_alpha' => $jumlahAlpha,
                'gaji_pokok' => round($gajiPokok, 0),
                'potongan' => round($potongan, 0),
                'total' => max(0, round($total, 0)),
            ]);
        }
    }

    public function destroy(Absensi $absensi)
    {
        $tanggal = $absensi->tanggal->format('Y-m-d');
        $absensi->delete();

        return redirect('/absensi?tanggal=' . $tanggal)->with('success', 'Absensi berhasil dihapus');
    }

    public function rekap(Request $request)
    {
        // Tipe rekap: bulanan atau mingguan
        $tipe = $request->get('tipe', 'bulanan');
        $bulan = $request->get('bulan', now()->format('Y-m'));
        $minggu = $request->get('minggu', 1);

        // Parse bulan dengan aman
        try {
            $bulanDate = Carbon::parse($bulan . '-01');
        } catch (\Exception $e) {
            $bulanDate = now()->startOfMonth();
            $bulan = now()->format('Y-m');
        }

        if ($tipe === 'mingguan') {
            // Mingguan: gunakan tanggal_awal dan tanggal_akhir dari request
            $tanggalAwal = $request->get('tanggal_awal');
            $tanggalAkhir = $request->get('tanggal_akhir');

            // Jika tidak ada, hitung minggu pertama dari bulan
            if (!$tanggalAwal || !$tanggalAkhir) {
                $tanggalAwal = $bulanDate->copy()->startOfMonth()->format('Y-m-d');
                $tanggalAkhir = $bulanDate->copy()->startOfMonth()->addDays(6)->format('Y-m-d');
            }

            $startDate = Carbon::parse($tanggalAwal)->startOfDay();
            $endDate = Carbon::parse($tanggalAkhir)->endOfDay();
        } else {
            // Bulanan
            $startDate = $bulanDate->copy()->startOfMonth();
            $endDate = $bulanDate->copy()->endOfMonth();
            $tanggalAwal = $startDate->format('Y-m-d');
            $tanggalAkhir = $endDate->format('Y-m-d');
        }

        // Get all karyawan (aktif) with tipe_gaji
        $karyawans = Karyawan::where('status', 'aktif')
            ->orderBy('nama', 'asc')
            ->get();

        // Get rekap per karyawan
        $rekap = $karyawans->map(function ($karyawan) use ($startDate, $endDate) {
            $absensis = Absensi::where('karyawan_id', $karyawan->id)
                ->whereDate('tanggal', '>=', $startDate->toDateString())
                ->whereDate('tanggal', '<=', $endDate->toDateString())
                ->get();

            return [
                'id' => $karyawan->id,
                'nama' => $karyawan->nama,
                'tipe_gaji' => $karyawan->tipe_gaji,
                'nominal_gaji' => $karyawan->nominal_gaji,
                'hadir' => $absensis->where('status', 'hadir')->count(),
                'izin' => $absensis->where('status', 'izin')->count(),
                'sakit' => $absensis->where('status', 'sakit')->count(),
                'alpha' => $absensis->where('status', 'alpha')->count(),
                'total_hari_kerja' => $absensis->count(),
            ];
        });

        // Total summary
        $summary = [
            'totalHadir' => $rekap->sum('hadir'),
            'totalIzin' => $rekap->sum('izin'),
            'totalSakit' => $rekap->sum('sakit'),
            'totalAlpha' => $rekap->sum('alpha'),
        ];

        return Inertia::render('Absensi/Rekap', [
            'rekap' => $rekap,
            'summary' => $summary,
            'tipe' => $tipe,
            'bulan' => $bulan,
            'minggu' => (int) $minggu,
            'tanggalAwal' => $tanggalAwal,
            'tanggalAkhir' => $tanggalAkhir,
            'periode' => [
                'start' => $startDate->format('d M Y'),
                'end' => $endDate->format('d M Y'),
            ],
        ]);
    }

    public function exportExcel(Request $request)
    {
        $tipe = $request->get('tipe', 'bulanan');

        if ($tipe === 'mingguan') {
            $tanggalAwal = $request->get('tanggal_awal', now()->startOfWeek()->format('Y-m-d'));
            $tanggalAkhir = $request->get('tanggal_akhir', now()->endOfWeek()->format('Y-m-d'));
            $startDate = Carbon::parse($tanggalAwal)->startOfDay();
            $endDate = Carbon::parse($tanggalAkhir)->endOfDay();
            $filename = 'rekap-absensi-' . $tanggalAwal . '-sd-' . $tanggalAkhir . '.csv';
        } else {
            $bulan = $request->get('bulan', now()->format('Y-m'));
            $startDate = Carbon::createFromFormat('Y-m', $bulan)->startOfMonth();
            $endDate = Carbon::createFromFormat('Y-m', $bulan)->endOfMonth();
            $filename = 'rekap-absensi-' . $bulan . '.csv';
        }

        $karyawans = Karyawan::where('status', 'aktif')->orderBy('nama', 'asc')->get();

        $data = $karyawans->map(function ($karyawan) use ($startDate, $endDate) {
            $absensis = Absensi::where('karyawan_id', $karyawan->id)
                ->whereDate('tanggal', '>=', $startDate->format('Y-m-d'))
                ->whereDate('tanggal', '<=', $endDate->format('Y-m-d'))
                ->get();

            return [
                'Nama' => $karyawan->nama,
                'Tipe Gaji' => ucfirst($karyawan->tipe_gaji),
                'Nominal Gaji' => $karyawan->nominal_gaji,
                'Hadir' => $absensis->where('status', 'hadir')->count(),
                'Izin' => $absensis->where('status', 'izin')->count(),
                'Sakit' => $absensis->where('status', 'sakit')->count(),
                'Alpha' => $absensis->where('status', 'alpha')->count(),
                'Total Hari' => $absensis->count(),
            ];
        });

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function () use ($data) {
            $file = fopen('php://output', 'w');
            // Header
            fputcsv($file, ['Nama', 'Tipe Gaji', 'Nominal Gaji', 'Hadir', 'Izin', 'Sakit', 'Alpha', 'Total Hari']);
            // Data
            foreach ($data as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Weekly attendance input page (Grid view: Minggu-Sabtu)
     */
    public function mingguan(Request $request)
    {
        // Get week period (default: current week starting from Sunday)
        $mingguKe = $request->get('minggu', 1);
        $bulan = $request->get('bulan', now()->format('Y-m'));

        // Parse month
        $bulanDate = Carbon::parse($bulan . '-01');

        // Calculate week dates (Sunday to Saturday)
        $weeks = $this->getWeeksInMonth($bulanDate);
        $selectedWeek = $weeks[$mingguKe - 1] ?? $weeks[0];

        $tanggalMulai = Carbon::parse($selectedWeek['start']);
        $tanggalSelesai = Carbon::parse($selectedWeek['end']);

        // Get all active karyawan (mingguan type only, exclude borongan)
        $karyawans = Karyawan::where('status', 'aktif')
            ->where('tipe_gaji', 'mingguan')
            ->orderBy('bagian', 'asc')
            ->orderBy('nama', 'asc')
            ->get();

        // Get existing absensi for the week
        $existingAbsensi = Absensi::whereIn('karyawan_id', $karyawans->pluck('id'))
            ->whereDate('tanggal', '>=', $tanggalMulai)
            ->whereDate('tanggal', '<=', $tanggalSelesai)
            ->get()
            ->groupBy('karyawan_id');

        // Build grid data
        $days = [];
        $currentDay = $tanggalMulai->copy();
        while ($currentDay <= $tanggalSelesai) {
            $days[] = [
                'date' => $currentDay->format('Y-m-d'),
                'day' => $currentDay->locale('id')->isoFormat('ddd'),
                'dayNum' => $currentDay->format('d'),
            ];
            $currentDay->addDay();
        }

        // Build karyawan grid with attendance data
        $gridData = $karyawans->map(function ($karyawan) use ($days, $existingAbsensi) {
            $karyawanAbsensi = $existingAbsensi->get($karyawan->id, collect());

            $attendance = [];
            foreach ($days as $day) {
                $absensi = $karyawanAbsensi->firstWhere('tanggal', Carbon::parse($day['date']));
                $attendance[$day['date']] = $absensi ? $absensi->status : 'hadir'; // Default hadir
            }

            return [
                'id' => $karyawan->id,
                'nama' => $karyawan->nama,
                'bagian' => $karyawan->bagian,
                'attendance' => $attendance,
            ];
        });

        return Inertia::render('Penggajian/AbsensiMingguan', [
            'karyawans' => $gridData,
            'days' => $days,
            'bulan' => $bulan,
            'minggu' => (int) $mingguKe,
            'weeks' => $weeks,
            'periode' => [
                'start' => $tanggalMulai->format('d M Y'),
                'end' => $tanggalSelesai->format('d M Y'),
            ],
        ]);
    }

    /**
     * Get weeks in a month (Sunday to Saturday)
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

    /**
     * Store weekly attendance (bulk)
     */
    public function storeMingguan(Request $request)
    {
        $validated = $request->validate([
            'attendance' => 'required|array',
            'attendance.*.karyawan_id' => 'required|exists:karyawans,id',
            'attendance.*.data' => 'required|array',
        ]);

        foreach ($validated['attendance'] as $item) {
            foreach ($item['data'] as $tanggal => $status) {
                Absensi::updateOrCreate(
                    [
                        'karyawan_id' => $item['karyawan_id'],
                        'tanggal' => $tanggal,
                    ],
                    [
                        'status' => $status,
                    ]
                );
            }
        }

        return redirect()->back()->with('success', 'Absensi mingguan berhasil disimpan');
    }

    /**
     * Export weekly attendance grid to PDF
     */
    public function exportMingguanPdf(Request $request)
    {
        $bulan = $request->get('bulan', now()->format('Y-m'));
        $mingguKe = $request->get('minggu', 1);

        $bulanDate = Carbon::parse($bulan . '-01');
        $weeks = $this->getWeeksInMonth($bulanDate);
        $selectedWeek = $weeks[$mingguKe - 1] ?? $weeks[0];

        $tanggalMulai = Carbon::parse($selectedWeek['start']);
        $tanggalSelesai = Carbon::parse($selectedWeek['end']);

        // Get karyawan mingguan
        $karyawans = Karyawan::where('status', 'aktif')
            ->where('tipe_gaji', 'mingguan')
            ->orderBy('bagian', 'asc')
            ->orderBy('nama', 'asc')
            ->get();

        // Get existing absensi
        $existingAbsensi = Absensi::whereIn('karyawan_id', $karyawans->pluck('id'))
            ->whereDate('tanggal', '>=', $tanggalMulai)
            ->whereDate('tanggal', '<=', $tanggalSelesai)
            ->get()
            ->groupBy('karyawan_id');

        // Build days array
        $days = [];
        $currentDay = $tanggalMulai->copy();
        while ($currentDay <= $tanggalSelesai) {
            $days[] = [
                'date' => $currentDay->format('Y-m-d'),
                'day' => $currentDay->locale('id')->isoFormat('ddd'),
                'dayNum' => $currentDay->format('d'),
            ];
            $currentDay->addDay();
        }

        // Build grid data
        $gridData = $karyawans->map(function ($karyawan) use ($days, $existingAbsensi) {
            $karyawanAbsensi = $existingAbsensi->get($karyawan->id, collect());

            $attendance = [];
            $summary = ['hadir' => 0, 'izin' => 0, 'sakit' => 0, 'alpha' => 0];

            foreach ($days as $day) {
                $absensi = $karyawanAbsensi->firstWhere('tanggal', Carbon::parse($day['date']));
                $status = $absensi ? $absensi->status : 'hadir';
                $attendance[$day['date']] = $status;
                $summary[$status]++;
            }

            return [
                'nama' => $karyawan->nama,
                'bagian' => $karyawan->bagian,
                'attendance' => $attendance,
                'summary' => $summary,
            ];
        });

        $pdf = Pdf::loadView('pdf.absensi-mingguan', [
            'data' => $gridData,
            'days' => $days,
            'periode' => $tanggalMulai->locale('id')->isoFormat('D MMM Y') . ' - ' . $tanggalSelesai->locale('id')->isoFormat('D MMM Y'),
            'minggu' => $mingguKe,
            'bulan' => $bulanDate->locale('id')->isoFormat('MMMM Y'),
        ]);

        $pdf->setPaper('a4', 'landscape');

        $filename = 'absensi-mingguan-' . $bulan . '-minggu-' . $mingguKe . '.pdf';
        return $pdf->download($filename);
    }

    /**
     * Export weekly attendance grid to Excel/CSV
     */
    public function exportMingguanExcel(Request $request)
    {
        $bulan = $request->get('bulan', now()->format('Y-m'));
        $mingguKe = $request->get('minggu', 1);

        $bulanDate = Carbon::parse($bulan . '-01');
        $weeks = $this->getWeeksInMonth($bulanDate);
        $selectedWeek = $weeks[$mingguKe - 1] ?? $weeks[0];

        $tanggalMulai = Carbon::parse($selectedWeek['start']);
        $tanggalSelesai = Carbon::parse($selectedWeek['end']);

        // Get karyawan mingguan
        $karyawans = Karyawan::where('status', 'aktif')
            ->where('tipe_gaji', 'mingguan')
            ->orderBy('bagian', 'asc')
            ->orderBy('nama', 'asc')
            ->get();

        // Get existing absensi
        $existingAbsensi = Absensi::whereIn('karyawan_id', $karyawans->pluck('id'))
            ->whereDate('tanggal', '>=', $tanggalMulai)
            ->whereDate('tanggal', '<=', $tanggalSelesai)
            ->get()
            ->groupBy('karyawan_id');

        // Build days array
        $days = [];
        $currentDay = $tanggalMulai->copy();
        while ($currentDay <= $tanggalSelesai) {
            $days[] = [
                'date' => $currentDay->format('Y-m-d'),
                'day' => $currentDay->locale('id')->isoFormat('ddd'),
                'dayNum' => $currentDay->format('d'),
            ];
            $currentDay->addDay();
        }

        $filename = 'absensi-mingguan-' . $bulan . '-minggu-' . $mingguKe . '.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function () use ($karyawans, $days, $existingAbsensi, $tanggalMulai, $tanggalSelesai) {
            $file = fopen('php://output', 'w');
            // BOM for UTF-8
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));

            // Header row
            $headerRow = ['Nama', 'Bagian'];
            foreach ($days as $day) {
                $headerRow[] = $day['day'] . ' ' . $day['dayNum'];
            }
            $headerRow[] = 'Hadir';
            $headerRow[] = 'Izin';
            $headerRow[] = 'Sakit';
            $headerRow[] = 'Alpha';
            fputcsv($file, $headerRow);

            // Data rows
            foreach ($karyawans as $karyawan) {
                $karyawanAbsensi = $existingAbsensi->get($karyawan->id, collect());
                $row = [$karyawan->nama, $karyawan->bagian];

                $summary = ['hadir' => 0, 'izin' => 0, 'sakit' => 0, 'alpha' => 0];

                foreach ($days as $day) {
                    $absensi = $karyawanAbsensi->firstWhere('tanggal', Carbon::parse($day['date']));
                    $status = $absensi ? $absensi->status : 'hadir';
                    $row[] = strtoupper(substr($status, 0, 1)); // H, I, S, A
                    $summary[$status]++;
                }

                $row[] = $summary['hadir'];
                $row[] = $summary['izin'];
                $row[] = $summary['sakit'];
                $row[] = $summary['alpha'];

                fputcsv($file, $row);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function exportPdf(Request $request)
    {
        $tipe = $request->get('tipe', 'bulanan');

        if ($tipe === 'mingguan') {
            $tanggalAwal = $request->get('tanggal_awal', now()->startOfWeek()->format('Y-m-d'));
            $tanggalAkhir = $request->get('tanggal_akhir', now()->endOfWeek()->format('Y-m-d'));
            $startDate = Carbon::parse($tanggalAwal)->startOfDay();
            $endDate = Carbon::parse($tanggalAkhir)->endOfDay();
            $periodeLabel = 'Minggu ' . $startDate->locale('id')->isoFormat('D MMM Y') . ' - ' . $endDate->locale('id')->isoFormat('D MMM Y');
            $filename = 'rekap-absensi-' . $tanggalAwal . '-sd-' . $tanggalAkhir . '.pdf';
        } else {
            $bulan = $request->get('bulan', now()->format('Y-m'));
            $startDate = Carbon::createFromFormat('Y-m', $bulan)->startOfMonth();
            $endDate = Carbon::createFromFormat('Y-m', $bulan)->endOfMonth();
            $periodeLabel = $startDate->locale('id')->isoFormat('MMMM Y');
            $filename = 'rekap-absensi-' . $bulan . '.pdf';
        }

        $karyawans = Karyawan::where('status', 'aktif')->orderBy('nama', 'asc')->get();

        $rekap = $karyawans->map(function ($karyawan) use ($startDate, $endDate) {
            $absensis = Absensi::where('karyawan_id', $karyawan->id)
                ->whereDate('tanggal', '>=', $startDate->format('Y-m-d'))
                ->whereDate('tanggal', '<=', $endDate->format('Y-m-d'))
                ->get();

            return [
                'nama' => $karyawan->nama,
                'tipe_gaji' => ucfirst($karyawan->tipe_gaji),
                'nominal_gaji' => $karyawan->nominal_gaji,
                'hadir' => $absensis->where('status', 'hadir')->count(),
                'izin' => $absensis->where('status', 'izin')->count(),
                'sakit' => $absensis->where('status', 'sakit')->count(),
                'alpha' => $absensis->where('status', 'alpha')->count(),
                'total' => $absensis->count(),
            ];
        });

        $pdf = Pdf::loadView('pdf.rekap-absensi', [
            'rekap' => $rekap,
            'bulan' => $periodeLabel,
            'periode' => $startDate->locale('id')->isoFormat('D MMM Y') . ' - ' . $endDate->locale('id')->isoFormat('D MMM Y'),
        ]);

        return $pdf->download($filename);
    }
}
