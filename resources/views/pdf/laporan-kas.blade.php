<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Kas - {{ $periode }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 11px;
            color: #1F1D1B;
            margin: 0;
            padding: 24px;
        }
        .header {
            text-align: center;
            margin-bottom: 24px;
            border-bottom: 2px solid #166534;
            padding-bottom: 12px;
        }
        .header h1 {
            color: #166534;
            margin: 0 0 4px 0;
            font-size: 20px;
        }
        .header h2 {
            color: #333;
            margin: 0 0 4px 0;
            font-size: 13px;
            font-weight: normal;
        }
        .header p {
            margin: 0;
            color: #666;
            font-size: 10px;
        }
        .summary-grid {
            display: table;
            width: 100%;
            margin-bottom: 18px;
            border-collapse: collapse;
        }
        .summary-row {
            display: table-row;
        }
        .summary-cell {
            display: table-cell;
            width: 25%;
            padding: 10px 12px;
            border: 1px solid #E5E5E5;
            vertical-align: middle;
        }
        .summary-cell .label {
            font-size: 9px;
            color: #6B6B6B;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        .summary-cell .value {
            font-size: 13px;
            font-weight: bold;
            color: #1F1D1B;
        }
        .summary-cell.saldo-awal .value { color: #166534; }
        .summary-cell.masuk .value { color: #5C8A3E; }
        .summary-cell.keluar .value { color: #B85040; }
        .summary-cell.saldo-akhir { background-color: #F4F8EE; }
        .summary-cell.saldo-akhir .value { color: #166534; }
        .section {
            margin-bottom: 22px;
        }
        .section-title {
            background-color: #166534;
            color: white;
            padding: 7px 12px;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 8px;
        }
        .section-title.masuk { background-color: #5C8A3E; }
        .section-title.keluar { background-color: #B85040; }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
        }
        th, td {
            border: 1px solid #DDD;
            padding: 6px 8px;
            text-align: left;
            font-size: 10px;
        }
        th {
            background-color: #F5F5F5;
            font-weight: bold;
            font-size: 10px;
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .text-masuk { color: #5C8A3E; font-weight: bold; }
        .text-keluar { color: #B85040; font-weight: bold; }
        .total-row {
            background-color: #F5F5F5;
            font-weight: bold;
        }
        .empty {
            text-align: center;
            padding: 14px;
            color: #888;
            font-style: italic;
        }
        .footer {
            margin-top: 24px;
            padding-top: 8px;
            border-top: 1px solid #DDD;
            text-align: right;
            font-size: 9px;
            color: #666;
        }
        .saldo-akhir-box {
            margin-top: 18px;
            padding: 14px;
            border: 2px solid #166534;
            background-color: #F4F8EE;
            text-align: center;
        }
        .saldo-akhir-box .label {
            font-size: 10px;
            color: #166534;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .saldo-akhir-box .value {
            font-size: 22px;
            font-weight: bold;
            color: #166534;
            margin-top: 4px;
        }
        .breakdown-grid {
            display: table;
            width: 100%;
        }
        .breakdown-col {
            display: table-cell;
            width: 50%;
            vertical-align: top;
            padding-right: 8px;
        }
        .breakdown-col:last-child {
            padding-right: 0;
            padding-left: 8px;
        }
        .kode-mono {
            font-family: 'DejaVu Sans Mono', monospace;
            font-size: 9px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>LAPORAN KAS / KEUANGAN</h1>
        <h2>Defila Solusi Bersama Indonesia</h2>
        <p>Periode: {{ $periode }}</p>
    </div>

    {{-- Ringkasan --}}
    <div class="section">
        <div class="section-title">RINGKASAN SALDO</div>
        <div class="summary-grid">
            <div class="summary-row">
                <div class="summary-cell saldo-awal">
                    <div class="label">Saldo Awal</div>
                    <div class="value">Rp {{ number_format($kas['saldoAwal'], 0, ',', '.') }}</div>
                </div>
                <div class="summary-cell masuk">
                    <div class="label">Total Masuk</div>
                    <div class="value">+Rp {{ number_format($kas['totalMasuk'], 0, ',', '.') }}</div>
                </div>
                <div class="summary-cell keluar">
                    <div class="label">Total Keluar</div>
                    <div class="value">-Rp {{ number_format($kas['totalKeluar'], 0, ',', '.') }}</div>
                </div>
                <div class="summary-cell saldo-akhir">
                    <div class="label">Saldo Akhir</div>
                    <div class="value">Rp {{ number_format($kas['saldoAkhir'], 0, ',', '.') }}</div>
                </div>
            </div>
        </div>
        <p style="font-size: 10px; color: #666; margin-top: 4px;">
            Total {{ $kas['jumlahTransaksi'] }} transaksi pada periode ini.
        </p>
    </div>

    {{-- Breakdown per Kategori --}}
    <div class="section">
        <div class="section-title">BREAKDOWN PER KATEGORI</div>
        <div class="breakdown-grid">
            <div class="breakdown-col">
                <table>
                    <thead>
                        <tr style="background-color: #5C8A3E; color: white;">
                            <th>Kategori Masuk</th>
                            <th class="text-right">Jumlah</th>
                            <th class="text-center">Trx</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($kas['perKategoriMasuk'] as $row)
                            <tr>
                                <td style="text-transform: capitalize;">{{ $row['kategori'] }}</td>
                                <td class="text-right text-masuk">Rp {{ number_format($row['total'], 0, ',', '.') }}</td>
                                <td class="text-center">{{ $row['count'] }}</td>
                            </tr>
                        @empty
                            <tr><td colspan="3" class="empty">Tidak ada</td></tr>
                        @endforelse
                        @if (count($kas['perKategoriMasuk']) > 0)
                            <tr class="total-row">
                                <td>Total</td>
                                <td class="text-right text-masuk">Rp {{ number_format($kas['totalMasuk'], 0, ',', '.') }}</td>
                                <td class="text-center">{{ collect($kas['perKategoriMasuk'])->sum('count') }}</td>
                            </tr>
                        @endif
                    </tbody>
                </table>
            </div>
            <div class="breakdown-col">
                <table>
                    <thead>
                        <tr style="background-color: #B85040; color: white;">
                            <th>Kategori Keluar</th>
                            <th class="text-right">Jumlah</th>
                            <th class="text-center">Trx</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($kas['perKategoriKeluar'] as $row)
                            <tr>
                                <td style="text-transform: capitalize;">{{ $row['kategori'] }}</td>
                                <td class="text-right text-keluar">Rp {{ number_format($row['total'], 0, ',', '.') }}</td>
                                <td class="text-center">{{ $row['count'] }}</td>
                            </tr>
                        @empty
                            <tr><td colspan="3" class="empty">Tidak ada</td></tr>
                        @endforelse
                        @if (count($kas['perKategoriKeluar']) > 0)
                            <tr class="total-row">
                                <td>Total</td>
                                <td class="text-right text-keluar">Rp {{ number_format($kas['totalKeluar'], 0, ',', '.') }}</td>
                                <td class="text-center">{{ collect($kas['perKategoriKeluar'])->sum('count') }}</td>
                            </tr>
                        @endif
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    {{-- Transaksi Masuk --}}
    <div class="section">
        <div class="section-title masuk">TRANSAKSI KAS MASUK</div>
        <table>
            <thead>
                <tr>
                    <th style="width: 70px;">Tanggal</th>
                    <th style="width: 110px;">Kode</th>
                    <th>Keterangan</th>
                    <th style="width: 80px;">Kategori</th>
                    <th style="width: 110px;" class="text-right">Jumlah</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($kas['transaksiMasuk'] as $tx)
                    <tr>
                        <td>{{ \Carbon\Carbon::parse($tx['tanggal'])->locale('id')->isoFormat('D MMM Y') }}</td>
                        <td class="kode-mono">{{ $tx['kode_transaksi'] }}</td>
                        <td>{{ $tx['keterangan'] }}</td>
                        <td style="text-transform: capitalize;">{{ $tx['kategori'] }}</td>
                        <td class="text-right text-masuk">+Rp {{ number_format($tx['jumlah'], 0, ',', '.') }}</td>
                    </tr>
                @empty
                    <tr><td colspan="5" class="empty">Tidak ada transaksi masuk pada periode ini</td></tr>
                @endforelse
                @if (count($kas['transaksiMasuk']) > 0)
                    <tr class="total-row">
                        <td colspan="4" class="text-right">TOTAL MASUK</td>
                        <td class="text-right text-masuk">+Rp {{ number_format($kas['totalMasuk'], 0, ',', '.') }}</td>
                    </tr>
                @endif
            </tbody>
        </table>
    </div>

    {{-- Transaksi Keluar --}}
    <div class="section">
        <div class="section-title keluar">TRANSAKSI KAS KELUAR</div>
        <table>
            <thead>
                <tr>
                    <th style="width: 70px;">Tanggal</th>
                    <th style="width: 110px;">Kode</th>
                    <th>Keterangan</th>
                    <th style="width: 80px;">Kategori</th>
                    <th style="width: 110px;" class="text-right">Jumlah</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($kas['transaksiKeluar'] as $tx)
                    <tr>
                        <td>{{ \Carbon\Carbon::parse($tx['tanggal'])->locale('id')->isoFormat('D MMM Y') }}</td>
                        <td class="kode-mono">{{ $tx['kode_transaksi'] }}</td>
                        <td>{{ $tx['keterangan'] }}</td>
                        <td style="text-transform: capitalize;">{{ $tx['kategori'] }}</td>
                        <td class="text-right text-keluar">-Rp {{ number_format($tx['jumlah'], 0, ',', '.') }}</td>
                    </tr>
                @empty
                    <tr><td colspan="5" class="empty">Tidak ada transaksi keluar pada periode ini</td></tr>
                @endforelse
                @if (count($kas['transaksiKeluar']) > 0)
                    <tr class="total-row">
                        <td colspan="4" class="text-right">TOTAL KELUAR</td>
                        <td class="text-right text-keluar">-Rp {{ number_format($kas['totalKeluar'], 0, ',', '.') }}</td>
                    </tr>
                @endif
            </tbody>
        </table>
    </div>

    {{-- Saldo Akhir Box --}}
    <div class="saldo-akhir-box">
        <div class="label">SALDO AKHIR PER {{ \Carbon\Carbon::parse($endDate)->locale('id')->isoFormat('D MMMM Y') }}</div>
        <div class="value">Rp {{ number_format($kas['saldoAkhir'], 0, ',', '.') }}</div>
        <p style="font-size: 9px; color: #666; margin: 8px 0 0 0;">
            = Saldo Awal Rp {{ number_format($kas['saldoAwal'], 0, ',', '.') }}
            + Masuk Rp {{ number_format($kas['totalMasuk'], 0, ',', '.') }}
            - Keluar Rp {{ number_format($kas['totalKeluar'], 0, ',', '.') }}
        </p>
    </div>

    <div class="footer">
        Dicetak pada: {{ $cetakPada }} WIB · Sistem Manajemen Defila Solusi
    </div>
</body>
</html>
