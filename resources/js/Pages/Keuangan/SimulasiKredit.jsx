import { useState, useMemo } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Icon } from '@iconify/react';

export default function SimulasiKredit({ konfigurasi, totalGaji, contextData }) {
    const { data, setData, post, processing } = useForm({
        kredit_investasi_limit: konfigurasi?.kredit_investasi_limit || 28000000000,
        kredit_investasi_tenor: konfigurasi?.kredit_investasi_tenor || 120,
        kredit_investasi_bunga: konfigurasi?.kredit_investasi_bunga || 6,
        kredit_modal_kerja_limit: konfigurasi?.kredit_modal_kerja_limit || 2000000000,
        kredit_modal_kerja_tenor: konfigurasi?.kredit_modal_kerja_tenor || 12,
        kredit_modal_kerja_bunga: konfigurasi?.kredit_modal_kerja_bunga || 6,
    });

    const [activeTab, setActiveTab] = useState('investasi');

    // Format currency
    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(angka);
    };

    // Format currency singkat (miliar/juta)
    const formatRupiahSingkat = (angka) => {
        if (angka >= 1_000_000_000) {
            return `Rp ${(angka / 1_000_000_000).toFixed(1)} M`;
        } else if (angka >= 1_000_000) {
            return `Rp ${(angka / 1_000_000).toFixed(0)} Jt`;
        }
        return formatRupiah(angka);
    };

    // Kalkulasi Kredit Investasi
    const kalkulasiInvestasi = useMemo(() => {
        const pokokPinjaman = parseFloat(data.kredit_investasi_limit) || 0;
        const tenorBulan = parseInt(data.kredit_investasi_tenor) || 1;
        const bungaTahunan = parseFloat(data.kredit_investasi_bunga) || 0;

        const cicilanPokok = pokokPinjaman / tenorBulan;
        const bungaPerBulan = (pokokPinjaman * (bungaTahunan / 100)) / 12;
        const totalCicilanBulanan = cicilanPokok + bungaPerBulan;
        const totalPembayaran = totalCicilanBulanan * tenorBulan;
        const totalBunga = bungaPerBulan * tenorBulan;

        // Ringkasan per tahun
        const tenorTahun = Math.ceil(tenorBulan / 12);
        const ringkasanTahunan = [];
        let sisaPokok = pokokPinjaman;

        for (let tahun = 1; tahun <= tenorTahun; tahun++) {
            const bulanDiTahunIni = tahun === tenorTahun ? (tenorBulan % 12 || 12) : 12;
            sisaPokok -= cicilanPokok * bulanDiTahunIni;
            ringkasanTahunan.push({
                tahun,
                totalPokok: cicilanPokok * bulanDiTahunIni,
                totalBunga: bungaPerBulan * bulanDiTahunIni,
                totalBayar: totalCicilanBulanan * bulanDiTahunIni,
                sisaPokokAkhirTahun: Math.max(0, sisaPokok),
            });
        }

        return {
            pokokPinjaman,
            tenorBulan,
            bungaTahunan,
            cicilanPokok,
            bungaPerBulan,
            totalCicilanBulanan,
            totalPembayaran,
            totalBunga,
            ringkasanTahunan,
        };
    }, [data.kredit_investasi_limit, data.kredit_investasi_tenor, data.kredit_investasi_bunga]);

    // Kalkulasi Kredit Modal Kerja
    const kalkulasiModalKerja = useMemo(() => {
        const pokokPinjaman = parseFloat(data.kredit_modal_kerja_limit) || 0;
        const tenorBulan = parseInt(data.kredit_modal_kerja_tenor) || 1;
        const bungaTahunan = parseFloat(data.kredit_modal_kerja_bunga) || 0;

        const bungaPerBulan = (pokokPinjaman * (bungaTahunan / 100)) / 12;
        const totalBunga = bungaPerBulan * tenorBulan;

        return {
            pokokPinjaman,
            tenorBulan,
            bungaTahunan,
            bungaPerBulan,
            totalBunga,
        };
    }, [data.kredit_modal_kerja_limit, data.kredit_modal_kerja_tenor, data.kredit_modal_kerja_bunga]);

    // Total Kewajiban Bulanan
    const totalKewajibanBulanan = kalkulasiInvestasi.totalCicilanBulanan + kalkulasiModalKerja.bungaPerBulan;

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('keuangan.konfigurasi.update'));
    };

    // Preset jumlah pinjaman investasi (dalam miliar)
    const presetInvestasi = [20, 25, 28, 30, 35, 40];

    return (
        <AdminLayout title="Simulasi Kredit">
            <Head title="Simulasi Kredit" />

            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <Icon icon="solar:calculator-bold" className="w-8 h-8" />
                                    <h1 className="text-2xl font-bold">Simulasi Kredit BNI</h1>
                                </div>
                                <p className="text-blue-100">
                                    PT Defila Solusi Bersama Indonesia - Kredit Investasi & Modal Kerja
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors flex items-center disabled:opacity-50"
                            >
                                <Icon icon="solar:diskette-bold" className="w-5 h-5 mr-2" />
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
                            <div className="flex items-center gap-2 mb-2">
                                <Icon icon="solar:buildings-bold" className="w-5 h-5 opacity-80" />
                                <span className="text-sm font-medium opacity-90">Cicilan Investasi</span>
                            </div>
                            <p className="text-2xl font-bold">{formatRupiahSingkat(kalkulasiInvestasi.totalCicilanBulanan)}</p>
                            <p className="text-xs opacity-75 mt-1">per bulan</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
                            <div className="flex items-center gap-2 mb-2">
                                <Icon icon="solar:refresh-circle-bold" className="w-5 h-5 opacity-80" />
                                <span className="text-sm font-medium opacity-90">Bunga Modal Kerja</span>
                            </div>
                            <p className="text-2xl font-bold">{formatRupiahSingkat(kalkulasiModalKerja.bungaPerBulan)}</p>
                            <p className="text-xs opacity-75 mt-1">per bulan</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
                            <div className="flex items-center gap-2 mb-2">
                                <Icon icon="solar:wallet-bold" className="w-5 h-5 opacity-80" />
                                <span className="text-sm font-medium opacity-90">Total Kewajiban</span>
                            </div>
                            <p className="text-2xl font-bold">{formatRupiahSingkat(totalKewajibanBulanan)}</p>
                            <p className="text-xs opacity-75 mt-1">per bulan</p>
                        </div>
                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white">
                            <div className="flex items-center gap-2 mb-2">
                                <Icon icon="solar:money-bag-bold" className="w-5 h-5 opacity-80" />
                                <span className="text-sm font-medium opacity-90">Total Pinjaman</span>
                            </div>
                            <p className="text-2xl font-bold">{formatRupiahSingkat(kalkulasiInvestasi.pokokPinjaman + kalkulasiModalKerja.pokokPinjaman)}</p>
                            <p className="text-xs opacity-75 mt-1">Rp 30 Miliar</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="border-b">
                            <div className="flex">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('investasi')}
                                    className={`flex-1 flex items-center justify-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                        activeTab === 'investasi'
                                            ? 'border-blue-600 text-blue-600 bg-blue-50'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <Icon icon="solar:buildings-bold" className="w-5 h-5 mr-2" />
                                    Kredit Investasi (Rp 28M)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('modal-kerja')}
                                    className={`flex-1 flex items-center justify-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                        activeTab === 'modal-kerja'
                                            ? 'border-green-600 text-green-600 bg-green-50'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <Icon icon="solar:refresh-circle-bold" className="w-5 h-5 mr-2" />
                                    Modal Kerja (Rp 2M)
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Tab: Kredit Investasi */}
                            {activeTab === 'investasi' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Jumlah Pinjaman */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-medium text-gray-700">Jumlah Pinjaman</label>
                                                <span className="text-2xl font-bold text-blue-600">
                                                    {formatRupiahSingkat(data.kredit_investasi_limit)}
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="5000000000"
                                                max="50000000000"
                                                step="1000000000"
                                                value={data.kredit_investasi_limit}
                                                onChange={(e) => setData('kredit_investasi_limit', parseFloat(e.target.value))}
                                                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <div className="flex flex-wrap gap-2">
                                                {presetInvestasi.map((val) => (
                                                    <button
                                                        key={val}
                                                        type="button"
                                                        onClick={() => setData('kredit_investasi_limit', val * 1000000000)}
                                                        className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                                                            data.kredit_investasi_limit === val * 1000000000
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        {val} M
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Tenor */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-medium text-gray-700">Tenor</label>
                                                <span className="text-2xl font-bold text-green-600">
                                                    {Math.floor(data.kredit_investasi_tenor / 12)} Tahun
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="12"
                                                max="240"
                                                step="12"
                                                value={data.kredit_investasi_tenor}
                                                onChange={(e) => setData('kredit_investasi_tenor', parseInt(e.target.value))}
                                                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>1 Thn</span>
                                                <span>5 Thn</span>
                                                <span>10 Thn</span>
                                                <span>15 Thn</span>
                                                <span>20 Thn</span>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                = <span className="font-semibold">{data.kredit_investasi_tenor} bulan</span>
                                            </p>
                                        </div>

                                        {/* Bunga */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-medium text-gray-700">Bunga per Tahun</label>
                                                <span className="text-2xl font-bold text-orange-600">
                                                    {data.kredit_investasi_bunga}%
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="1"
                                                max="20"
                                                step="0.5"
                                                value={data.kredit_investasi_bunga}
                                                onChange={(e) => setData('kredit_investasi_bunga', parseFloat(e.target.value))}
                                                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>1%</span>
                                                <span>5%</span>
                                                <span>10%</span>
                                                <span>15%</span>
                                                <span>20%</span>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                Bunga flat: <span className="font-semibold">{(data.kredit_investasi_bunga / 12).toFixed(2)}%/bulan</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Formula & Ringkasan */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 rounded-xl p-6">
                                            <h4 className="font-semibold text-gray-800 mb-4">Formula Perhitungan (Aflopend)</h4>
                                            <div className="space-y-3 text-sm font-mono">
                                                <div className="p-3 bg-white rounded-lg">
                                                    <p className="text-gray-600">Pokok/Bulan = Pinjaman ÷ Tenor</p>
                                                    <p className="text-green-600 font-semibold">= {formatRupiah(kalkulasiInvestasi.cicilanPokok)}</p>
                                                </div>
                                                <div className="p-3 bg-white rounded-lg">
                                                    <p className="text-gray-600">Bunga/Bulan = (Pinjaman × Bunga%) ÷ 12</p>
                                                    <p className="text-orange-600 font-semibold">= {formatRupiah(kalkulasiInvestasi.bungaPerBulan)}</p>
                                                </div>
                                                <div className="p-3 bg-blue-100 rounded-lg border-2 border-blue-300">
                                                    <p className="text-gray-700">Total Cicilan/Bulan</p>
                                                    <p className="text-blue-700 font-bold text-lg">= {formatRupiah(kalkulasiInvestasi.totalCicilanBulanan)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-6">
                                            <h4 className="font-semibold text-gray-800 mb-4">Ringkasan</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between py-2 border-b">
                                                    <span className="text-gray-600">Pokok Pinjaman</span>
                                                    <span className="font-semibold">{formatRupiah(kalkulasiInvestasi.pokokPinjaman)}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b">
                                                    <span className="text-gray-600">Total Bunga</span>
                                                    <span className="font-semibold text-orange-600">{formatRupiah(kalkulasiInvestasi.totalBunga)}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b">
                                                    <span className="text-gray-600">Cicilan/Bulan</span>
                                                    <span className="font-semibold text-blue-600">{formatRupiah(kalkulasiInvestasi.totalCicilanBulanan)}</span>
                                                </div>
                                                <div className="flex justify-between py-3 bg-purple-50 rounded-lg px-3 -mx-3">
                                                    <span className="font-medium">Total Pembayaran</span>
                                                    <span className="font-bold text-purple-600">{formatRupiah(kalkulasiInvestasi.totalPembayaran)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Jadwal Angsuran */}
                                    <div className="bg-white border rounded-xl overflow-hidden">
                                        <div className="bg-gray-50 px-6 py-3 border-b">
                                            <h4 className="font-semibold text-gray-800">Jadwal Angsuran per Tahun</h4>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="bg-gray-50">
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Tahun</th>
                                                        <th className="px-4 py-3 text-right font-semibold text-gray-700">Angsuran Pokok</th>
                                                        <th className="px-4 py-3 text-right font-semibold text-gray-700">Angsuran Bunga</th>
                                                        <th className="px-4 py-3 text-right font-semibold text-gray-700">Total Bayar</th>
                                                        <th className="px-4 py-3 text-right font-semibold text-gray-700">Sisa Pokok</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y">
                                                    {kalkulasiInvestasi.ringkasanTahunan.map((row) => (
                                                        <tr key={row.tahun} className="hover:bg-gray-50">
                                                            <td className="px-4 py-3 font-medium">Tahun {row.tahun}</td>
                                                            <td className="px-4 py-3 text-right text-green-600">{formatRupiah(row.totalPokok)}</td>
                                                            <td className="px-4 py-3 text-right text-orange-600">{formatRupiah(row.totalBunga)}</td>
                                                            <td className="px-4 py-3 text-right font-semibold">{formatRupiah(row.totalBayar)}</td>
                                                            <td className="px-4 py-3 text-right text-gray-600">{formatRupiah(row.sisaPokokAkhirTahun)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                    <tr className="bg-blue-50 font-semibold">
                                                        <td className="px-4 py-3">TOTAL</td>
                                                        <td className="px-4 py-3 text-right text-green-700">{formatRupiah(kalkulasiInvestasi.pokokPinjaman)}</td>
                                                        <td className="px-4 py-3 text-right text-orange-700">{formatRupiah(kalkulasiInvestasi.totalBunga)}</td>
                                                        <td className="px-4 py-3 text-right text-blue-700">{formatRupiah(kalkulasiInvestasi.totalPembayaran)}</td>
                                                        <td className="px-4 py-3 text-right">Rp 0</td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tab: Modal Kerja */}
                            {activeTab === 'modal-kerja' && (
                                <div className="space-y-6">
                                    <div className="bg-green-50 rounded-xl p-6">
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="p-3 bg-green-100 rounded-lg">
                                                <Icon icon="solar:refresh-circle-bold" className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-green-800">Kredit Modal Kerja (Revolving)</h3>
                                                <p className="text-sm text-green-600">Fasilitas kredit yang dapat ditarik dan dibayar berulang selama masa kredit</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Limit Kredit</label>
                                                <input
                                                    type="number"
                                                    value={data.kredit_modal_kerja_limit}
                                                    onChange={(e) => setData('kredit_modal_kerja_limit', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 border rounded-lg text-right text-lg"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">{formatRupiah(data.kredit_modal_kerja_limit)}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Tenor (Bulan)</label>
                                                <input
                                                    type="number"
                                                    value={data.kredit_modal_kerja_tenor}
                                                    onChange={(e) => setData('kredit_modal_kerja_tenor', parseInt(e.target.value) || 1)}
                                                    className="w-full px-4 py-3 border rounded-lg text-right text-lg"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Bunga (% p.a)</label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={data.kredit_modal_kerja_bunga}
                                                    onChange={(e) => setData('kredit_modal_kerja_bunga', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 border rounded-lg text-right text-lg"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white border-2 border-green-200 rounded-xl p-6">
                                            <h4 className="font-semibold text-gray-800 mb-4">Kalkulasi Bunga Bulanan</h4>
                                            <div className="space-y-3 font-mono text-sm">
                                                <div className="p-3 bg-gray-50 rounded-lg">
                                                    <p className="text-gray-600">Bunga/Bulan = (Limit × Bunga%) ÷ 12</p>
                                                    <p className="text-gray-800">= ({formatRupiahSingkat(data.kredit_modal_kerja_limit)} × {data.kredit_modal_kerja_bunga}%) ÷ 12</p>
                                                </div>
                                                <div className="p-4 bg-green-100 rounded-lg border-2 border-green-300">
                                                    <p className="text-gray-700">Bunga per Bulan</p>
                                                    <p className="text-green-700 font-bold text-2xl">{formatRupiah(kalkulasiModalKerja.bungaPerBulan)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-amber-50 rounded-xl p-6">
                                            <h4 className="font-semibold text-amber-800 mb-4 flex items-center gap-2">
                                                <Icon icon="solar:info-circle-bold" className="w-5 h-5" />
                                                Cara Kerja Revolving
                                            </h4>
                                            <ul className="space-y-2 text-sm text-amber-900">
                                                <li className="flex items-start gap-2">
                                                    <Icon icon="solar:check-circle-bold" className="w-4 h-4 mt-0.5 text-amber-600" />
                                                    Setiap bulan hanya bayar <strong>bunga saja</strong>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <Icon icon="solar:check-circle-bold" className="w-4 h-4 mt-0.5 text-amber-600" />
                                                    Pokok dibayar di akhir tenor atau bisa diperpanjang
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <Icon icon="solar:check-circle-bold" className="w-4 h-4 mt-0.5 text-amber-600" />
                                                    Bisa tarik dana kapan saja sesuai kebutuhan
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <Icon icon="solar:check-circle-bold" className="w-4 h-4 mt-0.5 text-amber-600" />
                                                    Bunga dihitung dari dana yang ditarik
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="bg-gray-100 rounded-xl p-6">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-gray-600">Total Bunga selama {data.kredit_modal_kerja_tenor} bulan</p>
                                                <p className="text-sm text-gray-500">(jika limit terpakai penuh)</p>
                                            </div>
                                            <p className="text-2xl font-bold text-gray-800">{formatRupiah(kalkulasiModalKerja.totalBunga)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info Bank */}
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <Icon icon="solar:bank-bold" className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-1">Catatan Kredit BNI</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>* Kredit Investasi: Aflopend (cicilan pokok + bunga tetap)</li>
                                    <li>* Kredit Modal Kerja: Revolving (bayar bunga, pokok di akhir)</li>
                                    <li>* Suku bunga aktual mengacu pada ketentuan BNI</li>
                                    <li>* Belum termasuk provisi 0.25% dan biaya administrasi 1‰</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
