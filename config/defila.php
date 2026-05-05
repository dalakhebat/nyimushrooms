<?php

/*
|--------------------------------------------------------------------------
| Defila Branding & Authority Config
|--------------------------------------------------------------------------
|
| Nama yang muncul sebagai pihak "Mengetahui" dan "Disetujui" di setiap
| dokumen Pengajuan Pengeluaran (PDF + UI). Dipakai sebagai pengganti nama
| user yang login — supaya yang muncul selalu nama institusi/owner, bukan
| nama operator (misal staff).
|
| Kalau leadership berubah, edit di sini saja.
|
*/

return [

    'mengetahui' => [
        'nama' => 'Edy Junaedi',
        'jabatan' => 'Komisaris',
        'ttd_path' => 'images/signatures/edy.png',
    ],

    'disetujui' => [
        'nama' => 'Sri Retno Hadiningsih',
        'jabatan' => 'Direktur Utama',
        'ttd_path' => 'images/signatures/retno.png',
    ],

    /*
    |--------------------------------------------------------------------------
    | Bank Account Summary
    |--------------------------------------------------------------------------
    | Saldo efektif (available balance) di-update manual dari BNI iBank
    | "Informasi Saldo Summary". Selisih dengan saldo buku (computed dari
    | mutasi terakhir) = saldo hold (transaksi pending/scheduled).
    | Update saat dapat statement baru.
    */
    'bank' => [
        'bni_giro' => [
            'rekening' => '2047423575',
            'saldo_efektif' => 952471540,
            'saldo_efektif_per' => '2026-05-05 17:56',
        ],
    ],

];
