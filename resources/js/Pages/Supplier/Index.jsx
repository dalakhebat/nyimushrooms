import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';

export default function SupplierIndex({ suppliers, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/supplier', { search }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus supplier ini?')) {
            router.delete('/supplier/' + id);
        }
    };

    return (
        <AdminLayout title="Supplier">
            <Head title="Supplier" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-on-surface">Daftar Supplier</h2>
                    <p className="text-sm text-on-surface-variant">Kelola data supplier bahan baku</p>
                </div>
                <Link
                    href="/supplier/create"
                    className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary"
                >
                    <MIcon name="add_circle" className="text-xl mr-1" />
                    Tambah Supplier
                </Link>
            </div>

            {/* Search */}
            <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4 mb-6">
                <form onSubmit={handleSearch} className="flex gap-3">
                    <div className="relative flex-1">
                        <MIcon name="search" className="text-xl absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama supplier..."
                            className="w-full pl-10 pr-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-surface-container-low text-on-surface-variant rounded-xl hover:bg-gray-200"
                    >
                        Cari
                    </button>
                </form>
            </div>

            {/* Table */}
            <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-surface-container-low">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">
                                    Supplier
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">
                                    Kontak
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">
                                    Alamat
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-on-tertiary-container uppercase">
                                    Transaksi
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-on-tertiary-container uppercase">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {suppliers.data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-on-tertiary-container">
                                        <MIcon name="delivery" className="text-4xl mx-auto mb-3 text-slate-300" />
                                        <p>Belum ada data supplier</p>
                                    </td>
                                </tr>
                            ) : (
                                suppliers.data.map((supplier) => (
                                    <tr key={supplier.id} className="hover:bg-surface-container-low">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="bg-blue-100 p-2 rounded-xl mr-3">
                                                    <MIcon name="delivery" className="text-xl text-blue-600" />
                                                </div>
                                                <span className="font-medium text-on-surface">{supplier.nama}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {supplier.no_hp ? (
                                                <div className="flex items-center text-sm text-on-surface-variant">
                                                    <MIcon name="phone" className="text-base mr-1" />
                                                    {supplier.no_hp}
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {supplier.alamat ? (
                                                <div className="flex items-start text-sm text-on-surface-variant max-w-xs">
                                                    <MIcon name="location_on" className="text-base mr-1 mt-0.5 flex-shrink-0" />
                                                    <span className="truncate">{supplier.alamat}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-container-low text-on-surface">
                                                {supplier.pembelians_count || 0} transaksi
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={`/supplier/${supplier.id}/edit`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl"
                                                >
                                                    <MIcon name="edit" className="text-xl" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(supplier.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
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
                {suppliers.links && suppliers.links.length > 3 && (
                    <div className="px-6 py-3 border-t border-outline-variant/15 flex justify-center">
                        <div className="flex space-x-1">
                            {suppliers.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-3 py-1 text-sm rounded ${
                                        link.active
                                            ? 'bg-primary text-white'
                                            : link.url
                                            ? 'text-on-surface-variant hover:bg-surface-container-low'
                                            : 'text-slate-400 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
