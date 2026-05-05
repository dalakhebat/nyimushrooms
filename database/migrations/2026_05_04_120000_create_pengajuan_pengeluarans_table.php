<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengajuan_pengeluarans', function (Blueprint $table) {
            $table->id();
            $table->string('nomor')->unique();
            $table->date('tanggal_pengajuan');
            $table->foreignId('pemohon_id')->constrained('users')->cascadeOnDelete();
            $table->string('kategori');
            $table->decimal('jumlah', 15, 2);
            $table->string('tujuan_penerima');
            $table->text('keterangan');
            $table->string('lampiran_path')->nullable();
            $table->enum('status', ['diajukan', 'disetujui', 'ditolak', 'cair'])->default('diajukan');
            $table->text('ttd_pemohon')->nullable();
            $table->text('ttd_disetujui')->nullable();
            $table->foreignId('disetujui_oleh')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('disetujui_at')->nullable();
            $table->text('catatan_tolak')->nullable();
            $table->foreignId('kas_id')->nullable()->constrained('kas')->nullOnDelete();
            $table->timestamp('cair_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengajuan_pengeluarans');
    }
};
