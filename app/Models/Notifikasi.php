<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notifikasi extends Model
{
    use HasFactory;

    protected $fillable = [
        'judul',
        'pesan',
        'tipe',
        'kategori',
        'link',
        'is_read',
        'read_at',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime',
    ];

    public function markAsRead(): void
    {
        $this->update([
            'is_read' => true,
            'read_at' => now(),
        ]);
    }

    public static function createStokAlert(BahanBaku $bahanBaku): self
    {
        return self::create([
            'judul' => 'Stok Menipis',
            'pesan' => "Stok {$bahanBaku->nama} tinggal {$bahanBaku->stok} {$bahanBaku->satuan}. Segera lakukan pembelian!",
            'tipe' => 'warning',
            'kategori' => 'stok',
            'link' => '/bahan-baku',
        ]);
    }

    public static function createPanenReminder(Baglog $baglog): self
    {
        return self::create([
            'judul' => 'Reminder Panen',
            'pesan' => "Baglog batch {$baglog->kode_batch} sudah mendekati waktu panen.",
            'tipe' => 'info',
            'kategori' => 'panen',
            'link' => '/baglog',
        ]);
    }

    public static function createGajiReminder(): self
    {
        return self::create([
            'judul' => 'Reminder Penggajian',
            'pesan' => "Waktunya proses penggajian karyawan untuk periode ini.",
            'tipe' => 'info',
            'kategori' => 'gaji',
            'link' => '/penggajian/create',
        ]);
    }

    public static function getUnreadCount(): int
    {
        return self::where('is_read', false)->count();
    }
}
