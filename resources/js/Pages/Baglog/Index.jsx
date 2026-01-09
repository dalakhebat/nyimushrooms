import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Icon } from '@iconify/react';

export default function BaglogIndex({ baglogs, kumbungs, summary, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleFilter = (key, value) => {
        router.get('/baglog', { ...filters, [key]: value }, { preserveState: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        handleFilter('search', search);
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus baglog ini?')) {
            router.delete('/baglog/' + id);
        }
    };

    const handleStatusChange = (id, newStatus) => {
        router.patch(`/baglog/${id}/status`, { status: newStatus });
    };

    const getStatusBadge = (status) => {
        const badges = {
            produksi: { class: 'bg-yellow-100 text-yellow-700', label: 'Produksi' },
            inkubasi: { class: 'bg-orange-100 text-orange-700', label: 'Inkubasi' },
            pembibitan: { class: 'bg-purple-100 text-purple-700', label: 'Pembibitan' },
            masuk_kumbung: { class: 'bg-green-100 text-green-700', label: 'Masuk Kumbung' },
            dijual: { class: 'bg-blue-100 text-blue-700', label: 'Dijual' },
            selesai: { class: 'bg-gray-100 text-gray-700', label: 'Selesai' },
        };
        return badges[status] || { class: 'bg-gray-100 text-gray-700', label: status };
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('id-ID').format(num);
    };

    return (
        <AdminLayout title="Baglog">
            <Head title="Baglog" />

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center">
                        <div className="bg-yellow-500 p-2 rounded-lg">
                            <Icon icon="solar:layers-bold" className="w-5 h-5 text-white" />
                        </div>
                        <div className="ml-3">
                            <p className="text-xs font-medium text-gray-500">Produksi</p>
                            <p className="text-xl font-semibold text-gray-900">{formatNumber(summary.produksi)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center">
                        <div className="bg-orange-500 p-2 rounded-lg">
                            <Icon icon="solar:layers-bold" className="w-5 h-5 text-white" />
                        </div>
                        <div className="ml-3">
                            <p className="text-xs font-medium text-gray-500">Inkubasi</p>
                            <p className="text-xl font-semibold text-gray-900">{formatNumber(summary.inkubasi)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center">
                        <div className="bg-purple-500 p-2 rounded-lg">
                            <Icon icon="solar:layers-bold" className="w-5 h-5 text-white" />
                        </div>
                        <div className="ml-3">
                            <p className="text-xs font-medium text-gray-500">Pembibitan</p>
                            <p className="text-xl font-semibold text-gray-900">{formatNumber(summary.pembibitan)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center">
                        <div className="bg-green-500 p-2 rounded-lg">
                            <Icon icon="solar:layers-bold" className="w-5 h-5 text-white" />
                        </div>
                        <div className="ml-3">
                            <p className="text-xs font-medium text-gray-500">Masuk Kumbung</p>
                            <p className="text-xl font-semibold text-gray-900">{formatNumber(summary.masuk_kumbung)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center">
                        <div className="bg-blue-500 p-2 rounded-lg">
                            <Icon icon="solar:layers-bold" className="w-5 h-5 text-white" />
                        </div>
                        <div className="ml-3">
                            <p className="text-xs font-medium text-gray-500">Dijual</p>
                            <p className="text-xl font-semibold text-gray-900">{formatNumber(summary.dijual)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center">
                        <div className="bg-gray-500 p-2 rounded-lg">
                            <Icon icon="solar:layers-bold" className="w-5 h-5 text-white" />
                        </div>
                        <div className="ml-3">
                            <p className="text-xs font-medium text-gray-500">Selesai</p>
                            <p className="text-xl font-semibold text-gray-900">{formatNumber(summary.selesai)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex flex-wrap items-center gap-3">
                    <select
                        value={filters.status || ''}
                        onChange={(e) => handleFilter('status', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                        <option value="">Semua Status</option>
                        <option value="produksi">Produksi</option>
                        <option value="inkubasi">Inkubasi</option>
                        <option value="pembibitan">Pembibitan</option>
                        <option value="masuk_kumbung">Masuk Kumbung</option>
                        <option value="dijual">Dijual</option>
                        <option value="selesai">Selesai</option>
                    </select>
                    <select
                        value={filters.kumbung_id || ''}
                        onChange={(e) => handleFilter('kumbung_id', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                        <option value="">Semua Kumbung</option>
                        {kumbungs.map((k) => (
                            <option key={k.id} value={k.id}>{k.nama}</option>
                        ))}
                    </select>
                    <form onSubmit={handleSearch} className="flex flex-1 min-w-[200px]">
                        <div className="relative flex-1">
                            <Icon icon="solar:magnifer-bold" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari kode batch..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </form>
                    <Link
                        href="/baglog/create"
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                    >
                        <Icon icon="solar:add-circle-bold" className="w-5 h-5 mr-1" />
                        Tambah Baglog
                    </Link>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode Batch</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kumbung</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl Produksi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl Masuk Kumbung</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Umur</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {baglogs.data.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                        <Icon icon="solar:layers-bold" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p>Belum ada data baglog</p>
                                    </td>
                                </tr>
                            ) : (
                                baglogs.data.map((baglog) => (
                                    <tr key={baglog.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-gray-900">{baglog.kode_batch}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-semibold text-gray-900">{formatNumber(baglog.jumlah)}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {baglog.kumbung?.nama || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {baglog.tanggal_produksi_formatted}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {baglog.tanggal_masuk_kumbung_formatted || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {baglog.umur || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <select
                                                value={baglog.status}
                                                onChange={(e) => handleStatusChange(baglog.id, e.target.value)}
                                                className={`px-2 py-1 text-xs font-medium rounded-full border-0 cursor-pointer ${getStatusBadge(baglog.status).class}`}
                                            >
                                                <option value="produksi">Produksi</option>
                                                <option value="inkubasi">Inkubasi</option>
                                                <option value="pembibitan">Pembibitan</option>
                                                <option value="masuk_kumbung">Masuk Kumbung</option>
                                                <option value="dijual">Dijual</option>
                                                <option value="selesai">Selesai</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={`/baglog/${baglog.id}/edit`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                >
                                                    <Icon icon="solar:pen-bold" className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(baglog.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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

                {/* Pagination */}
                {baglogs.links && baglogs.links.length > 3 && (
                    <div className="px-6 py-3 border-t border-gray-200 flex justify-center">
                        <div className="flex space-x-1">
                            {baglogs.links.map((link, index) => (
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
