<?php

namespace App\Models;

use App\Traits\EncryptsSensitiveData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvestasiTransolindo extends Model
{
    use HasFactory, EncryptsSensitiveData;

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

    // Fields that will be encrypted in database
    protected $encryptedFields = [
        'modal',
        'return_bulanan',
        'roi_tahunan',
    ];

    protected $casts = [
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
        return $this->hasMany(PanenTransolindo::class);
    }

    // Calculate in PHP since encrypted fields can't be summed in SQL
    public static function getTotalModal()
    {
        return self::where('status', 'active')->get()->sum(function ($item) {
            return (float) $item->modal;
        });
    }

    public static function getTotalReturnBulanan()
    {
        return self::where('status', 'active')->get()->sum(function ($item) {
            return (float) $item->return_bulanan;
        });
    }

    public static function getAverageROI()
    {
        $items = self::where('status', 'active')->get();
        $total = $items->sum(function ($item) {
            return (float) $item->modal;
        });
        $return = $items->sum(function ($item) {
            return (float) $item->return_bulanan;
        });

        if ($total == 0) return 0;
        return ($return * 12 / $total) * 100;
    }
}
