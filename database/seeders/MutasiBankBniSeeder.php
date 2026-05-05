<?php

namespace Database\Seeders;

use App\Models\MutasiBank;
use Illuminate\Database\Seeder;

class MutasiBankBniSeeder extends Seeder
{
    /**
     * Mutasi BNI Giro 2047423575 / DEFILA SOLUSI BERSAMA INDONESIA PT
     * Periode 05-Apr-2026 s/d 05-May-2026
     * Beginning Balance: 5.275.796.068, Ending Balance: 1.218.471.540
     * Total Debit: 4.203.847.426, Total Credit: 146.522.898
     */
    public function run(): void
    {
        $rekening = '2047423575';

        $rows = [
            // 28/04/2026
            ['2026-04-28', '11:47:52', '909594', 'TRANSFER KE 8011770004 Ibu RR SRI RETNO HADININGS - Operasional TRF', 5000000, 'D', 5270796068, 'Operasional', 'Sri Retno Hadiningsih'],
            ['2026-04-28', '12:01:13', '988071', 'TRF/PAY/TOP-UP ECHANNEL ke 700011183444', 100000, 'D', 5270696068, 'Operasional', null],
            ['2026-04-28', '00:00:00', '988071', 'BY TRX BIFAST', 2500, 'D', 5270693568, 'Biaya Bank', null],
            ['2026-04-28', '12:36:26', '901674', 'TRANSFER KE 8011770004 Ibu RR SRI RETNO HADININGS - Operasional Defila TRF', 3000000000, 'D', 2270693568, 'Operasional', 'Sri Retno Hadiningsih'],
            ['2026-04-28', '19:40:37', '985571', 'TRANSFER KE 2013836446 M IKHWAN SUFI - Pengembalian TRF', 250500000, 'D', 2020193568, 'Pengembalian', 'M Ikhwan Sufi'],
            ['2026-04-28', '19:40:37', '939904', 'TRF/PAY/TOP-UP ECHANNEL ke 1290745345 - Ops maintenance kumbung', 50000000, 'D', 1970193568, 'Pemb Kumbung', null],
            ['2026-04-28', '00:00:00', '939904', 'BY TRX BIFAST', 2500, 'D', 1970191068, 'Biaya Bank', null],
            ['2026-04-28', '19:40:38', '939907', 'TRANSFER KE 2051640764 Ibu IMAS HERLINA - Pemb kumbung TRF', 315500000, 'D', 1654691068, 'Pemb Kumbung', 'Imas Herlina'],
            ['2026-04-28', '19:40:39', '985829', 'TRF/PAY/TOP-UP ECHANNEL ke 7361355265 - Pemb pph', 126523506, 'D', 1528167562, 'Pajak', null],
            ['2026-04-28', '00:00:00', '985829', 'BY TRX BIFAST', 2500, 'D', 1528165062, 'Biaya Bank', null],

            // 30/04/2026
            ['2026-04-30', '00:52:59', '903981', 'JASA GIRO/BUNGA', 1188098, 'C', 1529353160, 'Bunga Bank', null],
            ['2026-04-30', '00:52:59', '903981', 'PPH atas Bunga', 237620, 'D', 1529115540, 'Pajak', null],
            ['2026-04-30', '08:00:00', '903981', 'BIAYA ADM REK', 25000, 'D', 1529090540, 'Biaya Bank', null],

            // 02/05/2026
            ['2026-05-02', '09:01:47', '978983', 'TRANSFER DARI 2051657676 Ibu IMAS HERLINA - jmr', 55834800, 'C', 1584925340, 'Penjualan Jamur', 'Imas Herlina'],
            ['2026-05-02', '10:29:48', '914272', 'TRANSFER KE 2051657676 Ibu IMAS HERLINA - Pemb Bahan Baku TRF', 97000000, 'D', 1487925340, 'Pemb Bahan Baku', 'Imas Herlina'],
            ['2026-05-02', '10:29:49', '914348', 'TRANSFER KE 2013836446 M IKHWAN SUFI - Pengembalian TRF', 218250000, 'D', 1269675340, 'Pengembalian', 'M Ikhwan Sufi'],
            ['2026-05-02', '10:29:49', '914369', 'TRF/PAY/TOP-UP ECHANNEL ke 700011183444 - jamur', 7017600, 'D', 1262657740, 'Pemb Bahan Baku', null],
            ['2026-05-02', '00:00:00', '914369', 'BY TRX BIFAST', 2500, 'D', 1262655240, 'Biaya Bank', null],
            ['2026-05-02', '10:29:51', '914589', 'TRF/PAY/TOP-UP ECHANNEL ke 7330096751 - jamur', 44176200, 'D', 1218479040, 'Pemb Bahan Baku', null],
            ['2026-05-02', '00:00:00', '914589', 'BY TRX BIFAST', 2500, 'D', 1218476540, 'Biaya Bank', null],

            // 05/05/2026
            ['2026-05-05', '07:06:16', '947804', 'TRANSFER DARI Ibu IMAS HERLINA - jmr', 89500000, 'C', 1307976540, 'Penjualan Jamur', 'Imas Herlina'],
            ['2026-05-05', '07:33:02', '944690', 'TRF/PAY/TOP-UP ECHANNEL ke 1291595583 - Pemb bahan baku', 34500000, 'D', 1273476540, 'Pemb Bahan Baku', null],
            ['2026-05-05', '00:00:00', '944690', 'BY TRX BIFAST', 2500, 'D', 1273474040, 'Biaya Bank', null],
            ['2026-05-05', '07:33:03', '946964', 'TRF/PAY/TOP-UP ECHANNEL ke 1290745345 - Pemb bahan baku', 55000000, 'D', 1218474040, 'Pemb Bahan Baku', null],
            ['2026-05-05', '00:00:00', '946964', 'BY TRX BIFAST', 2500, 'D', 1218471540, 'Biaya Bank', null],
        ];

        foreach ($rows as $row) {
            [$tanggal, $jam, $journalNo, $deskripsi, $nominal, $tipe, $saldo, $kategori, $counterparty] = $row;

            MutasiBank::updateOrCreate(
                [
                    'rekening' => $rekening,
                    'tanggal' => $tanggal,
                    'journal_no' => $journalNo,
                    'nominal' => $nominal,
                    'tipe' => $tipe,
                ],
                [
                    'bank' => 'BNI',
                    'jam' => $jam,
                    'deskripsi' => $deskripsi,
                    'saldo' => $saldo,
                    'kategori' => $kategori,
                    'counterparty' => $counterparty,
                ]
            );
        }

        $this->command->info('Mutasi BNI Giro Defila ' . count($rows) . ' rows imported.');
    }
}
