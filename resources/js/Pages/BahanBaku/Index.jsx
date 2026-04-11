import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';

export default function BahanBakuIndex({ bahanBakus, summary, kategoris, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [kategori, setKategori] = useState(filters.kategori || '');
    const [deleting, setDeleting] = useState(null);

    const handleFilter = () => {
        router.get('/bahan-baku', { search, kategori, low_stock: filters.low_stock }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus bahan baku ini?')) {
            setDeleting(id);
            router.delete(`/bahan-baku/${id}`, {
                onFinish: () => setDeleting(null),
            });
        }
    };

    const formatRupiah = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };

    return (
        <AdminLayout title="Bahan Baku">
            <Head title="Bahan Baku" />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <MIcon name="inventory_2" className="text-2xl text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-on-tertiary-container">Total Item</p>
                            <p className="text-xl font-bold text-on-surface">{summary.total}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-red-100 rounded-xl">
                            <MIcon name="warning" className="text-2xl text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-on-tertiary-container">Stok Menipis</p>
                            <p className="text-xl font-bold text-red-600">{summary.lowStock}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-emerald-100 rounded-xl">
                            <MIcon name="inventory_2" className="text-2xl text-secondary" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-on-tertiary-container">Total Nilai Stok</p>
                            <p className="text-xl font-bold text-on-surface">{formatRupiah(summary.totalNilai)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm">
                <div className="p-6 border-b border-outline-variant/15">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <h2 className="text-lg font-headline font-bold text-on-surface">Daftar Bahan Baku</h2>
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
                                        className="pl-10 pr-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-green-500"
                                    />
                                </div>
                                <select
                                    value={kategori}
                                    onChange={(e) => { setKategori(e.target.value); }}
                                    className="px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-green-500"
                                >
                                    <option value="">Semua Kategori</option>
                                    {kategoris.map((k) => (
                                        <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleFilter}
                                    className="px-4 py-2 bg-surface-container-low text-on-surface-variant rounded-xl hover:bg-gray-200"
                                >
                                    Filter
                                </button>
                            </div>
                            <Link
                                href="/bahan-baku/create"
                                className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary transition-colors"
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Nama</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Kategori</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Stok</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Min. Stok</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Harga Terakhir</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-on-tertiary-container uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {bahanBakus.data.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-on-tertiary-container">
                                        Belum ada data bahan baku
                                    </td>
                                </tr>
                            ) : (
                                bahanBakus.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-surface-container-low">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">
                                            {item.kode}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                                            {item.nama}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-surface-container-low text-on-surface">
                                                {item.kategori}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={item.stok <= item.stok_minimum ? 'text-red-600 font-bold' : 'text-on-surface-variant'}>
                                                {item.stok} {item.satuan}
                                            </span>
                                            {item.stok <= item.stok_minimum && (
                                                <MIcon name="warning" className="text-base inline ml-1 text-red-500" />
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                                            {item.stok_minimum} {item.satuan}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                                            {formatRupiah(item.harga_terakhir)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={`/bahan-baku/${item.id}/movements`}
                                                    className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-colors"
                                                    title="Riwayat Stok"
                                                >
                                                    <MIcon name="tune" className="text-xl" />
                                                </Link>
                                                <Link
                                                    href={`/bahan-baku/${item.id}/edit`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                                >
                                                    <MIcon name="edit" className="text-xl" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    disabled={deleting === item.id}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
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

                {/* Pagination */}
                {bahanBakus.links && bahanBakus.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-outline-variant/15">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-on-tertiary-container">
                                Showing {bahanBakus.from} to {bahanBakus.to} of {bahanBakus.total} results
                            </p>
                            <div className="flex space-x-1">
                                {bahanBakus.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 text-sm rounded ${
                                            link.active
                                                ? 'bg-primary text-white'
                                                : 'bg-surface-container-low text-on-surface-variant hover:bg-gray-200'
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
