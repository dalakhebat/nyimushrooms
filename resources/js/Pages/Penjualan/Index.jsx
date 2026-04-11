import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';

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

    const handleStatusChange = (id, newStatus, currentStatus, type) => {
        // Jika sudah lunas, tidak bisa diubah
        if (currentStatus === 'lunas') {
            return;
        }

        // Konfirmasi jika mengubah ke lunas
        if (newStatus === 'lunas') {
            if (confirm('Apakah Anda yakin ingin mengubah status menjadi LUNAS?\n\nStatus yang sudah lunas tidak dapat diubah kembali ke pending.')) {
                if (type === 'baglog') {
                    router.patch(`/penjualan/baglog/${id}/status`, { status: newStatus });
                } else {
                    router.patch(`/penjualan/jamur/${id}/status`, { status: newStatus });
                }
            }
        } else {
            if (type === 'baglog') {
                router.patch(`/penjualan/baglog/${id}/status`, { status: newStatus });
            } else {
                router.patch(`/penjualan/jamur/${id}/status`, { status: newStatus });
            }
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
            lunas: { class: 'bg-emerald-100 text-secondary', label: 'Lunas' },
        };
        return badges[status] || { class: 'bg-surface-container-low text-on-surface-variant', label: status };
    };

    return (
        <AdminLayout title="Penjualan">
            <Head title="Penjualan" />

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-blue-500 p-3 rounded-xl">
                            <MIcon name="inventory_2" className="text-2xl text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-on-tertiary-container">Total Baglog</p>
                            <p className="text-lg font-headline font-bold text-on-surface">{formatCurrency(summary.totalBaglog)}</p>
                            <p className="text-xs text-slate-400">{formatNumber(summary.countBaglog)} transaksi</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-secondary p-3 rounded-xl">
                            <MIcon name="mushroom" className="text-2xl text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-on-tertiary-container">Total Jamur</p>
                            <p className="text-lg font-headline font-bold text-on-surface">{formatCurrency(summary.totalJamur)}</p>
                            <p className="text-xs text-slate-400">{formatNumber(summary.countJamur)} transaksi</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-yellow-500 p-3 rounded-xl">
                            <MIcon name="schedule" className="text-2xl text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-on-tertiary-container">Pending Baglog</p>
                            <p className="text-lg font-bold text-yellow-600">{formatCurrency(summary.pendingBaglog)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-orange-500 p-3 rounded-xl">
                            <MIcon name="schedule" className="text-2xl text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-on-tertiary-container">Pending Jamur</p>
                            <p className="text-lg font-bold text-orange-600">{formatCurrency(summary.pendingJamur)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm mb-6">
                <div className="border-b border-outline-variant/15">
                    <nav className="flex -mb-px">
                        <button
                            onClick={() => handleTabChange('baglog')}
                            className={`px-6 py-4 text-sm font-medium border-b-2 ${
                                activeTab === 'baglog'
                                    ? 'border-green-500 text-secondary'
                                    : 'border-transparent text-on-tertiary-container hover:text-on-surface-variant hover:border-outline-variant/30'
                            }`}
                        >
                            <MIcon name="inventory_2" className="text-xl inline-block mr-2" />
                            Penjualan Baglog
                        </button>
                        <button
                            onClick={() => handleTabChange('jamur')}
                            className={`px-6 py-4 text-sm font-medium border-b-2 ${
                                activeTab === 'jamur'
                                    ? 'border-green-500 text-secondary'
                                    : 'border-transparent text-on-tertiary-container hover:text-on-surface-variant hover:border-outline-variant/30'
                            }`}
                        >
                            <MIcon name="mushroom" className="text-xl inline-block mr-2" />
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
                            className="px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                        >
                            <option value="">Semua Status</option>
                            <option value="pending">Pending</option>
                            <option value="lunas">Lunas</option>
                        </select>
                        <form onSubmit={handleSearch} className="flex flex-1 min-w-[200px]">
                            <div className="relative flex-1">
                                <MIcon name="search" className="text-xl absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari nama customer..."
                                    className="w-full pl-10 pr-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                                />
                            </div>
                        </form>
                        <Link
                            href={activeTab === 'baglog' ? '/penjualan/baglog/create' : '/penjualan/jamur/create'}
                            className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary"
                        >
                            <MIcon name="add_circle" className="text-xl mr-1" />
                            Tambah {activeTab === 'baglog' ? 'Baglog' : 'Jamur'}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Table Baglog */}
            {activeTab === 'baglog' && (
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-surface-container-low">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Tanggal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Customer</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-on-tertiary-container uppercase">Jumlah</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-on-tertiary-container uppercase">Harga Satuan</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-on-tertiary-container uppercase">Total</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-on-tertiary-container uppercase">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-on-tertiary-container uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {penjualanBaglogs.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-on-tertiary-container">
                                            <MIcon name="inventory_2" className="text-4xl mx-auto mb-3 text-slate-300" />
                                            <p>Belum ada data penjualan baglog</p>
                                        </td>
                                    </tr>
                                ) : (
                                    penjualanBaglogs.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-surface-container-low">
                                            <td className="px-6 py-4 text-sm text-on-surface-variant">
                                                {item.tanggal_formatted}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-on-surface">
                                                    {item.customer?.nama || 'Umum'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="font-bold text-on-surface">
                                                    {formatNumber(item.jumlah_baglog)} baglog
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-on-surface-variant">
                                                {formatCurrency(item.harga_satuan)}
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-on-surface">
                                                {formatCurrency(item.total_harga)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {item.status === 'lunas' ? (
                                                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-emerald-100 text-primary">
                                                        <MIcon name="check_circle" className="text-base mr-1" />
                                                        Lunas
                                                    </span>
                                                ) : (
                                                    <select
                                                        value={item.status}
                                                        onChange={(e) => handleStatusChange(item.id, e.target.value, item.status, 'baglog')}
                                                        className="px-2 py-1 text-xs font-medium rounded-xl border border-yellow-300 bg-yellow-50 text-yellow-800 focus:ring-2 focus:ring-yellow-500 cursor-pointer"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="lunas">Lunas</option>
                                                    </select>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Link
                                                        href={`/penjualan/baglog/${item.id}/edit`}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl"
                                                    >
                                                        <MIcon name="edit" className="text-xl" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteBaglog(item.id)}
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
                    {penjualanBaglogs.links && penjualanBaglogs.links.length > 3 && (
                        <div className="px-6 py-3 border-t border-outline-variant/15 flex justify-center">
                            <div className="flex space-x-1">
                                {penjualanBaglogs.links.map((link, index) => (
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
            )}

            {/* Table Jamur */}
            {activeTab === 'jamur' && (
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-surface-container-low">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Tanggal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Customer</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-on-tertiary-container uppercase">Berat</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-on-tertiary-container uppercase">Harga/kg</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-on-tertiary-container uppercase">Total</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-on-tertiary-container uppercase">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-on-tertiary-container uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {penjualanJamurs.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-on-tertiary-container">
                                            <MIcon name="mushroom" className="text-4xl mx-auto mb-3 text-slate-300" />
                                            <p>Belum ada data penjualan jamur</p>
                                        </td>
                                    </tr>
                                ) : (
                                    penjualanJamurs.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-surface-container-low">
                                            <td className="px-6 py-4 text-sm text-on-surface-variant">
                                                {item.tanggal_formatted}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-on-surface">
                                                    {item.customer?.nama || 'Umum'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="font-bold text-on-surface">
                                                    {formatNumber(item.berat_kg)} kg
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-on-surface-variant">
                                                {formatCurrency(item.harga_per_kg)}
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-on-surface">
                                                {formatCurrency(item.total_harga)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {item.status === 'lunas' ? (
                                                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-emerald-100 text-primary">
                                                        <MIcon name="check_circle" className="text-base mr-1" />
                                                        Lunas
                                                    </span>
                                                ) : (
                                                    <select
                                                        value={item.status}
                                                        onChange={(e) => handleStatusChange(item.id, e.target.value, item.status, 'jamur')}
                                                        className="px-2 py-1 text-xs font-medium rounded-xl border border-yellow-300 bg-yellow-50 text-yellow-800 focus:ring-2 focus:ring-yellow-500 cursor-pointer"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="lunas">Lunas</option>
                                                    </select>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Link
                                                        href={`/penjualan/jamur/${item.id}/edit`}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl"
                                                    >
                                                        <MIcon name="edit" className="text-xl" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteJamur(item.id)}
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
                    {penjualanJamurs.links && penjualanJamurs.links.length > 3 && (
                        <div className="px-6 py-3 border-t border-outline-variant/15 flex justify-center">
                            <div className="flex space-x-1">
                                {penjualanJamurs.links.map((link, index) => (
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
            )}
        </AdminLayout>
    );
}
