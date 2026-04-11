import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';

export default function PenggajianIndex({ penggajians, filters, summary }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedIds, setSelectedIds] = useState([]);
    const [showBayarModal, setShowBayarModal] = useState(false);
    const [tanggalBayar, setTanggalBayar] = useState(new Date().toISOString().slice(0, 10));
    const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
    const [deleteConfirmCode, setDeleteConfirmCode] = useState('');
    const [deleteError, setDeleteError] = useState('');

    const formatLocalMonth = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    };

    const getMonthOptions = () => {
        const options = [];
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();

        // Generate months from current month down to January 2023
        for (let year = currentYear; year >= 2023; year--) {
            const endMonth = year === currentYear ? currentMonth : 11;

            for (let month = endMonth; month >= 0; month--) {
                const date = new Date(year, month, 1);
                const value = formatLocalMonth(date);
                const label = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
                options.push({ value, label });
            }
        }
        return options;
    };

    const handleFilter = (key, value) => {
        router.get('/penggajian', { ...filters, [key]: value }, { preserveState: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        handleFilter('search', search);
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus data penggajian ini?')) {
            router.delete('/penggajian/' + id);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const pendingIds = penggajians.data
                .filter((p) => p.status === 'pending')
                .map((p) => p.id);
            setSelectedIds(pendingIds);
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((i) => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBayarBulk = () => {
        router.post('/penggajian/bayar-bulk', {
            ids: selectedIds,
            tanggal_bayar: tanggalBayar,
        }, {
            onSuccess: () => {
                setShowBayarModal(false);
                setSelectedIds([]);
            }
        });
    };

    const handleDeleteAll = () => {
        if (!deleteConfirmCode.trim()) {
            setDeleteError('Masukkan kode konfirmasi!');
            return;
        }

        router.delete('/penggajian/destroy-all', {
            data: { confirmation_code: deleteConfirmCode },
            onSuccess: () => {
                setShowDeleteAllModal(false);
                setDeleteConfirmCode('');
                setDeleteError('');
            },
            onError: (errors) => {
                setDeleteError(errors?.confirmation_code || 'Kode konfirmasi salah atau gagal menghapus data.');
            }
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusBadge = (status) => {
        if (status === 'dibayar') {
            return { class: 'bg-emerald-100 text-secondary', label: 'Dibayar', icon: 'solar:check-circle-bold' };
        }
        return { class: 'bg-yellow-100 text-yellow-700', label: 'Pending', icon: 'solar:clock-circle-bold' };
    };

    return (
        <AdminLayout title="Penggajian">
            <Head title="Penggajian" />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-yellow-500 p-3 rounded-xl flex-shrink-0">
                            <MIcon name="schedule" className="text-2xl text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-on-tertiary-container">Pending</p>
                            <p className="text-2xl font-bold text-on-surface">{summary.totalPending}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-secondary p-3 rounded-xl flex-shrink-0">
                            <MIcon name="check_circle" className="text-2xl text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-on-tertiary-container">Dibayar</p>
                            <p className="text-2xl font-bold text-on-surface">{summary.totalDibayar}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-red-500 p-3 rounded-xl flex-shrink-0">
                            <MIcon name="payments" className="text-2xl text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-on-tertiary-container">Total Belum Dibayar</p>
                            <p className="text-lg font-headline font-bold text-on-surface">{formatCurrency(summary.totalNominalPending)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Actions */}
            <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={filters.status || ''}
                            onChange={(e) => handleFilter('status', e.target.value)}
                            className="px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                        >
                            <option value="">Semua Status</option>
                            <option value="pending">Pending</option>
                            <option value="dibayar">Dibayar</option>
                        </select>
                        <select
                            value={filters.bulan || ''}
                            onChange={(e) => handleFilter('bulan', e.target.value)}
                            className="px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                        >
                            <option value="">Semua Bulan</option>
                            {getMonthOptions().map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <form onSubmit={handleSearch} className="flex">
                            <input
                                type="text"
                                placeholder="Cari karyawan..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="px-4 py-2 border border-outline-variant/30 rounded-l-lg focus:ring-2 focus:ring-secondary"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-surface-container-low border border-l-0 border-outline-variant/30 rounded-r-lg hover:bg-gray-200"
                            >
                                <MIcon name="search" className="text-xl text-on-tertiary-container" />
                            </button>
                        </form>
                    </div>
                    <div className="flex items-center gap-3">
                        {selectedIds.length > 0 && (
                            <button
                                onClick={() => setShowBayarModal(true)}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700"
                            >
                                <MIcon name="payments" className="text-xl mr-1" />
                                Bayar ({selectedIds.length})
                            </button>
                        )}
                        <button
                            onClick={() => setShowDeleteAllModal(true)}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700"
                        >
                            <MIcon name="delete" className="text-xl mr-1" />
                            Hapus Semua
                        </button>
                        <Link
                            href="/penggajian/create"
                            className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary"
                        >
                            <MIcon name="add_circle" className="text-xl mr-1" />
                            Proses Gaji
                        </Link>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-surface-container-low">
                            <tr>
                                <th className="px-4 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={selectedIds.length > 0 && selectedIds.length === penggajians.data.filter(p => p.status === 'pending').length}
                                        className="rounded border-outline-variant/30 text-secondary focus:ring-secondary"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Karyawan</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Periode</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-on-tertiary-container uppercase">Hadir</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-on-tertiary-container uppercase">Total Gaji</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-on-tertiary-container uppercase">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-on-tertiary-container uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {penggajians.data.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-4 py-12 text-center text-on-tertiary-container">
                                        Belum ada data penggajian
                                    </td>
                                </tr>
                            ) : (
                                penggajians.data.map((item) => {
                                    const statusIconName = getStatusBadge(item.status).icon;
                                    return (
                                        <tr key={item.id} className="hover:bg-surface-container-low">
                                            <td className="px-4 py-4">
                                                {item.status === 'pending' && (
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.includes(item.id)}
                                                        onChange={() => handleSelect(item.id)}
                                                        className="rounded border-outline-variant/30 text-secondary focus:ring-secondary"
                                                    />
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <p className="text-sm font-medium text-on-surface">{item.karyawan?.nama}</p>
                                                <p className="text-xs text-on-tertiary-container capitalize">{item.karyawan?.tipe_gaji}</p>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-on-surface-variant">
                                                {item.periode_formatted}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-medium bg-emerald-100 text-secondary rounded-full">
                                                    {item.jumlah_hadir}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right text-sm font-bold text-on-surface">
                                                {formatCurrency(item.total)}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(item.status).class}`}>
                                                    <Icon icon={statusIconName} className="w-3 h-3 mr-1" />
                                                    {getStatusBadge(item.status).label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Link
                                                        href={`/penggajian/${item.id}`}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl"
                                                    >
                                                        <MIcon name="visibility" className="text-xl" />
                                                    </Link>
                                                    <a
                                                        href={`/penggajian/${item.id}/slip-pdf`}
                                                        className="p-2 text-secondary hover:bg-emerald-50 rounded-xl"
                                                    >
                                                        <MIcon name="document_download" className="text-xl" />
                                                    </a>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                                                    >
                                                        <MIcon name="delete" className="text-xl" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {penggajians.links && penggajians.links.length > 3 && (
                    <div className="px-4 py-3 border-t border-outline-variant/15 flex justify-center">
                        <div className="flex space-x-1">
                            {penggajians.links.map((link, index) => (
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

            {/* Modal Bayar Bulk */}
            {showBayarModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-surface-container-lowest rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold text-on-surface mb-4">Bayar Gaji</h3>
                        <p className="text-sm text-on-surface-variant mb-4">
                            Anda akan membayar {selectedIds.length} gaji karyawan.
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                Tanggal Bayar
                            </label>
                            <input
                                type="date"
                                value={tanggalBayar}
                                onChange={(e) => setTanggalBayar(e.target.value)}
                                className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowBayarModal(false)}
                                className="px-4 py-2 text-on-surface-variant hover:bg-surface-container-low rounded-xl"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleBayarBulk}
                                className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary"
                            >
                                Bayar Sekarang
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Hapus Semua */}
            {showDeleteAllModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-surface-container-lowest rounded-xl p-6 w-full max-w-md">
                        <div className="flex items-center mb-4">
                            <div className="bg-red-100 p-3 rounded-full mr-3">
                                <MIcon name="warning" className="text-2xl text-red-600" />
                            </div>
                            <h3 className="text-lg font-headline font-bold text-on-surface">Hapus Semua Data Penggajian</h3>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                            <p className="text-sm text-red-700 font-medium">
                                Peringatan: Tindakan ini akan menghapus SEMUA data penggajian dan tidak dapat dibatalkan!
                            </p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                Masukkan kode konfirmasi untuk melanjutkan:
                            </label>
                            <input
                                type="text"
                                value={deleteConfirmCode}
                                onChange={(e) => {
                                    setDeleteConfirmCode(e.target.value);
                                    setDeleteError('');
                                }}
                                placeholder="Masukkan kode..."
                                className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-red-500"
                            />
                            {deleteError && (
                                <p className="mt-2 text-sm text-red-600">{deleteError}</p>
                            )}
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteAllModal(false);
                                    setDeleteConfirmCode('');
                                    setDeleteError('');
                                }}
                                className="px-4 py-2 text-on-surface-variant hover:bg-surface-container-low rounded-xl"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDeleteAll}
                                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
                            >
                                Hapus Semua
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
