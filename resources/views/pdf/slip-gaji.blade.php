<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Slip Gaji - {{ $penggajian->karyawan->nama }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .header {
            background-color: #166534;
            color: white;
            padding: 20px;
            margin: -20px -20px 20px -20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .header p {
            margin: 5px 0 0 0;
            opacity: 0.8;
        }
        .periode {
            float: right;
            text-align: right;
        }
        .periode .label {
            font-size: 10px;
            opacity: 0.8;
        }
        .periode .value {
            font-size: 14px;
            font-weight: bold;
        }
        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }
        .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .status-dibayar {
            background-color: #dcfce7;
            color: #166534;
        }
        .status-pending {
            background-color: #fef3c7;
            color: #92400e;
        }
        .karyawan-info {
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e5e7eb;
        }
        .karyawan-info h2 {
            margin: 0 0 5px 0;
            font-size: 18px;
            color: #111;
        }
        .karyawan-info .tipe {
            display: inline-block;
            padding: 3px 10px;
            background-color: #e5e7eb;
            border-radius: 10px;
            font-size: 10px;
            text-transform: uppercase;
        }
        .section-title {
            font-size: 11px;
            text-transform: uppercase;
            color: #6b7280;
            margin-bottom: 10px;
            font-weight: bold;
        }
        .absensi-grid {
            display: table;
            width: 100%;
            margin-bottom: 25px;
        }
        .absensi-item {
            display: table-cell;
            width: 25%;
            text-align: center;
            padding: 10px;
        }
        .absensi-item .value {
            font-size: 24px;
            font-weight: bold;
        }
        .absensi-item .label {
            font-size: 10px;
            margin-top: 5px;
        }
        .absensi-hadir { background-color: #dcfce7; color: #166534; }
        .absensi-izin { background-color: #dbeafe; color: #1e40af; }
        .absensi-sakit { background-color: #fef3c7; color: #92400e; }
        .absensi-alpha { background-color: #fee2e2; color: #dc2626; }
        .rincian {
            background-color: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 25px;
        }
        .rincian-row {
            display: table;
            width: 100%;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .rincian-row:last-child {
            border-bottom: none;
        }
        .rincian-row .label {
            display: table-cell;
            width: 70%;
        }
        .rincian-row .value {
            display: table-cell;
            width: 30%;
            text-align: right;
            font-weight: 500;
        }
        .rincian-row.total {
            border-top: 2px solid #166534;
            padding-top: 12px;
            margin-top: 5px;
        }
        .rincian-row.total .label,
        .rincian-row.total .value {
            font-weight: bold;
            font-size: 14px;
        }
        .rincian-row.total .value {
            color: #166534;
            font-size: 16px;
        }
        .rincian-row.bonus .value {
            color: #166534;
        }
        .rincian-row.potongan .value {
            color: #dc2626;
        }
        .catatan {
            background-color: #f9fafb;
            padding: 10px 15px;
            border-radius: 8px;
            margin-bottom: 25px;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 10px;
            color: #9ca3af;
        }
        .signature-area {
            margin-top: 50px;
            display: table;
            width: 100%;
        }
        .signature-box {
            display: table-cell;
            width: 50%;
            text-align: center;
        }
        .signature-box .line {
            border-top: 1px solid #333;
            width: 150px;
            margin: 60px auto 5px auto;
        }
        .signature-box .name {
            font-size: 11px;
        }
    </style>
</head>
<body>
    <div class="header clearfix">
        <div class="periode">
            <div class="label">Periode</div>
            <div class="value">{{ $penggajian->periode_mulai->locale('id')->isoFormat('D MMM') }} - {{ $penggajian->periode_selesai->locale('id')->isoFormat('D MMM Y') }}</div>
        </div>
        <h1>SLIP GAJI</h1>
        <p>Defila Solusi Bersama Indonesia Farm</p>
    </div>

    <div class="status-badge {{ $penggajian->status === 'dibayar' ? 'status-dibayar' : 'status-pending' }}">
        @if($penggajian->status === 'dibayar')
            [LUNAS] Dibayar pada {{ $penggajian->tanggal_bayar->locale('id')->isoFormat('D MMM Y') }}
        @else
            [PENDING] Belum Dibayar
        @endif
    </div>

    <div class="karyawan-info">
        <h2>{{ $penggajian->karyawan->nama }}</h2>
        <span class="tipe">{{ ucfirst($penggajian->karyawan->tipe_gaji) }}</span>
        @if($penggajian->karyawan->no_hp)
            <span style="margin-left: 10px; color: #6b7280;">{{ $penggajian->karyawan->no_hp }}</span>
        @endif
    </div>

    <div class="section-title">Rekap Kehadiran</div>
    <div class="absensi-grid">
        <div class="absensi-item absensi-hadir">
            <div class="value">{{ $penggajian->jumlah_hadir }}</div>
            <div class="label">Hadir</div>
        </div>
        <div class="absensi-item absensi-izin">
            <div class="value">{{ $penggajian->jumlah_izin ?? 0 }}</div>
            <div class="label">Izin</div>
        </div>
        <div class="absensi-item absensi-sakit">
            <div class="value">{{ $penggajian->jumlah_sakit ?? 0 }}</div>
            <div class="label">Sakit</div>
        </div>
        <div class="absensi-item absensi-alpha">
            <div class="value">{{ $penggajian->jumlah_alpha ?? 0 }}</div>
            <div class="label">Alpha</div>
        </div>
    </div>

    <div class="section-title">Rincian Gaji</div>
    <div class="rincian">
        <div class="rincian-row">
            <span class="label">Gaji Pokok</span>
            <span class="value">Rp {{ number_format($penggajian->gaji_pokok, 0, ',', '.') }}</span>
        </div>
        @if($penggajian->bonus > 0)
        <div class="rincian-row bonus">
            <span class="label">Bonus</span>
            <span class="value">+Rp {{ number_format($penggajian->bonus, 0, ',', '.') }}</span>
        </div>
        @endif
        @if($penggajian->potongan > 0)
        <div class="rincian-row potongan">
            <span class="label">Potongan Absensi</span>
            <span class="value">-Rp {{ number_format($penggajian->potongan, 0, ',', '.') }}</span>
        </div>
        @endif
        @if($penggajian->potongan_kasbon > 0)
        <div class="rincian-row potongan">
            <span class="label">Potongan Kasbon</span>
            <span class="value">-Rp {{ number_format($penggajian->potongan_kasbon, 0, ',', '.') }}</span>
        </div>
        @endif
        <div class="rincian-row total">
            <span class="label">Total Diterima</span>
            <span class="value">Rp {{ number_format($penggajian->total, 0, ',', '.') }}</span>
        </div>
    </div>

    @if($penggajian->catatan)
    <div class="section-title">Catatan</div>
    <div class="catatan">
        {{ $penggajian->catatan }}
    </div>
    @endif

    <div class="signature-area">
        <div class="signature-box">
            <div class="line"></div>
            <div class="name">Penerima</div>
        </div>
        <div class="signature-box">
            <div class="line"></div>
            <div class="name">Pemberi</div>
        </div>
    </div>

    <div class="footer">
        Dicetak pada: {{ now()->locale('id')->isoFormat('D MMM Y HH:mm') }} WIB | Defila Solusi Bersama Indonesia Farm
    </div>
</body>
</html>
