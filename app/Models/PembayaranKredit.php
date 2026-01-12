<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PembayaranKredit extends Model
{
    use HasFactory;

    protected $fillable = [
        'tanggal_bayar',
        'periode_ke',
        'jumlah_pokok',
        'jumlah_bunga',
        'total_bayar',
        'metode_pembayaran',
        'bukti_pembayaran',
        'nomor_referensi',
        'keterangan',
        'user_id',
    ];

    protected $casts = [
        'tanggal_bayar' => 'date',
        'jumlah_pokok' => 'decimal:2',
        'jumlah_bunga' => 'decimal:2',
        'total_bayar' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
