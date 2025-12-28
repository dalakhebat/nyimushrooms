<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Penggajian extends Model
{
    use HasFactory;

    protected $fillable = [
        'karyawan_id',
        'periode_mulai',
        'periode_selesai',
        'jumlah_hadir',
        'jumlah_izin',
        'jumlah_sakit',
        'jumlah_alpha',
        'gaji_pokok',
        'bonus',
        'potongan',
        'potongan_kasbon',
        'total',
        'status',
        'tanggal_bayar',
        'catatan',
    ];

    protected $casts = [
        'periode_mulai' => 'date',
        'periode_selesai' => 'date',
        'tanggal_bayar' => 'date',
        'gaji_pokok' => 'decimal:2',
        'bonus' => 'decimal:2',
        'potongan' => 'decimal:2',
        'potongan_kasbon' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function karyawan(): BelongsTo
    {
        return $this->belongsTo(Karyawan::class);
    }

    public function pembayaranKasbons(): HasMany
    {
        return $this->hasMany(PembayaranKasbon::class);
    }
}
