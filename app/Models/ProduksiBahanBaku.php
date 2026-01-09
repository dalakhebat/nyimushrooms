<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProduksiBahanBaku extends Model
{
    use HasFactory;

    protected $fillable = [
        'produksi_baglog_id',
        'bahan_baku_id',
        'jumlah_digunakan',
    ];

    public function produksiBaglog(): BelongsTo
    {
        return $this->belongsTo(ProduksiBaglog::class);
    }

    public function bahanBaku(): BelongsTo
    {
        return $this->belongsTo(BahanBaku::class);
    }
}
