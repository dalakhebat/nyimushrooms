<?php

namespace App\Http\Controllers;

use App\Models\QrAbsensi;
use App\Models\AbsensiScan;
use App\Models\Karyawan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class QrAbsensiController extends Controller
{
    /**
     * Halaman scan publik (tanpa login) - untuk karyawan scan via HP
     */
    public function scanPublic()
    {
        return Inertia::render('QrAbsensi/ScanPublic');
    }

    /**
     * Process scan dari halaman publik dengan validasi PIN
     */
    public function processScanPublic(Request $request)
    {
        $validated = $request->validate([
            'pin' => 'required|string|size:6',
            'kode_qr' => 'required|string',
            'tipe' => 'required|in:masuk,keluar',
        ]);

        // Validasi PIN dan cari karyawan
        $karyawan = Karyawan::where('pin', $validated['pin'])
            ->where('status', 'aktif')
            ->first();

        if (!$karyawan) {
            return back()->withErrors(['pin' => 'PIN tidak valid atau karyawan tidak aktif']);
        }

        // Validasi QR code
        $qr = QrAbsensi::where('kode_qr', $validated['kode_qr'])->first();

        if (!$qr) {
            return back()->withErrors(['kode_qr' => 'QR Code tidak valid']);
        }

        if (!$qr->isValid()) {
            return back()->withErrors(['kode_qr' => 'QR Code sudah tidak berlaku atau kadaluarsa']);
        }

        $today = Carbon::today();
        $now = Carbon::now()->format('H:i:s');

        // Cek apakah sudah ada record untuk hari ini
        $existingScan = AbsensiScan::where('karyawan_id', $karyawan->id)
            ->where('tanggal', $today)
            ->first();

        if ($validated['tipe'] === 'masuk') {
            if ($existingScan && $existingScan->jam_masuk) {
                return back()->withErrors(['pin' => 'Anda sudah melakukan scan masuk hari ini pada jam ' . $existingScan->jam_masuk]);
            }

            // Tentukan status (terlambat jika masuk setelah jam 08:00)
            $status = Carbon::parse($now)->gt(Carbon::parse('08:00:00')) ? 'terlambat' : 'hadir';

            if ($existingScan) {
                $existingScan->update([
                    'jam_masuk' => $now,
                    'status' => $status,
                ]);
            } else {
                AbsensiScan::create([
                    'karyawan_id' => $karyawan->id,
                    'qr_absensi_id' => $qr->id,
                    'tanggal' => $today,
                    'jam_masuk' => $now,
                    'status' => $status,
                ]);
            }

            $message = 'Halo ' . $karyawan->nama . '! Scan masuk berhasil pada ' . Carbon::parse($now)->format('H:i');
            if ($status === 'terlambat') {
                $message .= ' (Terlambat)';
            }
        } else {
            if (!$existingScan || !$existingScan->jam_masuk) {
                return back()->withErrors(['pin' => 'Anda belum melakukan scan masuk hari ini']);
            }

            if ($existingScan->jam_keluar) {
                return back()->withErrors(['pin' => 'Anda sudah melakukan scan keluar hari ini pada jam ' . $existingScan->jam_keluar]);
            }

            $existingScan->update([
                'jam_keluar' => $now,
            ]);

            $message = 'Halo ' . $karyawan->nama . '! Scan keluar berhasil pada ' . Carbon::parse($now)->format('H:i') . '. Sampai jumpa besok!';
        }

        return back()->with('success', $message);
    }

    public function index()
    {
        // Generate atau ambil QR untuk hari ini
        $qrToday = QrAbsensi::generateForToday();

        // Ambil data scan hari ini
        $scansToday = AbsensiScan::with('karyawan')
            ->where('tanggal', Carbon::today())
            ->orderBy('jam_masuk', 'desc')
            ->get();

        // Karyawan yang belum scan
        $karyawanIds = $scansToday->pluck('karyawan_id')->toArray();
        $belumScan = Karyawan::where('status', 'aktif')
            ->whereNotIn('id', $karyawanIds)
            ->get();

        // Summary
        $totalKaryawan = Karyawan::where('status', 'aktif')->count();
        $sudahMasuk = $scansToday->whereNotNull('jam_masuk')->count();
        $sudahKeluar = $scansToday->whereNotNull('jam_keluar')->count();
        $terlambat = $scansToday->where('status', 'terlambat')->count();

        return Inertia::render('QrAbsensi/Index', [
            'qrCode' => $qrToday,
            'scansToday' => $scansToday,
            'belumScan' => $belumScan,
            'summary' => [
                'totalKaryawan' => $totalKaryawan,
                'sudahMasuk' => $sudahMasuk,
                'sudahKeluar' => $sudahKeluar,
                'belumMasuk' => $totalKaryawan - $sudahMasuk,
                'terlambat' => $terlambat,
            ],
        ]);
    }

    public function scan()
    {
        $karyawans = Karyawan::where('status', 'aktif')->orderBy('nama')->get();

        return Inertia::render('QrAbsensi/Scan', [
            'karyawans' => $karyawans,
        ]);
    }

    public function processScan(Request $request)
    {
        $validated = $request->validate([
            'kode_qr' => 'required|string',
            'karyawan_id' => 'required|exists:karyawans,id',
            'tipe' => 'required|in:masuk,keluar',
            'lokasi' => 'nullable|string',
        ]);

        // Validasi QR code
        $qr = QrAbsensi::where('kode_qr', $validated['kode_qr'])->first();

        if (!$qr) {
            return back()->withErrors(['kode_qr' => 'QR Code tidak valid']);
        }

        if (!$qr->isValid()) {
            return back()->withErrors(['kode_qr' => 'QR Code sudah tidak berlaku']);
        }

        $today = Carbon::today();
        $now = Carbon::now()->format('H:i:s');

        // Cek apakah sudah ada record untuk hari ini
        $existingScan = AbsensiScan::where('karyawan_id', $validated['karyawan_id'])
            ->where('tanggal', $today)
            ->first();

        if ($validated['tipe'] === 'masuk') {
            if ($existingScan && $existingScan->jam_masuk) {
                return back()->withErrors(['karyawan_id' => 'Karyawan sudah melakukan scan masuk hari ini']);
            }

            // Tentukan status (terlambat jika masuk setelah jam 08:00)
            $status = Carbon::parse($now)->gt(Carbon::parse('08:00:00')) ? 'terlambat' : 'hadir';

            if ($existingScan) {
                $existingScan->update([
                    'jam_masuk' => $now,
                    'status' => $status,
                    'lokasi_masuk' => $validated['lokasi'],
                ]);
            } else {
                AbsensiScan::create([
                    'karyawan_id' => $validated['karyawan_id'],
                    'qr_absensi_id' => $qr->id,
                    'tanggal' => $today,
                    'jam_masuk' => $now,
                    'status' => $status,
                    'lokasi_masuk' => $validated['lokasi'],
                ]);
            }

            $message = 'Scan masuk berhasil' . ($status === 'terlambat' ? ' (Terlambat)' : '');
        } else {
            if (!$existingScan || !$existingScan->jam_masuk) {
                return back()->withErrors(['karyawan_id' => 'Karyawan belum melakukan scan masuk']);
            }

            if ($existingScan->jam_keluar) {
                return back()->withErrors(['karyawan_id' => 'Karyawan sudah melakukan scan keluar hari ini']);
            }

            $existingScan->update([
                'jam_keluar' => $now,
                'lokasi_keluar' => $validated['lokasi'],
            ]);

            $message = 'Scan keluar berhasil';
        }

        return back()->with('success', $message);
    }

    public function history(Request $request)
    {
        $query = AbsensiScan::with(['karyawan', 'qrAbsensi']);

        if ($request->filled('karyawan_id')) {
            $query->where('karyawan_id', $request->karyawan_id);
        }

        if ($request->filled('tanggal_dari')) {
            $query->where('tanggal', '>=', $request->tanggal_dari);
        }

        if ($request->filled('tanggal_sampai')) {
            $query->where('tanggal', '<=', $request->tanggal_sampai);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $scans = $query->orderBy('tanggal', 'desc')
            ->orderBy('jam_masuk', 'desc')
            ->paginate(20);

        $karyawans = Karyawan::where('status', 'aktif')->orderBy('nama')->get();

        return Inertia::render('QrAbsensi/History', [
            'scans' => $scans,
            'karyawans' => $karyawans,
            'filters' => $request->only(['karyawan_id', 'tanggal_dari', 'tanggal_sampai', 'status']),
        ]);
    }

    public function generateNewQr()
    {
        $today = Carbon::today();
        $kodeQr = strtoupper(\Str::random(8)) . '-' . now()->format('dmY') . '-' . strtoupper(\Str::random(4));

        // Update existing atau create baru
        QrAbsensi::updateOrCreate(
            ['tanggal' => $today],
            [
                'kode_qr' => $kodeQr,
                'berlaku_mulai' => '06:00:00',
                'berlaku_sampai' => '23:59:59',
                'is_active' => true,
            ]
        );

        return back()->with('success', 'QR Code baru berhasil digenerate');
    }
}
