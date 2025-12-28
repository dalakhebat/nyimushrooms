<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kumbung extends Model
{
    use HasFactory;

    protected $fillable = [
        'nomor',
        'nama',
        'kapasitas_baglog',
        'status',
        'tanggal_mulai',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
    ];

    public function baglogs(): HasMany
    {
        return $this->hasMany(Baglog::class);
    }

    public function panens(): HasMany
    {
        return $this->hasMany(Panen::class);
    }

    public function getUmurAttribute(): ?int
    {
        if (!$this->tanggal_mulai) {
            return null;
        }
        return $this->tanggal_mulai->diffInDays(now());
    }

    /**
     * Generate nomor kumbung berikutnya (re-use nomor kosong)
     */
    public static function generateNomor(): string
    {
        // Ambil semua nomor yang sudah ada
        $existingNomors = self::pluck('nomor')->toArray();

        // Extract angka dari nomor (K001 -> 1, K002 -> 2, dst)
        $usedNumbers = [];
        foreach ($existingNomors as $nomor) {
            if (preg_match('/K(\d+)/', $nomor, $matches)) {
                $usedNumbers[] = (int) $matches[1];
            }
        }

        // Cari nomor terkecil yang belum dipakai
        $nextNumber = 1;
        while (in_array($nextNumber, $usedNumbers)) {
            $nextNumber++;
        }

        // Format: K001, K002, dst
        return 'K' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
    }
}
