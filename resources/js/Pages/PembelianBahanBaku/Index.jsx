import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';

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

    const handleUpdateStatus = (id, newStatus, currentStatus) => {
        // Jika sudah lunas, tidak bisa diubah
        if (currentStatus === 'lunas') {
            return;
        }

        // Konfirmasi jika mengubah ke lunas
        if (newStatus === 'lunas') {
            if (confirm('Apakah Anda yakin ingin mengubah status menjadi LUNAS?\n\nStatus yang sudah lunas tidak dapat diubah kembali ke pending.')) {
                router.patch(`/pembelian-bahan-baku/${id}/status`, { status: newStatus });
            }
        } else {
            router.patch(`/pembelian-bahan-baku/${id}/status`, { status: newStatus });
        }
    };

    const formatRupiah = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };

    return (
        <AdminLayout title="Pembelian Bahan Baku">
            <Head title="Pembelian Bahan Baku" />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <MIcon name="cart" className="text-2xl text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-on-tertiary-container">Total Bulan Ini</p>
                            <p className="text-lg font-headline font-bold text-on-surface">{formatRupiah(summary.totalBulanIni)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-xl">
                            <MIcon name="schedule" className="text-2xl text-yello" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-on-tertiary-container">Pending</p>
                            <p className="text-lg font-bold text-yellow-600">{formatRupiah(summary.pendingBulanIni)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-emerald-100 rounded-xl">
                            <MIcon name="check_circle" className="text-2xl text-secondary" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-on-tertiary-container">Lunas</p>
                            <p className="text-lg font-bold text-secondary">{formatRupiah(summary.lunasBulanIni)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-xl">
                            <MIcon name="cart" className="text-2xl text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-on-tertiary-container">Transaksi</p>
                            <p className="text-lg font-headline font-bold text-on-surface">{summary.countBulanIni}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm">
                <div className="p-6 border-b border-outline-variant/15">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <h2 className="text-lg font-headline font-bold text-on-surface">Daftar Pembelian</h2>
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="flex gap-2">
                                <div className="relative">
                                    <MIcon name="search" className="text-xl absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                        className="pl-10 pr-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                                    />
                                </div>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="lunas">Lunas</option>
                                </select>
                                <button onClick={handleFilter} className="px-4 py-2 bg-surface-container-low text-on-surface-variant rounded-xl hover:bg-gray-200">
                                    Filter
                                </button>
                            </div>
                            <Link
                                href="/pembelian-bahan-baku/create"
                                className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary"
                            >
                                <MIcon name="add_circle" className="text-xl mr-1" />
                                Tambah
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-surface-container-low">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Kode</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Bahan Baku</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Supplier</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Jumlah</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-on-tertiary-container uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {pembelians.data.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-on-tertiary-container">
                                        Belum ada data pembelian
                                    </td>
                                </tr>
                            ) : (
                                pembelians.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-surface-container-low">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">
                                            {item.kode_transaksi}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                                            {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                                            {item.bahan_baku?.nama}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                                            {item.supplier?.nama || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                                            {item.jumlah} {item.bahan_baku?.satuan}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">
                                            {formatRupiah(item.total_harga)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.status === 'lunas' ? (
                                                <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-emerald-100 text-primary">
                                                    <MIcon name="check_circle" className="text-base mr-1" />
                                                    Lunas
                                                </span>
                                            ) : (
                                                <select
                                                    value={item.status}
                                                    onChange={(e) => handleUpdateStatus(item.id, e.target.value, item.status)}
                                                    className="px-2 py-1 text-xs font-medium rounded-xl border border-yellow-300 bg-yellow-50 text-yellow-800 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 cursor-pointer"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="lunas">Lunas</option>
                                                </select>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={`/pembelian-bahan-baku/${item.id}/edit`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl"
                                                >
                                                    <MIcon name="edit" className="text-xl" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    disabled={deleting === item.id}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl disabled:opacity-50"
                                                >
                                                    <MIcon name="delete" className="text-xl" />
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
                    <div className="px-6 py-4 border-t border-outline-variant/15">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-on-tertiary-container">
                                Showing {pembelians.from} to {pembelians.to} of {pembelians.total} results
                            </p>
                            <div className="flex space-x-1">
                                {pembelians.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 text-sm rounded ${
                                            link.active ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant hover:bg-gray-200'
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
