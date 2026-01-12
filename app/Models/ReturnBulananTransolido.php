<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReturnBulananTransolido extends Model
{
    use HasFactory;

    protected $fillable = [
        'bulan',
        'jamur_kering',
        'share_transolido',
        'share_defila',
        'kumbung',
        'total',
        'diterima',
        'tanggal_terima',
        'keterangan',
    ];

    protected $casts = [
        'jamur_kering' => 'decimal:2',
        'share_transolido' => 'decimal:2',
        'share_defila' => 'decimal:2',
        'kumbung' => 'decimal:2',
        'total' => 'decimal:2',
        'diterima' => 'boolean',
        'tanggal_terima' => 'date',
    ];

    public static function getTotalDiterima()
    {
        return self::where('diterima', true)->sum('total');
    }

    public static function getTotalShareTransolido()
    {
        return self::where('diterima', true)->sum('share_transolido');
    }

    public static function getTotalKumbung()
    {
        return self::where('diterima', true)->sum('kumbung');
    }

    public function getBulanFormattedAttribute()
    {
        $date = \Carbon\Carbon::createFromFormat('Y-m', $this->bulan);
        return $date->translatedFormat('M Y');
    }
}
