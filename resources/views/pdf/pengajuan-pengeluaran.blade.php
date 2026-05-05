<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Pengajuan {{ $pengajuan->nomor }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 11px;
            color: #1F1D1B;
            margin: 0;
            padding: 28px;
        }
        .header {
            text-align: center;
            margin-bottom: 22px;
            border-bottom: 3px double #166534;
            padding-bottom: 14px;
        }
        .header h1 {
            color: #166534;
            margin: 0 0 4px 0;
            font-size: 18px;
            letter-spacing: 1px;
        }
        .header h2 {
            color: #333;
            margin: 0 0 4px 0;
            font-size: 13px;
            font-weight: bold;
        }
        .header p {
            margin: 2px 0;
            color: #666;
            font-size: 10px;
        }
        .meta-table {
            width: 100%;
            margin-bottom: 18px;
            border-collapse: collapse;
        }
        .meta-table td {
            padding: 6px 8px;
            font-size: 10px;
            vertical-align: top;
        }
        .meta-table .label-cell {
            width: 30%;
            color: #6B6B6B;
            text-transform: uppercase;
            font-size: 9px;
            letter-spacing: 0.5px;
        }
        .meta-table .value-cell {
            width: 20%;
            font-weight: bold;
        }
        .nomor-box {
            border: 2px solid #166534;
            background-color: #F4F8EE;
            padding: 6px 12px;
            display: inline-block;
            font-family: 'DejaVu Sans Mono', monospace;
            font-weight: bold;
            font-size: 13px;
            color: #166534;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .status-diajukan { background-color: #FEF3C7; color: #92400E; }
        .status-disetujui { background-color: #DBEAFE; color: #1E40AF; }
        .status-cair { background-color: #DCFCE7; color: #166534; }
        .status-ditolak { background-color: #FEE2E2; color: #991B1B; }
        .section {
            margin-bottom: 18px;
        }
        .section-title {
            background-color: #166534;
            color: white;
            padding: 6px 12px;
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
        }
        .detail-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #DDD;
        }
        .detail-table tr {
            border-bottom: 1px solid #EEE;
        }
        .detail-table td {
            padding: 8px 12px;
            font-size: 11px;
            vertical-align: top;
        }
        .detail-table .label {
            width: 35%;
            color: #6B6B6B;
            background-color: #FAFAFA;
            font-size: 10px;
        }
        .detail-table .value {
            font-weight: 500;
        }
        .jumlah-box {
            margin: 14px 0;
            padding: 14px;
            background-color: #F4F8EE;
            border: 2px solid #166534;
            text-align: center;
        }
        .jumlah-box .label {
            font-size: 9px;
            color: #166534;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .jumlah-box .value {
            font-size: 22px;
            font-weight: bold;
            color: #166534;
            margin-top: 4px;
        }
        .jumlah-box .terbilang {
            font-size: 10px;
            color: #166534;
            font-style: italic;
            margin-top: 4px;
        }
        .keterangan-box {
            background-color: #FAFAFA;
            border-left: 3px solid #166534;
            padding: 10px 14px;
            font-size: 11px;
            line-height: 1.5;
        }
        .signature-area {
            margin-top: 28px;
            display: table;
            width: 100%;
            table-layout: fixed;
        }
        .signature-box {
            display: table-cell;
            width: 33.33%;
            text-align: center;
            padding: 0 6px;
            vertical-align: top;
        }
        .signature-box .role {
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            color: #6B6B6B;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        .signature-box .city-date {
            font-size: 10px;
            color: #555;
            margin-bottom: 4px;
        }
        .signature-box .ttd-area {
            height: 90px;
            border-bottom: 1px solid #333;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 6px;
        }
        .signature-box .ttd-area img {
            max-height: 85px;
            max-width: 100%;
        }
        .signature-box .name {
            font-size: 11px;
            font-weight: bold;
            color: #1F1D1B;
        }
        .signature-box .stamp {
            font-size: 9px;
            color: #999;
            margin-top: 2px;
        }
        .footer {
            margin-top: 28px;
            padding-top: 8px;
            border-top: 1px solid #DDD;
            display: table;
            width: 100%;
            font-size: 9px;
            color: #888;
        }
        .footer .left { display: table-cell; text-align: left; }
        .footer .right { display: table-cell; text-align: right; }
        .ttd-img {
            max-height: 80px;
            max-width: 95%;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>FORMULIR PENGAJUAN PENGELUARAN</h1>
        <h2>Defila Solusi Bersama Indonesia</h2>
        <p>Pengeluaran Rekening BNI Giro</p>
    </div>

    <table class="meta-table">
        <tr>
            <td class="label-cell">Nomor Pengajuan</td>
            <td class="value-cell">
                <span class="nomor-box">{{ $pengajuan->nomor }}</span>
            </td>
            <td class="label-cell">Status</td>
            <td>
                <span class="status-badge status-{{ $pengajuan->status }}">{{ $pengajuan->status }}</span>
            </td>
        </tr>
        <tr>
            <td class="label-cell">Tanggal Pengajuan</td>
            <td class="value-cell">{{ $pengajuan->tanggal_pengajuan->locale('id')->isoFormat('D MMMM Y') }}</td>
            <td class="label-cell">Kategori</td>
            <td style="text-transform: capitalize; font-weight: bold;">{{ $pengajuan->kategori }}</td>
        </tr>
    </table>

    <div class="section">
        <div class="section-title">DETAIL PENGAJUAN</div>
        <table class="detail-table">
            <tr>
                <td class="label">Pemohon</td>
                <td class="value">{{ $pengajuan->pemohon?->name ?? $pengajuan->pemohon_nama }}</td>
            </tr>
            <tr>
                <td class="label">Tujuan / Penerima</td>
                <td class="value">{{ $pengajuan->tujuan_penerima }}</td>
            </tr>
            <tr>
                <td class="label">Kategori Pengeluaran</td>
                <td class="value" style="text-transform: capitalize;">{{ $pengajuan->kategori }}</td>
            </tr>
        </table>
    </div>

    <div class="jumlah-box">
        <div class="label">Jumlah Pengeluaran</div>
        <div class="value">Rp {{ number_format($pengajuan->jumlah, 0, ',', '.') }}</div>
    </div>

    <div class="section">
        <div class="section-title">KETERANGAN / RINCIAN</div>
        <div class="keterangan-box">{{ $pengajuan->keterangan }}</div>
    </div>

    @if ($pengajuan->status === 'ditolak' && $pengajuan->catatan_tolak)
        <div class="section">
            <div class="section-title" style="background-color: #B85040;">CATATAN PENOLAKAN</div>
            <div class="keterangan-box" style="border-left-color: #B85040;">{{ $pengajuan->catatan_tolak }}</div>
        </div>
    @endif

    <div class="signature-area">
        {{-- Pemohon --}}
        <div class="signature-box">
            <div class="role">Pemohon</div>
            <div class="city-date">
                {{ $pengajuan->tanggal_pengajuan->locale('id')->isoFormat('D MMM Y') }}
            </div>
            <div class="ttd-area">
                @if ($pengajuan->ttd_pemohon)
                    <img src="{{ $pengajuan->ttd_pemohon }}" class="ttd-img" alt="TTD Pemohon">
                @endif
            </div>
            <div class="name">{{ $pengajuan->pemohon?->name ?? $pengajuan->pemohon_nama }}</div>
        </div>

        {{-- Mengetahui --}}
        <div class="signature-box">
            <div class="role">Mengetahui</div>
            <div class="city-date">&nbsp;</div>
            <div class="ttd-area">
                @if (!empty($ttdMengetahui))
                    <img src="{{ $ttdMengetahui }}" class="ttd-img" alt="TTD {{ $namaMengetahui }}">
                @endif
            </div>
            <div class="name">{{ $namaMengetahui }}</div>
            <div class="stamp">{{ $jabatanMengetahui }}</div>
        </div>

        {{-- Disetujui --}}
        <div class="signature-box">
            <div class="role">Disetujui</div>
            <div class="city-date">
                @if ($pengajuan->disetujui_at)
                    {{ \Carbon\Carbon::parse($pengajuan->disetujui_at)->locale('id')->isoFormat('D MMM Y') }}
                @else
                    &nbsp;
                @endif
            </div>
            <div class="ttd-area">
                @if (!empty($ttdDisetujui))
                    <img src="{{ $ttdDisetujui }}" class="ttd-img" alt="TTD {{ $namaDisetujui }}">
                @endif
            </div>
            <div class="name">{{ $namaDisetujui }}</div>
            <div class="stamp">{{ $jabatanDisetujui }}</div>
        </div>
    </div>

    <div class="footer">
        <div class="left">
            Nomor: <strong>{{ $pengajuan->nomor }}</strong>
        </div>
        <div class="right">
            Dicetak: {{ $cetakPada }} WIB · Sistem Defila Solusi
        </div>
    </div>
</body>
</html>
