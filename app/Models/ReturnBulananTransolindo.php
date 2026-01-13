<?php

namespace App\Models;

use App\Traits\EncryptsSensitiveData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReturnBulananTransolindo extends Model
{
    use HasFactory, EncryptsSensitiveData;

    protected $fillable = [
        'bulan',
        'jamur_kering',
        'share_transolindo',
        'share_defila',
        'kumbung',
        'total',
        'diterima',
        'tanggal_terima',
        'keterangan',
    ];

    // Fields that will be encrypted in database
    protected $encryptedFields = [
        'jamur_kering',
        'share_transolindo',
        'share_defila',
        'kumbung',
        'total',
    ];

    protected $casts = [
        'diterima' => 'boolean',
        'tanggal_terima' => 'date',
    ];

    // Calculate in PHP since encrypted fields can't be summed in SQL
    public static function getTotalDiterima()
    {
        return self::where('diterima', true)->get()->sum(function ($item) {
            return (float) $item->total;
        });
    }

    public static function getTotalShareTransolindo()
    {
        return self::where('diterima', true)->get()->sum(function ($item) {
            return (float) $item->share_transolindo;
        });
    }

    public static function getTotalKumbung()
    {
        return self::where('diterima', true)->get()->sum(function ($item) {
            return (float) $item->kumbung;
        });
    }

    public function getBulanFormattedAttribute()
    {
        $date = \Carbon\Carbon::createFromFormat('Y-m', $this->bulan);
        return $date->translatedFormat('M Y');
    }
}
