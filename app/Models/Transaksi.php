<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Transaksi extends Model
{
    use HasFactory;

    protected $fillable = [
        'tipe',
        'kategori',
        'referensi_id',
        'referensi_tipe',
        'tanggal',
        'jumlah',
        'keterangan',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'jumlah' => 'decimal:2',
    ];

    public function referensi(): MorphTo
    {
        return $this->morphTo('referensi', 'referensi_tipe', 'referensi_id');
    }

    public function scopeIncome($query)
    {
        return $query->where('tipe', 'income');
    }

    public function scopeOutcome($query)
    {
        return $query->where('tipe', 'outcome');
    }
}
