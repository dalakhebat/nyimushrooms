<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PenjualanBaglog extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'tanggal',
        'jumlah_baglog',
        'harga_satuan',
        'total_harga',
        'status',
        'nota_image',
        'catatan',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'harga_satuan' => 'decimal:2',
        'total_harga' => 'decimal:2',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
