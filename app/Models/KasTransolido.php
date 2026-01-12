<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KasTransolido extends Model
{
    use HasFactory;

    protected $table = 'kas_transolido';

    protected $fillable = [
        'tanggal',
        'tipe',
        'jumlah',
        'keterangan',
        'kategori',
        'return_bulanan_id',
        'reimburse_ref_id',
        'status',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'jumlah' => 'decimal:2',
    ];

    const TIPE_MASUK = 'masuk';
    const TIPE_KELUAR = 'keluar';
    const TIPE_REIMBURSE = 'reimburse';

    const STATUS_SETTLED = 'settled';
    const STATUS_PENDING = 'pending_reimburse';

    const KATEGORI_OPTIONS = [
        'return_jk' => 'Return Jamur Kering',
        'return_autoclave' => 'Return Autoclave',
        'return_kumbung' => 'Return Kumbung',
        'operasional' => 'Operasional',
        'pribadi' => 'Keperluan Pribadi',
        'investasi' => 'Investasi',
        'lainnya' => 'Lainnya',
    ];

    public function returnBulanan()
    {
        return $this->belongsTo(ReturnBulananTransolido::class, 'return_bulanan_id');
    }

    public function reimburseRef()
    {
        return $this->belongsTo(KasTransolido::class, 'reimburse_ref_id');
    }

    public function reimburses()
    {
        return $this->hasMany(KasTransolido::class, 'reimburse_ref_id');
    }

    // Get current balance
    public static function getSaldo()
    {
        $masuk = self::where('tipe', self::TIPE_MASUK)->sum('jumlah');
        $reimburse = self::where('tipe', self::TIPE_REIMBURSE)->sum('jumlah');
        $keluar = self::where('tipe', self::TIPE_KELUAR)->sum('jumlah');

        return ($masuk + $reimburse) - $keluar;
    }

    // Get total pending reimburse
    public static function getTotalPendingReimburse()
    {
        return self::where('tipe', self::TIPE_KELUAR)
            ->where('status', self::STATUS_PENDING)
            ->sum('jumlah');
    }

    // Get total masuk
    public static function getTotalMasuk()
    {
        return self::where('tipe', self::TIPE_MASUK)->sum('jumlah');
    }

    // Get total keluar
    public static function getTotalKeluar()
    {
        return self::where('tipe', self::TIPE_KELUAR)->sum('jumlah');
    }

    // Get total reimburse
    public static function getTotalReimburse()
    {
        return self::where('tipe', self::TIPE_REIMBURSE)->sum('jumlah');
    }
}
