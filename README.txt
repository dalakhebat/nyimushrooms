================================================================================
                         NYIMUSHROOM FARM MANAGEMENT SYSTEM
                              Status Project Update
                           Last Updated: 29 Desember 2025
================================================================================

TECH STACK
----------
- Backend  : Laravel 11
- Frontend : React + Inertia.js
- Styling  : Tailwind CSS
- Database : MySQL
- PDF      : barryvdh/laravel-dompdf

KONFIGURASI PENTING
-------------------
- Timezone : Asia/Jakarta (config/app.php)
- Locale   : id (Indonesia)
- PHP      : 8.2+


================================================================================
                              FITUR YANG SUDAH SELESAI
================================================================================

[✓] AUTHENTICATION
    - Login/Logout
    - Profile management

[✓] DASHBOARD
    - Overview statistics
    - Quick summary cards

[✓] KUMBUNG (Gudang Jamur)
    - CRUD lengkap
    - Status aktif/nonaktif
    - Kapasitas baglog

[✓] PANEN
    - Input panen harian per kumbung
    - History panen
    - CRUD lengkap

[✓] KARYAWAN
    - CRUD lengkap
    - Import dari CSV (148 karyawan sudah diimport)
    - Tipe gaji: mingguan, bulanan, borongan
    - Status aktif/nonaktif
    - Field: nama, no_hp, alamat, bagian, tanggal_masuk, nominal_gaji

[✓] ABSENSI
    - Input absensi harian
    - Input absensi mingguan (grid view Minggu-Sabtu)
      * Lokasi: /absensi/mingguan
      * Klik untuk toggle status: H → I → S → A → H
      * Filter by bagian & search nama
    - Rekap absensi bulanan/mingguan
    - Export PDF & Excel
    - Search/filter by nama karyawan

[✓] PENGGAJIAN
    - Proses gaji mingguan (Minggu-Sabtu, gajian hari Sabtu)
    - Proses gaji bulanan
    - Kalkulasi otomatis berdasarkan kehadiran
    - Potongan absensi (izin, sakit, alpha)
    - Integrasi dengan Kasbon (potongan otomatis)
    - Detail slip gaji dengan breakdown kehadiran per tanggal
    - Koreksi absensi langsung dari slip gaji (untuk status pending)
    - Export slip gaji ke PDF
    - Bayar bulk (pilih multiple, bayar sekaligus)
    - Hapus semua data penggajian (dengan kode konfirmasi: ikh123wan)
    - Dropdown menu navigasi:
      * Input Absensi Mingguan
      * Proses Gaji
      * Riwayat Penggajian

[✓] KASBON (Pinjaman Karyawan)
    - CRUD lengkap
    - Pembayaran kasbon
    - Auto-sync dengan penggajian pending
    - Potongan kasbon otomatis saat proses gaji

[✓] PENGATURAN GAJI
    - Konfigurasi persentase potongan per tipe (izin, sakit, alpha)
    - Setting per tipe gaji (mingguan, bulanan, borongan)

[✓] EXPORT & LAPORAN
    - Export absensi mingguan ke PDF (landscape, grid view)
    - Export absensi mingguan ke Excel/CSV
    - Export rekap absensi ke PDF
    - Export slip gaji ke PDF
    - Semua PDF menggunakan:
      * Timezone WIB (Asia/Jakarta)
      * Bahasa Indonesia (Des, Sen, Sel, dll)

[✓] UI/UX
    - Sidebar navigation dengan dropdown support
    - Responsive design
    - Warna tema hijau (#166534)


================================================================================
                              FITUR YANG BELUM SELESAI
================================================================================

[ ] BAGLOG
    - Tracking produksi baglog
    - Status: produksi/ditanam/dijual/selesai
    - Kode batch

[ ] SUPPLIER
    - CRUD supplier bahan baku
    - Data tukang kayu/serbuk

[ ] CUSTOMER
    - CRUD customer
    - Data pembeli baglog/jamur

[ ] PEMBELIAN BAHAN BAKU
    - Input pembelian dari supplier
    - Upload nota/gambar
    - History pembelian

[ ] PENJUALAN BAGLOG
    - Transaksi jual baglog ke customer
    - Status pembayaran

[ ] PENJUALAN JAMUR
    - Transaksi jual jamur hasil panen
    - Per kg / harga

[ ] TRANSAKSI KEUANGAN
    - Rekap income/outcome
    - Kategori transaksi

[ ] LAPORAN LENGKAP
    - Laporan panen (harian, bulanan, per kumbung)
    - Laporan keuangan (income vs outcome)
    - Grafik & Chart

[ ] OCR NOTA
    - Upload gambar nota tulisan tangan
    - Extract data dengan Google Vision API

[ ] IMPORT DATA
    - Import data lama dari Excel/CSV


================================================================================
                              CATATAN TEKNIS
================================================================================

PERIODE GAJI MINGGUAN
---------------------
- Minggu = hari pertama minggu
- Sabtu = hari terakhir minggu (hari gajian)
- Contoh: Minggu 1 Des - Sabtu 7 Des

KALKULASI GAJI
--------------
- Mingguan: nominal_gaji × jumlah_hadir
- Bulanan: nominal_gaji - potongan
- Borongan: input manual

POTONGAN ABSENSI (default, bisa diubah di Pengaturan Gaji)
----------------------------------------------------------
- Hadir: 0%
- Izin: 50%
- Sakit: 0%
- Alpha: 100%

DATABASE TABLES
---------------
- users
- kumbungs
- panens
- karyawans
- absensis
- penggajians
- kasbons
- pembayaran_kasbons
- pengaturan_gajis


================================================================================
                              CARA MENJALANKAN
================================================================================

1. Clone/Copy project ke PC baru

2. Install dependencies:
   composer install
   npm install

3. Copy .env.example ke .env, sesuaikan:
   - DB_DATABASE=nyimushroom
   - DB_USERNAME=root
   - DB_PASSWORD=

4. Generate key & migrate:
   php artisan key:generate
   php artisan migrate

5. Jalankan server:
   php artisan serve
   npm run dev

6. Akses: http://localhost:8000


================================================================================
                              RECENT UPDATES (Des 2025)
================================================================================

29 Des 2025:
- Fix timezone ke Asia/Jakarta (WIB)
- Fix locale ke Indonesia (id)
- Tambah export PDF & Excel untuk absensi mingguan
- Semua tanggal di PDF sekarang dalam Bahasa Indonesia

28 Des 2025:
- Sync periode minggu antara Input Absensi Mingguan & Proses Gaji
- Fix koreksi absensi agar update penggajian pending
- Extend kalender support tahun 2023-2026
- Tambah timestamp display di slip gaji

Sebelumnya:
- Import 148 karyawan dari CSV
- Implementasi kasbon dengan auto-sync ke penggajian
- Implementasi input absensi mingguan (grid view)
- Dropdown menu Penggajian di sidebar
- Hapus semua penggajian dengan kode konfirmasi


================================================================================
                              KONTAK & NOTES
================================================================================

Jika ada pertanyaan atau butuh klarifikasi, cek file-file berikut:
- routes/web.php - Semua route aplikasi
- app/Http/Controllers/ - Logic backend
- resources/js/Pages/ - Halaman frontend React
- resources/views/pdf/ - Template PDF

Kode konfirmasi hapus semua penggajian: ikh123wan

================================================================================
