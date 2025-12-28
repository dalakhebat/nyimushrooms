import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    PlusIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    CurrencyDollarIcon,
    CheckCircleIcon,
    ClockIcon,
    MagnifyingGlassIcon,
    BanknotesIcon,
} from '@heroicons/react/24/outline';

export default function KasbonIndex({ kasbons, karyawans, filters, summary }) {
    const [search, setSearch] = useState(filters.search || '');
    const [showBayarModal, setShowBayarModal] = useState(false);
    const [selectedKasbon, setSelectedKasbon] = useState(null);
    const [bayarForm, setBayarForm] = useState({
        jumlah: 0,
        tanggal: new Date().toISOString().slice(0, 10),
        keterangan: '',
    });

    const handleFilter = (key, value) => {
        router.get('/kasbon', { ...filters, [key]: value }, { preserveState: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        handleFilter('search', search);
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus data kasbon ini?')) {
            router.delete('/kasbon/' + id);
        }
    };

    const openBayarModal = (kasbon) => {
        setSelectedKasbon(kasbon);
        setBayarForm({
            jumlah: kasbon.sisa,
            tanggal: new Date().toISOString().slice(0, 10),
            keterangan: '',
        });
        setShowBayarModal(true);
    };

    const handleBayar = () => {
        router.post(`/kasbon/${selectedKasbon.id}/bayar`, bayarForm, {
            onSuccess: () => {
                setShowBayarModal(false);
                setSelectedKasbon(null);
            },
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <AdminLayout title="Kasbon">
            <Head title="Kasbon" />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-blue-500 p-3 rounded-lg flex-shrink-0">
                            <CurrencyDollarIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Kasbon</p>
                            <p className="text-2xl font-semibold text-gray-900">{summary.totalKasbon}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-yellow-500 p-3 rounded-lg flex-shrink-0">
                            <ClockIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Belum Lunas</p>
                            <p className="text-2xl font-semibold text-gray-900">{summary.totalBelumLunas}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-red-500 p-3 rounded-lg flex-shrink-0">
                            <BanknotesIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Sisa</p>
                            <p className="text-lg font-semibold text-gray-900">{formatCurrency(summary.totalNominalBelumLunas)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Actions */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={filters.status || ''}
                            onChange={(e) => handleFilter('status', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Semua Status</option>
                            <option value="belum_lunas">Belum Lunas</option>
                            <option value="lunas">Lunas</option>
                        </select>
                        <select
                            value={filters.karyawan_id || ''}
                            onChange={(e) => handleFilter('karyawan_id', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Semua Karyawan</option>
                            {karyawans.map((k) => (
                                <option key={k.id} value={k.id}>{k.nama}</option>
                            ))}
                        </select>
                        <form onSubmit={handleSearch} className="flex">
                            <input
                                type="text"
                                placeholder="Cari karyawan..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200"
                            >
                                <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
                            </button>
                        </form>
                    </div>
                    <Link
                        href="/kasbon/create"
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                    >
                        <PlusIcon className="w-5 h-5 mr-1" />
                        Tambah Kasbon
                    </Link>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Karyawan</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Sisa</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {kasbons.data.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-4 py-12 text-center text-gray-500">
                                        Belum ada data kasbon
                                    </td>
                                </tr>
                            ) : (
                                kasbons.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4">
                                            <p className="text-sm font-medium text-gray-900">{item.karyawan?.nama}</p>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-700">
                                            {formatDate(item.tanggal)}
                                        </td>
                                        <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">
                                            {formatCurrency(item.jumlah)}
                                        </td>
                                        <td className="px-4 py-4 text-right text-sm font-medium text-red-600">
                                            {formatCurrency(item.sisa)}
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            {item.status === 'lunas' ? (
                                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                                    <CheckCircleIcon className="w-3 h-3 mr-1" />
                                                    Lunas
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                                                    <ClockIcon className="w-3 h-3 mr-1" />
                                                    Belum Lunas
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500">
                                            {item.keterangan || '-'}
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                {item.status === 'belum_lunas' && (
                                                    <button
                                                        onClick={() => openBayarModal(item)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                                        title="Bayar"
                                                    >
                                                        <BanknotesIcon className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <Link
                                                    href={`/kasbon/${item.id}`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                >
                                                    <EyeIcon className="w-5 h-5" />
                                                </Link>
                                                <Link
                                                    href={`/kasbon/${item.id}/edit`}
                                                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                                                >
                                                    <PencilIcon className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
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
                {kasbons.links && kasbons.links.length > 3 && (
                    <div className="px-4 py-3 border-t border-gray-200 flex justify-center">
                        <div className="flex space-x-1">
                            {kasbons.links.map((link, index) => (
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

            {/* Modal Bayar */}
            {showBayarModal && selectedKasbon && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Bayar Kasbon</h3>
                        <p className="text-sm text-gray-600 mb-2">
                            Karyawan: <span className="font-medium">{selectedKasbon.karyawan?.nama}</span>
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                            Sisa: <span className="font-medium text-red-600">{formatCurrency(selectedKasbon.sisa)}</span>
                        </p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Jumlah Bayar
                                </label>
                                <input
                                    type="number"
                                    value={bayarForm.jumlah}
                                    onChange={(e) => setBayarForm({ ...bayarForm, jumlah: parseFloat(e.target.value) || 0 })}
                                    max={selectedKasbon.sisa}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tanggal Bayar
                                </label>
                                <input
                                    type="date"
                                    value={bayarForm.tanggal}
                                    onChange={(e) => setBayarForm({ ...bayarForm, tanggal: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Keterangan (Opsional)
                                </label>
                                <input
                                    type="text"
                                    value={bayarForm.keterangan}
                                    onChange={(e) => setBayarForm({ ...bayarForm, keterangan: e.target.value })}
                                    placeholder="Contoh: Bayar tunai"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowBayarModal(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleBayar}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Bayar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
