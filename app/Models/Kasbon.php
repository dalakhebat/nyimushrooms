<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kasbon extends Model
{
    use HasFactory;

    protected $fillable = [
        'karyawan_id',
        'tanggal',
        'jumlah',
        'sisa',
        'keterangan',
        'status',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'jumlah' => 'decimal:2',
        'sisa' => 'decimal:2',
    ];

    public function karyawan(): BelongsTo
    {
        return $this->belongsTo(Karyawan::class);
    }

    public function pembayarans(): HasMany
    {
        return $this->hasMany(PembayaranKasbon::class);
    }

    /**
     * Get total sisa kasbon untuk karyawan
     */
    public static function getTotalSisaByKaryawan(int $karyawanId): float
    {
        return self::where('karyawan_id', $karyawanId)
            ->where('status', 'belum_lunas')
            ->sum('sisa');
    }

    /**
     * Get kasbon yang belum lunas untuk karyawan
     */
    public static function getBelumLunasByKaryawan(int $karyawanId)
    {
        return self::where('karyawan_id', $karyawanId)
            ->where('status', 'belum_lunas')
            ->orderBy('tanggal', 'asc')
            ->get();
    }

    /**
     * Bayar kasbon (update sisa dan status)
     */
    public function bayar(float $jumlah): float
    {
        $dibayar = min($jumlah, $this->sisa);
        $this->sisa -= $dibayar;

        if ($this->sisa <= 0) {
            $this->sisa = 0;
            $this->status = 'lunas';
        }

        $this->save();

        return $dibayar;
    }
}
