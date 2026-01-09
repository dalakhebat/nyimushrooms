<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MonitoringKumbung extends Model
{
    use HasFactory;

    protected $fillable = [
        'kumbung_id',
        'tanggal',
        'waktu',
        'suhu',
        'kelembaban',
        'kondisi_baglog',
        'sudah_spray',
        'sudah_siram',
        'catatan',
        'karyawan_id',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'suhu' => 'decimal:2',
        'kelembaban' => 'decimal:2',
        'sudah_spray' => 'boolean',
        'sudah_siram' => 'boolean',
    ];

    public function kumbung(): BelongsTo
    {
        return $this->belongsTo(Kumbung::class);
    }

    public function karyawan(): BelongsTo
    {
        return $this->belongsTo(Karyawan::class);
    }

    public function getSuhuStatusAttribute(): string
    {
        if (!$this->suhu) return 'unknown';
        if ($this->suhu >= 24 && $this->suhu <= 28) return 'optimal';
        if ($this->suhu >= 20 && $this->suhu <= 32) return 'acceptable';
        return 'warning';
    }

    public function getKelembabanStatusAttribute(): string
    {
        if (!$this->kelembaban) return 'unknown';
        if ($this->kelembaban >= 80 && $this->kelembaban <= 90) return 'optimal';
        if ($this->kelembaban >= 70 && $this->kelembaban <= 95) return 'acceptable';
        return 'warning';
    }
}
