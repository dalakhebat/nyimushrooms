# Nyimushroom — Sistem Manajemen Budidaya Jamur Tiram

## Identitas Bisnis
- **Nama Perusahaan:** Defila Solusi Bersama
- **Dikelola oleh:** Transendensi Solusi Indonesia (Transolindo)
- **Industri:** Budidaya & produksi jamur tiram (oyster mushroom)
- **Brand Sistem:** Nyimushroom / Mycelium Pro

---

## Tech Stack
- **Backend:** Laravel 12 (PHP 8.2+)
- **Frontend:** React 18 + Inertia.js 2.0
- **Styling:** Tailwind CSS 3.2
- **Icons:** Flaticon Uicons (Regular Rounded + Solid Rounded)
- **Font:** Space Grotesk
- **Database:** SQLite (dev) / MySQL (prod)
- **PDF Export:** DomPDF
- **Build Tool:** Vite
- **Design System:** "Clinical Greenhouse" — clean blue-toned, no-border tonal layering, glass panels, clinical shadows

---

## Arsitektur Halaman

### Layout
- **AdminLayout** — Sidebar kiri (desktop 64w) + Top header (glass blur) + Content area
- **GuestLayout** — Untuk halaman auth (login, register, dll)
- Sidebar navigation diorganisir per section: Produksi, Budidaya, Sales, SDM, Keuangan, Sistem

---

## Alur Bisnis (Business Flow)

### 1. PRODUKSI BAGLOG
```
Supplier → Bahan Baku → Pembelian Bahan → Produksi Baglog → Stok Baglog
```

#### Supplier (`/supplier`)
- CRUD data supplier (nama, no_hp, alamat)
- Relasi ke pembelian bahan baku

#### Bahan Baku (`/bahan-baku`)
- Master data bahan baku (kode, nama, satuan, kategori, stok, stok_minimum, harga_terakhir)
- Alert otomatis ketika stok < stok_minimum
- Halaman movements (`/bahan-baku/{id}/movements`) untuk melihat riwayat keluar-masuk stok

#### Pembelian Bahan Baku (`/pembelian-bahan-baku`)
- CRUD pembelian dari supplier
- Fields: kode_transaksi, supplier, bahan_baku, tanggal, jumlah, harga_satuan, total_harga, status
- Status: pending → lunas (otomatis update stok bahan baku saat lunas)
- Otomatis catat StokMovement (tipe: masuk)

#### Produksi Baglog (`/produksi-baglog`)
- CRUD proses produksi baglog
- Fields: kode_produksi, tanggal, jumlah_baglog, tahap, waktu proses (mixing, sterilisasi, inokulasi), karyawan
- **Tahap produksi:** Mixing → Sterilisasi → Inokulasi → Inkubasi → Selesai
- Menggunakan bahan baku (ProduksiBahanBaku — many-to-many)
- Otomatis potong stok bahan baku

#### Stok Baglog (`/baglog`)
- Manajemen stok baglog yang sudah diproduksi
- Fields: kumbung, kode_batch, jumlah, tanggal_produksi, tanggal_tanam, status
- **Status baglog:** Produksi → Siap Tanam → Ditanam → Panen → Selesai → Rusak

---

### 2. BUDIDAYA & PANEN
```
Kumbung → Monitoring Harian → Panen → Stok Jamur
```

#### Kumbung (`/kumbung`)
- CRUD kumbung/rumah jamur
- Fields: nomor, nama, kapasitas_baglog, status, tanggal_mulai, biaya pembangunan, biaya baglog, total investasi, target panen, harga jual, umur baglog
- Show page (`/kumbung/{id}`) menampilkan detail lengkap + profitability calculator
- Profitability endpoint: `/kumbung/{id}/profitability`

#### Monitoring Kumbung (`/monitoring-kumbung`)
- CRUD monitoring harian per kumbung
- Fields: kumbung, tanggal, waktu, suhu, kelembaban, kondisi_baglog, sudah_spray, sudah_siram, catatan, karyawan
- Tracking kondisi lingkungan untuk optimasi hasil panen

#### Panen (`/panen`)
- CRUD data panen harian
- Fields: kumbung, baglog, tanggal, berat_kg, berat_layak_jual, berat_reject, catatan
- Otomatis update StokJamur (tipe: masuk)

---

### 3. PENJUALAN
```
Customer → Penjualan (Baglog / Jamur) → Kas Masuk
```

#### Customer (`/customer`)
- CRUD data customer (nama, no_hp, alamat)

#### Penjualan (`/penjualan`)
- **2 tab:** Penjualan Baglog & Penjualan Jamur
- Filter by status, search by customer
- Summary cards: total semua, total baglog, total jamur

#### Penjualan Baglog (`/penjualan/baglog/create`)
- Fields: customer, baglog, tanggal, jumlah_baglog, harga_satuan, total_harga, status, nota_image, catatan
- Status: pending → lunas
- Otomatis update stok baglog

#### Penjualan Jamur (`/penjualan/jamur/create`)
- Fields: customer, tanggal, berat_kg, harga_per_kg, total_harga, status, catatan
- Status: pending → lunas
- Otomatis update stok jamur (tipe: keluar)

---

### 4. SDM & PENGGAJIAN
```
Karyawan → Absensi (Harian/QR) → Penggajian → Kasbon
```

#### Karyawan (`/karyawan`)
- CRUD data karyawan
- Fields: nama, no_hp, pin, alamat, bagian, tanggal_masuk, tipe_gaji (harian/bulanan), nominal_gaji, status

#### Absensi Harian (`/absensi`)
- CRUD absensi manual
- Fields: karyawan, tanggal, status (hadir/izin/sakit/alpha), catatan
- Export: PDF & Excel

#### Absensi Mingguan (`/absensi/mingguan`)
- Input absensi bulk per minggu
- Export: PDF & Excel

#### QR Absensi (`/qr-absensi`)
- Generate QR code harian (`/qr-absensi/generate`)
- Scan QR admin (`/qr-absensi/scan`)
- Scan QR publik (`/absensi-publik`) — tanpa login, karyawan input PIN
- History scan (`/qr-absensi/history`)
- Fields scan: karyawan, tanggal, jam_masuk, jam_keluar, status, lokasi

#### Rekap Absensi (`/absensi/rekap`)
- Rekap per karyawan per bulan
- Export PDF

#### Penggajian (`/penggajian`)
- CRUD proses gaji
- Fields: karyawan, periode, jumlah hadir/izin/sakit/alpha, gaji_pokok, bonus, potongan, potongan_kasbon, total, status, tanggal_bayar
- Status: pending → dibayar
- Bayar individual atau bulk
- Export slip gaji PDF (`/penggajian/{id}/slip-pdf`)
- Delete all (`/penggajian/destroy-all`)

#### Pengaturan Gaji (`/pengaturan-gaji`)
- Konfigurasi persentase potongan per status absensi per tipe gaji

#### Kasbon (`/kasbon`)
- CRUD kasbon/pinjaman karyawan
- Fields: karyawan, tanggal, jumlah, sisa, keterangan, status
- Pembayaran kasbon (bisa potong dari gaji)
- Show page (`/kasbon/{id}`) untuk detail + riwayat pembayaran

#### KPI Karyawan (`/kpi`)
- Index: daftar karyawan + skor KPI
- Detail (`/kpi/{karyawan}`): breakdown KPI per karyawan

---

### 5. KEUANGAN
```
Kas (Masuk/Keluar) → Laporan → Perencanaan
```

#### Kas (`/kas`)
- CRUD transaksi kas
- Fields: kode_transaksi, tanggal, tipe (masuk/keluar), kategori, jumlah, keterangan, referensi
- Report (`/kas/report`): laporan kas per periode

#### Laporan (`/laporan`)
- Laporan komprehensif (panen, penjualan, keuangan)
- Export PDF

#### Simulasi Kredit (`/keuangan/simulasi-kredit`)
- Kalkulasi simulasi kredit investasi & modal kerja
- Konfigurasi limit, tenor, bunga

#### Target Operasional (`/keuangan/target-operasional`)
- Setting alokasi biaya (bahan baku, produksi, SDM, marketing, dll)
- Setting overhead (listrik, air, transportasi, dll)
- Target profit bulanan

#### Rekap Pembayaran (`/keuangan/rekap-pembayaran`)
- CRUD pembayaran kredit
- Fields: tanggal, periode, jumlah_pokok, jumlah_bunga, total, metode, bukti, nomor_referensi

#### Transolindo (`/keuangan/transolindo`)
- Modul investasi & return tracking dengan Transolindo
- **Sub-modul:**
  - Investasi: nama, tipe, modal, return_bulanan, roi, status, fase (encrypted data)
  - Return Bulanan: jamur_kering, share_transolindo, share_defila, kumbung, total (encrypted)
  - Panen Transolindo: volume, pendapatan, tabungan_baglog, profit (encrypted)
  - Kas Transolindo: tipe masuk/keluar, reimburse tracking (encrypted)
- **Fase tracking:** Inkubasi → Fruiting → Panen → Istirahat (siklus berulang)

---

### 6. SISTEM

#### Notifikasi (`/notifikasi`)
- List notifikasi (judul, pesan, tipe, kategori, link)
- Tipe: info, warning, danger, success
- Mark as read (individual / all)
- Delete (individual / all)

#### Dashboard (`/dashboard`)
- **Production Hub** — bento grid layout
- Hero card: total panen bulan ini (besar, span 8 kolom)
- Finance cards: income, outcome, saldo kas
- Operational cards: karyawan, produksi, monitoring, notifikasi
- Recent panen list
- Notifikasi panel
- Quick actions: Input Panen, Scan Absensi, Monitoring, Produksi, Transaksi Kas, Jual Jamur

---

## Database Models (33 total)

| Model | Tabel | Keterangan |
|-------|-------|------------|
| User | users | Akun admin (name, email, role) |
| Kumbung | kumbungs | Rumah jamur + data investasi |
| Baglog | baglogs | Media tanam jamur + status tracking |
| Panen | panens | Data panen harian per kumbung |
| StokJamur | stok_jamurs | Stok jamur masuk/keluar |
| BahanBaku | bahan_bakus | Master bahan baku + stok minimum alert |
| StokMovement | stok_movements | Riwayat keluar-masuk stok bahan baku |
| Supplier | suppliers | Data supplier |
| PembelianBahanBaku | pembelian_bahan_bakus | Pembelian bahan + auto update stok |
| ProduksiBaglog | produksi_baglogs | Proses produksi + tahap tracking |
| ProduksiBahanBaku | produksi_bahan_bakus | Pivot: bahan baku per produksi |
| MonitoringKumbung | monitoring_kumbungs | Monitoring suhu/kelembaban harian |
| Customer | customers | Data customer |
| PenjualanBaglog | penjualan_baglogs | Penjualan baglog ke customer |
| PenjualanJamur | penjualan_jamurs | Penjualan jamur ke customer |
| Karyawan | karyawans | Data karyawan + gaji config |
| Absensi | absensis | Absensi harian manual |
| QrAbsensi | qr_absensis | QR code harian |
| AbsensiScan | absensi_scans | Scan QR masuk/keluar |
| Penggajian | penggajians | Proses gaji + potongan |
| PengaturanGaji | pengaturan_gajis | Config potongan per status |
| Kasbon | kasbons | Pinjaman karyawan |
| PembayaranKasbon | pembayaran_kasbons | Cicilan kasbon |
| Kas | kas | Transaksi kas masuk/keluar |
| Transaksi | transaksis | Polymorphic transaksi log |
| Notifikasi | notifikasis | Sistem notifikasi |
| KonfigurasiKeuangan | konfigurasi_keuangans | Config kredit, alokasi, target |
| PembayaranKredit | pembayaran_kredits | Rekap pembayaran kredit |
| InvestasiTransolindo | investasi_transolandos | Investasi (encrypted) |
| ReturnBulananTransolindo | return_bulanan_transolandos | Return bulanan (encrypted) |
| PanenTransolindo | panen_transolandos | Panen Transolindo (encrypted) |
| KasTransolindo | kas_transolindo | Kas Transolindo (encrypted) |
| Pembelian | pembelians | Legacy pembelian |

---

## Fitur Khusus
- **Enkripsi AES-256-CBC** pada data finansial sensitif (Transolindo: modal, return, profit)
- **QR Code absensi** dengan halaman publik (tanpa login)
- **Batch operations** (bulk bayar gaji, bulk delete)
- **PDF export** (absensi, slip gaji, laporan)
- **Auto stok management** (pembelian → stok masuk, penjualan → stok keluar, produksi → stok potong)
- **Status workflow** (baglog: produksi→siap tanam→ditanam→panen→selesai)
- **Profitability calculator** per kumbung
- **Notifikasi otomatis** (stok rendah, reminder)

---

## Navigasi Sidebar

```
Dashboard
─── Produksi
    ├── Inventory
    │   ├── Supplier
    │   ├── Bahan Baku
    │   └── Pembelian Bahan
    ├── Produksi Baglog
    └── Stok Baglog
─── Budidaya
    ├── Kumbung
    ├── Monitoring
    └── Panen
─── Sales
    ├── Customer
    └── Penjualan
─── SDM
    ├── Karyawan
    ├── Absensi
    │   ├── Absensi Harian
    │   ├── Absensi Mingguan
    │   ├── QR Code
    │   └── Rekap Absensi
    ├── Penggajian
    │   ├── Proses Gaji
    │   ├── Riwayat Gaji
    │   └── Pengaturan Upah
    ├── Kasbon
    └── KPI Karyawan
─── Keuangan
    ├── Kas
    ├── Laporan
    └── Perencanaan
        ├── Simulasi Kredit
        ├── Target Operasional
        ├── Rekap Pembayaran
        └── Transolindo
─── Sistem
    └── Notifikasi
```
