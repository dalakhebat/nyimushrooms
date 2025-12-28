<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Panen extends Model
{
    use HasFactory;

    protected $fillable = [
        'kumbung_id',
        'tanggal',
        'berat_kg',
        'catatan',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'berat_kg' => 'decimal:2',
    ];

    public function kumbung(): BelongsTo
    {
        return $this->belongsTo(Kumbung::class);
    }
}
