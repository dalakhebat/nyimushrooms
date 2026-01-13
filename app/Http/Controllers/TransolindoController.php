<?php

namespace App\Http\Controllers;

use App\Models\InvestasiTransolindo;
use App\Models\ReturnBulananTransolindo;
use App\Models\PanenTransolindo;
use App\Models\KasTransolindo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class TransolindoController extends Controller
{
    public function index()
    {
        // Investasi data (kumbung only for status tracking)
        $investasis = InvestasiTransolindo::orderBy('created_at', 'asc')->get();
        $kumbungs = InvestasiTransolindo::where('tipe', 'kumbung')->orderBy('created_at', 'asc')->get();

        // Return bulanan data
        $returnBulanans = ReturnBulananTransolindo::orderBy('bulan', 'asc')->get();

        // Panen data
        $panens = PanenTransolindo::with('investasi')
            ->orderBy('tanggal_mulai', 'asc')
            ->get();

        // Summary calculations
        $summary = [
            'totalModal' => InvestasiTransolindo::getTotalModal(),
            'totalReturnBulanan' => InvestasiTransolindo::getTotalReturnBulanan(),
            'averageROI' => InvestasiTransolindo::getAverageROI(),
            'totalDiterima' => ReturnBulananTransolindo::getTotalDiterima(),
            'totalShareTransolindo' => ReturnBulananTransolindo::getTotalShareTransolindo(),
            'totalKumbung' => PanenTransolindo::getTotalProfit(),
            'totalVolumePanen' => PanenTransolindo::getTotalVolume(),
            'totalPendapatanPanen' => PanenTransolindo::getTotalPendapatan(),
            'avgVolumePerWeek' => PanenTransolindo::getAverageVolumePerWeek(),
            'jumlahMingguPanen' => PanenTransolindo::count(),
        ];

        // Chart data - Monthly returns
        $chartData = $returnBulanans->map(function ($item) {
            return [
                'bulan' => Carbon::createFromFormat('Y-m', $item->bulan)->translatedFormat('M Y'),
                'jamur' => (float) $item->share_transolindo,
                'kumbung' => (float) $item->kumbung,
                'total' => (float) $item->total,
            ];
        });

        // Rekap Bulanan per Kumbung
        $rekapBulanan = $this->generateRekapBulanan($panens, $kumbungs);

        // Payment Reminders/Alerts
        $paymentAlerts = $this->generatePaymentAlerts($returnBulanans);

        // Kas Transolindo data
        $kasTransaksis = KasTransolindo::orderBy('tanggal', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        // Calculate running balance for each transaction
        $runningBalance = 0;
        $kasWithSaldo = $kasTransaksis->reverse()->map(function ($kas) use (&$runningBalance) {
            if ($kas->tipe === 'masuk' || $kas->tipe === 'reimburse') {
                $runningBalance += (float) $kas->jumlah;
            } else {
                $runningBalance -= (float) $kas->jumlah;
            }
            $kas->saldo = $runningBalance;
            return $kas;
        })->reverse()->values();

        $kasSummary = [
            'saldo' => KasTransolindo::getSaldo(),
            'totalMasuk' => KasTransolindo::getTotalMasuk(),
            'totalKeluar' => KasTransolindo::getTotalKeluar(),
            'totalReimburse' => KasTransolindo::getTotalReimburse(),
            'pendingReimburse' => KasTransolindo::getTotalPendingReimburse(),
        ];

        // Get pending reimburse transactions
        $pendingReimburseList = KasTransolindo::where('tipe', 'keluar')
            ->where('status', 'pending_reimburse')
            ->orderBy('tanggal', 'desc')
            ->get();

        return Inertia::render('Keuangan/Transolindo', [
            'investasis' => $investasis,
            'kumbungs' => $kumbungs,
            'returnBulanans' => $returnBulanans,
            'panens' => $panens,
            'summary' => $summary,
            'chartData' => $chartData,
            'rekapBulanan' => $rekapBulanan,
            'faseLabels' => InvestasiTransolindo::FASE_LABELS,
            'faseColors' => InvestasiTransolindo::FASE_COLORS,
            'kasTransaksis' => $kasWithSaldo,
            'kasSummary' => $kasSummary,
            'pendingReimburseList' => $pendingReimburseList,
            'kategoriOptions' => KasTransolindo::KATEGORI_OPTIONS,
            'paymentAlerts' => $paymentAlerts,
        ]);
    }

    private function generateRekapBulanan($panens, $kumbungs)
    {
        $rekap = [];

        foreach ($panens as $panen) {
            $bulan = Carbon::parse($panen->tanggal_mulai)->format('Y-m');

            if (!isset($rekap[$bulan])) {
                $rekap[$bulan] = [
                    'bulan' => $bulan,
                    'bulan_label' => Carbon::parse($panen->tanggal_mulai)->translatedFormat('M Y'),
                    'kumbungs' => [],
                    'total_volume' => 0,
                    'total_pendapatan' => 0,
                    'total_profit' => 0,
                ];

                // Initialize each kumbung
                foreach ($kumbungs as $kumbung) {
                    $rekap[$bulan]['kumbungs'][$kumbung->id] = [
                        'nama' => $kumbung->nama,
                        'volume' => 0,
                        'pendapatan' => 0,
                        'profit' => 0,
                        'minggu_count' => 0,
                    ];
                }
            }

            if ($panen->investasi_transolindo_id && isset($rekap[$bulan]['kumbungs'][$panen->investasi_transolindo_id])) {
                $rekap[$bulan]['kumbungs'][$panen->investasi_transolindo_id]['volume'] += (float) $panen->volume_kg;
                $rekap[$bulan]['kumbungs'][$panen->investasi_transolindo_id]['pendapatan'] += (float) $panen->pendapatan_kotor;
                $rekap[$bulan]['kumbungs'][$panen->investasi_transolindo_id]['profit'] += (float) $panen->profit;
                $rekap[$bulan]['kumbungs'][$panen->investasi_transolindo_id]['minggu_count']++;
            }

            $rekap[$bulan]['total_volume'] += (float) $panen->volume_kg;
            $rekap[$bulan]['total_pendapatan'] += (float) $panen->pendapatan_kotor;
            $rekap[$bulan]['total_profit'] += (float) $panen->profit;
        }

        // Convert kumbungs from associative to indexed array for frontend
        foreach ($rekap as &$item) {
            $item['kumbungs'] = array_values($item['kumbungs']);
        }

        return array_values($rekap);
    }

    private function generatePaymentAlerts($returnBulanans)
    {
        $alerts = [];
        $today = Carbon::now();

        // === JAMUR KERING - Jatuh tempo tanggal 3 setiap bulan ===
        $currentMonth = $today->format('Y-m');
        $dueDate3rd = Carbon::createFromFormat('Y-m-d', $currentMonth . '-03');

        // Check current month's return
        $currentMonthReturn = $returnBulanans->where('bulan', $currentMonth)->first();

        if ($today->day >= 3) {
            // Past due date for this month
            if (!$currentMonthReturn) {
                // No record at all
                $alerts[] = [
                    'type' => 'overdue',
                    'severity' => 'high',
                    'category' => 'jamur_kering',
                    'title' => 'Return Jamur Kering Belum Dibayar',
                    'message' => 'Return bulan ' . $today->translatedFormat('F Y') . ' belum diterima. Jatuh tempo: tanggal 3.',
                    'due_date' => $dueDate3rd->format('Y-m-d'),
                    'days_overdue' => $today->day - 3,
                    'amount' => 5000000, // Default expected amount
                ];
            } elseif (!$currentMonthReturn->diterima) {
                // Record exists but not received
                $alerts[] = [
                    'type' => 'overdue',
                    'severity' => 'high',
                    'category' => 'jamur_kering',
                    'title' => 'Return Jamur Kering Belum Diterima',
                    'message' => 'Return bulan ' . $today->translatedFormat('F Y') . ' sudah tercatat tapi belum ditandai diterima.',
                    'due_date' => $dueDate3rd->format('Y-m-d'),
                    'days_overdue' => $today->day - 3,
                    'amount' => (float) $currentMonthReturn->share_transolindo,
                    'return_id' => $currentMonthReturn->id,
                ];
            }
        } else {
            // Before due date - reminder
            if (!$currentMonthReturn || !$currentMonthReturn->diterima) {
                $daysUntilDue = 3 - $today->day;
                $alerts[] = [
                    'type' => 'upcoming',
                    'severity' => 'medium',
                    'category' => 'jamur_kering',
                    'title' => 'Return Jamur Kering Akan Jatuh Tempo',
                    'message' => 'Return bulan ' . $today->translatedFormat('F Y') . ' jatuh tempo dalam ' . $daysUntilDue . ' hari (tanggal 3).',
                    'due_date' => $dueDate3rd->format('Y-m-d'),
                    'days_until_due' => $daysUntilDue,
                    'amount' => $currentMonthReturn ? (float) $currentMonthReturn->share_transolindo : 5000000,
                ];
            }
        }

        // === KUMBUNG - Jatuh tempo setiap Rabu ===
        // Get last Wednesday and this Wednesday
        $lastWednesday = $today->copy()->previous(Carbon::WEDNESDAY);
        $thisWednesday = $today->copy()->next(Carbon::WEDNESDAY);

        if ($today->isWednesday()) {
            $thisWednesday = $today->copy();
        }

        // Check if there's been a payment this week (kas masuk with kategori return_kumbung since last Wednesday)
        $weeklyKumbungPayment = KasTransolindo::where('tipe', 'masuk')
            ->where('kategori', 'return_kumbung')
            ->whereBetween('tanggal', [$lastWednesday->format('Y-m-d'), $today->format('Y-m-d')])
            ->exists();

        // If it's Wednesday or past Wednesday and no payment this week
        if ($today->dayOfWeek >= Carbon::WEDNESDAY && !$weeklyKumbungPayment) {
            $daysOverdue = $today->diffInDays($lastWednesday);
            if ($today->isWednesday()) {
                $alerts[] = [
                    'type' => 'due_today',
                    'severity' => 'high',
                    'category' => 'kumbung',
                    'title' => 'Return Kumbung Jatuh Tempo Hari Ini',
                    'message' => 'Hari ini adalah hari Rabu - jatuh tempo pembayaran return kumbung mingguan.',
                    'due_date' => $today->format('Y-m-d'),
                    'days_overdue' => 0,
                ];
            } else {
                $alerts[] = [
                    'type' => 'overdue',
                    'severity' => 'high',
                    'category' => 'kumbung',
                    'title' => 'Return Kumbung Belum Dibayar',
                    'message' => 'Return kumbung minggu ini belum diterima. Jatuh tempo: Rabu, ' . $lastWednesday->translatedFormat('d M Y'),
                    'due_date' => $lastWednesday->format('Y-m-d'),
                    'days_overdue' => $daysOverdue,
                ];
            }
        } elseif ($today->dayOfWeek < Carbon::WEDNESDAY) {
            // Before Wednesday - reminder
            $daysUntilWednesday = Carbon::WEDNESDAY - $today->dayOfWeek;
            $alerts[] = [
                'type' => 'upcoming',
                'severity' => 'low',
                'category' => 'kumbung',
                'title' => 'Return Kumbung Akan Jatuh Tempo',
                'message' => 'Return kumbung mingguan jatuh tempo dalam ' . $daysUntilWednesday . ' hari (Rabu, ' . $thisWednesday->translatedFormat('d M Y') . ').',
                'due_date' => $thisWednesday->format('Y-m-d'),
                'days_until_due' => $daysUntilWednesday,
            ];
        }

        // Sort alerts by severity (high first)
        usort($alerts, function ($a, $b) {
            $severityOrder = ['high' => 0, 'medium' => 1, 'low' => 2];
            return $severityOrder[$a['severity']] - $severityOrder[$b['severity']];
        });

        return $alerts;
    }

    // Investasi CRUD
    public function storeInvestasi(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'tipe' => 'required|in:jamur_kering,kumbung',
            'modal' => 'required|numeric|min:0',
            'return_bulanan' => 'required|numeric|min:0',
            'tanggal_mulai' => 'nullable|date',
            'status' => 'required|in:active,inactive',
            'keterangan' => 'nullable|string',
        ]);

        // Calculate ROI
        if ($validated['modal'] > 0) {
            $validated['roi_tahunan'] = ($validated['return_bulanan'] * 12 / $validated['modal']) * 100;
        }

        InvestasiTransolindo::create($validated);

        return redirect()->back()->with('success', 'Investasi berhasil ditambahkan');
    }

    public function updateInvestasi(Request $request, InvestasiTransolindo $investasi)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'tipe' => 'required|in:jamur_kering,kumbung',
            'modal' => 'required|numeric|min:0',
            'return_bulanan' => 'required|numeric|min:0',
            'tanggal_mulai' => 'nullable|date',
            'status' => 'required|in:active,inactive',
            'keterangan' => 'nullable|string',
        ]);

        if ($validated['modal'] > 0) {
            $validated['roi_tahunan'] = ($validated['return_bulanan'] * 12 / $validated['modal']) * 100;
        }

        $investasi->update($validated);

        return redirect()->back()->with('success', 'Investasi berhasil diupdate');
    }

    public function destroyInvestasi(InvestasiTransolindo $investasi)
    {
        $investasi->delete();
        return redirect()->back()->with('success', 'Investasi berhasil dihapus');
    }

    public function updateFase(Request $request, InvestasiTransolindo $investasi)
    {
        $validated = $request->validate([
            'fase' => 'required|in:persiapan,inkubasi,panen,istirahat',
            'minggu_fase' => 'required|integer|min:1',
            'tanggal_mulai_fase' => 'nullable|date',
            'siklus_ke' => 'nullable|integer|min:1',
        ]);

        $investasi->update($validated);

        return redirect()->back()->with('success', 'Status fase berhasil diupdate');
    }

    // Return Bulanan CRUD
    public function storeReturn(Request $request)
    {
        $validated = $request->validate([
            'bulan' => 'required|string', // Format: YYYY-MM
            'jamur_kering' => 'required|numeric|min:0',
            'share_transolindo' => 'required|numeric|min:0',
            'share_defila' => 'required|numeric|min:0',
            'kumbung' => 'required|numeric|min:0',
            'diterima' => 'boolean',
            'tanggal_terima' => 'nullable|date',
            'keterangan' => 'nullable|string',
        ]);

        $validated['total'] = $validated['share_transolindo'] + $validated['kumbung'];

        ReturnBulananTransolindo::create($validated);

        return redirect()->back()->with('success', 'Return bulanan berhasil ditambahkan');
    }

    public function updateReturn(Request $request, ReturnBulananTransolindo $returnBulanan)
    {
        $validated = $request->validate([
            'bulan' => 'required|string',
            'jamur_kering' => 'required|numeric|min:0',
            'share_transolindo' => 'required|numeric|min:0',
            'share_defila' => 'required|numeric|min:0',
            'kumbung' => 'required|numeric|min:0',
            'diterima' => 'boolean',
            'tanggal_terima' => 'nullable|date',
            'keterangan' => 'nullable|string',
        ]);

        $validated['total'] = $validated['share_transolindo'] + $validated['kumbung'];

        $returnBulanan->update($validated);

        return redirect()->back()->with('success', 'Return bulanan berhasil diupdate');
    }

    public function destroyReturn(ReturnBulananTransolindo $returnBulanan)
    {
        $returnBulanan->delete();
        return redirect()->back()->with('success', 'Return bulanan berhasil dihapus');
    }

    public function toggleReturnStatus(ReturnBulananTransolindo $returnBulanan)
    {
        $returnBulanan->update([
            'diterima' => !$returnBulanan->diterima,
            'tanggal_terima' => !$returnBulanan->diterima ? now() : null,
        ]);

        return redirect()->back()->with('success', 'Status berhasil diupdate');
    }

    // Panen CRUD
    public function storePanen(Request $request)
    {
        $validated = $request->validate([
            'investasi_transolindo_id' => 'nullable|exists:investasi_transolindos,id',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'minggu_bulan' => 'required|string|max:100',
            'volume_kg' => 'required|numeric|min:0',
            'pendapatan_kotor' => 'required|numeric|min:0',
            'keterangan' => 'nullable|string',
        ]);

        // Calculate 80% baglog, 20% profit
        $validated['tabungan_baglog'] = $validated['pendapatan_kotor'] * 0.8;
        $validated['profit'] = $validated['pendapatan_kotor'] * 0.2;

        PanenTransolindo::create($validated);

        return redirect()->back()->with('success', 'Data panen berhasil ditambahkan');
    }

    public function updatePanen(Request $request, PanenTransolindo $panen)
    {
        $validated = $request->validate([
            'investasi_transolindo_id' => 'nullable|exists:investasi_transolindos,id',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'minggu_bulan' => 'required|string|max:100',
            'volume_kg' => 'required|numeric|min:0',
            'pendapatan_kotor' => 'required|numeric|min:0',
            'keterangan' => 'nullable|string',
        ]);

        $validated['tabungan_baglog'] = $validated['pendapatan_kotor'] * 0.8;
        $validated['profit'] = $validated['pendapatan_kotor'] * 0.2;

        $panen->update($validated);

        return redirect()->back()->with('success', 'Data panen berhasil diupdate');
    }

    public function destroyPanen(PanenTransolindo $panen)
    {
        $panen->delete();
        return redirect()->back()->with('success', 'Data panen berhasil dihapus');
    }

    // Kas Transolindo CRUD
    public function storeKas(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'tipe' => 'required|in:masuk,keluar,reimburse',
            'jumlah' => 'required|numeric|min:0',
            'keterangan' => 'required|string|max:255',
            'kategori' => 'nullable|string|max:100',
            'return_bulanan_id' => 'nullable|exists:return_bulanan_transolindos,id',
            'reimburse_ref_id' => 'nullable|exists:kas_transolindo,id',
            'status' => 'nullable|in:settled,pending_reimburse',
        ]);

        // Default status for keluar is pending_reimburse, others are settled
        if (!isset($validated['status'])) {
            $validated['status'] = $validated['tipe'] === 'keluar' ? 'pending_reimburse' : 'settled';
        }

        $kas = KasTransolindo::create($validated);

        // If this is a reimburse, update the referenced transaction status
        if ($validated['tipe'] === 'reimburse' && !empty($validated['reimburse_ref_id'])) {
            KasTransolindo::where('id', $validated['reimburse_ref_id'])
                ->update(['status' => 'settled']);
        }

        return redirect()->back()->with('success', 'Transaksi kas berhasil ditambahkan');
    }

    public function updateKas(Request $request, KasTransolindo $kas)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'tipe' => 'required|in:masuk,keluar,reimburse',
            'jumlah' => 'required|numeric|min:0',
            'keterangan' => 'required|string|max:255',
            'kategori' => 'nullable|string|max:100',
            'return_bulanan_id' => 'nullable|exists:return_bulanan_transolindos,id',
            'reimburse_ref_id' => 'nullable|exists:kas_transolindo,id',
            'status' => 'nullable|in:settled,pending_reimburse',
        ]);

        $kas->update($validated);

        return redirect()->back()->with('success', 'Transaksi kas berhasil diupdate');
    }

    public function destroyKas(KasTransolindo $kas)
    {
        // If deleting a reimburse, set the referenced transaction back to pending
        if ($kas->tipe === 'reimburse' && $kas->reimburse_ref_id) {
            KasTransolindo::where('id', $kas->reimburse_ref_id)
                ->update(['status' => 'pending_reimburse']);
        }

        $kas->delete();
        return redirect()->back()->with('success', 'Transaksi kas berhasil dihapus');
    }

    public function reimburseKas(KasTransolindo $kas)
    {
        // Create reimburse transaction
        KasTransolindo::create([
            'tanggal' => now(),
            'tipe' => 'reimburse',
            'jumlah' => $kas->jumlah,
            'keterangan' => 'Reimburse: ' . $kas->keterangan,
            'kategori' => $kas->kategori,
            'reimburse_ref_id' => $kas->id,
            'status' => 'settled',
        ]);

        // Update original transaction status
        $kas->update(['status' => 'settled']);

        return redirect()->back()->with('success', 'Reimburse berhasil dicatat');
    }
}
