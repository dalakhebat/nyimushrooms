import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Icon } from '@iconify/react';

export default function PenjualanIndex({ penjualanBaglogs, penjualanJamurs, summary, tipe, filters }) {
    const [activeTab, setActiveTab] = useState(tipe || 'baglog');
    const [search, setSearch] = useState(filters.search || '');

    const handleTabChange = (newTipe) => {
        setActiveTab(newTipe);
        router.get('/penjualan', { ...filters, tipe: newTipe }, { preserveState: true });
    };

    const handleFilter = (key, value) => {
        router.get('/penjualan', { ...filters, tipe: activeTab, [key]: value }, { preserveState: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        handleFilter('search', search);
    };

    const handleDeleteBaglog = (id) => {
        if (confirm('Yakin ingin menghapus penjualan baglog ini?')) {
            router.delete('/penjualan/baglog/' + id);
        }
    };

    const handleDeleteJamur = (id) => {
        if (confirm('Yakin ingin menghapus penjualan jamur ini?')) {
            router.delete('/penjualan/jamur/' + id);
        }
    };

    const handleStatusChange = (id, newStatus, type) => {
        if (type === 'baglog') {
            router.patch(`/penjualan/baglog/${id}/status`, { status: newStatus });
        } else {
            router.patch(`/penjualan/jamur/${id}/status`, { status: newStatus });
        }
    };

    const formatCurrency = (num) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('id-ID').format(num);
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { class: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
            lunas: { class: 'bg-green-100 text-green-700', label: 'Lunas' },
        };
        return badges[status] || { class: 'bg-gray-100 text-gray-700', label: status };
    };

    return (
        <AdminLayout title="Penjualan">
            <Head title="Penjualan" />

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-blue-500 p-3 rounded-lg">
                            <Icon icon="solar:box-bold" className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Baglog</p>
                            <p className="text-lg font-semibold text-gray-900">{formatCurrency(summary.totalBaglog)}</p>
                            <p className="text-xs text-gray-400">{formatNumber(summary.countBaglog)} transaksi</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-green-500 p-3 rounded-lg">
                            <Icon icon="solar:test-tube-bold" className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Jamur</p>
                            <p className="text-lg font-semibold text-gray-900">{formatCurrency(summary.totalJamur)}</p>
                            <p className="text-xs text-gray-400">{formatNumber(summary.countJamur)} transaksi</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-yellow-500 p-3 rounded-lg">
                            <Icon icon="solar:clock-circle-bold" className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Pending Baglog</p>
                            <p className="text-lg font-semibold text-yellow-600">{formatCurrency(summary.pendingBaglog)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-orange-500 p-3 rounded-lg">
                            <Icon icon="solar:clock-circle-bold" className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Pending Jamur</p>
                            <p className="text-lg font-semibold text-orange-600">{formatCurrency(summary.pendingJamur)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-6">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        <button
                            onClick={() => handleTabChange('baglog')}
                            className={`px-6 py-4 text-sm font-medium border-b-2 ${
                                activeTab === 'baglog'
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <Icon icon="solar:box-bold" className="w-5 h-5 inline-block mr-2" />
                            Penjualan Baglog
                        </button>
                        <button
                            onClick={() => handleTabChange('jamur')}
                            className={`px-6 py-4 text-sm font-medium border-b-2 ${
                                activeTab === 'jamur'
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <Icon icon="solar:test-tube-bold" className="w-5 h-5 inline-block mr-2" />
                            Penjualan Jamur
                        </button>
                    </nav>
                </div>

                {/* Filters */}
                <div className="p-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={filters.status || ''}
                            onChange={(e) => handleFilter('status', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Semua Status</option>
                            <option value="pending">Pending</option>
                            <option value="lunas">Lunas</option>
                        </select>
                        <form onSubmit={handleSearch} className="flex flex-1 min-w-[200px]">
                            <div className="relative flex-1">
                                <Icon icon="solar:magnifer-bold" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari nama customer..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                        </form>
                        <Link
                            href={activeTab === 'baglog' ? '/penjualan/baglog/create' : '/penjualan/jamur/create'}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                        >
                            <Icon icon="solar:add-circle-bold" className="w-5 h-5 mr-1" />
                            Tambah {activeTab === 'baglog' ? 'Baglog' : 'Jamur'}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Table Baglog */}
            {activeTab === 'baglog' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Harga Satuan</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {penjualanBaglogs.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                            <Icon icon="solar:box-bold" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                            <p>Belum ada data penjualan baglog</p>
                                        </td>
                                    </tr>
                                ) : (
                                    penjualanBaglogs.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {item.tanggal_formatted}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-gray-900">
                                                    {item.customer?.nama || 'Umum'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="font-semibold text-gray-900">
                                                    {formatNumber(item.jumlah_baglog)} baglog
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-gray-600">
                                                {formatCurrency(item.harga_satuan)}
                                            </td>
                                            <td className="px-6 py-4 text-right font-semibold text-gray-900">
                                                {formatCurrency(item.total_harga)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <select
                                                    value={item.status}
                                                    onChange={(e) => handleStatusChange(item.id, e.target.value, 'baglog')}
                                                    className={`px-2 py-1 text-xs font-medium rounded-full border-0 cursor-pointer ${getStatusBadge(item.status).class}`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="lunas">Lunas</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Link
                                                        href={`/penjualan/baglog/${item.id}/edit`}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    >
                                                        <Icon icon="solar:pen-bold" className="w-5 h-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteBaglog(item.id)}
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
                    {penjualanBaglogs.links && penjualanBaglogs.links.length > 3 && (
                        <div className="px-6 py-3 border-t border-gray-200 flex justify-center">
                            <div className="flex space-x-1">
                                {penjualanBaglogs.links.map((link, index) => (
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
            )}

            {/* Table Jamur */}
            {activeTab === 'jamur' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Berat</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Harga/kg</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {penjualanJamurs.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                            <Icon icon="solar:test-tube-bold" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                            <p>Belum ada data penjualan jamur</p>
                                        </td>
                                    </tr>
                                ) : (
                                    penjualanJamurs.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {item.tanggal_formatted}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-gray-900">
                                                    {item.customer?.nama || 'Umum'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="font-semibold text-gray-900">
                                                    {formatNumber(item.berat_kg)} kg
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-gray-600">
                                                {formatCurrency(item.harga_per_kg)}
                                            </td>
                                            <td className="px-6 py-4 text-right font-semibold text-gray-900">
                                                {formatCurrency(item.total_harga)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <select
                                                    value={item.status}
                                                    onChange={(e) => handleStatusChange(item.id, e.target.value, 'jamur')}
                                                    className={`px-2 py-1 text-xs font-medium rounded-full border-0 cursor-pointer ${getStatusBadge(item.status).class}`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="lunas">Lunas</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Link
                                                        href={`/penjualan/jamur/${item.id}/edit`}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    >
                                                        <Icon icon="solar:pen-bold" className="w-5 h-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteJamur(item.id)}
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
                    {penjualanJamurs.links && penjualanJamurs.links.length > 3 && (
                        <div className="px-6 py-3 border-t border-gray-200 flex justify-center">
                            <div className="flex space-x-1">
                                {penjualanJamurs.links.map((link, index) => (
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
            )}
        </AdminLayout>
    );
}
