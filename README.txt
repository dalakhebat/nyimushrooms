================================================================================
                    NYIMUSHROOM FARM MANAGEMENT SYSTEM
================================================================================

Aplikasi manajemen budidaya jamur tiram berbasis web menggunakan Laravel 12
dan React (Inertia.js).

================================================================================
                              REQUIREMENTS
================================================================================

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+
- Git

================================================================================
                              INSTALASI
================================================================================

1. Clone repository:
   git clone https://github.com/nyimushroom/nyimushroom.git
   cd nyimushroom

2. Install dependencies:
   composer install
   npm install

3. Setup environment:
   cp .env.example .env
   php artisan key:generate

4. Edit file .env, sesuaikan konfigurasi database:
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=nyimushroom
   DB_USERNAME=root
   DB_PASSWORD=

5. Buat database di MySQL:
   CREATE DATABASE nyimushroom;

6. Jalankan migration:
   php artisan migrate

7. Build assets:
   npm run build

8. Jalankan server:
   php artisan serve

9. Buka browser: http://localhost:8000

================================================================================
                              FITUR APLIKASI
================================================================================

1. DASHBOARD
   - Statistik panen harian & bulanan
   - Ringkasan keuangan (income/outcome)
   - Alert stok rendah & notifikasi
   - Quick actions

2. KUMBUNG
   - Data kumbung (rumah jamur)
   - Kapasitas baglog per kumbung

3. MONITORING KUMBUNG
   - Input suhu & kelembaban harian
   - Catatan kondisi kumbung

4. PANEN
   - Input data panen per kumbung
   - Tracking hasil panen

5. PRODUKSI
   a. Bahan Baku
      - Master data bahan baku (serbuk, dedak, jagung, plastik, dll)
      - Tracking stok dengan stok minimum
      - History pergerakan stok

   b. Pembelian Bahan Baku
      - CRUD pembelian dengan supplier
      - Otomatis update stok
      - Integrasi dengan kas

   c. Produksi Baglog
      - Workflow: Mixing -> Sterilisasi -> Inokulasi -> Inkubasi -> Selesai
      - Tracking pemakaian bahan baku

6. BAGLOG
   - Data baglog per kumbung
   - Status baglog

7. SDM (Sumber Daya Manusia)
   a. Data Karyawan
      - Master data karyawan

   b. Absensi Manual
      - Input absensi harian
      - Rekap absensi

   c. Absensi QR Code
      - Generate QR code harian (random tiap hari)
      - Scan QR untuk absen masuk/pulang
      - History scan

   d. KPI Karyawan
      - Skor kehadiran & ketepatan waktu
      - Peringkat karyawan terbaik

8. PENGGAJIAN
   - Input absensi mingguan
   - Proses gaji otomatis
   - Riwayat penggajian
   - Cetak slip gaji PDF

9. KASBON
   - Data kasbon karyawan
   - Tracking pembayaran

10. KAS / KEUANGAN
    - Transaksi kas masuk/keluar
    - Kategori: penjualan, pembelian, operasional, gaji, lainnya
    - Laporan bulanan per kategori

11. SUPPLIER
    - Master data supplier

12. CUSTOMER
    - Master data customer

13. PENJUALAN
    - Penjualan baglog
    - Penjualan jamur
    - Status: pending, lunas

14. LAPORAN
    - Laporan penjualan
    - Export PDF

15. NOTIFIKASI
    - Alert stok rendah
    - Reminder panen, gaji, dll
    - Mark as read

16. PENGATURAN GAJI
    - Konfigurasi upah per bagian

================================================================================
                           MENJALANKAN DEVELOPMENT
================================================================================

Terminal 1 (Backend):
   php artisan serve

Terminal 2 (Frontend dengan hot reload):
   npm run dev

================================================================================
                              BUILD PRODUCTION
================================================================================

   npm run build

================================================================================
                                TEKNOLOGI
================================================================================

Backend:
- Laravel 12.x
- PHP 8.2+
- MySQL 8.0+

Frontend:
- React 18.2
- Inertia.js 2.0
- Tailwind CSS 3.4
- Heroicons

Tools:
- Vite (build tool)
- DomPDF (generate PDF)

================================================================================
                                 KONTRIBUTOR
================================================================================

Nyimushroom Team

================================================================================
