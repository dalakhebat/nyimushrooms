<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KonfigurasiKeuangan extends Model
{
    use HasFactory;

    protected $fillable = [
        // Kredit Investasi
        'kredit_investasi_limit',
        'kredit_investasi_tenor',
        'kredit_investasi_bunga',

        // Kredit Modal Kerja
        'kredit_modal_kerja_limit',
        'kredit_modal_kerja_tenor',
        'kredit_modal_kerja_bunga',

        // Alokasi Dana
        'alokasi_pembangunan_kumbung',
        'alokasi_pembangunan_inkubasi',
        'alokasi_pembelian_bahan_baku',
        'alokasi_renovasi_kumbung',
        'alokasi_pembelian_mesin',
        'alokasi_pembelian_lahan',
        'alokasi_dana_cadangan',

        // Overhead
        'overhead_sewa',
        'overhead_listrik',
        'overhead_air',
        'overhead_telepon',
        'overhead_cicilan_kendaraan',
        'overhead_lainnya',

        // Harga
        'harga_jamur_per_kg',
        'harga_baglog_per_unit',

        // Target
        'target_profit_bulanan',
    ];

    protected $casts = [
        'kredit_investasi_limit' => 'decimal:2',
        'kredit_investasi_bunga' => 'decimal:2',
        'kredit_modal_kerja_limit' => 'decimal:2',
        'kredit_modal_kerja_bunga' => 'decimal:2',
        'alokasi_pembangunan_kumbung' => 'decimal:2',
        'alokasi_pembangunan_inkubasi' => 'decimal:2',
        'alokasi_pembelian_bahan_baku' => 'decimal:2',
        'alokasi_renovasi_kumbung' => 'decimal:2',
        'alokasi_pembelian_mesin' => 'decimal:2',
        'alokasi_pembelian_lahan' => 'decimal:2',
        'alokasi_dana_cadangan' => 'decimal:2',
        'overhead_sewa' => 'decimal:2',
        'overhead_listrik' => 'decimal:2',
        'overhead_air' => 'decimal:2',
        'overhead_telepon' => 'decimal:2',
        'overhead_cicilan_kendaraan' => 'decimal:2',
        'overhead_lainnya' => 'decimal:2',
        'harga_jamur_per_kg' => 'decimal:2',
        'harga_baglog_per_unit' => 'decimal:2',
        'target_profit_bulanan' => 'decimal:2',
    ];

    /**
     * Get or create the singleton configuration
     */
    public static function getConfig()
    {
        $config = self::first();
        if (!$config) {
            $config = self::create([]);
        }
        return $config;
    }

    /**
     * Calculate total alokasi
     */
    public function getTotalAlokasiAttribute()
    {
        return $this->alokasi_pembangunan_kumbung +
               $this->alokasi_pembangunan_inkubasi +
               $this->alokasi_pembelian_bahan_baku +
               $this->alokasi_renovasi_kumbung +
               $this->alokasi_pembelian_mesin +
               $this->alokasi_pembelian_lahan +
               $this->alokasi_dana_cadangan;
    }

    /**
     * Calculate sisa alokasi
     */
    public function getSisaAlokasiAttribute()
    {
        return $this->kredit_investasi_limit - $this->total_alokasi;
    }

    /**
     * Calculate total overhead
     */
    public function getTotalOverheadAttribute()
    {
        return $this->overhead_sewa +
               $this->overhead_listrik +
               $this->overhead_air +
               $this->overhead_telepon +
               $this->overhead_cicilan_kendaraan +
               $this->overhead_lainnya;
    }

    /**
     * Calculate cicilan kredit investasi (Aflopend - flat)
     */
    public function getCicilanInvestasiAttribute()
    {
        $pokok = $this->kredit_investasi_limit / $this->kredit_investasi_tenor;
        $bunga = ($this->kredit_investasi_limit * ($this->kredit_investasi_bunga / 100)) / 12;
        return $pokok + $bunga;
    }

    /**
     * Calculate bunga modal kerja per bulan (Revolving - bayar bunga saja)
     */
    public function getBungaModalKerjaAttribute()
    {
        return ($this->kredit_modal_kerja_limit * ($this->kredit_modal_kerja_bunga / 100)) / 12;
    }
}
