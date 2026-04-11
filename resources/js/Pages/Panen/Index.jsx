import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';
import { formatBerat } from '@/Utils/format';

export default function PanenIndex({ panens, kumbungs, filters, summary }) {
    const [filterOpen, setFilterOpen] = useState(false);
    const [deleting, setDeleting] = useState(null);

    const [filterData, setFilterData] = useState({
        tanggal_dari: filters.tanggal_dari || '',
        tanggal_sampai: filters.tanggal_sampai || '',
        kumbung_id: filters.kumbung_id || '',
    });

    const handleFilter = (e) => {
        e.preventDefault();
        router.get('/panen', filterData, { preserveState: true });
    };

    const handleReset = () => {
        setFilterData({ tanggal_dari: '', tanggal_sampai: '', kumbung_id: '' });
        router.get('/panen');
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus data panen ini?')) {
            setDeleting(id);
            router.delete('/panen/' + id, {
                onFinish: () => setDeleting(null),
            });
        }
    };

    return (
        <AdminLayout title="Panen">
            <Head title="Panen" />

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-emerald-500 p-3 rounded-xl">
                            <MIcon name="eco" className="text-2xl text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-on-tertiary-container">Panen Hari Ini</p>
                            <p className="text-2xl font-bold text-on-surface">{formatBerat(summary.totalHariIni)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-secondary p-3 rounded-xl">
                            <MIcon name="leaderboard" className="text-2xl text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-on-tertiary-container">Panen Bulan Ini</p>
                            <p className="text-2xl font-bold text-on-surface">{formatBerat(summary.totalBulanIni)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-blue-500 p-3 rounded-xl">
                            <MIcon name="check_circle" className="text-2xl text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-on-tertiary-container">Layak Jual</p>
                            <p className="text-2xl font-bold text-blue-600">{formatBerat(summary.layakJualBulanIni)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-red-500 p-3 rounded-xl">
                            <MIcon name="cancel" className="text-2xl text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-on-tertiary-container">Reject</p>
                            <p className="text-2xl font-bold text-red-600">{formatBerat(summary.rejectBulanIni)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm">
                <div className="p-6 border-b border-outline-variant/15">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <MIcon name="scale" className="text-2xl text-secondary mr-2" />
                            <h2 className="text-lg font-headline font-bold text-on-surface">Data Panen</h2>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setFilterOpen(!filterOpen)}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-on-surface-variant bg-surface-container-low rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                <MIcon name="filter_list" className="text-xl mr-1" />
                                Filter
                            </button>
                            <Link
                                href="/panen/create"
                                className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary transition-colors"
                            >
                                <MIcon name="add_circle" className="text-xl mr-1" />
                                Input Panen
                            </Link>
                        </div>
                    </div>

                    {/* Filter Form */}
                    {filterOpen && (
                        <form onSubmit={handleFilter} className="mt-4 p-4 bg-surface-container-low rounded-xl">
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                        Dari Tanggal
                                    </label>
                                    <input
                                        type="date"
                                        value={filterData.tanggal_dari}
                                        onChange={(e) => setFilterData({ ...filterData, tanggal_dari: e.target.value })}
                                        className="w-full px-3 py-2 border border-outline-variant/30 rounded-xl text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                        Sampai Tanggal
                                    </label>
                                    <input
                                        type="date"
                                        value={filterData.tanggal_sampai}
                                        onChange={(e) => setFilterData({ ...filterData, tanggal_sampai: e.target.value })}
                                        className="w-full px-3 py-2 border border-outline-variant/30 rounded-xl text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                        Kumbung
                                    </label>
                                    <select
                                        value={filterData.kumbung_id}
                                        onChange={(e) => setFilterData({ ...filterData, kumbung_id: e.target.value })}
                                        className="w-full px-3 py-2 border border-outline-variant/30 rounded-xl text-sm"
                                    >
                                        <option value="">Semua Kumbung</option>
                                        {kumbungs.map((k) => (
                                            <option key={k.id} value={k.id}>
                                                {k.nomor} - {k.nama}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-end space-x-2">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary"
                                    >
                                        Terapkan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="px-4 py-2 bg-gray-200 text-on-surface-variant text-sm font-medium rounded-xl hover:bg-gray-300"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-surface-container-low">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase tracking-wider">
                                    Tanggal
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase tracking-wider">
                                    Kumbung
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-on-tertiary-container uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-on-tertiary-container uppercase tracking-wider">
                                    Layak Jual
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-on-tertiary-container uppercase tracking-wider">
                                    Reject
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase tracking-wider">
                                    Catatan
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-on-tertiary-container uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {panens.data.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-on-tertiary-container">
                                        Belum ada data panen
                                    </td>
                                </tr>
                            ) : (
                                panens.data.map((panen) => (
                                    <tr key={panen.id} className="hover:bg-surface-container-low">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface">
                                            {panen.tanggal_formatted}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                                            {panen.kumbung ? (
                                                <span className="font-medium">{panen.kumbung.nomor}</span>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface text-right">
                                            {formatBerat(panen.berat_kg)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary text-right">
                                            {formatBerat(panen.berat_layak_jual)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 text-right">
                                            {formatBerat(panen.berat_reject)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-on-tertiary-container max-w-xs truncate">
                                            {panen.catatan || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={'/panen/' + panen.id + '/edit'}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                                >
                                                    <MIcon name="edit" className="text-xl" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(panen.id)}
                                                    disabled={deleting === panen.id}
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
                {panens.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-outline-variant/15">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-on-surface-variant">
                                Menampilkan {panens.from} - {panens.to} dari {panens.total} data
                            </p>
                            <div className="flex space-x-2">
                                {panens.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 text-sm rounded ${
                                            link.active
                                                ? 'bg-primary text-white'
                                                : link.url
                                                ? 'bg-surface-container-low text-on-surface-variant hover:bg-gray-200'
                                                : 'bg-surface-container-low text-slate-400 cursor-not-allowed'
                                        }`}
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
