import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useMemo } from 'react';
import MIcon from '@/Components/MIcon';

export default function TargetOperasional({ konfigurasi, totalGaji, karyawans, summaryPerBagian, kumbungs }) {
    const [activeTab, setActiveTab] = useState('alokasi');
    const [showJobdesk, setShowJobdesk] = useState(false);

    const { data, setData, post, processing } = useForm({
        // Kredit Investasi
        kredit_investasi_limit: konfigurasi.kredit_investasi_limit || 28000000000,
        kredit_investasi_tenor: konfigurasi.kredit_investasi_tenor || 120,
        kredit_investasi_bunga: konfigurasi.kredit_investasi_bunga || 6,

        // Kredit Modal Kerja
        kredit_modal_kerja_limit: konfigurasi.kredit_modal_kerja_limit || 2000000000,
        kredit_modal_kerja_tenor: konfigurasi.kredit_modal_kerja_tenor || 12,
        kredit_modal_kerja_bunga: konfigurasi.kredit_modal_kerja_bunga || 6,

        // Alokasi Dana
        alokasi_pembangunan_kumbung: konfigurasi.alokasi_pembangunan_kumbung || 0,
        alokasi_pembangunan_inkubasi: konfigurasi.alokasi_pembangunan_inkubasi || 0,
        alokasi_pembelian_bahan_baku: konfigurasi.alokasi_pembelian_bahan_baku || 0,
        alokasi_renovasi_kumbung: konfigurasi.alokasi_renovasi_kumbung || 0,
        alokasi_pembelian_mesin: konfigurasi.alokasi_pembelian_mesin || 0,
        alokasi_pembelian_lahan: konfigurasi.alokasi_pembelian_lahan || 0,
        alokasi_dana_cadangan: konfigurasi.alokasi_dana_cadangan || 0,

        // Overhead
        overhead_sewa: konfigurasi.overhead_sewa || 0,
        overhead_listrik: konfigurasi.overhead_listrik || 0,
        overhead_air: konfigurasi.overhead_air || 0,
        overhead_telepon: konfigurasi.overhead_telepon || 0,
        overhead_cicilan_kendaraan: konfigurasi.overhead_cicilan_kendaraan || 0,
        overhead_lainnya: konfigurasi.overhead_lainnya || 0,

        // Harga
        harga_jamur_per_kg: konfigurasi.harga_jamur_per_kg || 15000,
        harga_baglog_per_unit: konfigurasi.harga_baglog_per_unit || 2500,

        // Target
        target_profit_bulanan: konfigurasi.target_profit_bulanan || 0,
    });

    // Format number to rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(number);
    };

    // Format number with thousand separator
    const formatNumber = (number) => {
        return new Intl.NumberFormat('id-ID').format(Math.round(number));
    };

    // Parse input value
    const parseNumber = (value) => {
        return parseFloat(String(value).replace(/[^0-9.-]/g, '')) || 0;
    };

    // Calculate totals
    const calculations = useMemo(() => {
        // Total Alokasi
        const totalAlokasi = parseNumber(data.alokasi_pembangunan_kumbung) +
            parseNumber(data.alokasi_pembangunan_inkubasi) +
            parseNumber(data.alokasi_pembelian_bahan_baku) +
            parseNumber(data.alokasi_renovasi_kumbung) +
            parseNumber(data.alokasi_pembelian_mesin) +
            parseNumber(data.alokasi_pembelian_lahan) +
            parseNumber(data.alokasi_dana_cadangan);

        const sisaAlokasi = parseNumber(data.kredit_investasi_limit) - totalAlokasi;

        // Cicilan Kredit Investasi (Aflopend - flat)
        const pokokInvestasi = parseNumber(data.kredit_investasi_limit) / parseNumber(data.kredit_investasi_tenor);
        const bungaInvestasi = (parseNumber(data.kredit_investasi_limit) * (parseNumber(data.kredit_investasi_bunga) / 100)) / 12;
        const cicilanInvestasi = pokokInvestasi + bungaInvestasi;

        // Bunga Modal Kerja (Revolving - bayar bunga saja)
        const bungaModalKerja = (parseNumber(data.kredit_modal_kerja_limit) * (parseNumber(data.kredit_modal_kerja_bunga) / 100)) / 12;

        // Total Overhead
        const totalOverhead = parseNumber(totalGaji) +
            parseNumber(data.overhead_sewa) +
            parseNumber(data.overhead_listrik) +
            parseNumber(data.overhead_air) +
            parseNumber(data.overhead_telepon) +
            parseNumber(data.overhead_cicilan_kendaraan) +
            parseNumber(data.overhead_lainnya);

        // Total Pengeluaran Bulanan
        const totalPengeluaran = totalOverhead + cicilanInvestasi + bungaModalKerja;

        // Target Pendapatan
        const targetProfit = parseNumber(data.target_profit_bulanan);
        const targetPendapatan = totalPengeluaran + targetProfit;

        // Target Penjualan
        const hargaJamur = parseNumber(data.harga_jamur_per_kg);
        const hargaBaglog = parseNumber(data.harga_baglog_per_unit);
        const targetJamurKg = hargaJamur > 0 ? targetPendapatan / hargaJamur : 0;
        const targetBaglogUnit = hargaBaglog > 0 ? targetPendapatan / hargaBaglog : 0;

        // Target harian
        const targetJamurHarian = targetJamurKg / 30;
        const targetPendapatanHarian = targetPendapatan / 30;

        return {
            totalAlokasi,
            sisaAlokasi,
            pokokInvestasi,
            bungaInvestasi,
            cicilanInvestasi,
            bungaModalKerja,
            totalOverhead,
            totalPengeluaran,
            targetProfit,
            targetPendapatan,
            targetJamurKg,
            targetBaglogUnit,
            targetJamurHarian,
            targetPendapatanHarian,
        };
    }, [data, totalGaji]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('keuangan.konfigurasi.update'));
    };

    // Jobdesk based on bagian
    const getJobdesk = (bagian) => {
        const jobdeskMap = {
            'produksi': [
                'Menyiapkan dan mencampur bahan baku baglog',
                'Mengoperasikan mesin sterilisasi',
                'Melakukan inokulasi bibit jamur',
                'Memastikan kualitas baglog sesuai standar',
                'Mencatat hasil produksi harian',
            ],
            'budidaya': [
                'Memantau kondisi kumbung (suhu, kelembaban)',
                'Melakukan penyiraman sesuai jadwal',
                'Merawat baglog di kumbung',
                'Mendeteksi hama dan penyakit',
                'Melaporkan kondisi pertumbuhan jamur',
            ],
            'panen': [
                'Memanen jamur sesuai kriteria',
                'Melakukan sortasi dan grading',
                'Mencatat hasil panen harian',
                'Menjaga kebersihan area panen',
                'Memastikan kualitas jamur layak jual',
            ],
            'packing': [
                'Mengemas jamur sesuai pesanan',
                'Menimbang dan labeling produk',
                'Menyimpan produk di cold storage',
                'Menyiapkan produk untuk pengiriman',
                'Mencatat stok produk jadi',
            ],
            'sales': [
                'Melayani pelanggan dan menerima pesanan',
                'Mengkoordinasi pengiriman',
                'Mengelola hubungan dengan customer',
                'Membuat laporan penjualan',
                'Follow up pembayaran customer',
            ],
            'admin': [
                'Mengelola data dan dokumen',
                'Input data ke sistem',
                'Membuat laporan berkala',
                'Mengurus administrasi karyawan',
                'Koordinasi antar departemen',
            ],
            'driver': [
                'Mengantar produk ke customer',
                'Menjaga kondisi produk saat pengiriman',
                'Mengurus dokumen pengiriman',
                'Melaporkan status pengiriman',
                'Perawatan kendaraan operasional',
            ],
            'security': [
                'Menjaga keamanan area farm',
                'Mencatat keluar masuk tamu/kendaraan',
                'Patroli rutin area',
                'Memantau CCTV',
                'Laporan harian keamanan',
            ],
        };

        const bagianLower = (bagian || '').toLowerCase();
        return jobdeskMap[bagianLower] || [
            'Menjalankan tugas sesuai instruksi',
            'Melaporkan pekerjaan harian',
            'Menjaga kebersihan area kerja',
            'Koordinasi dengan tim',
            'Mengikuti SOP yang berlaku',
        ];
    };

    // Group karyawan by bagian
    const karyawanByBagian = useMemo(() => {
        const grouped = {};
        karyawans.forEach(k => {
            const bagian = k.bagian || 'Lainnya';
            if (!grouped[bagian]) {
                grouped[bagian] = [];
            }
            grouped[bagian].push(k);
        });
        return grouped;
    }, [karyawans]);

    const tabs = [
        { id: 'alokasi', name: 'Alokasi Dana', icon: 'solar:pie-chart-bold' },
        { id: 'overhead', name: 'Biaya Overhead', icon: 'solar:wallet-bold' },
        { id: 'target', name: 'Kalkulator Target', icon: 'solar:target-bold' },
    ];

    return (
        <AdminLayout title="Target Operasional">
            <Head title="Target Operasional" />

            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold">Target Operasional</h1>
                                <p className="text-blue-100 mt-1">Perencanaan keuangan kredit BNI - PT Defila Solusi Bersama Indonesia</p>
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-surface-container-lowest text-blue-700 rounded-xl hover:bg-blue-50 transition-colors flex items-center disabled:opacity-50"
                            >
                                <MIcon name="diskette" className="text-xl mr-2" />
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>

                    {/* Quick Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-on-tertiary-container">Total Pengeluaran/Bulan</p>
                                    <p className="text-xl font-bold text-red-600">{formatRupiah(calculations.totalPengeluaran)}</p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-xl">
                                    <MIcon name="account_balance_wallet" className="text-2xl text-red-600" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-on-tertiary-container">Target Profit/Bulan</p>
                                    <p className="text-xl font-bold text-secondary">{formatRupiah(calculations.targetProfit)}</p>
                                </div>
                                <div className="p-3 bg-emerald-100 rounded-xl">
                                    <MIcon name="leaderboard" className="text-2xl text-secondary" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-on-tertiary-container">Target Pendapatan/Bulan</p>
                                    <p className="text-xl font-bold text-blue-600">{formatRupiah(calculations.targetPendapatan)}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-xl">
                                    <MIcon name="account_balance" className="text-2xl text-blue-600" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-on-tertiary-container">Target Panen Jamur/Bulan</p>
                                    <p className="text-xl font-bold text-purple-600">{formatNumber(calculations.targetJamurKg)} Kg</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-xl">
                                    <MIcon name="eco" className="text-2xl text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm overflow-hidden">
                        <div className="border-b">
                            <div className="flex overflow-x-auto">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                                            activeTab === tab.id
                                                ? 'border-blue-600 text-blue-600'
                                                : 'border-transparent text-on-tertiary-container hover:text-on-surface-variant'
                                        }`}
                                    >
                                        <Icon icon={tab.icon} className="w-5 h-5 mr-2" />
                                        {tab.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Tab: Alokasi Dana */}
                            {activeTab === 'alokasi' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-headline font-bold text-on-surface">Alokasi Dana Kredit Investasi</h3>
                                        <div className="text-right">
                                            <p className="text-sm text-on-tertiary-container">Limit Kredit Investasi</p>
                                            <p className="text-xl font-bold text-blue-600">{formatRupiah(data.kredit_investasi_limit)}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { key: 'alokasi_pembangunan_kumbung', label: 'Pembangunan Kumbung Baru', icon: 'solar:home-add-bold' },
                                            { key: 'alokasi_pembangunan_inkubasi', label: 'Pembangunan Inkubasi', icon: 'solar:temperature-bold' },
                                            { key: 'alokasi_pembelian_bahan_baku', label: 'Pembelian Bahan Baku', icon: 'solar:box-bold' },
                                            { key: 'alokasi_renovasi_kumbung', label: 'Renovasi Kumbung Eksisting', icon: 'solar:hammer-bold' },
                                            { key: 'alokasi_pembelian_mesin', label: 'Pembelian Mesin Produksi', icon: 'solar:settings-bold' },
                                            { key: 'alokasi_pembelian_lahan', label: 'Pembelian Lahan', icon: 'solar:map-bold' },
                                            { key: 'alokasi_dana_cadangan', label: 'Dana Cadangan', icon: 'solar:safe-circle-bold' },
                                        ].map((item) => (
                                            <div key={item.key} className="flex items-center bg-surface-container-low rounded-xl p-4">
                                                <div className="p-2 bg-surface-container-lowest rounded-xl mr-3">
                                                    <Icon icon={item.icon} className="w-5 h-5 text-on-surface-variant" />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-on-surface-variant">{item.label}</label>
                                                    <input
                                                        type="number"
                                                        value={data[item.key]}
                                                        onChange={(e) => setData(item.key, parseNumber(e.target.value))}
                                                        className="mt-1 w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 text-right"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Summary */}
                                    <div className="border-t pt-4 mt-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-on-surface-variant">Total Dialokasikan:</span>
                                            <span className="text-lg font-bold">{formatRupiah(calculations.totalAlokasi)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-on-surface-variant">Sisa Belum Dialokasikan:</span>
                                            <span className={`text-lg font-bold ${calculations.sisaAlokasi < 0 ? 'text-red-600' : 'text-secondary'}`}>
                                                {formatRupiah(calculations.sisaAlokasi)}
                                            </span>
                                        </div>
                                        {calculations.sisaAlokasi < 0 && (
                                            <p className="text-red-500 text-sm mt-2">
                                                <MIcon name="warning" className="text-base inline mr-1" />
                                                Total alokasi melebihi limit kredit!
                                            </p>
                                        )}

                                        {/* Progress Bar */}
                                        <div className="mt-4">
                                            <div className="w-full bg-gray-200 rounded-full h-4">
                                                <div
                                                    className={`h-4 rounded-full transition-all ${calculations.sisaAlokasi < 0 ? 'bg-red-500' : 'bg-blue-600'}`}
                                                    style={{ width: `${Math.min((calculations.totalAlokasi / parseNumber(data.kredit_investasi_limit)) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-sm text-on-tertiary-container mt-1 text-center">
                                                {((calculations.totalAlokasi / parseNumber(data.kredit_investasi_limit)) * 100).toFixed(1)}% teralokasi
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tab: Biaya Overhead */}
                            {activeTab === 'overhead' && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-headline font-bold text-on-surface">Biaya Overhead Bulanan</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Gaji - Read Only */}
                                        <div className="flex items-center bg-blue-50 rounded-xl p-4">
                                            <div className="p-2 bg-blue-100 rounded-xl mr-3">
                                                <MIcon name="groups" className="text-xl text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-on-surface-variant">Gaji Karyawan</label>
                                                <p className="text-sm text-on-tertiary-container">{karyawans.length} karyawan aktif</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-blue-600">{formatRupiah(totalGaji)}</p>
                                                <p className="text-xs text-on-tertiary-container">dari sistem</p>
                                            </div>
                                        </div>

                                        {/* Manual Inputs */}
                                        {[
                                            { key: 'overhead_sewa', label: 'Sewa Kantor/Lahan', icon: 'solar:home-bold' },
                                            { key: 'overhead_listrik', label: 'Listrik', icon: 'solar:bolt-bold' },
                                            { key: 'overhead_air', label: 'Air', icon: 'solar:water-bold' },
                                            { key: 'overhead_telepon', label: 'Telepon/Internet', icon: 'solar:phone-bold' },
                                            { key: 'overhead_cicilan_kendaraan', label: 'Cicilan Kendaraan Ops', icon: 'solar:bus-bold' },
                                            { key: 'overhead_lainnya', label: 'Lain-lain', icon: 'solar:widget-bold' },
                                        ].map((item) => (
                                            <div key={item.key} className="flex items-center bg-surface-container-low rounded-xl p-4">
                                                <div className="p-2 bg-surface-container-lowest rounded-xl mr-3">
                                                    <Icon icon={item.icon} className="w-5 h-5 text-on-surface-variant" />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-on-surface-variant">{item.label}</label>
                                                    <input
                                                        type="number"
                                                        value={data[item.key]}
                                                        onChange={(e) => setData(item.key, parseNumber(e.target.value))}
                                                        className="mt-1 w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 text-right"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Summary */}
                                    <div className="bg-orange-50 rounded-xl p-6">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-orange-800 font-bold">Total Biaya Overhead per Bulan</p>
                                                <p className="text-sm text-orange-600">Gaji + Operasional</p>
                                            </div>
                                            <p className="text-2xl font-bold text-orange-600">{formatRupiah(calculations.totalOverhead)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tab: Kalkulator Target */}
                            {activeTab === 'target' && (
                                <div className="space-y-6">
                                    {/* Input Target Profit */}
                                    <div className="bg-emerald-50 rounded-xl p-6">
                                        <h3 className="text-lg font-bold text-primary mb-4 flex items-center">
                                            <MIcon name="star" className="text-xl mr-2" />
                                            Target Profit Bulanan
                                        </h3>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-1">
                                                <input
                                                    type="number"
                                                    value={data.target_profit_bulanan}
                                                    onChange={(e) => setData('target_profit_bulanan', parseNumber(e.target.value))}
                                                    className="w-full px-4 py-3 text-xl font-bold border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-secondary text-right"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <span className="text-lg text-on-surface-variant">/ bulan</span>
                                        </div>
                                    </div>

                                    {/* Harga Jual */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-surface-container-low rounded-xl p-4">
                                            <label className="block text-sm font-medium text-on-surface-variant mb-2">Harga Jual Jamur per Kg</label>
                                            <input
                                                type="number"
                                                value={data.harga_jamur_per_kg}
                                                onChange={(e) => setData('harga_jamur_per_kg', parseNumber(e.target.value))}
                                                className="w-full px-3 py-2 border rounded-xl text-right"
                                            />
                                        </div>
                                        <div className="bg-surface-container-low rounded-xl p-4">
                                            <label className="block text-sm font-medium text-on-surface-variant mb-2">Harga Jual Baglog per Unit</label>
                                            <input
                                                type="number"
                                                value={data.harga_baglog_per_unit}
                                                onChange={(e) => setData('harga_baglog_per_unit', parseNumber(e.target.value))}
                                                className="w-full px-3 py-2 border rounded-xl text-right"
                                            />
                                        </div>
                                    </div>

                                    {/* Calculation Breakdown */}
                                    <div className="bg-surface-container-lowest border-2 border-outline-variant/15 rounded-xl overflow-hidden">
                                        <div className="bg-surface-container-low px-6 py-3">
                                            <h4 className="font-bold text-on-surface">Kalkulasi Target Pendapatan</h4>
                                        </div>
                                        <div className="p-6 space-y-3">
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="text-on-surface-variant">Biaya Overhead</span>
                                                <span className="font-medium">{formatRupiah(calculations.totalOverhead)}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="text-on-surface-variant">Cicilan Kredit Investasi</span>
                                                <span className="font-medium">{formatRupiah(calculations.cicilanInvestasi)}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="text-on-surface-variant">Bunga Modal Kerja</span>
                                                <span className="font-medium">{formatRupiah(calculations.bungaModalKerja)}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b bg-red-50 -mx-6 px-6">
                                                <span className="text-red-700 font-bold">Total Pengeluaran</span>
                                                <span className="font-bold text-red-700">{formatRupiah(calculations.totalPengeluaran)}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="text-secondary">+ Target Profit</span>
                                                <span className="font-medium text-secondary">{formatRupiah(calculations.targetProfit)}</span>
                                            </div>
                                            <div className="flex justify-between py-3 bg-blue-50 -mx-6 px-6 -mb-6">
                                                <span className="text-blue-800 font-bold text-lg">TARGET PENDAPATAN</span>
                                                <span className="font-bold text-blue-800 text-xl">{formatRupiah(calculations.targetPendapatan)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Target Penjualan */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-6 text-white">
                                            <div className="flex items-center mb-4">
                                                <MIcon name="eco" className="text-3xl mr-3" />
                                                <div>
                                                    <p className="text-purple-200">Target Penjualan Jamur</p>
                                                    <p className="text-3xl font-bold">{formatNumber(calculations.targetJamurKg)} Kg</p>
                                                </div>
                                            </div>
                                            <div className="border-t border-purple-400 pt-3 mt-3">
                                                <p className="text-sm text-purple-200">Target Harian: <span className="font-bold text-white">{formatNumber(calculations.targetJamurHarian)} Kg/hari</span></p>
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl p-6 text-white">
                                            <div className="flex items-center mb-4">
                                                <MIcon name="layers" className="text-3xl mr-3" />
                                                <div>
                                                    <p className="text-indigo-200">ATAU Penjualan Baglog</p>
                                                    <p className="text-3xl font-bold">{formatNumber(calculations.targetBaglogUnit)} Unit</p>
                                                </div>
                                            </div>
                                            <div className="border-t border-indigo-400 pt-3 mt-3">
                                                <p className="text-sm text-indigo-200">Target Harian: <span className="font-bold text-white">{formatNumber(calculations.targetBaglogUnit / 30)} unit/hari</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Jobdesk Section */}
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setShowJobdesk(!showJobdesk)}
                            className="w-full px-6 py-4 flex items-center justify-between text-left bg-surface-container-low hover:bg-surface-container-low transition-colors"
                        >
                            <div className="flex items-center">
                                <MIcon name="groups" className="text-xl mr-3 text-purple-600" />
                                <span className="font-bold text-on-surface">Jobdesk Karyawan ({karyawans.length} orang)</span>
                            </div>
                            <Icon
                                icon="solar:alt-arrow-down-bold"
                                className={`w-5 h-5 text-on-tertiary-container transition-transform ${showJobdesk ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {showJobdesk && (
                            <div className="p-6">
                                {/* Summary per Bagian */}
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
                                    {summaryPerBagian.map((item) => (
                                        <div key={item.bagian} className="p-3 bg-surface-container-low rounded-xl text-center">
                                            <p className="text-xs text-on-tertiary-container uppercase">{item.bagian || 'Lainnya'}</p>
                                            <p className="text-xl font-bold text-on-surface">{item.jumlah}</p>
                                            <p className="text-xs text-on-tertiary-container">{formatRupiah(item.total_gaji)}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Jobdesk per Bagian */}
                                <div className="space-y-4">
                                    {Object.entries(karyawanByBagian).map(([bagian, employees]) => (
                                        <div key={bagian} className="border rounded-xl overflow-hidden">
                                            <div className="bg-surface-container-low px-4 py-3 flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <MIcon name="groups" className="text-xl mr-2 text-on-surface-variant" />
                                                    <span className="font-bold text-on-surface">{bagian}</span>
                                                    <span className="ml-2 px-2 py-0.5 bg-gray-200 rounded-full text-xs text-on-surface-variant">
                                                        {employees.length} orang
                                                    </span>
                                                </div>
                                                <span className="text-sm text-on-surface-variant">
                                                    Total: {formatRupiah(employees.reduce((s, e) => s + (e.nominal_gaji || 0), 0))}
                                                </span>
                                            </div>
                                            <div className="p-4">
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                    {/* Employee List */}
                                                    <div>
                                                        <p className="text-sm font-medium text-on-surface-variant mb-2">Anggota:</p>
                                                        <div className="space-y-2">
                                                            {employees.map((emp) => (
                                                                <div key={emp.id} className="flex items-center justify-between text-sm p-2 bg-surface-container-low rounded">
                                                                    <span className="text-on-surface">{emp.nama}</span>
                                                                    <span className="text-on-tertiary-container">
                                                                        {emp.tipe_gaji === 'bulanan' ? 'Bulanan' : 'Harian'} - {formatRupiah(emp.nominal_gaji)}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {/* Jobdesk */}
                                                    <div>
                                                        <p className="text-sm font-medium text-on-surface-variant mb-2">Jobdesk:</p>
                                                        <ul className="space-y-1">
                                                            {getJobdesk(bagian).map((job, idx) => (
                                                                <li key={idx} className="flex items-start text-sm text-on-surface-variant">
                                                                    <MIcon name="check_circle" className="text-base mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                                                                    {job}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
