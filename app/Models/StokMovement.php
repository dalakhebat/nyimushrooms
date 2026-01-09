<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StokMovement extends Model
{
    use HasFactory;

    protected $fillable = [
        'bahan_baku_id',
        'tipe',
        'jumlah',
        'stok_sebelum',
        'stok_sesudah',
        'referensi',
        'keterangan',
        'tanggal',
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];

    public function bahanBaku(): BelongsTo
    {
        return $this->belongsTo(BahanBaku::class);
    }
}
