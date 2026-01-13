# Workflow Sistem Manajemen Budidaya Jamur Tiram (Nyimushroom)

## Overview
Sistem ini mengelola seluruh proses budidaya jamur tiram dari produksi baglog hingga penjualan, termasuk manajemen SDM dan keuangan.

---

## 1. WORKFLOW PRODUKSI BAGLOG

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ALUR PRODUKSI BAGLOG                                │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │ BAHAN BAKU   │ ◄── Pembelian dari Supplier
    │ (Stok)       │     • Serbuk kayu, bekatul, kapur, dll
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │   MIXING     │ ◄── Tahap 1: Pencampuran bahan
    │  (Produksi)  │     • Input: Bahan baku + jumlah baglog
    └──────┬───────┘     • Output: Kode produksi (PRD20260112001)
           │              • Stok bahan baku otomatis berkurang
           ▼
    ┌──────────────┐
    │ STERILISASI  │ ◄── Tahap 2: Sterilisasi baglog
    │              │     • Catat waktu mulai & selesai
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │  INOKULASI   │ ◄── Tahap 3: Penanaman bibit
    │              │     • Catat waktu inokulasi
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │   INKUBASI   │ ◄── Tahap 4: Masa inkubasi miselium
    │              │     • Monitoring suhu & kelembaban
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │   SELESAI    │ ◄── Tahap 5: Baglog siap
    │              │     • Bisa masuk kumbung atau dijual
    └──────┬───────┘
           │
           ├─────────────────┬─────────────────┐
           ▼                 ▼                 ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │MASUK KUMBUNG │  │    DIJUAL    │  │   SELESAI    │
    │  (Budidaya)  │  │   (Export)   │  │   (Rusak)    │
    └──────────────┘  └──────────────┘  └──────────────┘
```

### Status Baglog:
| Status | Deskripsi |
|--------|-----------|
| `produksi` | Sedang dalam proses produksi |
| `inkubasi` | Masa inkubasi miselium |
| `pembibitan` | Masa pembibitan |
| `masuk_kumbung` | Sudah di kumbung, siap panen |
| `dijual` | Dijual sebagai baglog |
| `selesai` | Siklus selesai |

---

## 2. WORKFLOW BUDIDAYA & PANEN

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ALUR BUDIDAYA & PANEN                               │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │   KUMBUNG    │ ◄── Setup kumbung baru
    │   (Setup)    │     • Nomor: K001, K002, dst
    └──────┬───────┘     • Kapasitas baglog
           │              • Data investasi (biaya pembangunan, target ROI)
           ▼
    ┌──────────────┐
    │ ALOKASI      │ ◄── Baglog masuk ke kumbung
    │ BAGLOG       │     • Pilih baglog status 'selesai'
    └──────┬───────┘     • Update status → 'masuk_kumbung'
           │
           ▼
    ┌──────────────┐
    │  MONITORING  │ ◄── Monitoring harian
    │  KUMBUNG     │     • Catat suhu & kelembaban
    └──────┬───────┘     • Catatan kondisi
           │
           ▼
    ┌──────────────┐
    │    PANEN     │ ◄── Pencatatan hasil panen
    │              │     • Berat total (kg)
    └──────┬───────┘     • Berat layak jual
           │              • Berat reject
           ▼
    ┌──────────────┐
    │ STOK JAMUR   │ ◄── Otomatis masuk stok
    │   (Masuk)    │     • Hanya berat layak jual
    └──────────────┘     • Siap untuk dijual
```

### Perhitungan ROI Kumbung:
```
Total Investasi = Biaya Pembangunan + (Jumlah Baglog × Biaya per Baglog)
Pendapatan      = Total Panen × Harga Jual per Kg
ROI (%)         = ((Pendapatan - Total Investasi) / Total Investasi) × 100
```

---

## 3. WORKFLOW PENJUALAN

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ALUR PENJUALAN                                    │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────────────┐
                    │           PENJUALAN                 │
                    └─────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
            ┌──────────────┐               ┌──────────────┐
            │  PENJUALAN   │               │  PENJUALAN   │
            │    BAGLOG    │               │    JAMUR     │
            └──────┬───────┘               └──────┬───────┘
                   │                               │
                   ▼                               ▼
            ┌──────────────┐               ┌──────────────┐
            │ • Customer   │               │ • Customer   │
            │ • Jumlah     │               │ • Berat (kg) │
            │ • Harga/unit │               │ • Harga/kg   │
            │ • Total      │               │ • Total      │
            └──────┬───────┘               └──────┬───────┘
                   │                               │
                   ▼                               ▼
            ┌──────────────┐               ┌──────────────┐
            │ Update Stok  │               │ Update Stok  │
            │ Baglog       │               │ Jamur (-)    │
            └──────┬───────┘               └──────┬───────┘
                   │                               │
                   └───────────────┬───────────────┘
                                   ▼
                           ┌──────────────┐
                           │   KAS        │
                           │  (Masuk)     │ ◄── Otomatis tercatat
                           └──────────────┘
```

### Status Penjualan:
| Status | Deskripsi |
|--------|-----------|
| `pending` | Belum lunas |
| `lunas` | Sudah dibayar |

---

## 4. WORKFLOW SDM & PENGGAJIAN

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ALUR SDM & PENGGAJIAN                                │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │  KARYAWAN    │ ◄── Data master karyawan
    │  (Master)    │     • Nama, No HP, Alamat
    └──────┬───────┘     • Bagian (produksi, panen, dll)
           │              • Tipe gaji (harian/mingguan/bulanan)
           │              • PIN untuk absensi QR
           │
           ├─────────────────────────────────────┐
           ▼                                     ▼
    ┌──────────────┐                     ┌──────────────┐
    │   ABSENSI    │                     │  ABSENSI QR  │
    │   MANUAL     │                     │   (Scan)     │
    └──────┬───────┘                     └──────┬───────┘
           │                                     │
           │ • Hadir/Izin/Sakit/Alpha           │ • Scan masuk (PIN)
           │ • Input per tanggal                │ • Scan pulang
           │                                     │ • QR code berubah tiap hari
           │                                     │
           └─────────────────┬───────────────────┘
                             ▼
                     ┌──────────────┐
                     │    REKAP     │ ◄── Rekap otomatis
                     │   ABSENSI    │     • Per periode
                     └──────┬───────┘     • Export PDF/Excel
                            │
                            ▼
    ┌──────────────┐ ┌──────────────┐
    │   KASBON     │ │  PENGATURAN  │
    │  (Pinjaman)  │ │    GAJI      │
    └──────┬───────┘ └──────┬───────┘
           │                │
           │ Potongan       │ Upah per bagian
           │                │
           └────────┬───────┘
                    ▼
            ┌──────────────┐
            │  PENGGAJIAN  │ ◄── Proses gaji
            │              │
            └──────┬───────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
    ▼              ▼              ▼
┌────────┐  ┌────────────┐  ┌────────────┐
│ Gaji   │  │  Bonus     │  │ Potongan   │
│ Pokok  │  │            │  │ (Kasbon)   │
└────────┘  └────────────┘  └────────────┘
    │              │              │
    └──────────────┼──────────────┘
                   ▼
           ┌──────────────┐
           │    TOTAL     │
           │    GAJI      │
           └──────┬───────┘
                  │
                  ├─────────────────┐
                  ▼                 ▼
          ┌──────────────┐  ┌──────────────┐
          │    BAYAR     │  │   SLIP PDF   │
          │   (Bulk)     │  │   (Export)   │
          └──────┬───────┘  └──────────────┘
                 │
                 ▼
          ┌──────────────┐
          │   KAS        │
          │  (Keluar)    │ ◄── Otomatis tercatat
          └──────────────┘
```

### Formula Penggajian:
```
Gaji Pokok = Jumlah Hadir × Upah Harian (sesuai bagian)
Total Gaji = Gaji Pokok + Bonus - Potongan - Potongan Kasbon
```

### Tipe Absensi:
| Status | Deskripsi |
|--------|-----------|
| `hadir` | Masuk kerja |
| `izin` | Tidak masuk dengan izin |
| `sakit` | Tidak masuk karena sakit |
| `alpha` | Tidak masuk tanpa keterangan |

---

## 5. WORKFLOW INVENTORY (BAHAN BAKU)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ALUR INVENTORY BAHAN BAKU                            │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │   SUPPLIER   │ ◄── Data supplier
    │   (Master)   │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │  PEMBELIAN   │ ◄── Order bahan baku
    │  BAHAN BAKU  │     • Pilih supplier
    └──────┬───────┘     • Item + jumlah + harga
           │
           ▼
    ┌──────────────┐
    │ STOK MASUK   │ ◄── Stok otomatis bertambah
    │              │     • StokMovement (tipe: masuk)
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │ BAHAN BAKU   │ ◄── Stok tersedia
    │   (Stok)     │     • Kode: BB001, BB002, dst
    └──────┬───────┘     • Stok minimum (alert)
           │
           ▼
    ┌──────────────┐
    │  PRODUKSI    │ ◄── Digunakan untuk produksi
    │   BAGLOG     │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │ STOK KELUAR  │ ◄── Stok otomatis berkurang
    │              │     • StokMovement (tipe: keluar)
    └──────────────┘


    ┌─────────────────────────────────────┐
    │         ALERT STOK MINIMUM          │
    │                                     │
    │  Jika stok < stok_minimum:          │
    │  → Notifikasi otomatis muncul       │
    └─────────────────────────────────────┘
```

---

## 6. WORKFLOW KEUANGAN (KAS)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ALUR KAS / KEUANGAN                               │
└─────────────────────────────────────────────────────────────────────────────┘

                        ┌──────────────┐
                        │     KAS      │
                        │   (Ledger)   │
                        └──────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            ▼                                     ▼
    ┌──────────────┐                     ┌──────────────┐
    │  KAS MASUK   │                     │  KAS KELUAR  │
    │   (Income)   │                     │  (Expense)   │
    └──────────────┘                     └──────────────┘
            │                                     │
    ┌───────┼───────┐                     ┌───────┼───────┐
    ▼       ▼       ▼                     ▼       ▼       ▼
┌──────┐ ┌──────┐ ┌──────┐           ┌──────┐ ┌──────┐ ┌──────┐
│Penju-│ │Penju-│ │Lain- │           │Pembe-│ │ Gaji │ │Opera-│
│alan  │ │alan  │ │nya   │           │lian  │ │      │ │sional│
│Jamur │ │Baglog│ │      │           │      │ │      │ │      │
└──────┘ └──────┘ └──────┘           └──────┘ └──────┘ └──────┘


    ┌─────────────────────────────────────┐
    │            KATEGORI KAS             │
    ├─────────────────────────────────────┤
    │ • penjualan  - Hasil penjualan      │
    │ • pembelian  - Pembelian bahan/alat │
    │ • operasional- Biaya operasional    │
    │ • gaji       - Pembayaran gaji      │
    │ • lainnya    - Transaksi lainnya    │
    └─────────────────────────────────────┘
```

---

## 7. WORKFLOW NOTIFIKASI

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SISTEM NOTIFIKASI                                  │
└─────────────────────────────────────────────────────────────────────────────┘

    Auto-generated notifications:

    ┌─────────────────┐
    │ STOK MINIMUM    │ ──► "Stok [Bahan] sudah di bawah minimum"
    └─────────────────┘

    ┌─────────────────┐
    │ PRODUKSI TAHAP  │ ──► "Produksi [Kode] siap ke tahap berikutnya"
    └─────────────────┘

    ┌─────────────────┐
    │ KASBON JATUH    │ ──► "Kasbon [Karyawan] jatuh tempo"
    │ TEMPO           │
    └─────────────────┘

    ┌─────────────────┐
    │ PENGGAJIAN      │ ──► "Waktunya proses penggajian periode [X]"
    └─────────────────┘


    Tipe Notifikasi:
    ┌────────────┬─────────────────────────┐
    │ alert      │ Peringatan penting      │
    │ info       │ Informasi umum          │
    │ warning    │ Perhatian               │
    │ success    │ Sukses/berhasil         │
    └────────────┴─────────────────────────┘
```

---

## 8. DIAGRAM RELASI ANTAR MODUL

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        RELASI ANTAR MODUL                                   │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌──────────┐
                              │ SUPPLIER │
                              └────┬─────┘
                                   │
                                   ▼
    ┌──────────┐           ┌──────────────┐           ┌──────────┐
    │ BAHAN    │◄──────────│  PEMBELIAN   │           │ CUSTOMER │
    │  BAKU    │           │  BAHAN BAKU  │           └────┬─────┘
    └────┬─────┘           └──────────────┘                │
         │                                                 │
         ▼                                                 ▼
    ┌──────────┐                                    ┌──────────────┐
    │ PRODUKSI │                                    │  PENJUALAN   │
    │  BAGLOG  │                                    │ BAGLOG/JAMUR │
    └────┬─────┘                                    └──────┬───────┘
         │                                                 │
         ▼                                                 │
    ┌──────────┐         ┌──────────┐                     │
    │  BAGLOG  │────────►│  KUMBUNG │                     │
    └────┬─────┘         └────┬─────┘                     │
         │                    │                           │
         │                    ▼                           │
         │              ┌──────────┐                      │
         │              │  PANEN   │                      │
         │              └────┬─────┘                      │
         │                   │                            │
         │                   ▼                            │
         │              ┌──────────┐                      │
         └─────────────►│STOK JAMUR│◄─────────────────────┘
                        └────┬─────┘
                             │
                             ▼
    ┌──────────┐        ┌──────────┐        ┌──────────┐
    │ KARYAWAN │───────►│PENGGAJIAN│───────►│   KAS    │◄────┐
    └────┬─────┘        └──────────┘        └──────────┘     │
         │                   ▲                               │
         ▼                   │                               │
    ┌──────────┐        ┌──────────┐                        │
    │ ABSENSI  │────────│  KASBON  │                        │
    └──────────┘        └──────────┘                        │
                                                            │
    ┌──────────────────────────────────────────────────────┘
    │
    │  KAS menerima input dari:
    │  • Penjualan (masuk)
    │  • Pembelian (keluar)
    │  • Penggajian (keluar)
    │  • Operasional (keluar)
    └──────────────────────────────────────────────────────
```

---

## 9. USER ROLES & ACCESS

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AKSES PENGGUNA                                    │
└─────────────────────────────────────────────────────────────────────────────┘

    ADMIN (Full Access)
    ├── Dashboard (statistik & KPI)
    ├── Kumbung (CRUD)
    ├── Baglog (CRUD)
    ├── Panen (CRUD)
    ├── Produksi Baglog (CRUD)
    ├── Bahan Baku (CRUD)
    ├── Pembelian (CRUD)
    ├── Monitoring Kumbung (CRUD)
    ├── Karyawan (CRUD)
    ├── Absensi (CRUD)
    ├── QR Absensi (Generate & View)
    ├── Penggajian (CRUD + Bayar Bulk)
    ├── Kasbon (CRUD)
    ├── Pengaturan Gaji (CRUD)
    ├── KPI (View)
    ├── Customer (CRUD)
    ├── Supplier (CRUD)
    ├── Penjualan (CRUD)
    ├── Kas (CRUD)
    ├── Laporan (View & Export)
    └── Notifikasi (View & Manage)

    PUBLIC (No Login Required)
    └── Absensi Publik (Scan QR dengan PIN)
```

---

## 10. QUICK REFERENCE - KODE OTOMATIS

| Entitas | Format Kode | Contoh |
|---------|-------------|--------|
| Kumbung | K + 3 digit | K001, K002, K003 |
| Bahan Baku | BB + 3 digit | BB001, BB002 |
| Produksi Baglog | PRD + YYYYMMDD + 3 digit | PRD20260112001 |
| Baglog Batch | Manual input | BATCH-001 |

---

## 11. TIPS PENGGUNAAN

### Urutan Setup Awal:
1. **Supplier** - Daftarkan supplier bahan baku
2. **Customer** - Daftarkan customer
3. **Bahan Baku** - Setup master bahan baku
4. **Kumbung** - Buat kumbung dengan data investasi
5. **Karyawan** - Daftarkan karyawan + set PIN
6. **Pengaturan Gaji** - Set upah per bagian

### Urutan Operasional Harian:
1. **Absensi** - Karyawan scan QR atau input manual
2. **Monitoring Kumbung** - Catat suhu/kelembaban
3. **Panen** - Input hasil panen
4. **Penjualan** - Catat penjualan jika ada

### Urutan Akhir Periode:
1. **Rekap Absensi** - Review kehadiran
2. **Proses Penggajian** - Hitung & bayar gaji
3. **Laporan** - Generate laporan keuangan

---

*Dokumen ini dibuat berdasarkan analisis sistem Nyimushroom v1.0*
