<?php
use App\Http\Controllers\AbsensiController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KaryawanController;
use App\Http\Controllers\KasbonController;
use App\Http\Controllers\KumbungController;
use App\Http\Controllers\PanenController;
use App\Http\Controllers\PenggajianController;
use App\Http\Controllers\PengaturanGajiController;
use App\Http\Controllers\ProfileController;
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
});
require __DIR__.'/auth.php';
