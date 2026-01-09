<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BahanBaku extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode',
        'nama',
        'satuan',
        'kategori',
        'stok',
        'stok_minimum',
        'harga_terakhir',
        'keterangan',
    ];

    protected $casts = [
        'harga_terakhir' => 'decimal:2',
    ];

    public function pembelians(): HasMany
    {
        return $this->hasMany(Pembelian::class);
    }

    public function stokMovements(): HasMany
    {
        return $this->hasMany(StokMovement::class);
    }

    public function isLowStock(): bool
    {
        return $this->stok <= $this->stok_minimum;
    }

    public static function generateKode(): string
    {
        $lastKode = self::orderBy('id', 'desc')->first()?->kode;
        if (!$lastKode) {
            return 'BB001';
        }
        $number = (int) substr($lastKode, 2) + 1;
        return 'BB' . str_pad($number, 3, '0', STR_PAD_LEFT);
    }
}
