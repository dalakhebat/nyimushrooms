import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';

export default function BaglogIndex({ baglogs, kumbungs, customers = [], summary, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [showKumbungModal, setShowKumbungModal] = useState(false);
    const [selectedBaglog, setSelectedBaglog] = useState(null);
    const [distributions, setDistributions] = useState([{ kumbung_id: '', jumlah: '' }]);
    const [tanggalTanam, setTanggalTanam] = useState(() => new Date().toISOString().slice(0, 10));
    const [distProcessing, setDistProcessing] = useState(false);

    // Sell modal state
    const [showSellModal, setShowSellModal] = useState(false);
    const [sellBaglog, setSellBaglog] = useState(null);
    const [sellForm, setSellForm] = useState({
        customer_id: '',
        tanggal: new Date().toISOString().slice(0, 10),
        jumlah_baglog: '',
        harga_satuan: '',
        status: 'lunas',
        catatan: '',
    });
    const [sellProcessing, setSellProcessing] = useState(false);
    const [sellErrors, setSellErrors] = useState({});

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
        // Jika pilih masuk_kumbung, buka modal distribusi (bisa split ke banyak kumbung)
        if (newStatus === 'masuk_kumbung' && !baglog.kumbung_id) {
            setSelectedBaglog(baglog);
            setDistributions([{ kumbung_id: '', jumlah: String(baglog.jumlah) }]);
            setTanggalTanam(new Date().toISOString().slice(0, 10));
            setShowKumbungModal(true);
            return;
        }

        // Jika pilih dijual, buka modal penjualan
        if (newStatus === 'dijual') {
            setSellBaglog(baglog);
            setSellForm({
                customer_id: '',
                tanggal: new Date().toISOString().slice(0, 10),
                jumlah_baglog: String(baglog.jumlah),
                harga_satuan: '',
                status: 'lunas',
                catatan: '',
            });
            setSellErrors({});
            setShowSellModal(true);
            return;
        }

        // Untuk status lain, langsung update
        if (confirm(`Ubah status menjadi "${getStatusBadge(newStatus).label}"?`)) {
            router.patch(`/baglog/${baglog.id}/status`, { status: newStatus });
        }
    };

    const sellTotalHarga = (parseInt(sellForm.jumlah_baglog) || 0) * (parseFloat(sellForm.harga_satuan) || 0);
    const sellJumlahValid =
        sellBaglog &&
        parseInt(sellForm.jumlah_baglog) > 0 &&
        parseInt(sellForm.jumlah_baglog) <= sellBaglog.jumlah;
    const sellHargaValid = parseFloat(sellForm.harga_satuan) > 0;
    const isSellValid = sellBaglog && sellJumlahValid && sellHargaValid;

    const handleSell = () => {
        if (!isSellValid) return;

        setSellProcessing(true);
        setSellErrors({});
        router.post(
            '/penjualan/baglog',
            {
                customer_id: sellForm.customer_id || null,
                baglog_id: sellBaglog.id,
                tanggal: sellForm.tanggal,
                jumlah_baglog: parseInt(sellForm.jumlah_baglog),
                harga_satuan: parseFloat(sellForm.harga_satuan),
                status: sellForm.status,
                catatan: sellForm.catatan,
            },
            {
                onSuccess: () => {
                    setShowSellModal(false);
                    setSellBaglog(null);
                },
                onError: (errs) => setSellErrors(errs),
                onFinish: () => setSellProcessing(false),
            }
        );
    };

    const addDistributionRow = () => {
        setDistributions([...distributions, { kumbung_id: '', jumlah: '' }]);
    };

    const removeDistributionRow = (index) => {
        if (distributions.length === 1) return;
        setDistributions(distributions.filter((_, i) => i !== index));
    };

    const updateDistributionRow = (index, field, value) => {
        setDistributions(distributions.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
    };

    const totalDistribusi = distributions.reduce((sum, r) => sum + (parseInt(r.jumlah) || 0), 0);
    const sisaDistribusi = selectedBaglog ? selectedBaglog.jumlah - totalDistribusi : 0;
    const usedKumbungIds = distributions.map((r) => r.kumbung_id).filter(Boolean);
    const hasDuplicateKumbung = new Set(usedKumbungIds).size !== usedKumbungIds.length;
    const isDistValid =
        selectedBaglog &&
        distributions.every((r) => r.kumbung_id && parseInt(r.jumlah) > 0) &&
        totalDistribusi > 0 &&
        totalDistribusi <= selectedBaglog.jumlah &&
        !hasDuplicateKumbung;

    const handleDistribute = () => {
        if (!isDistValid) return;

        setDistProcessing(true);
        router.post(
            `/baglog/${selectedBaglog.id}/distribute`,
            {
                tanggal_tanam: tanggalTanam,
                distributions: distributions.map((r) => ({
                    kumbung_id: parseInt(r.kumbung_id),
                    jumlah: parseInt(r.jumlah),
                })),
            },
            {
                onSuccess: () => {
                    setShowKumbungModal(false);
                    setSelectedBaglog(null);
                    setDistributions([{ kumbung_id: '', jumlah: '' }]);
                },
                onFinish: () => setDistProcessing(false),
            }
        );
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

            {/* Modal Distribusi ke Kumbung (bisa split ke banyak kumbung) */}
            {showKumbungModal && selectedBaglog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-surface-container-lowest rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center mb-4">
                            <div className="bg-emerald-100 p-3 rounded-full mr-3">
                                <MIcon name="house" className="text-2xl text-secondary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-headline font-bold text-on-surface">Distribusikan ke Kumbung</h3>
                                <p className="text-sm text-on-tertiary-container">
                                    {selectedBaglog.kode_batch} — bisa dibagi ke beberapa kumbung sekaligus
                                </p>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="bg-surface-container-low rounded-xl p-3">
                                <p className="text-xs text-on-tertiary-container">Total Baglog</p>
                                <p className="font-bold text-on-surface">{formatNumber(selectedBaglog.jumlah)}</p>
                            </div>
                            <div className="bg-surface-container-low rounded-xl p-3">
                                <p className="text-xs text-on-tertiary-container">Terdistribusi</p>
                                <p className={`font-bold ${totalDistribusi > selectedBaglog.jumlah ? 'text-red-600' : 'text-emerald-600'}`}>
                                    {formatNumber(totalDistribusi)}
                                </p>
                            </div>
                            <div className="bg-surface-container-low rounded-xl p-3">
                                <p className="text-xs text-on-tertiary-container">Sisa</p>
                                <p className={`font-bold ${sisaDistribusi < 0 ? 'text-red-600' : 'text-on-surface'}`}>
                                    {formatNumber(Math.max(sisaDistribusi, 0))}
                                </p>
                            </div>
                        </div>

                        {/* Tanggal Masuk Kumbung */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                Tanggal Masuk Kumbung <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={tanggalTanam}
                                onChange={(e) => setTanggalTanam(e.target.value)}
                                className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                            />
                        </div>

                        {/* Distribution rows */}
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-on-surface-variant mb-2">
                                Distribusi per Kumbung <span className="text-red-500">*</span>
                            </label>

                            {availableKumbungs.length === 0 ? (
                                <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200/50 rounded-xl text-sm">
                                    <div className="flex items-center gap-2 text-amber-700">
                                        <MIcon name="info" className="text-base" />
                                        <span>Belum ada data <strong>Kumbung</strong></span>
                                    </div>
                                    <a
                                        href="/kumbung/create"
                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white primary-gradient rounded-lg hover:opacity-90"
                                    >
                                        <MIcon name="add" className="text-sm" />
                                        Tambah Kumbung
                                    </a>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {distributions.map((row, idx) => {
                                        const kumbung = kumbungs.find((k) => k.id == row.kumbung_id);
                                        const jumlahNum = parseInt(row.jumlah) || 0;
                                        const overCapacity = kumbung && jumlahNum > kumbung.tersedia;
                                        return (
                                            <div key={idx} className="flex items-start gap-2">
                                                <div className="flex-1">
                                                    <select
                                                        value={row.kumbung_id}
                                                        onChange={(e) => updateDistributionRow(idx, 'kumbung_id', e.target.value)}
                                                        className="w-full px-3 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary text-sm"
                                                    >
                                                        <option value="">-- Pilih Kumbung --</option>
                                                        {availableKumbungs.map((k) => {
                                                            const isUsedElsewhere =
                                                                usedKumbungIds.includes(String(k.id)) && String(k.id) !== String(row.kumbung_id);
                                                            return (
                                                                <option key={k.id} value={k.id} disabled={isUsedElsewhere}>
                                                                    {k.nama} — Tersedia: {formatNumber(k.tersedia)}
                                                                    {isUsedElsewhere ? ' (sudah dipilih)' : ''}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                    {kumbung && (
                                                        <p className="text-xs text-on-tertiary-container mt-1">
                                                            Kapasitas {formatNumber(kumbung.kapasitas)}, terisi {formatNumber(kumbung.terisi || kumbung.kapasitas - kumbung.tersedia)}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="w-36">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={row.jumlah}
                                                        onChange={(e) => updateDistributionRow(idx, 'jumlah', e.target.value)}
                                                        placeholder="Jumlah"
                                                        className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-secondary text-sm ${
                                                            overCapacity ? 'border-red-400 bg-red-50' : 'border-outline-variant/30'
                                                        }`}
                                                    />
                                                    {overCapacity && (
                                                        <p className="text-xs text-red-600 mt-1">
                                                            Lebih dari tersedia ({formatNumber(kumbung.tersedia)})
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeDistributionRow(idx)}
                                                    disabled={distributions.length === 1}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed"
                                                    title="Hapus baris"
                                                >
                                                    <MIcon name="delete" className="text-xl" />
                                                </button>
                                            </div>
                                        );
                                    })}

                                    <button
                                        type="button"
                                        onClick={addDistributionRow}
                                        className="w-full py-2 border border-dashed border-outline-variant/50 rounded-xl text-sm text-secondary hover:bg-surface-container-low flex items-center justify-center gap-1"
                                    >
                                        <MIcon name="add" className="text-base" />
                                        Tambah Kumbung
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Validation messages */}
                        {totalDistribusi > selectedBaglog.jumlah && (
                            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-start gap-2">
                                <MIcon name="warning" className="text-base mt-0.5" />
                                <span>
                                    Total distribusi ({formatNumber(totalDistribusi)}) melebihi jumlah baglog ({formatNumber(selectedBaglog.jumlah)}).
                                </span>
                            </div>
                        )}
                        {hasDuplicateKumbung && (
                            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-start gap-2">
                                <MIcon name="warning" className="text-base mt-0.5" />
                                <span>Ada kumbung yang dipilih lebih dari sekali. Gabungkan jumlahnya jadi satu baris.</span>
                            </div>
                        )}
                        {sisaDistribusi > 0 && (
                            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 flex items-start gap-2">
                                <MIcon name="info" className="text-base mt-0.5" />
                                <span>
                                    {formatNumber(sisaDistribusi)} baglog akan tetap di status <strong>produksi</strong> dan bisa didistribusi nanti.
                                </span>
                            </div>
                        )}

                        <div className="flex justify-end space-x-3 pt-2">
                            <button
                                onClick={() => {
                                    setShowKumbungModal(false);
                                    setSelectedBaglog(null);
                                    setDistributions([{ kumbung_id: '', jumlah: '' }]);
                                }}
                                className="px-4 py-2 text-on-surface-variant hover:bg-surface-container-low rounded-xl"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDistribute}
                                disabled={!isDistValid || distProcessing}
                                className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {distProcessing ? 'Memproses...' : 'Distribusikan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Jual Baglog */}
            {showSellModal && sellBaglog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-surface-container-lowest rounded-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center mb-4">
                            <div className="bg-blue-100 p-3 rounded-full mr-3">
                                <MIcon name="storefront" className="text-2xl text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-headline font-bold text-on-surface">Jual Baglog</h3>
                                <p className="text-sm text-on-tertiary-container">
                                    {sellBaglog.kode_batch} — stok tersedia {formatNumber(sellBaglog.jumlah)}
                                </p>
                            </div>
                        </div>

                        {/* Error from backend */}
                        {Object.keys(sellErrors).length > 0 && (
                            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                                {Object.values(sellErrors).map((err, i) => (
                                    <div key={i}>• {err}</div>
                                ))}
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Customer */}
                            <div>
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                    Customer <span className="text-on-tertiary-container text-xs">(opsional)</span>
                                </label>
                                {customers.length === 0 ? (
                                    <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200/50 rounded-xl text-sm">
                                        <div className="flex items-center gap-2 text-amber-700">
                                            <MIcon name="info" className="text-base" />
                                            <span>Belum ada customer — biarkan kosong untuk "Umum"</span>
                                        </div>
                                        <a
                                            href="/customer/create"
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white primary-gradient rounded-lg hover:opacity-90"
                                        >
                                            <MIcon name="add" className="text-sm" />
                                            Tambah
                                        </a>
                                    </div>
                                ) : (
                                    <select
                                        value={sellForm.customer_id}
                                        onChange={(e) => setSellForm({ ...sellForm, customer_id: e.target.value })}
                                        className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                                    >
                                        <option value="">— Umum (tanpa customer) —</option>
                                        {customers.map((c) => (
                                            <option key={c.id} value={c.id}>{c.nama}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* Tanggal & Jumlah */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                        Tanggal <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={sellForm.tanggal}
                                        onChange={(e) => setSellForm({ ...sellForm, tanggal: e.target.value })}
                                        className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                        Jumlah Baglog <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={sellBaglog.jumlah}
                                        value={sellForm.jumlah_baglog}
                                        onChange={(e) => setSellForm({ ...sellForm, jumlah_baglog: e.target.value })}
                                        className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-secondary ${
                                            sellForm.jumlah_baglog && !sellJumlahValid
                                                ? 'border-red-400 bg-red-50'
                                                : 'border-outline-variant/30'
                                        }`}
                                        placeholder="0"
                                    />
                                    {sellForm.jumlah_baglog && !sellJumlahValid && (
                                        <p className="text-xs text-red-600 mt-1">
                                            Max {formatNumber(sellBaglog.jumlah)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Harga satuan */}
                            <div>
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                    Harga per Baglog (Rp) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="100"
                                    value={sellForm.harga_satuan}
                                    onChange={(e) => setSellForm({ ...sellForm, harga_satuan: e.target.value })}
                                    className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                                    placeholder="3500"
                                />
                            </div>

                            {/* Total auto */}
                            {sellTotalHarga > 0 && (
                                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex justify-between items-center">
                                    <span className="text-sm text-emerald-700">Total Harga:</span>
                                    <span className="font-bold text-lg text-emerald-700">
                                        Rp {new Intl.NumberFormat('id-ID').format(sellTotalHarga)}
                                    </span>
                                </div>
                            )}

                            {/* Status pembayaran */}
                            <div>
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                    Status Pembayaran <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['lunas', 'pending'].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setSellForm({ ...sellForm, status: s })}
                                            className={`py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                                                sellForm.status === s
                                                    ? s === 'lunas'
                                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                        : 'border-amber-500 bg-amber-50 text-amber-700'
                                                    : 'border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low'
                                            }`}
                                        >
                                            {s === 'lunas' ? 'Lunas (kas masuk)' : 'Pending (piutang)'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Catatan */}
                            <div>
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                    Catatan <span className="text-on-tertiary-container text-xs">(opsional)</span>
                                </label>
                                <textarea
                                    value={sellForm.catatan}
                                    onChange={(e) => setSellForm({ ...sellForm, catatan: e.target.value })}
                                    rows="2"
                                    className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                                    placeholder="Catatan tambahan..."
                                />
                            </div>

                            {/* Info sisa */}
                            {sellJumlahValid && parseInt(sellForm.jumlah_baglog) < sellBaglog.jumlah && (
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 flex items-start gap-2">
                                    <MIcon name="info" className="text-base mt-0.5" />
                                    <span>
                                        Sisa {formatNumber(sellBaglog.jumlah - parseInt(sellForm.jumlah_baglog))} baglog akan tetap di batch ini.
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3 pt-4 mt-4 border-t border-outline-variant/15">
                            <button
                                onClick={() => {
                                    setShowSellModal(false);
                                    setSellBaglog(null);
                                }}
                                className="px-4 py-2 text-on-surface-variant hover:bg-surface-container-low rounded-xl"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSell}
                                disabled={!isSellValid || sellProcessing}
                                className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {sellProcessing ? 'Memproses...' : 'Simpan Penjualan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
