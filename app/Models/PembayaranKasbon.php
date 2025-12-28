<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PembayaranKasbon extends Model
{
    use HasFactory;

    protected $fillable = [
        'kasbon_id',
        'penggajian_id',
        'tanggal',
        'jumlah',
        'metode',
        'keterangan',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'jumlah' => 'decimal:2',
    ];

    public function kasbon(): BelongsTo
    {
        return $this->belongsTo(Kasbon::class);
    }

    public function penggajian(): BelongsTo
    {
        return $this->belongsTo(Penggajian::class);
    }
}
