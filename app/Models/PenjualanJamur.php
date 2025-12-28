<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PenjualanJamur extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'tanggal',
        'berat_kg',
        'harga_per_kg',
        'total_harga',
        'status',
        'catatan',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'berat_kg' => 'decimal:2',
        'harga_per_kg' => 'decimal:2',
        'total_harga' => 'decimal:2',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
