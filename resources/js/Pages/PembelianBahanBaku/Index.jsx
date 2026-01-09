import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Icon } from '@iconify/react';

export default function PembelianBahanBakuIndex({ pembelians, summary, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [deleting, setDeleting] = useState(null);

    const handleFilter = () => {
        router.get('/pembelian-bahan-baku', { search, status }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus pembelian ini? Stok akan dikurangi.')) {
            setDeleting(id);
            router.delete(`/pembelian-bahan-baku/${id}`, {
                onFinish: () => setDeleting(null),
            });
        }
    };

    const handleUpdateStatus = (id, newStatus) => {
        router.patch(`/pembelian-bahan-baku/${id}/status`, { status: newStatus });
    };

    const formatRupiah = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };

    return (
        <AdminLayout title="Pembelian Bahan Baku">
            <Head title="Pembelian Bahan Baku" />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Icon icon="solar:cart-bold" className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Total Bulan Ini</p>
                            <p className="text-lg font-bold text-gray-800">{formatRupiah(summary.totalBulanIni)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <Icon icon="solar:clock-circle-bold" className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Pending</p>
                            <p className="text-lg font-bold text-yellow-600">{formatRupiah(summary.pendingBulanIni)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <Icon icon="solar:check-circle-bold" className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Lunas</p>
                            <p className="text-lg font-bold text-green-600">{formatRupiah(summary.lunasBulanIni)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <Icon icon="solar:cart-bold" className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Transaksi</p>
                            <p className="text-lg font-bold text-gray-800">{summary.countBulanIni}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <h2 className="text-lg font-semibold text-gray-800">Daftar Pembelian</h2>
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Icon icon="solar:magnifer-bold" className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="lunas">Lunas</option>
                                </select>
                                <button onClick={handleFilter} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                                    Filter
                                </button>
                            </div>
                            <Link
                                href="/pembelian-bahan-baku/create"
                                className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                            >
                                <Icon icon="solar:add-circle-bold" className="w-5 h-5 mr-1" />
                                Tambah
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bahan Baku</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {pembelians.data.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                        Belum ada data pembelian
                                    </td>
                                </tr>
                            ) : (
                                pembelians.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.kode_transaksi}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {item.bahan_baku?.nama}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {item.supplier?.nama || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {item.jumlah} {item.bahan_baku?.satuan}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {formatRupiah(item.total_harga)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleUpdateStatus(item.id, item.status === 'pending' ? 'lunas' : 'pending')}
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    item.status === 'lunas'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                            >
                                                {item.status === 'lunas' ? 'Lunas' : 'Pending'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={`/pembelian-bahan-baku/${item.id}/edit`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                >
                                                    <Icon icon="solar:pen-bold" className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    disabled={deleting === item.id}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                                                >
                                                    <Icon icon="solar:trash-bin-trash-bold" className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {pembelians.links && pembelians.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Showing {pembelians.from} to {pembelians.to} of {pembelians.total} results
                            </p>
                            <div className="flex space-x-1">
                                {pembelians.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 text-sm rounded ${
                                            link.active ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
