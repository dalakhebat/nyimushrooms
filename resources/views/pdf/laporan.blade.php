<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan {{ ucfirst($tipe) }} - {{ $periode }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 12px;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #166534;
            padding-bottom: 15px;
        }
        .header h1 {
            color: #166534;
            margin: 0 0 5px 0;
            font-size: 24px;
        }
        .header h2 {
            color: #333;
            margin: 0 0 5px 0;
            font-size: 16px;
            font-weight: normal;
        }
        .header p {
            margin: 0;
            color: #666;
            font-size: 11px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            background-color: #166534;
            color: white;
            padding: 8px 12px;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f5f5f5;
            font-weight: bold;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .font-bold {
            font-weight: bold;
        }
        .text-green {
            color: #166534;
        }
        .text-red {
            color: #dc2626;
        }
        .text-blue {
            color: #2563eb;
        }
        .summary-box {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            padding: 15px;
            margin-bottom: 15px;
        }
        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .total-row {
            background-color: #f0fdf4;
            font-weight: bold;
        }
        .grid {
            display: table;
            width: 100%;
        }
        .grid-col {
            display: table-cell;
            width: 50%;
            vertical-align: top;
            padding-right: 10px;
        }
        .grid-col:last-child {
            padding-right: 0;
            padding-left: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>NYIMUSHROOM</h1>
        <h2>Laporan {{ ucfirst($tipe) }}</h2>
        <p>Periode: {{ $periode }}</p>
    </div>

    @if($tipe == 'panen')
    <!-- Laporan Panen -->
    <div class="section">
        <div class="section-title">Ringkasan Panen</div>
        <table>
            <tr>
                <td width="200">Total Panen Bulan Ini</td>
                <td class="font-bold text-green">{{ number_format($laporanPanen['total'], 1) }} kg</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Panen per Kumbung</div>
        <table>
            <thead>
                <tr>
                    <th>Kumbung</th>
                    <th class="text-center">Jumlah Hari</th>
                    <th class="text-right">Total Panen (kg)</th>
                </tr>
            </thead>
            <tbody>
                @foreach($laporanPanen['perKumbung'] as $item)
                <tr>
                    <td>{{ $item['nama'] }}</td>
                    <td class="text-center">{{ $item['jumlah_hari'] }}</td>
                    <td class="text-right">{{ number_format($item['total_panen'], 1) }}</td>
                </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr class="total-row">
                    <td colspan="2" class="text-right">Total:</td>
                    <td class="text-right">{{ number_format($laporanPanen['total'], 1) }} kg</td>
                </tr>
            </tfoot>
        </table>
    </div>

    @elseif($tipe == 'penjualan')
    <!-- Laporan Penjualan -->
    <div class="grid">
        <div class="grid-col">
            <div class="section">
                <div class="section-title">Penjualan Baglog</div>
                <table>
                    <tr>
                        <td>Jumlah Transaksi</td>
                        <td class="text-right">{{ number_format($laporanPenjualan['baglog']['count']) }}</td>
                    </tr>
                    <tr>
                        <td>Total Baglog Terjual</td>
                        <td class="text-right">{{ number_format($laporanPenjualan['baglog']['jumlah']) }} baglog</td>
                    </tr>
                    <tr class="font-bold">
                        <td>Total Nilai</td>
                        <td class="text-right text-blue">Rp {{ number_format($laporanPenjualan['baglog']['total']) }}</td>
                    </tr>
                    <tr>
                        <td>Status Lunas</td>
                        <td class="text-right text-green">Rp {{ number_format($laporanPenjualan['baglog']['status']['lunas']) }}</td>
                    </tr>
                    <tr>
                        <td>Status Pending</td>
                        <td class="text-right" style="color: #ca8a04;">Rp {{ number_format($laporanPenjualan['baglog']['status']['pending']) }}</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="grid-col">
            <div class="section">
                <div class="section-title">Penjualan Jamur</div>
                <table>
                    <tr>
                        <td>Jumlah Transaksi</td>
                        <td class="text-right">{{ number_format($laporanPenjualan['jamur']['count']) }}</td>
                    </tr>
                    <tr>
                        <td>Total Berat Terjual</td>
                        <td class="text-right">{{ number_format($laporanPenjualan['jamur']['berat'], 1) }} kg</td>
                    </tr>
                    <tr class="font-bold">
                        <td>Total Nilai</td>
                        <td class="text-right" style="color: #7c3aed;">Rp {{ number_format($laporanPenjualan['jamur']['total']) }}</td>
                    </tr>
                    <tr>
                        <td>Status Lunas</td>
                        <td class="text-right text-green">Rp {{ number_format($laporanPenjualan['jamur']['status']['lunas']) }}</td>
                    </tr>
                    <tr>
                        <td>Status Pending</td>
                        <td class="text-right" style="color: #ca8a04;">Rp {{ number_format($laporanPenjualan['jamur']['status']['pending']) }}</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>

    @elseif($tipe == 'keuangan')
    <!-- Laporan Keuangan -->
    <div class="section">
        <div class="section-title">Pemasukan</div>
        <table>
            <tr>
                <td>Penjualan Baglog (Lunas)</td>
                <td class="text-right">Rp {{ number_format($laporanKeuangan['pemasukan']['baglog']) }}</td>
            </tr>
            <tr>
                <td>Penjualan Jamur (Lunas)</td>
                <td class="text-right">Rp {{ number_format($laporanKeuangan['pemasukan']['jamur']) }}</td>
            </tr>
            <tr class="total-row">
                <td class="font-bold">Total Pemasukan</td>
                <td class="text-right font-bold text-green">Rp {{ number_format($laporanKeuangan['pemasukan']['total']) }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Pengeluaran</div>
        <table>
            <tr>
                <td>Gaji Karyawan</td>
                <td class="text-right">Rp {{ number_format($laporanKeuangan['pengeluaran']['gaji']) }}</td>
            </tr>
            <tr class="total-row">
                <td class="font-bold">Total Pengeluaran</td>
                <td class="text-right font-bold text-red">Rp {{ number_format($laporanKeuangan['pengeluaran']['total']) }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Ringkasan</div>
        <table>
            <tr>
                <td>Total Pemasukan</td>
                <td class="text-right text-green">Rp {{ number_format($laporanKeuangan['pemasukan']['total']) }}</td>
            </tr>
            <tr>
                <td>Total Pengeluaran</td>
                <td class="text-right text-red">(Rp {{ number_format($laporanKeuangan['pengeluaran']['total']) }})</td>
            </tr>
            <tr class="total-row" style="background-color: {{ $laporanKeuangan['laba'] >= 0 ? '#dbeafe' : '#ffedd5' }};">
                <td class="font-bold">{{ $laporanKeuangan['laba'] >= 0 ? 'Laba Bersih' : 'Rugi Bersih' }}</td>
                <td class="text-right font-bold" style="font-size: 14px; color: {{ $laporanKeuangan['laba'] >= 0 ? '#2563eb' : '#ea580c' }};">
                    Rp {{ number_format($laporanKeuangan['laba']) }}
                </td>
            </tr>
        </table>
    </div>
    @endif

    <div class="footer">
        <p>Dicetak pada: {{ $cetakPada }} WIB</p>
        <p>Defila Solusi Bersama Indonesia - Sistem Manajemen Usaha Jamur</p>
    </div>
</body>
</html>
