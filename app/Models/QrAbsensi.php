<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class QrAbsensi extends Model
{
    use HasFactory;

    protected $fillable = [
        'tanggal',
        'kode_qr',
        'berlaku_mulai',
        'berlaku_sampai',
        'is_active',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'is_active' => 'boolean',
    ];

    public function absensiScans(): HasMany
    {
        return $this->hasMany(AbsensiScan::class);
    }

    public static function generateForToday(): self
    {
        $today = now()->toDateString();

        // Check if QR for today already exists
        $existing = self::where('tanggal', $today)->first();
        if ($existing) {
            return $existing;
        }

        // Generate new unique QR code
        $kodeQr = strtoupper(Str::random(8)) . '-' . now()->format('dmY') . '-' . strtoupper(Str::random(4));

        return self::create([
            'tanggal' => $today,
            'kode_qr' => $kodeQr,
            'berlaku_mulai' => '06:00:00',
            'berlaku_sampai' => '23:59:59',
            'is_active' => true,
        ]);
    }

    public function isValid(): bool
    {
        if (!$this->is_active) return false;
        if ($this->tanggal->toDateString() !== now()->toDateString()) return false;

        $now = now()->format('H:i:s');
        return $now >= $this->berlaku_mulai && $now <= $this->berlaku_sampai;
    }
}
