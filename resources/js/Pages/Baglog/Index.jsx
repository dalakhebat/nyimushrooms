import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';

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
            masuk_kumbung: { class: 'bg-emerald-100 text-secondary', label: 'Masuk Kumbung' },
            dijual: { class: 'bg-blue-100 text-blue-700', label: 'Dijual' },
            selesai: { class: 'bg-surface-container-low text-on-surface-variant', label: 'Selesai' },
        };
        return badges[status] || { class: 'bg-surface-container-low text-on-surface-variant', label: status };
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
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                    <div className="flex items-center">
                        <div className="bg-yellow-500 p-2 rounded-xl">
                            <MIcon name="science" className="text-xl text-white" />
                        </div>
                        <div className="ml-3">
                            <p className="text-xs font-medium text-on-tertiary-container">Produksi</p>
                            <p className="text-xl font-bold text-on-surface">{formatNumber(summary.produksi)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                    <div className="flex items-center">
                        <div className="bg-emerald-500 p-2 rounded-xl">
                            <MIcon name="house" className="text-xl text-white" />
                        </div>
                        <div className="ml-3">
                            <p className="text-xs font-medium text-on-tertiary-container">Masuk Kumbung</p>
                            <p className="text-xl font-bold text-on-surface">{formatNumber(summary.masuk_kumbung)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                    <div className="flex items-center">
                        <div className="bg-blue-500 p-2 rounded-xl">
                            <MIcon name="storefront" className="text-xl text-white" />
                        </div>
                        <div className="ml-3">
                            <p className="text-xs font-medium text-on-tertiary-container">Dijual</p>
                            <p className="text-xl font-bold text-on-surface">{formatNumber(summary.dijual)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                    <div className="flex items-center">
                        <div className="bg-slate-400 p-2 rounded-xl">
                            <MIcon name="check_circle" className="text-xl text-white" />
                        </div>
                        <div className="ml-3">
                            <p className="text-xs font-medium text-on-tertiary-container">Selesai</p>
                            <p className="text-xl font-bold text-on-surface">{formatNumber(summary.selesai)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4 mb-6">
                <div className="flex flex-wrap items-center gap-3">
                    <select
                        value={filters.status || ''}
                        onChange={(e) => handleFilter('status', e.target.value)}
                        className="px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                    >
                        <option value="">Semua Status</option>
                        <option value="produksi">Produksi</option>
                                                <option value="masuk_kumbung">Masuk Kumbung</option>
                        <option value="dijual">Dijual</option>
                        <option value="selesai">Selesai</option>
                    </select>
                    <select
                        value={filters.kumbung_id || ''}
                        onChange={(e) => handleFilter('kumbung_id', e.target.value)}
                        className="px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                    >
                        <option value="">Semua Kumbung</option>
                        {kumbungs.map((k) => (
                            <option key={k.id} value={k.id}>{k.nama}</option>
                        ))}
                    </select>
                    <form onSubmit={handleSearch} className="flex flex-1 min-w-[200px]">
                        <div className="relative flex-1">
                            <MIcon name="search" className="text-xl absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari kode batch..."
                                className="w-full pl-10 pr-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                            />
                        </div>
                    </form>
                    <Link
                        href="/baglog/create"
                        className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary"
                    >
                        <MIcon name="add_circle" className="text-xl mr-1" />
                        Tambah Baglog
                    </Link>
                </div>
            </div>

            {/* Table */}
            <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-surface-container-low">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Kode Batch</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-on-tertiary-container uppercase">Jumlah</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Kumbung</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Tgl Produksi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Tgl Masuk Kumbung</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Umur</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-on-tertiary-container uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-on-tertiary-container uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {baglogs.data.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-on-tertiary-container">
                                        <MIcon name="layers" className="text-4xl mx-auto mb-3 text-slate-300" />
                                        <p>Belum ada data baglog</p>
                                    </td>
                                </tr>
                            ) : (
                                baglogs.data.map((baglog) => (
                                    <tr key={baglog.id} className="hover:bg-surface-container-low">
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-on-surface">{baglog.kode_batch}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-bold text-on-surface">{formatNumber(baglog.jumlah)}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-on-surface-variant">
                                            {baglog.kumbung?.nama || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-on-surface-variant">
                                            {baglog.tanggal_produksi_formatted}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-on-surface-variant">
                                            {baglog.tanggal_masuk_kumbung_formatted || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-on-surface-variant">
                                            {baglog.umur || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <select
                                                value={baglog.status}
                                                onChange={(e) => handleStatusChange(baglog, e.target.value)}
                                                className={`px-2 py-1 text-xs font-medium rounded-xl border cursor-pointer ${getStatusBadge(baglog.status).class}`}
                                            >
                                                <option value="produksi">Produksi</option>
                                                                                                <option value="masuk_kumbung">Masuk Kumbung</option>
                                                <option value="dijual">Dijual</option>
                                                <option value="selesai">Selesai</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={`/baglog/${baglog.id}/edit`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl"
                                                >
                                                    <MIcon name="edit" className="text-xl" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(baglog.id)}
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
                {baglogs.links && baglogs.links.length > 3 && (
                    <div className="px-6 py-3 border-t border-outline-variant/15 flex justify-center">
                        <div className="flex space-x-1">
                            {baglogs.links.map((link, index) => (
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

            {/* Modal Pilih Kumbung */}
            {showKumbungModal && selectedBaglog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-surface-container-lowest rounded-xl p-6 w-full max-w-md">
                        <div className="flex items-center mb-4">
                            <div className="bg-emerald-100 p-3 rounded-full mr-3">
                                <MIcon name="house" className="text-2xl text-secondary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-headline font-bold text-on-surface">Masukkan ke Kumbung</h3>
                                <p className="text-sm text-on-tertiary-container">{selectedBaglog.kode_batch}</p>
                            </div>
                        </div>

                        <div className="bg-surface-container-low rounded-xl p-4 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-on-tertiary-container">Jumlah Baglog:</span>
                                <span className="font-bold text-on-surface">{formatNumber(selectedBaglog.jumlah)}</span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-on-surface-variant mb-2">
                                Pilih Kumbung <span className="text-red-500">*</span>
                            </label>
                            {availableKumbungs.length === 0 ? (
                                <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200/50 rounded-xl text-sm">
                                    <div className="flex items-center gap-2 text-amber-700">
                                        <MIcon name="info" className="text-base" />
                                        <span>Belum ada data <strong>Kumbung</strong></span>
                                    </div>
                                    <a
                                        href="/kumbung/create"
                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white primary-gradient rounded-lg hover:opacity-90 transition-all active:scale-95"
                                    >
                                        <MIcon name="add" className="text-sm" />
                                        Tambah Kumbung
                                    </a>
                                </div>
                            ) : (
                                <>
                                    <select
                                        value={selectedKumbung}
                                        onChange={(e) => setSelectedKumbung(e.target.value)}
                                        className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
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
                                    <a href="/kumbung/create" className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-secondary hover:underline">
                                        <MIcon name="add" className="text-sm" />
                                        Tambah Kumbung Baru
                                    </a>
                                </>
                            )}

                            {/* Warning jika kapasitas tidak cukup */}
                            {selectedKumbung && (() => {
                                const k = kumbungs.find(x => x.id == selectedKumbung);
                                if (k && selectedBaglog?.jumlah > k.tersedia) {
                                    return (
                                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                                            <p className="text-sm text-red-700">
                                                <MIcon name="warning" className="text-base inline mr-1" />
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
                                className="px-4 py-2 text-on-surface-variant hover:bg-surface-container-low rounded-xl"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleMasukKumbung}
                                disabled={!selectedKumbung || (selectedKumbung && kumbungs.find(k => k.id == selectedKumbung)?.tersedia < selectedBaglog?.jumlah)}
                                className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
