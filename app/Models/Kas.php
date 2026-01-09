<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kas extends Model
{
    use HasFactory;

    protected $table = 'kas';

    protected $fillable = [
        'kode_transaksi',
        'tanggal',
        'tipe',
        'kategori',
        'jumlah',
        'keterangan',
        'referensi',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'jumlah' => 'decimal:2',
    ];

    public static function generateKode(): string
    {
        $today = now()->format('Ymd');
        $lastKode = self::where('kode_transaksi', 'like', "KAS{$today}%")
            ->orderBy('id', 'desc')
            ->first()?->kode_transaksi;

        if (!$lastKode) {
            return "KAS{$today}001";
        }
        $number = (int) substr($lastKode, -3) + 1;
        return "KAS{$today}" . str_pad($number, 3, '0', STR_PAD_LEFT);
    }

    public static function getSaldo(): float
    {
        $masuk = self::where('tipe', 'masuk')->sum('jumlah');
        $keluar = self::where('tipe', 'keluar')->sum('jumlah');
        return $masuk - $keluar;
    }

    public static function getSaldoBulanIni(): array
    {
        $startOfMonth = now()->startOfMonth();
        $endOfMonth = now()->endOfMonth();

        $masuk = self::where('tipe', 'masuk')
            ->whereBetween('tanggal', [$startOfMonth, $endOfMonth])
            ->sum('jumlah');

        $keluar = self::where('tipe', 'keluar')
            ->whereBetween('tanggal', [$startOfMonth, $endOfMonth])
            ->sum('jumlah');

        return [
            'masuk' => $masuk,
            'keluar' => $keluar,
            'saldo' => $masuk - $keluar,
        ];
    }
}
