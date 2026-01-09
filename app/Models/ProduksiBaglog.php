<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProduksiBaglog extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_produksi',
        'tanggal',
        'jumlah_baglog',
        'tahap',
        'waktu_mixing',
        'waktu_sterilisasi_mulai',
        'waktu_sterilisasi_selesai',
        'waktu_inokulasi',
        'karyawan_id',
        'catatan',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'waktu_mixing' => 'datetime',
        'waktu_sterilisasi_mulai' => 'datetime',
        'waktu_sterilisasi_selesai' => 'datetime',
        'waktu_inokulasi' => 'datetime',
    ];

    public function karyawan(): BelongsTo
    {
        return $this->belongsTo(Karyawan::class);
    }

    public function bahanBakus(): HasMany
    {
        return $this->hasMany(ProduksiBahanBaku::class);
    }

    public static function generateKode(): string
    {
        $today = now()->format('Ymd');
        $lastKode = self::where('kode_produksi', 'like', "PRD{$today}%")
            ->orderBy('id', 'desc')
            ->first()?->kode_produksi;

        if (!$lastKode) {
            return "PRD{$today}001";
        }
        $number = (int) substr($lastKode, -3) + 1;
        return "PRD{$today}" . str_pad($number, 3, '0', STR_PAD_LEFT);
    }

    public function getTahapBadgeAttribute(): array
    {
        $badges = [
            'mixing' => ['color' => 'blue', 'label' => 'Mixing'],
            'sterilisasi' => ['color' => 'yellow', 'label' => 'Sterilisasi'],
            'inokulasi' => ['color' => 'purple', 'label' => 'Inokulasi'],
            'inkubasi' => ['color' => 'orange', 'label' => 'Inkubasi'],
            'selesai' => ['color' => 'green', 'label' => 'Selesai'],
        ];
        return $badges[$this->tahap] ?? ['color' => 'gray', 'label' => $this->tahap];
    }
}
