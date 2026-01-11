<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StokJamur extends Model
{
    use HasFactory;

    protected $fillable = [
        'kumbung_id',
        'panen_id',
        'penjualan_jamur_id',
        'tipe',
        'berat_kg',
        'stok_sebelum',
        'stok_sesudah',
        'keterangan',
        'tanggal',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'berat_kg' => 'decimal:2',
        'stok_sebelum' => 'decimal:2',
        'stok_sesudah' => 'decimal:2',
    ];

    public function kumbung(): BelongsTo
    {
        return $this->belongsTo(Kumbung::class);
    }

    public function panen(): BelongsTo
    {
        return $this->belongsTo(Panen::class);
    }

    public function penjualanJamur(): BelongsTo
    {
        return $this->belongsTo(PenjualanJamur::class);
    }

    // Get current total stock
    public static function getStokTersedia(): float
    {
        $masuk = self::where('tipe', 'masuk')->sum('berat_kg');
        $keluar = self::where('tipe', 'keluar')->sum('berat_kg');
        return $masuk - $keluar;
    }
}
