<?php
use App\Http\Controllers\AbsensiController;
use App\Http\Controllers\BaglogController;
use App\Http\Controllers\BahanBakuController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KaryawanController;
use App\Http\Controllers\KasbonController;
use App\Http\Controllers\KasController;
use App\Http\Controllers\KpiController;
use App\Http\Controllers\KumbungController;
use App\Http\Controllers\MonitoringKumbungController;
use App\Http\Controllers\NotifikasiController;
use App\Http\Controllers\PanenController;
use App\Http\Controllers\PembelianBahanBakuController;
use App\Http\Controllers\PenggajianController;
use App\Http\Controllers\PengaturanGajiController;
use App\Http\Controllers\PenjualanController;
use App\Http\Controllers\ProduksiBaglogController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QrAbsensiController;
use App\Http\Controllers\SupplierController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Public route untuk absensi karyawan (tanpa login)
Route::get('/absensi-publik', [QrAbsensiController::class, 'scanPublic'])->name('absensi.publik');
Route::post('/absensi-publik', [QrAbsensiController::class, 'processScanPublic'])->name('absensi.publik.process');
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])->name('dashboard');
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Kumbung
    Route::resource('kumbung', KumbungController::class)->except(['show']);

    // Panen
    Route::resource('panen', PanenController::class)->except(['show']);

    // Karyawan
    Route::resource('karyawan', KaryawanController::class)->except(['show']);

    // Absensi
    Route::get('/absensi/rekap', [AbsensiController::class, 'rekap'])->name('absensi.rekap');
    Route::get('/absensi/mingguan', [AbsensiController::class, 'mingguan'])->name('absensi.mingguan');
    Route::post('/absensi/mingguan', [AbsensiController::class, 'storeMingguan'])->name('absensi.mingguan.store');
    Route::get('/absensi/mingguan/export/pdf', [AbsensiController::class, 'exportMingguanPdf'])->name('absensi.mingguan.export.pdf');
    Route::get('/absensi/mingguan/export/excel', [AbsensiController::class, 'exportMingguanExcel'])->name('absensi.mingguan.export.excel');
    Route::get('/absensi/export/excel', [AbsensiController::class, 'exportExcel'])->name('absensi.export.excel');
    Route::get('/absensi/export/pdf', [AbsensiController::class, 'exportPdf'])->name('absensi.export.pdf');
    Route::resource('absensi', AbsensiController::class)->except(['show']);

    // Penggajian
    Route::post('/penggajian/{penggajian}/bayar', [PenggajianController::class, 'bayar'])->name('penggajian.bayar');
    Route::post('/penggajian/bayar-bulk', [PenggajianController::class, 'bayarBulk'])->name('penggajian.bayar-bulk');
    Route::delete('/penggajian/destroy-all', [PenggajianController::class, 'destroyAll'])->name('penggajian.destroy-all');
    Route::get('/penggajian/{penggajian}/slip-pdf', [PenggajianController::class, 'exportSlipPdf'])->name('penggajian.slip-pdf');
    Route::resource('penggajian', PenggajianController::class);

    // Kasbon
    Route::post('/kasbon/{kasbon}/bayar', [KasbonController::class, 'bayar'])->name('kasbon.bayar');
    Route::resource('kasbon', KasbonController::class);

    // Pengaturan Gaji
    Route::get('/pengaturan-gaji', [PengaturanGajiController::class, 'index'])->name('pengaturan-gaji.index');
    Route::post('/pengaturan-gaji', [PengaturanGajiController::class, 'update'])->name('pengaturan-gaji.update');

    // Baglog
    Route::patch('/baglog/{baglog}/status', [BaglogController::class, 'updateStatus'])->name('baglog.update-status');
    Route::resource('baglog', BaglogController::class)->except(['show']);

    // Supplier
    Route::resource('supplier', SupplierController::class)->except(['show']);

    // Customer
    Route::resource('customer', CustomerController::class)->except(['show']);

    // Penjualan
    Route::get('/penjualan', [PenjualanController::class, 'index'])->name('penjualan.index');
    // Penjualan Baglog
    Route::get('/penjualan/baglog/create', [PenjualanController::class, 'createBaglog'])->name('penjualan.baglog.create');
    Route::post('/penjualan/baglog', [PenjualanController::class, 'storeBaglog'])->name('penjualan.baglog.store');
    Route::get('/penjualan/baglog/{penjualanBaglog}/edit', [PenjualanController::class, 'editBaglog'])->name('penjualan.baglog.edit');
    Route::put('/penjualan/baglog/{penjualanBaglog}', [PenjualanController::class, 'updateBaglog'])->name('penjualan.baglog.update');
    Route::delete('/penjualan/baglog/{penjualanBaglog}', [PenjualanController::class, 'destroyBaglog'])->name('penjualan.baglog.destroy');
    Route::patch('/penjualan/baglog/{penjualanBaglog}/status', [PenjualanController::class, 'updateStatusBaglog'])->name('penjualan.baglog.status');
    // Penjualan Jamur
    Route::get('/penjualan/jamur/create', [PenjualanController::class, 'createJamur'])->name('penjualan.jamur.create');
    Route::post('/penjualan/jamur', [PenjualanController::class, 'storeJamur'])->name('penjualan.jamur.store');
    Route::get('/penjualan/jamur/{penjualanJamur}/edit', [PenjualanController::class, 'editJamur'])->name('penjualan.jamur.edit');
    Route::put('/penjualan/jamur/{penjualanJamur}', [PenjualanController::class, 'updateJamur'])->name('penjualan.jamur.update');
    Route::delete('/penjualan/jamur/{penjualanJamur}', [PenjualanController::class, 'destroyJamur'])->name('penjualan.jamur.destroy');
    Route::patch('/penjualan/jamur/{penjualanJamur}/status', [PenjualanController::class, 'updateStatusJamur'])->name('penjualan.jamur.status');

    // Laporan
    Route::get('/laporan', [LaporanController::class, 'index'])->name('laporan.index');
    Route::get('/laporan/export/pdf', [LaporanController::class, 'exportPdf'])->name('laporan.export.pdf');

    // Bahan Baku (Inventory)
    Route::get('/bahan-baku/{bahanBaku}/movements', [BahanBakuController::class, 'movements'])->name('bahan-baku.movements');
    Route::resource('bahan-baku', BahanBakuController::class)->except(['show']);

    // Pembelian Bahan Baku
    Route::resource('pembelian-bahan-baku', PembelianBahanBakuController::class)->except(['show']);

    // Produksi Baglog
    Route::patch('/produksi-baglog/{produksiBaglog}/status', [ProduksiBaglogController::class, 'updateStatus'])->name('produksi-baglog.update-status');
    Route::resource('produksi-baglog', ProduksiBaglogController::class);

    // Monitoring Kumbung
    Route::resource('monitoring-kumbung', MonitoringKumbungController::class)->except(['show']);

    // QR Absensi
    Route::get('/qr-absensi', [QrAbsensiController::class, 'index'])->name('qr-absensi.index');
    Route::post('/qr-absensi/generate', [QrAbsensiController::class, 'generateNewQr'])->name('qr-absensi.generate');
    Route::get('/qr-absensi/scan', [QrAbsensiController::class, 'scan'])->name('qr-absensi.scan');
    Route::post('/qr-absensi/process-scan', [QrAbsensiController::class, 'processScan'])->name('qr-absensi.process-scan');
    Route::get('/qr-absensi/history', [QrAbsensiController::class, 'history'])->name('qr-absensi.history');

    // KPI Karyawan
    Route::get('/kpi', [KpiController::class, 'index'])->name('kpi.index');
    Route::get('/kpi/{karyawan}', [KpiController::class, 'detail'])->name('kpi.detail');

    // Kas / Keuangan
    Route::get('/kas/report', [KasController::class, 'report'])->name('kas.report');
    Route::resource('kas', KasController::class)->except(['show']);

    // Notifikasi
    Route::get('/notifikasi', [NotifikasiController::class, 'index'])->name('notifikasi.index');
    Route::patch('/notifikasi/{notifikasi}/read', [NotifikasiController::class, 'markAsRead'])->name('notifikasi.read');
    Route::post('/notifikasi/read-all', [NotifikasiController::class, 'markAllAsRead'])->name('notifikasi.read-all');
    Route::delete('/notifikasi/{notifikasi}', [NotifikasiController::class, 'destroy'])->name('notifikasi.destroy');
    Route::delete('/notifikasi/delete-all', [NotifikasiController::class, 'destroyAll'])->name('notifikasi.destroy-all');
});
require __DIR__.'/auth.php';
