<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'no_hp',
        'alamat',
    ];

    public function penjualanBaglogs(): HasMany
    {
        return $this->hasMany(PenjualanBaglog::class);
    }

    public function penjualanJamurs(): HasMany
    {
        return $this->hasMany(PenjualanJamur::class);
    }
}
