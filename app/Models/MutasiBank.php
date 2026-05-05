<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MutasiBank extends Model
{
    use HasFactory;

    protected $fillable = [
        'rekening',
        'bank',
        'tanggal',
        'jam',
        'journal_no',
        'deskripsi',
        'nominal',
        'tipe',
        'saldo',
        'kategori',
        'counterparty',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'nominal' => 'decimal:2',
        'saldo' => 'decimal:2',
    ];

    public function scopeDebit($query)
    {
        return $query->where('tipe', 'D');
    }

    public function scopeKredit($query)
    {
        return $query->where('tipe', 'C');
    }

    public function scopeForRekening($query, string $rekening)
    {
        return $query->where('rekening', $rekening);
    }
}
