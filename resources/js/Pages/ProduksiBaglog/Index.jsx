import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PlusIcon, EyeIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function ProduksiBaglogIndex({ produksis, summary, tahaps, filters }) {
    const [deleting, setDeleting] = useState(null);

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus produksi ini? Stok bahan baku akan dikembalikan.')) {
            setDeleting(id);
            router.delete(`/produksi-baglog/${id}`, { onFinish: () => setDeleting(null) });
        }
    };

    const handleUpdateTahap = (id, tahap) => {
        router.patch(`/produksi-baglog/${id}/tahap`, { tahap });
    };

    const getTahapBadge = (tahap) => {
        const badges = {
            mixing: 'bg-blue-100 text-blue-800',
            sterilisasi: 'bg-yellow-100 text-yellow-800',
            inokulasi: 'bg-purple-100 text-purple-800',
            inkubasi: 'bg-orange-100 text-orange-800',
            selesai: 'bg-green-100 text-green-800',
        };
        return badges[tahap] || 'bg-gray-100 text-gray-800';
    };

    const getNextTahap = (currentTahap) => {
        const order = ['mixing', 'sterilisasi', 'inokulasi', 'inkubasi', 'selesai'];
        const currentIndex = order.indexOf(currentTahap);
        return currentIndex < order.length - 1 ? order[currentIndex + 1] : null;
    };

    return (
        <AdminLayout title="Produksi Baglog">
            <Head title="Produksi Baglog" />

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <p className="text-sm text-gray-500">Total Bulan Ini</p>
                    <p className="text-2xl font-bold text-gray-800">{summary.totalBulanIni}</p>
                </div>
                {tahaps.map((tahap) => (
                    <div key={tahap} className="bg-white rounded-xl shadow-sm p-4">
                        <p className="text-sm text-gray-500 capitalize">{tahap}</p>
                        <p className="text-2xl font-bold text-gray-800">{summary[tahap] || 0}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">Daftar Produksi</h2>
                        <Link
                            href="/produksi-baglog/create"
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                        >
                            <PlusIcon className="w-5 h-5 mr-1" />
                            Produksi Baru
                        </Link>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tahap</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operator</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {produksis.data.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        Belum ada data produksi
                                    </td>
                                </tr>
                            ) : (
                                produksis.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.kode_produksi}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {item.jumlah_baglog} baglog
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getTahapBadge(item.tahap)}`}>
                                                {item.tahap}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {item.karyawan?.nama || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex items-center justify-end space-x-2">
                                                {getNextTahap(item.tahap) && (
                                                    <button
                                                        onClick={() => handleUpdateTahap(item.id, getNextTahap(item.tahap))}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                                        title={`Lanjut ke ${getNextTahap(item.tahap)}`}
                                                    >
                                                        <ArrowPathIcon className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <Link
                                                    href={`/produksi-baglog/${item.id}`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                >
                                                    <EyeIcon className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    disabled={deleting === item.id}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
