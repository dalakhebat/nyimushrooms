<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PengajuanPengeluaran extends Model
{
    use HasFactory;

    protected $fillable = [
        'nomor',
        'tanggal_pengajuan',
        'pemohon_id',
        'pemohon_nama',
        'kategori',
        'jumlah',
        'tujuan_penerima',
        'keterangan',
        'lampiran_path',
        'status',
        'ttd_pemohon',
        'ttd_disetujui',
        'disetujui_oleh',
        'disetujui_at',
        'catatan_tolak',
        'kas_id',
        'cair_at',
    ];

    protected $appends = ['nama_pemohon_display'];

    public function getNamaPemohonDisplayAttribute(): string
    {
        return $this->pemohon?->name ?? $this->pemohon_nama ?? '-';
    }

    protected $casts = [
        'tanggal_pengajuan' => 'date',
        'jumlah' => 'decimal:2',
        'disetujui_at' => 'datetime',
        'cair_at' => 'datetime',
    ];

    public function pemohon()
    {
        return $this->belongsTo(User::class, 'pemohon_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'disetujui_oleh');
    }

    public function kas()
    {
        return $this->belongsTo(Kas::class, 'kas_id');
    }

    public static function generateNomor(): string
    {
        $year = now()->format('Y');
        $last = self::where('nomor', 'like', "PENG-{$year}-%")
            ->orderBy('id', 'desc')
            ->first()?->nomor;

        if (!$last) {
            return "PENG-{$year}-0001";
        }

        $number = (int) substr($last, -4) + 1;
        return "PENG-{$year}-" . str_pad($number, 4, '0', STR_PAD_LEFT);
    }
}
