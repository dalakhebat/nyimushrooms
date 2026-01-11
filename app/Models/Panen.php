<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Panen extends Model
{
    use HasFactory;

    protected $fillable = [
        'kumbung_id',
        'baglog_id',
        'tanggal',
        'berat_kg',
        'berat_layak_jual',
        'berat_reject',
        'catatan',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'berat_kg' => 'decimal:2',
        'berat_layak_jual' => 'decimal:2',
        'berat_reject' => 'decimal:2',
    ];

    public function kumbung(): BelongsTo
    {
        return $this->belongsTo(Kumbung::class);
    }

    public function baglog(): BelongsTo
    {
        return $this->belongsTo(Baglog::class);
    }

    public function stokJamur(): HasOne
    {
        return $this->hasOne(StokJamur::class);
    }
}
