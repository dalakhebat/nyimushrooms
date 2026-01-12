<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvestasiTransolido extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'tipe',
        'modal',
        'return_bulanan',
        'roi_tahunan',
        'tanggal_mulai',
        'status',
        'fase',
        'minggu_fase',
        'tanggal_mulai_fase',
        'siklus_ke',
        'keterangan',
    ];

    protected $casts = [
        'modal' => 'decimal:2',
        'return_bulanan' => 'decimal:2',
        'roi_tahunan' => 'decimal:2',
        'tanggal_mulai' => 'date',
        'tanggal_mulai_fase' => 'date',
    ];

    const FASE_LABELS = [
        'persiapan' => 'Persiapan Baglog',
        'inkubasi' => 'Inkubasi',
        'panen' => 'Panen Aktif',
        'istirahat' => 'Istirahat',
    ];

    const FASE_COLORS = [
        'persiapan' => 'blue',
        'inkubasi' => 'amber',
        'panen' => 'green',
        'istirahat' => 'gray',
    ];

    public function panens()
    {
        return $this->hasMany(PanenTransolido::class);
    }

    public static function getTotalModal()
    {
        return self::where('status', 'active')->sum('modal');
    }

    public static function getTotalReturnBulanan()
    {
        return self::where('status', 'active')->sum('return_bulanan');
    }

    public static function getAverageROI()
    {
        $total = self::where('status', 'active')->sum('modal');
        $return = self::where('status', 'active')->sum('return_bulanan');

        if ($total == 0) return 0;
        return ($return * 12 / $total) * 100;
    }
}
