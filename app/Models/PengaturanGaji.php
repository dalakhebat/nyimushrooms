<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PengaturanGaji extends Model
{
    use HasFactory;

    protected $fillable = [
        'tipe_gaji',
        'status_absensi',
        'persentase_potongan',
        'keterangan',
    ];

    protected $casts = [
        'persentase_potongan' => 'decimal:2',
    ];

    /**
     * Get pengaturan by tipe gaji
     */
    public static function getByTipeGaji(string $tipeGaji): array
    {
        return self::where('tipe_gaji', $tipeGaji)
            ->get()
            ->keyBy('status_absensi')
            ->toArray();
    }

    /**
     * Get all pengaturan grouped by tipe gaji
     */
    public static function getAllGrouped(): array
    {
        return self::all()
            ->groupBy('tipe_gaji')
            ->map(function ($items) {
                return $items->keyBy('status_absensi');
            })
            ->toArray();
    }
}
