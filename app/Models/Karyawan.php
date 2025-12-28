<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Karyawan extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'no_hp',
        'alamat',
        'bagian',
        'tanggal_masuk',
        'tipe_gaji',
        'nominal_gaji',
        'status',
    ];

    protected $casts = [
        'tanggal_masuk' => 'date',
        'nominal_gaji' => 'decimal:2',
    ];

    public function absensis(): HasMany
    {
        return $this->hasMany(Absensi::class);
    }

    public function penggajians(): HasMany
    {
        return $this->hasMany(Penggajian::class);
    }
}
