<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Absensi Mingguan - {{ $bulan }} Minggu {{ $minggu }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            margin: 0;
            padding: 15px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            font-size: 16px;
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
            margin-top: 15px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 6px 4px;
            text-align: center;
        }
        th {
            background-color: #166534;
            color: white;
            font-weight: bold;
            font-size: 10px;
        }
        th.name-col {
            text-align: left;
            width: 180px;
        }
        th.bagian-col {
            text-align: left;
            width: 100px;
        }
        th.day-col {
            width: 45px;
        }
        th.summary-col {
            width: 35px;
            background-color: #374151;
        }
        td.name-col {
            text-align: left;
            font-weight: 500;
        }
        td.bagian-col {
            text-align: left;
            font-size: 10px;
            color: #666;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .status-h {
            background-color: #dcfce7;
            color: #166534;
            font-weight: bold;
        }
        .status-i {
            background-color: #dbeafe;
            color: #2563eb;
            font-weight: bold;
        }
        .status-s {
            background-color: #fef9c3;
            color: #ca8a04;
            font-weight: bold;
        }
        .status-a {
            background-color: #fee2e2;
            color: #dc2626;
            font-weight: bold;
        }
        .footer {
            margin-top: 20px;
            font-size: 9px;
            color: #999;
            text-align: center;
        }
        tfoot td {
            background-color: #f3f4f6;
            font-weight: bold;
        }
        .legend {
            margin-top: 15px;
            font-size: 10px;
        }
        .legend span {
            display: inline-block;
            padding: 2px 8px;
            margin-right: 10px;
            border-radius: 3px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>ABSENSI MINGGUAN KARYAWAN</h1>
        <p>Nyimushroom Farm</p>
        <p style="margin-top: 8px; font-weight: bold;">{{ $bulan }} - Minggu {{ $minggu }}</p>
        <p>Periode: {{ $periode }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 25px;">No</th>
                <th class="name-col">Nama Karyawan</th>
                <th class="bagian-col">Bagian</th>
                @foreach($days as $day)
                <th class="day-col">{{ $day['day'] }}<br>{{ $day['dayNum'] }}</th>
                @endforeach
                <th class="summary-col">H</th>
                <th class="summary-col">I</th>
                <th class="summary-col">S</th>
                <th class="summary-col">A</th>
            </tr>
        </thead>
        <tbody>
            @php
                $totalH = 0; $totalI = 0; $totalS = 0; $totalA = 0;
            @endphp
            @forelse($data as $index => $row)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td class="name-col">{{ $row['nama'] }}</td>
                    <td class="bagian-col">{{ $row['bagian'] ?? '-' }}</td>
                    @foreach($days as $day)
                        @php
                            $status = $row['attendance'][$day['date']] ?? 'hadir';
                            $statusLabel = strtoupper(substr($status, 0, 1));
                            $statusClass = 'status-' . strtolower($statusLabel);
                        @endphp
                        <td class="{{ $statusClass }}">{{ $statusLabel }}</td>
                    @endforeach
                    <td>{{ $row['summary']['hadir'] }}</td>
                    <td>{{ $row['summary']['izin'] }}</td>
                    <td>{{ $row['summary']['sakit'] }}</td>
                    <td>{{ $row['summary']['alpha'] }}</td>
                </tr>
                @php
                    $totalH += $row['summary']['hadir'];
                    $totalI += $row['summary']['izin'];
                    $totalS += $row['summary']['sakit'];
                    $totalA += $row['summary']['alpha'];
                @endphp
            @empty
                <tr>
                    <td colspan="{{ 4 + count($days) + 4 }}" style="text-align: center; padding: 20px;">Tidak ada data</td>
                </tr>
            @endforelse
        </tbody>
        @if(count($data) > 0)
        <tfoot>
            <tr>
                <td colspan="3" style="text-align: left;">Total ({{ count($data) }} karyawan)</td>
                @foreach($days as $day)
                <td>-</td>
                @endforeach
                <td>{{ $totalH }}</td>
                <td>{{ $totalI }}</td>
                <td>{{ $totalS }}</td>
                <td>{{ $totalA }}</td>
            </tr>
        </tfoot>
        @endif
    </table>

    <div class="legend">
        <strong>Keterangan:</strong>
        <span class="status-h">H = Hadir</span>
        <span class="status-i">I = Izin</span>
        <span class="status-s">S = Sakit</span>
        <span class="status-a">A = Alpha</span>
    </div>

    <div class="footer">
        Dicetak pada: {{ now()->locale('id')->isoFormat('D MMM Y HH:mm') }} WIB
    </div>
</body>
</html>
