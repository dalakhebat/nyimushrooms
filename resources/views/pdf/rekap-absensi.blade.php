<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rekap Absensi - {{ $bulan }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            font-size: 18px;
            margin: 0 0 5px 0;
            color: #166534;
        }
        .header p {
            margin: 0;
            color: #666;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 10px 8px;
            text-align: left;
        }
        th {
            background-color: #166534;
            color: white;
            font-weight: bold;
            text-align: center;
        }
        td {
            text-align: center;
        }
        td:nth-child(2) {
            text-align: left;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .footer {
            margin-top: 30px;
            font-size: 10px;
            color: #999;
            text-align: center;
        }
        tfoot td {
            background-color: #f3f4f6;
            font-weight: bold;
        }
        .hadir { color: #166534; }
        .izin { color: #2563eb; }
        .sakit { color: #ca8a04; }
        .alpha { color: #dc2626; }
    </style>
</head>
<body>
    <div class="header">
        <h1>REKAP ABSENSI KARYAWAN</h1>
        <p>Nyimushroom Farm</p>
        <p style="margin-top: 10px;">Periode: {{ $periode }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 30px;">No</th>
                <th>Nama Karyawan</th>
                <th style="width: 70px;">Tipe Gaji</th>
                <th style="width: 90px;">Nominal</th>
                <th style="width: 50px;">Hadir</th>
                <th style="width: 50px;">Izin</th>
                <th style="width: 50px;">Sakit</th>
                <th style="width: 50px;">Alpha</th>
                <th style="width: 50px;">Total</th>
            </tr>
        </thead>
        <tbody>
            @php $totalHadir = 0; $totalIzin = 0; $totalSakit = 0; $totalAlpha = 0; @endphp
            @forelse($rekap as $index => $row)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td style="text-align: left;">{{ $row['nama'] }}</td>
                    <td>{{ $row['tipe_gaji'] ?? '-' }}</td>
                    <td style="text-align: right;">{{ isset($row['nominal_gaji']) ? 'Rp ' . number_format($row['nominal_gaji'], 0, ',', '.') : '-' }}</td>
                    <td class="hadir">{{ $row['hadir'] }}</td>
                    <td class="izin">{{ $row['izin'] }}</td>
                    <td class="sakit">{{ $row['sakit'] }}</td>
                    <td class="alpha">{{ $row['alpha'] }}</td>
                    <td>{{ $row['total'] }}</td>
                </tr>
                @php
                    $totalHadir += $row['hadir'];
                    $totalIzin += $row['izin'];
                    $totalSakit += $row['sakit'];
                    $totalAlpha += $row['alpha'];
                @endphp
            @empty
                <tr>
                    <td colspan="9" style="text-align: center; padding: 20px;">Tidak ada data</td>
                </tr>
            @endforelse
        </tbody>
        @if(count($rekap) > 0)
        <tfoot>
            <tr>
                <td colspan="4" style="text-align: left;">Total</td>
                <td class="hadir">{{ $totalHadir }}</td>
                <td class="izin">{{ $totalIzin }}</td>
                <td class="sakit">{{ $totalSakit }}</td>
                <td class="alpha">{{ $totalAlpha }}</td>
                <td>{{ $totalHadir + $totalIzin + $totalSakit + $totalAlpha }}</td>
            </tr>
        </tfoot>
        @endif
    </table>

    <div class="footer">
        Dicetak pada: {{ now()->locale('id')->isoFormat('D MMM Y HH:mm') }} WIB
    </div>
</body>
</html>
