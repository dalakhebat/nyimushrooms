<?php

namespace App\Models;

use App\Traits\EncryptsSensitiveData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PanenTransolindo extends Model
{
    use HasFactory, EncryptsSensitiveData;

    protected $fillable = [
        'investasi_transolindo_id',
        'tanggal_mulai',
        'tanggal_selesai',
        'minggu_bulan',
        'volume_kg',
        'pendapatan_kotor',
        'tabungan_baglog',
        'profit',
        'keterangan',
    ];

    // Fields that will be encrypted in database
    protected $encryptedFields = [
        'volume_kg',
        'pendapatan_kotor',
        'tabungan_baglog',
        'profit',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
    ];

    public function investasi()
    {
        return $this->belongsTo(InvestasiTransolindo::class, 'investasi_transolindo_id');
    }

    // Calculate in PHP since encrypted fields can't be summed in SQL
    public static function getTotalVolume()
    {
        return self::all()->sum(function ($item) {
            return (float) $item->volume_kg;
        });
    }

    public static function getTotalPendapatan()
    {
        return self::all()->sum(function ($item) {
            return (float) $item->pendapatan_kotor;
        });
    }

    public static function getTotalProfit()
    {
        return self::all()->sum(function ($item) {
            return (float) $item->profit;
        });
    }

    public static function getAverageVolumePerWeek()
    {
        $items = self::all();
        $count = $items->count();
        if ($count == 0) return 0;

        $totalVolume = $items->sum(function ($item) {
            return (float) $item->volume_kg;
        });

        return $totalVolume / $count;
    }
}
