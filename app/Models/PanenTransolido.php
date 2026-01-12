<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PanenTransolido extends Model
{
    use HasFactory;

    protected $fillable = [
        'investasi_transolido_id',
        'tanggal_mulai',
        'tanggal_selesai',
        'minggu_bulan',
        'volume_kg',
        'pendapatan_kotor',
        'tabungan_baglog',
        'profit',
        'keterangan',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'volume_kg' => 'decimal:2',
        'pendapatan_kotor' => 'decimal:2',
        'tabungan_baglog' => 'decimal:2',
        'profit' => 'decimal:2',
    ];

    public function investasi()
    {
        return $this->belongsTo(InvestasiTransolido::class, 'investasi_transolido_id');
    }

    public static function getTotalVolume()
    {
        return self::sum('volume_kg');
    }

    public static function getTotalPendapatan()
    {
        return self::sum('pendapatan_kotor');
    }

    public static function getTotalProfit()
    {
        return self::sum('profit');
    }

    public static function getAverageVolumePerWeek()
    {
        $count = self::count();
        if ($count == 0) return 0;
        return self::sum('volume_kg') / $count;
    }
}
