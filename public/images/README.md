# Folder Gambar Defila

Tempat naro semua foto Defila yang dipakai di **landing page**. Foto otomatis muncul kalau filename-nya **sama persis** dengan yang sudah di-set di kode (lihat di bawah).

Kalau file belum ada, sistem auto-fallback ke icon 3D bikinan kita — jadi gak akan broken image.

## Spek umum

- **Format**: `.jpg` (recommended) atau `.webp`. Hindari `.png` (besar). Hindari `.heic` dari iPhone.
- **Ukuran**: square 1200×1200 px untuk produk, landscape 1600×1100 px untuk gallery.
- **Maks ukuran file**: 500 KB per gambar (kompres dulu di [tinypng.com](https://tinypng.com) atau [squoosh.app](https://squoosh.app)).
- **Naming**: lowercase, kata-pisah-strip. Contoh: `jamur-tiram-segar.jpg` (bukan `Jamur Tiram Segar.JPG`).

---

## Struktur folder

### `gallery/lab/` — Lab Bibit (kategori "Lab Bibit" di landing)
Filename yang dipakai:
- `01-isolasi-bibit-f0.jpg` — proses isolasi miselium dari indukan
- `02-inokulasi-pda.jpg` — pemindahan ke media PDA

### `gallery/produksi/` — Produksi Baglog
- `03-pencampuran-media.jpg` — campuran serbuk gergaji + dedak
- `04-sterilisasi-steam.jpg` — drum sterilisasi steam
- `05-inokulasi-baglog.jpg` — bibit ditanam ke baglog
- `06-inkubasi.jpg` — rak inkubasi penuh baglog

### `gallery/kumbung/` — Kumbung
- `07-kumbung-a1.jpg` — interior kumbung
- `08-monitoring-sensor.jpg` — sensor IoT/dashboard kumbung

### `gallery/panen/` — Panen
- `09-panen-pagi.jpg` — proses panen jamur pagi hari
- `10-sortir-grading.jpg` — sortir berdasarkan ukuran

### `gallery/distribusi/` — Distribusi
- `11-pengemasan.jpg` — packing jamur ke kemasan
- `12-distribusi.jpg` — pengiriman ke market/customer

### `produk/jamur-tiram/` — Foto produk jamur segar
- `kemasan-200gr.jpg`
- `kemasan-500gr.jpg`
- `kemasan-1kg.jpg`
- `display.jpg` — foto utama untuk card produk landing

### `produk/baglog/`
- `display.jpg` — foto utama baglog
- `siap-tumbuh.jpg`
- `inkubasi-30hari.jpg`

### `produk/bibit/`
- `display.jpg` — foto utama bibit (botol PDA)
- `f0.jpg`
- `f1.jpg`

### `hero/` — gambar hero/banner section utama (opsional)
- `hero-1.jpg` — bisa dipakai sebagai background hero

### `facility/` — foto fasilitas umum (kantor, pabrik luar, tim)
- bebas naming, dipakai opsional

---

## Cara replace foto

1. Compress foto di [squoosh.app](https://squoosh.app) → output `.jpg` quality 80
2. Rename sesuai konvensi di atas
3. Drop ke folder yang tepat
4. Commit & deploy → otomatis muncul di landing

Kalau mau **tambah foto baru di gallery** (selain 12 yang udah ada), edit array `DEFAULT_ITEMS` di `resources/js/Components/InteractiveGallery.jsx` — tambah entry dengan `id`, `category`, `label`, `desc`, `src`.

## Tips komposisi foto

- **Angle**: eye-level atau slightly bird-view. Hindari low-angle.
- **Pencahayaan**: natural daylight. Hindari neon putih lab yang flat.
- **Subject**: ada manusia kerja > pure produk. Storytelling lebih kuat.
- **Branding**: kalau ada logo/branding di kemasan, taro di area frame yang menonjol.
