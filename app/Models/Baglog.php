<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Baglog extends Model
{
    use HasFactory;

    protected $fillable = [
        'kumbung_id',
        'kode_batch',
        'sumber',
        'supplier_nama',
        'harga_satuan',
        'jumlah',
        'tanggal_produksi',
        'tanggal_tanam',
        'tanggal_estimasi_selesai',
        'status',
    ];

    protected $casts = [
        'tanggal_produksi' => 'date',
        'tanggal_tanam' => 'date',
        'tanggal_estimasi_selesai' => 'date',
        'harga_satuan' => 'decimal:2',
    ];

    public function kumbung(): BelongsTo
    {
        return $this->belongsTo(Kumbung::class);
    }
}
