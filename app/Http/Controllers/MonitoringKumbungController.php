<?php

namespace App\Http\Controllers;

use App\Models\MonitoringKumbung;
use App\Models\Kumbung;
use App\Models\Karyawan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class MonitoringKumbungController extends Controller
{
    public function index(Request $request)
    {
        $query = MonitoringKumbung::with(['kumbung', 'karyawan']);

        if ($request->filled('kumbung_id')) {
            $query->where('kumbung_id', $request->kumbung_id);
        }

        if ($request->filled('tanggal')) {
            $query->whereDate('tanggal', $request->tanggal);
        }

        if ($request->filled('bulan')) {
            $query->whereMonth('tanggal', $request->bulan);
        }

        if ($request->filled('tahun')) {
            $query->whereYear('tanggal', $request->tahun);
        }

        $monitorings = $query->orderBy('tanggal', 'desc')
            ->orderBy('waktu', 'desc')
            ->paginate(15);

        // Data untuk summary
        $today = Carbon::today();
        $kumbungs = Kumbung::where('status', 'aktif')->get();

        $todayMonitoring = [];
        foreach ($kumbungs as $kumbung) {
            $latestMonitoring = MonitoringKumbung::where('kumbung_id', $kumbung->id)
                ->whereDate('tanggal', $today)
                ->orderBy('waktu', 'desc')
                ->first();

            $todayMonitoring[] = [
                'kumbung' => $kumbung,
                'monitoring' => $latestMonitoring,
            ];
        }

        return Inertia::render('MonitoringKumbung/Index', [
            'monitorings' => $monitorings,
            'todayMonitoring' => $todayMonitoring,
            'kumbungs' => $kumbungs,
            'filters' => $request->only(['kumbung_id', 'tanggal', 'bulan', 'tahun']),
        ]);
    }

    public function create()
    {
        $kumbungs = Kumbung::where('status', 'aktif')->orderBy('nomor')->get();
        $karyawans = Karyawan::where('status', 'aktif')->orderBy('nama')->get();

        return Inertia::render('MonitoringKumbung/Create', [
            'kumbungs' => $kumbungs,
            'karyawans' => $karyawans,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kumbung_id' => 'required|exists:kumbungs,id',
            'tanggal' => 'required|date',
            'waktu' => 'required',
            'suhu' => 'nullable|numeric|min:0|max:50',
            'kelembaban' => 'nullable|numeric|min:0|max:100',
            'kondisi_baglog' => 'required|in:baik,cukup,buruk',
            'sudah_spray' => 'boolean',
            'sudah_siram' => 'boolean',
            'catatan' => 'nullable|string',
            'karyawan_id' => 'nullable|exists:karyawans,id',
        ]);

        MonitoringKumbung::create($validated);

        return redirect()->route('monitoring-kumbung.index')
            ->with('success', 'Data monitoring berhasil ditambahkan');
    }

    public function edit(MonitoringKumbung $monitoringKumbung)
    {
        $kumbungs = Kumbung::where('status', 'aktif')->orderBy('nomor')->get();
        $karyawans = Karyawan::where('status', 'aktif')->orderBy('nama')->get();

        return Inertia::render('MonitoringKumbung/Edit', [
            'monitoring' => $monitoringKumbung->load(['kumbung', 'karyawan']),
            'kumbungs' => $kumbungs,
            'karyawans' => $karyawans,
        ]);
    }

    public function update(Request $request, MonitoringKumbung $monitoringKumbung)
    {
        $validated = $request->validate([
            'kumbung_id' => 'required|exists:kumbungs,id',
            'tanggal' => 'required|date',
            'waktu' => 'required',
            'suhu' => 'nullable|numeric|min:0|max:50',
            'kelembaban' => 'nullable|numeric|min:0|max:100',
            'kondisi_baglog' => 'required|in:baik,cukup,buruk',
            'sudah_spray' => 'boolean',
            'sudah_siram' => 'boolean',
            'catatan' => 'nullable|string',
            'karyawan_id' => 'nullable|exists:karyawans,id',
        ]);

        $monitoringKumbung->update($validated);

        return redirect()->route('monitoring-kumbung.index')
            ->with('success', 'Data monitoring berhasil diupdate');
    }

    public function destroy(MonitoringKumbung $monitoringKumbung)
    {
        $monitoringKumbung->delete();

        return redirect()->route('monitoring-kumbung.index')
            ->with('success', 'Data monitoring berhasil dihapus');
    }

    public function chart(Request $request)
    {
        $kumbungId = $request->get('kumbung_id');
        $days = $request->get('days', 7);

        $startDate = Carbon::now()->subDays($days);

        $query = MonitoringKumbung::where('tanggal', '>=', $startDate)
            ->orderBy('tanggal')
            ->orderBy('waktu');

        if ($kumbungId) {
            $query->where('kumbung_id', $kumbungId);
        }

        $data = $query->get()->groupBy('kumbung_id');

        $chartData = [];
        foreach ($data as $kumbungId => $monitorings) {
            $kumbung = Kumbung::find($kumbungId);
            $chartData[] = [
                'kumbung' => $kumbung->nama,
                'data' => $monitorings->map(function ($m) {
                    return [
                        'tanggal' => $m->tanggal->format('d/m'),
                        'waktu' => $m->waktu,
                        'suhu' => $m->suhu,
                        'kelembaban' => $m->kelembaban,
                    ];
                }),
            ];
        }

        return response()->json($chartData);
    }
}
