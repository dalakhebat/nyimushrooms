import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Icon } from '@iconify/react';

export default function BaglogIndex({ baglogs, kumbungs, summary, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [showKumbungModal, setShowKumbungModal] = useState(false);
    const [selectedBaglog, setSelectedBaglog] = useState(null);
    const [selectedKumbung, setSelectedKumbung] = useState('');

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

    const handleStatusChange = (baglog, newStatus) => {
        // Jika pilih masuk_kumbung, tampilkan modal pilih kumbung
        if (newStatus === 'masuk_kumbung' && !baglog.kumbung_id) {
            setSelectedBaglog(baglog);
            setSelectedKumbung('');
            setShowKumbungModal(true);
            return;
        }

        // Untuk status lain, langsung update
        if (confirm(`Ubah status menjadi "${getStatusBadge(newStatus).label}"?`)) {
            router.patch(`/baglog/${baglog.id}/status`, { status: newStatus });
        }
    };

    const handleMasukKumbung = () => {
        if (!selectedKumbung) {
            alert('Pilih kumbung terlebih dahulu');
            return;
        }

        // Validasi kapasitas
        const kumbung = kumbungs.find(k => k.id == selectedKumbung);
        if (kumbung && selectedBaglog.jumlah > kumbung.tersedia) {
            alert(`Kapasitas kumbung tidak cukup!\n\nJumlah baglog: ${formatNumber(selectedBaglog.jumlah)}\nKapasitas tersedia: ${formatNumber(kumbung.tersedia)}`);
            return;
        }

        router.patch(`/baglog/${selectedBaglog.id}/status`, {
            status: 'masuk_kumbung',
            kumbung_id: selectedKumbung,
        }, {
            onSuccess: () => {
                setShowKumbungModal(false);
                setSelectedBaglog(null);
                setSelectedKumbung('');
            }
        });
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

    // Filter kumbungs yang aktif dan punya kapasitas
    const availableKumbungs = kumbungs.filter(k => k.status === 'aktif');

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
                                                onChange={(e) => handleStatusChange(baglog, e.target.value)}
                                                className={`px-2 py-1 text-xs font-medium rounded-lg border cursor-pointer ${getStatusBadge(baglog.status).class}`}
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

            {/* Modal Pilih Kumbung */}
            {showKumbungModal && selectedBaglog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <div className="flex items-center mb-4">
                            <div className="bg-green-100 p-3 rounded-full mr-3">
                                <Icon icon="solar:home-2-bold" className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Masukkan ke Kumbung</h3>
                                <p className="text-sm text-gray-500">{selectedBaglog.kode_batch}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Jumlah Baglog:</span>
                                <span className="font-semibold text-gray-900">{formatNumber(selectedBaglog.jumlah)}</span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Pilih Kumbung <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedKumbung}
                                onChange={(e) => setSelectedKumbung(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">-- Pilih Kumbung --</option>
                                {availableKumbungs.map((k) => {
                                    const cukup = k.tersedia >= selectedBaglog?.jumlah;
                                    return (
                                        <option
                                            key={k.id}
                                            value={k.id}
                                            disabled={!cukup}
                                        >
                                            {k.nama} - Tersedia: {formatNumber(k.tersedia)} / {formatNumber(k.kapasitas)} {!cukup ? '(Kapasitas tidak cukup)' : ''}
                                        </option>
                                    );
                                })}
                            </select>

                            {/* Warning jika kapasitas tidak cukup */}
                            {selectedKumbung && (() => {
                                const k = kumbungs.find(x => x.id == selectedKumbung);
                                if (k && selectedBaglog?.jumlah > k.tersedia) {
                                    return (
                                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-sm text-red-700">
                                                <Icon icon="solar:danger-triangle-bold" className="inline w-4 h-4 mr-1" />
                                                Kapasitas tidak cukup! Tersedia: {formatNumber(k.tersedia)}, Dibutuhkan: {formatNumber(selectedBaglog.jumlah)}
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            })()}
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowKumbungModal(false);
                                    setSelectedBaglog(null);
                                    setSelectedKumbung('');
                                }}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleMasukKumbung}
                                disabled={!selectedKumbung || (selectedKumbung && kumbungs.find(k => k.id == selectedKumbung)?.tersedia < selectedBaglog?.jumlah)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Masukkan ke Kumbung
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
