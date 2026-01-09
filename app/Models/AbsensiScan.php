<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AbsensiScan extends Model
{
    use HasFactory;

    protected $fillable = [
        'karyawan_id',
        'qr_absensi_id',
        'tanggal',
        'jam_masuk',
        'jam_keluar',
        'status',
        'lokasi_masuk',
        'lokasi_keluar',
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];

    public function karyawan(): BelongsTo
    {
        return $this->belongsTo(Karyawan::class);
    }

    public function qrAbsensi(): BelongsTo
    {
        return $this->belongsTo(QrAbsensi::class);
    }

    public function getDurasiKerjaAttribute(): ?string
    {
        if (!$this->jam_masuk || !$this->jam_keluar) return null;

        $masuk = \Carbon\Carbon::parse($this->jam_masuk);
        $keluar = \Carbon\Carbon::parse($this->jam_keluar);
        $diff = $masuk->diff($keluar);

        return $diff->format('%H jam %I menit');
    }

    public function getDurasiMenitAttribute(): ?int
    {
        if (!$this->jam_masuk || !$this->jam_keluar) return null;

        $masuk = \Carbon\Carbon::parse($this->jam_masuk);
        $keluar = \Carbon\Carbon::parse($this->jam_keluar);

        return $masuk->diffInMinutes($keluar);
    }
}
