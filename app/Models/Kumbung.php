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
        'biaya_pembangunan',
        'biaya_baglog',
        'total_investasi',
        'target_panen_kg',
        'harga_jual_per_kg',
        'umur_baglog_bulan',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'biaya_pembangunan' => 'decimal:2',
        'biaya_baglog' => 'decimal:2',
        'total_investasi' => 'decimal:2',
        'target_panen_kg' => 'decimal:2',
        'harga_jual_per_kg' => 'decimal:2',
    ];

    public function baglogs(): HasMany
    {
        return $this->hasMany(Baglog::class);
    }

    public function panens(): HasMany
    {
        return $this->hasMany(Panen::class);
    }

    public function stokJamurs(): HasMany
    {
        return $this->hasMany(StokJamur::class);
    }

    public function getUmurAttribute(): ?int
    {
        if (!$this->tanggal_mulai) {
            return null;
        }
        return $this->tanggal_mulai->diffInDays(now());
    }

    /**
     * Get jumlah baglog aktif di kumbung ini
     */
    public function getBaglogAktifAttribute(): int
    {
        return $this->baglogs()->where('status', 'masuk_kumbung')->sum('jumlah');
    }

    /**
     * Get kapasitas tersedia
     */
    public function getKapasitasTersediaAttribute(): int
    {
        return $this->kapasitas_baglog - $this->baglog_aktif;
    }

    /**
     * Get total panen (kg) dari kumbung ini
     */
    public function getTotalPanenAttribute(): float
    {
        return $this->panens()->sum('berat_layak_jual');
    }

    /**
     * Get pendapatan dari panen kumbung ini (harga jual x total panen)
     */
    public function getPendapatanPanenAttribute(): float
    {
        return $this->total_panen * ($this->harga_jual_per_kg ?? 15000);
    }

    /**
     * Get ROI (Return on Investment) percentage
     * ROI = ((Pendapatan - Investasi) / Investasi) * 100
     */
    public function getRoiAttribute(): ?float
    {
        if (!$this->total_investasi || $this->total_investasi <= 0) {
            return null;
        }
        return (($this->pendapatan_panen - $this->total_investasi) / $this->total_investasi) * 100;
    }

    /**
     * Get progress target panen (percentage)
     */
    public function getProgressTargetAttribute(): ?float
    {
        if (!$this->target_panen_kg || $this->target_panen_kg <= 0) {
            return null;
        }
        return ($this->total_panen / $this->target_panen_kg) * 100;
    }

    /**
     * Get sisa panen yang dibutuhkan untuk BEP (Break Even Point)
     */
    public function getSisaTargetBepAttribute(): float
    {
        if (!$this->total_investasi || !$this->harga_jual_per_kg) {
            return 0;
        }
        $targetBep = $this->total_investasi / $this->harga_jual_per_kg;
        $sisa = $targetBep - $this->total_panen;
        return max(0, $sisa);
    }

    /**
     * Calculate estimated profit based on capacity and standard yield
     * Assumes 0.3kg yield per baglog per cycle (5 months)
     */
    public function getEstimasiProfitAttribute(): array
    {
        $yieldPerBaglog = 0.3; // kg per baglog per 5 bulan
        $cyclesPerYear = 12 / ($this->umur_baglog_bulan ?? 5);

        $estimasiPanenPerCycle = $this->kapasitas_baglog * $yieldPerBaglog;
        $estimasiPanenPerTahun = $estimasiPanenPerCycle * $cyclesPerYear;
        $estimasiPendapatanPerTahun = $estimasiPanenPerTahun * ($this->harga_jual_per_kg ?? 15000);

        return [
            'panen_per_cycle' => $estimasiPanenPerCycle,
            'panen_per_tahun' => $estimasiPanenPerTahun,
            'pendapatan_per_tahun' => $estimasiPendapatanPerTahun,
            'waktu_bep_bulan' => $this->total_investasi > 0
                ? ($this->total_investasi / ($estimasiPendapatanPerTahun / 12))
                : 0,
        ];
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
