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

];
