# Nyimushroom - Setup Guide

Panduan lengkap untuk setup project Nyimushroom di PC baru.

## Requirements

Pastikan sudah terinstall:

| Software | Versi Minimum | Download |
|----------|---------------|----------|
| PHP | 8.2+ | https://windows.php.net/download |
| Composer | 2.x | https://getcomposer.org/download |
| Node.js | 18+ | https://nodejs.org |
| MySQL | 8.0+ / MariaDB 10.4+ | https://dev.mysql.com/downloads |
| Git | (opsional) | https://git-scm.com |

### Cek Versi di Terminal:
```bash
php -v          # PHP 8.2.x
composer -V     # Composer 2.x
node -v         # v18.x atau lebih
npm -v          # 9.x atau lebih
mysql --version # MySQL 8.x
```

---

## Cara Setup

### 1. Copy/Clone Project

**Opsi A - Dari Git:**
```bash
git clone https://github.com/username/nyimushroom-app.git
cd nyimushroom-app
```

**Opsi B - Copy Manual:**
- Copy folder `nyimushroom-app` ke PC baru
- TIDAK perlu copy folder `vendor` dan `node_modules` (akan di-install ulang)

---

### 2. Install PHP Dependencies

```bash
cd nyimushroom-app
composer install
```

Tunggu sampai selesai (biasanya 1-3 menit).

---

### 3. Install Node Dependencies

```bash
npm install
```

Tunggu sampai selesai (biasanya 2-5 menit).

---

### 4. Setup Environment File

```bash
# Windows (Command Prompt)
copy .env.example .env

# Windows (PowerShell) / Linux / Mac
cp .env.example .env
```

---

### 5. Generate Application Key

```bash
php artisan key:generate
```

Akan muncul: `Application key set successfully.`

---

### 6. Konfigurasi Database

#### A. Buat Database MySQL

Buka phpMyAdmin atau MySQL CLI:
```sql
CREATE DATABASE nyimushroom;
```

#### B. Edit File .env

Buka file `.env` dengan text editor dan sesuaikan bagian database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nyimushroom
DB_USERNAME=root
DB_PASSWORD=password_kamu
```

> **Note:** Jika menggunakan XAMPP/Laragon dengan user `root` tanpa password, kosongkan `DB_PASSWORD=`

---

### 7. Jalankan Migration

```bash
php artisan migrate
```

Ketik `yes` jika diminta konfirmasi.

---

### 8. Build Frontend Assets

```bash
npm run build
```

Tunggu sampai muncul `✓ built in X.Xs`

---

### 9. Jalankan Server

```bash
php artisan serve
```

Akan muncul:
```
INFO  Server running on [http://127.0.0.1:8000].
Press Ctrl+C to stop the server
```

---

### 10. Buka Aplikasi

Buka browser dan akses: **http://localhost:8000**

---

## Quick Setup (Copy-Paste)

Untuk yang sudah familiar, jalankan semua sekaligus:

```bash
cd nyimushroom-app
composer install
npm install
copy .env.example .env
php artisan key:generate
php artisan migrate
npm run build
php artisan serve
```

---

## Troubleshooting

### Error: "SQLSTATE[HY000] [1049] Unknown database"
- Pastikan database `nyimushroom` sudah dibuat di MySQL
- Cek konfigurasi DB_DATABASE di file `.env`

### Error: "php is not recognized"
- Tambahkan PHP ke PATH environment variable
- Atau gunakan full path: `C:\php\php.exe artisan serve`

### Error: "npm is not recognized"
- Tambahkan Node.js ke PATH environment variable
- Restart terminal setelah install Node.js

### Error: "The stream or file storage/logs/laravel.log could not be opened"
```bash
# Beri permission ke folder storage
php artisan storage:link
```

### Halaman blank / error 500
```bash
# Clear semua cache
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear
```

### Assets tidak loading (CSS/JS error)
```bash
# Rebuild frontend
npm run build
```

---

## Development Mode

Untuk development dengan hot-reload:

**Terminal 1 - PHP Server:**
```bash
php artisan serve
```

**Terminal 2 - Vite Dev Server:**
```bash
npm run dev
```

---

## Akun Default

Setelah setup, register akun baru di:
**http://localhost:8000/register**

---

## Struktur Folder Penting

```
nyimushroom-app/
├── app/
│   ├── Http/Controllers/    # Logic backend
│   └── Models/              # Model database
├── database/
│   └── migrations/          # Struktur tabel
├── resources/
│   └── js/Pages/            # Halaman React
├── routes/
│   └── web.php              # Routing
├── .env                     # Konfigurasi (JANGAN commit!)
└── .env.example             # Template konfigurasi
```

---

## Kontak

Jika ada kendala, hubungi developer.

---

*Last updated: Januari 2026*
