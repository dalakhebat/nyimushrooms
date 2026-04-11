import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    ScaleIcon,
    ShoppingCartIcon,
    BanknotesIcon,
    ArrowDownTrayIcon,
    ChartBarIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

export default function LaporanIndex({ laporanPanen, laporanPenjualan, laporanKeuangan, summary, tipe, filters }) {
    const [activeTab, setActiveTab] = useState(tipe || 'panen');

    const months = [
        { value: 1, label: 'Januari' },
        { value: 2, label: 'Februari' },
        { value: 3, label: 'Maret' },
        { value: 4, label: 'April' },
        { value: 5, label: 'Mei' },
        { value: 6, label: 'Juni' },
        { value: 7, label: 'Juli' },
        { value: 8, label: 'Agustus' },
        { value: 9, label: 'September' },
        { value: 10, label: 'Oktober' },
        { value: 11, label: 'November' },
        { value: 12, label: 'Desember' },
    ];

    const years = [];
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= 2023; y--) {
        years.push(y);
    }

    const handleTabChange = (newTipe) => {
        setActiveTab(newTipe);
        router.get('/laporan', { ...filters, tipe: newTipe }, { preserveState: true });
    };

    const handleFilter = (key, value) => {
        router.get('/laporan', { ...filters, tipe: activeTab, [key]: value }, { preserveState: true });
    };

    const formatCurrency = (num) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('id-ID').format(num || 0);
    };

    // Calculate max for chart scaling
    const maxPanen = Math.max(...(laporanPanen.perHari?.map(d => d.total) || [0]), 1);

    return (
        <AdminLayout title="Laporan">
            <Head title="Laporan" />

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-secondary p-3 rounded-xl">
                            <ScaleIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-on-tertiary-container">Total Panen</p>
                            <p className="text-xl font-bold text-on-surface">{formatNumber(summary.totalPanen)} kg</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-blue-500 p-3 rounded-xl">
                            <ShoppingCartIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-on-tertiary-container">Penjualan Baglog</p>
                            <p className="text-lg font-headline font-bold text-on-surface">{formatCurrency(summary.totalPenjualanBaglog)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-purple-500 p-3 rounded-xl">
                            <ShoppingCartIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-on-tertiary-container">Penjualan Jamur</p>
                            <p className="text-lg font-headline font-bold text-on-surface">{formatCurrency(summary.totalPenjualanJamur)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-red-500 p-3 rounded-xl">
                            <BanknotesIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-on-tertiary-container">Total Gaji</p>
                            <p className="text-lg font-headline font-bold text-on-surface">{formatCurrency(summary.totalPenggajian)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Tabs */}
            <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm mb-6">
                <div className="p-4 border-b border-outline-variant/15">
                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={filters.bulan}
                            onChange={(e) => handleFilter('bulan', e.target.value)}
                            className="px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                        >
                            {months.map((m) => (
                                <option key={m.value} value={m.value}>{m.label}</option>
                            ))}
                        </select>
                        <select
                            value={filters.tahun}
                            onChange={(e) => handleFilter('tahun', e.target.value)}
                            className="px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                        >
                            {years.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                        <div className="flex-1"></div>
                        <a
                            href={`/laporan/export/pdf?bulan=${filters.bulan}&tahun=${filters.tahun}&tipe=${activeTab}`}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700"
                        >
                            <ArrowDownTrayIcon className="w-5 h-5 mr-1" />
                            Download PDF
                        </a>
                    </div>
                </div>

                <div className="border-b border-outline-variant/15">
                    <nav className="flex -mb-px">
                        <button
                            onClick={() => handleTabChange('panen')}
                            className={`px-6 py-4 text-sm font-medium border-b-2 ${
                                activeTab === 'panen'
                                    ? 'border-green-500 text-secondary'
                                    : 'border-transparent text-on-tertiary-container hover:text-on-surface-variant hover:border-outline-variant/30'
                            }`}
                        >
                            <ScaleIcon className="w-5 h-5 inline-block mr-2" />
                            Laporan Panen
                        </button>
                        <button
                            onClick={() => handleTabChange('penjualan')}
                            className={`px-6 py-4 text-sm font-medium border-b-2 ${
                                activeTab === 'penjualan'
                                    ? 'border-green-500 text-secondary'
                                    : 'border-transparent text-on-tertiary-container hover:text-on-surface-variant hover:border-outline-variant/30'
                            }`}
                        >
                            <ShoppingCartIcon className="w-5 h-5 inline-block mr-2" />
                            Laporan Penjualan
                        </button>
                        <button
                            onClick={() => handleTabChange('keuangan')}
                            className={`px-6 py-4 text-sm font-medium border-b-2 ${
                                activeTab === 'keuangan'
                                    ? 'border-green-500 text-secondary'
                                    : 'border-transparent text-on-tertiary-container hover:text-on-surface-variant hover:border-outline-variant/30'
                            }`}
                        >
                            <BanknotesIcon className="w-5 h-5 inline-block mr-2" />
                            Laporan Keuangan
                        </button>
                    </nav>
                </div>
            </div>

            {/* Laporan Panen */}
            {activeTab === 'panen' && (
                <div className="space-y-6">
                    {/* Chart */}
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-6">
                        <h3 className="text-lg font-bold text-on-surface mb-4">Grafik Panen Harian</h3>
                        {laporanPanen.perHari?.length > 0 ? (
                            <div className="flex items-end space-x-1 h-48 overflow-x-auto">
                                {laporanPanen.perHari.map((item, index) => (
                                    <div key={index} className="flex flex-col items-center min-w-[40px]">
                                        <div
                                            className="w-8 bg-secondary rounded-t"
                                            style={{ height: `${(item.total / maxPanen) * 150}px` }}
                                            title={`${item.total} kg`}
                                        ></div>
                                        <span className="text-xs text-on-tertiary-container mt-1">{item.tanggal}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-on-tertiary-container text-center py-8">Belum ada data panen</p>
                        )}
                    </div>

                    {/* Per Kumbung */}
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm overflow-hidden">
                        <div className="p-6 border-b border-outline-variant/15">
                            <h3 className="text-lg font-headline font-bold text-on-surface">Panen per Kumbung</h3>
                        </div>
                        <table className="w-full">
                            <thead className="bg-surface-container-low">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Kumbung</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-on-tertiary-container uppercase">Jumlah Hari</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-on-tertiary-container uppercase">Total Panen</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {laporanPanen.perKumbung?.length > 0 ? (
                                    laporanPanen.perKumbung.map((item) => (
                                        <tr key={item.id} className="hover:bg-surface-container-low">
                                            <td className="px-6 py-4 font-medium text-on-surface">{item.nama}</td>
                                            <td className="px-6 py-4 text-center text-on-surface-variant">{item.jumlah_hari} hari</td>
                                            <td className="px-6 py-4 text-right font-bold text-secondary">{formatNumber(item.total_panen)} kg</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-on-tertiary-container">
                                            Belum ada data panen
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className="bg-surface-container-low">
                                <tr>
                                    <td colSpan="2" className="px-6 py-3 text-right font-medium text-on-surface-variant">Total:</td>
                                    <td className="px-6 py-3 text-right font-bold text-secondary">{formatNumber(laporanPanen.total)} kg</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}

            {/* Laporan Penjualan */}
            {activeTab === 'penjualan' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Penjualan Baglog */}
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm overflow-hidden">
                        <div className="p-6 border-b border-outline-variant/15 bg-blue-50">
                            <h3 className="text-lg font-bold text-blue-800">Penjualan Baglog</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-on-surface-variant">Jumlah Transaksi</span>
                                <span className="font-bold">{formatNumber(laporanPenjualan.baglog.count)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-on-surface-variant">Total Baglog Terjual</span>
                                <span className="font-bold">{formatNumber(laporanPenjualan.baglog.jumlah)} baglog</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-on-surface-variant">Total Nilai</span>
                                <span className="font-bold text-blue-600">{formatCurrency(laporanPenjualan.baglog.total)}</span>
                            </div>
                            <hr />
                            <div className="flex justify-between items-center">
                                <span className="text-secondary">Lunas</span>
                                <span className="font-bold text-secondary">{formatCurrency(laporanPenjualan.baglog.status.lunas)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-yellow-600">Pending</span>
                                <span className="font-bold text-yellow-600">{formatCurrency(laporanPenjualan.baglog.status.pending)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Penjualan Jamur */}
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm overflow-hidden">
                        <div className="p-6 border-b border-outline-variant/15 bg-purple-50">
                            <h3 className="text-lg font-bold text-purple-800">Penjualan Jamur</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-on-surface-variant">Jumlah Transaksi</span>
                                <span className="font-bold">{formatNumber(laporanPenjualan.jamur.count)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-on-surface-variant">Total Berat Terjual</span>
                                <span className="font-bold">{formatNumber(laporanPenjualan.jamur.berat)} kg</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-on-surface-variant">Total Nilai</span>
                                <span className="font-bold text-purple-600">{formatCurrency(laporanPenjualan.jamur.total)}</span>
                            </div>
                            <hr />
                            <div className="flex justify-between items-center">
                                <span className="text-secondary">Lunas</span>
                                <span className="font-bold text-secondary">{formatCurrency(laporanPenjualan.jamur.status.lunas)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-yellow-600">Pending</span>
                                <span className="font-bold text-yellow-600">{formatCurrency(laporanPenjualan.jamur.status.pending)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Laporan Keuangan */}
            {activeTab === 'keuangan' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Pemasukan */}
                        <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm overflow-hidden">
                            <div className="p-6 border-b border-outline-variant/15 bg-emerald-50">
                                <div className="flex items-center">
                                    <ArrowTrendingUpIcon className="w-6 h-6 text-secondary mr-2" />
                                    <h3 className="text-lg font-bold text-primary">Pemasukan</h3>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-on-surface-variant">Penjualan Baglog</span>
                                    <span className="font-bold">{formatCurrency(laporanKeuangan.pemasukan.baglog)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-on-surface-variant">Penjualan Jamur</span>
                                    <span className="font-bold">{formatCurrency(laporanKeuangan.pemasukan.jamur)}</span>
                                </div>
                                <hr />
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-on-surface-variant">Total</span>
                                    <span className="font-bold text-secondary text-lg">{formatCurrency(laporanKeuangan.pemasukan.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Pengeluaran */}
                        <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm overflow-hidden">
                            <div className="p-6 border-b border-outline-variant/15 bg-red-50">
                                <div className="flex items-center">
                                    <ArrowTrendingDownIcon className="w-6 h-6 text-red-600 mr-2" />
                                    <h3 className="text-lg font-bold text-red-800">Pengeluaran</h3>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-on-surface-variant">Gaji Karyawan</span>
                                    <span className="font-bold">{formatCurrency(laporanKeuangan.pengeluaran.gaji)}</span>
                                </div>
                                <hr />
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-on-surface-variant">Total</span>
                                    <span className="font-bold text-red-600 text-lg">{formatCurrency(laporanKeuangan.pengeluaran.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Laba/Rugi */}
                        <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm overflow-hidden">
                            <div className={`p-6 border-b border-outline-variant/15 ${laporanKeuangan.laba >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
                                <div className="flex items-center">
                                    <ChartBarIcon className={`w-6 h-6 mr-2 ${laporanKeuangan.laba >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
                                    <h3 className={`text-lg font-bold ${laporanKeuangan.laba >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                                        {laporanKeuangan.laba >= 0 ? 'Laba Bersih' : 'Rugi'}
                                    </h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="text-center">
                                    <p className={`text-3xl font-bold ${laporanKeuangan.laba >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                                        {formatCurrency(Math.abs(laporanKeuangan.laba))}
                                    </p>
                                    <p className="text-sm text-on-tertiary-container mt-2">
                                        {laporanKeuangan.laba >= 0 ? 'Keuntungan bulan ini' : 'Kerugian bulan ini'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Table */}
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm overflow-hidden">
                        <div className="p-6 border-b border-outline-variant/15">
                            <h3 className="text-lg font-headline font-bold text-on-surface">Ringkasan Keuangan</h3>
                        </div>
                        <table className="w-full">
                            <tbody className="divide-y divide-gray-200">
                                <tr className="bg-emerald-50">
                                    <td className="px-6 py-4 font-medium text-primary">Total Pemasukan</td>
                                    <td className="px-6 py-4 text-right font-bold text-secondary">{formatCurrency(laporanKeuangan.pemasukan.total)}</td>
                                </tr>
                                <tr className="bg-red-50">
                                    <td className="px-6 py-4 font-medium text-red-800">Total Pengeluaran</td>
                                    <td className="px-6 py-4 text-right font-bold text-red-600">({formatCurrency(laporanKeuangan.pengeluaran.total)})</td>
                                </tr>
                                <tr className={laporanKeuangan.laba >= 0 ? 'bg-blue-100' : 'bg-orange-100'}>
                                    <td className={`px-6 py-4 font-bold ${laporanKeuangan.laba >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                                        {laporanKeuangan.laba >= 0 ? 'Laba Bersih' : 'Rugi Bersih'}
                                    </td>
                                    <td className={`px-6 py-4 text-right font-bold text-xl ${laporanKeuangan.laba >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                                        {formatCurrency(laporanKeuangan.laba)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
