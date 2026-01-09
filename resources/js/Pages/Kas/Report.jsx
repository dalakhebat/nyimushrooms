import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeftIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

export default function KasReport({ dailyData, perKategori, totalMasuk, totalKeluar, saldo, bulan, tahun }) {
    const [selectedBulan, setSelectedBulan] = useState(bulan);
    const [selectedTahun, setSelectedTahun] = useState(tahun);

    const handleFilter = () => {
        router.get('/kas/report', { bulan: selectedBulan, tahun: selectedTahun });
    };

    const formatRupiah = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };

    const bulanOptions = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    return (
        <AdminLayout title="Laporan Kas">
            <Head title="Laporan Kas" />

            <div className="mb-6">
                <Link href="/kas" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
                    <ArrowLeftIcon className="w-4 h-4 mr-1" />
                    Kembali
                </Link>
            </div>

            {/* Filter */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex items-center gap-4">
                    <select value={selectedBulan} onChange={(e) => setSelectedBulan(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
                        {bulanOptions.map((b, i) => (<option key={i} value={i + 1}>{b}</option>))}
                    </select>
                    <select value={selectedTahun} onChange={(e) => setSelectedTahun(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
                        {[2024, 2025, 2026].map((y) => (<option key={y} value={y}>{y}</option>))}
                    </select>
                    <button onClick={handleFilter} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Filter</button>
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <ArrowUpIcon className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Total Kas Masuk</p>
                            <p className="text-2xl font-bold text-green-600">{formatRupiah(totalMasuk)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-red-100 rounded-lg">
                            <ArrowDownIcon className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Total Kas Keluar</p>
                            <p className="text-2xl font-bold text-red-600">{formatRupiah(totalKeluar)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <ArrowUpIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Saldo</p>
                            <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatRupiah(saldo)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Per Kategori */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan per Kategori - {bulanOptions[bulan - 1]} {tahun}</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Masuk</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Keluar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {perKategori.map((item) => (
                                <tr key={`${item.kategori}-${item.tipe}`} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">{item.kategori}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600">
                                        {item.tipe === 'masuk' ? formatRupiah(item.total) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">
                                        {item.tipe === 'keluar' ? formatRupiah(item.total) : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
