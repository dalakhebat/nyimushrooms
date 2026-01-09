import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    UserGroupIcon,
    MagnifyingGlassIcon,
    PhoneIcon,
    MapPinIcon,
} from '@heroicons/react/24/outline';

export default function CustomerIndex({ customers, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/customer', { search }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus customer ini?')) {
            router.delete('/customer/' + id);
        }
    };

    return (
        <AdminLayout title="Customer">
            <Head title="Customer" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Daftar Customer</h2>
                    <p className="text-sm text-gray-600">Kelola data pembeli baglog & jamur</p>
                </div>
                <Link
                    href="/customer/create"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                >
                    <PlusIcon className="w-5 h-5 mr-1" />
                    Tambah Customer
                </Link>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <form onSubmit={handleSearch} className="flex gap-3">
                    <div className="relative flex-1">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama customer..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                        Cari
                    </button>
                </form>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Kontak
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Alamat
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                    Transaksi
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {customers.data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <UserGroupIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p>Belum ada data customer</p>
                                    </td>
                                </tr>
                            ) : (
                                customers.data.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                                    <UserGroupIcon className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <span className="font-medium text-gray-900">{customer.nama}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {customer.no_hp ? (
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <PhoneIcon className="w-4 h-4 mr-1" />
                                                    {customer.no_hp}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {customer.alamat ? (
                                                <div className="flex items-start text-sm text-gray-600 max-w-xs">
                                                    <MapPinIcon className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                                                    <span className="truncate">{customer.alamat}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {customer.total_transaksi || 0} transaksi
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={`/customer/${customer.id}/edit`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                >
                                                    <PencilSquareIcon className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(customer.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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

                {/* Pagination */}
                {customers.links && customers.links.length > 3 && (
                    <div className="px-6 py-3 border-t border-gray-200 flex justify-center">
                        <div className="flex space-x-1">
                            {customers.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-3 py-1 text-sm rounded ${
                                        link.active
                                            ? 'bg-green-600 text-white'
                                            : link.url
                                            ? 'text-gray-700 hover:bg-gray-100'
                                            : 'text-gray-400 cursor-not-allowed'
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
