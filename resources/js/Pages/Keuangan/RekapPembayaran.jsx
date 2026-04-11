import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import MIcon from '@/Components/MIcon';

export default function RekapPembayaran({ pembayarans, summary }) {
    const [showForm, setShowForm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        tanggal_bayar: new Date().toISOString().split('T')[0],
        periode_ke: (summary.periodeTerakhir || 0) + 1,
        jumlah_pokok: summary.monthlyPrincipal,
        jumlah_bunga: summary.monthlyInterest,
        metode_pembayaran: 'transfer',
        nomor_referensi: '',
        keterangan: '',
    });

    // Format number to rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(number);
    };

    // Format date
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('keuangan.pembayaran.store'), {
            onSuccess: () => {
                setShowForm(false);
                reset();
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus data pembayaran ini?')) {
            router.delete(route('keuangan.pembayaran.destroy', id));
        }
    };

    // Calculate progress
    const progressPercent = (summary.periodeTerakhir / summary.tenorMonths) * 100;
    const paidPercent = (summary.totalPokok / summary.loanAmount) * 100;

    return (
        <AdminLayout title="Rekap Pembayaran Kredit">
            <Head title="Rekap Pembayaran Kredit" />

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl p-6 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold">Rekap Pembayaran Kredit</h1>
                            <p className="text-emerald-100 mt-1">Catatan pembayaran cicilan kredit BNI</p>
                        </div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="px-4 py-2 bg-surface-container-lowest text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors flex items-center"
                        >
                            <MIcon name="add_circle" className="text-xl mr-2" />
                            Catat Pembayaran
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-on-tertiary-container">Total Sudah Dibayar</p>
                                <p className="text-xl font-bold text-secondary">{formatRupiah(summary.totalBayar)}</p>
                            </div>
                            <div className="p-3 bg-emerald-100 rounded-xl">
                                <MIcon name="check_circle" className="text-2xl text-secondary" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-on-tertiary-container">Sisa Pokok</p>
                                <p className="text-xl font-bold text-red-600">{formatRupiah(summary.sisaPokok)}</p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-xl">
                                <MIcon name="account_balance_wallet" className="text-2xl text-red-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-on-tertiary-container">Periode Terbayar</p>
                                <p className="text-xl font-bold text-blue-600">{summary.periodeTerakhir} / {summary.tenorMonths}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <MIcon name="date_range" className="text-2xl text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-on-tertiary-container">Sisa Periode</p>
                                <p className="text-xl font-bold text-purple-600">{summary.sisaPeriode} bulan</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <MIcon name="hourglass" className="text-2xl text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-6">
                    <h2 className="text-lg font-bold text-on-surface mb-4">Progress Pembayaran</h2>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-on-surface-variant">Periode Terbayar</span>
                                <span className="font-medium">{progressPercent.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-on-surface-variant">Pokok Terbayar</span>
                                <span className="font-medium">{paidPercent.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-primary h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(paidPercent, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Payment Form */}
                {showForm && (
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-6">
                        <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center">
                            <MIcon name="add_circle" className="text-xl mr-2 text-emerald-600" />
                            Catat Pembayaran Baru
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-on-surface-variant mb-1">Tanggal Bayar *</label>
                                    <input
                                        type="date"
                                        value={data.tanggal_bayar}
                                        onChange={(e) => setData('tanggal_bayar', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                                    />
                                    {errors.tanggal_bayar && <p className="text-red-500 text-xs mt-1">{errors.tanggal_bayar}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface-variant mb-1">Periode Ke *</label>
                                    <input
                                        type="number"
                                        value={data.periode_ke}
                                        onChange={(e) => setData('periode_ke', parseInt(e.target.value) || 0)}
                                        min="1"
                                        className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                                    />
                                    {errors.periode_ke && <p className="text-red-500 text-xs mt-1">{errors.periode_ke}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface-variant mb-1">Metode Pembayaran</label>
                                    <select
                                        value={data.metode_pembayaran}
                                        onChange={(e) => setData('metode_pembayaran', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="transfer">Transfer Bank</option>
                                        <option value="tunai">Tunai</option>
                                        <option value="autodebet">Auto Debet</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface-variant mb-1">Jumlah Pokok *</label>
                                    <input
                                        type="number"
                                        value={data.jumlah_pokok}
                                        onChange={(e) => setData('jumlah_pokok', parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                                    />
                                    {errors.jumlah_pokok && <p className="text-red-500 text-xs mt-1">{errors.jumlah_pokok}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface-variant mb-1">Jumlah Bunga *</label>
                                    <input
                                        type="number"
                                        value={data.jumlah_bunga}
                                        onChange={(e) => setData('jumlah_bunga', parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                                    />
                                    {errors.jumlah_bunga && <p className="text-red-500 text-xs mt-1">{errors.jumlah_bunga}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface-variant mb-1">Total Bayar</label>
                                    <input
                                        type="text"
                                        value={formatRupiah(data.jumlah_pokok + data.jumlah_bunga)}
                                        readOnly
                                        className="w-full px-3 py-2 bg-surface-container-low border rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface-variant mb-1">No. Referensi</label>
                                    <input
                                        type="text"
                                        value={data.nomor_referensi}
                                        onChange={(e) => setData('nomor_referensi', e.target.value)}
                                        placeholder="Nomor bukti transfer"
                                        className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium text-on-surface-variant mb-1">Keterangan</label>
                                    <input
                                        type="text"
                                        value={data.keterangan}
                                        onChange={(e) => setData('keterangan', e.target.value)}
                                        placeholder="Catatan tambahan"
                                        className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 border border-outline-variant/30 rounded-xl hover:bg-surface-container-low"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Pembayaran'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Payment History Table */}
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm overflow-hidden">
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-bold text-on-surface flex items-center">
                            <MIcon name="summarize" className="text-xl mr-2 text-blue-600" />
                            Riwayat Pembayaran
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-surface-container-low">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Periode</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Tanggal</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-on-tertiary-container uppercase">Pokok</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-on-tertiary-container uppercase">Bunga</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-on-tertiary-container uppercase">Total</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Metode</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Referensi</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-on-tertiary-container uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {pembayarans.length > 0 ? (
                                    pembayarans.map((item) => (
                                        <tr key={item.id} className="hover:bg-surface-container-low">
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    Ke-{item.periode_ke}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-on-surface-variant">{formatDate(item.tanggal_bayar)}</td>
                                            <td className="px-4 py-3 text-sm text-right text-on-surface-variant">{formatRupiah(item.jumlah_pokok)}</td>
                                            <td className="px-4 py-3 text-sm text-right text-on-tertiary-container">{formatRupiah(item.jumlah_bunga)}</td>
                                            <td className="px-4 py-3 text-sm text-right font-medium text-on-surface">{formatRupiah(item.total_bayar)}</td>
                                            <td className="px-4 py-3 text-sm text-on-surface-variant capitalize">{item.metode_pembayaran || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-on-surface-variant">{item.nomor_referensi || '-'}</td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                    title="Hapus"
                                                >
                                                    <MIcon name="delete" className="text-xl" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-4 py-8 text-center text-on-tertiary-container">
                                            <MIcon name="clipboard_remove" className="text-4xl mx-auto mb-2 text-slate-300" />
                                            <p>Belum ada data pembayaran</p>
                                            <p className="text-sm">Klik "Catat Pembayaran" untuk menambah data</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {pembayarans.length > 0 && (
                        <div className="p-4 bg-surface-container-low border-t">
                            <div className="flex justify-between text-sm">
                                <span className="text-on-surface-variant">Total {pembayarans.length} pembayaran</span>
                                <div className="space-x-4">
                                    <span className="text-on-surface-variant">Pokok: <strong>{formatRupiah(summary.totalPokok)}</strong></span>
                                    <span className="text-on-surface-variant">Bunga: <strong>{formatRupiah(summary.totalBunga)}</strong></span>
                                    <span className="text-on-surface font-bold">Total: {formatRupiah(summary.totalBayar)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Loan Info */}
                <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/15">
                    <h3 className="text-sm font-medium text-on-surface-variant mb-3">Informasi Kredit</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-on-tertiary-container">Jumlah Pinjaman</p>
                            <p className="font-medium">{formatRupiah(summary.loanAmount)}</p>
                        </div>
                        <div>
                            <p className="text-on-tertiary-container">Tenor</p>
                            <p className="font-medium">{summary.tenorMonths / 12} Tahun ({summary.tenorMonths} bulan)</p>
                        </div>
                        <div>
                            <p className="text-on-tertiary-container">Bunga</p>
                            <p className="font-medium">{summary.interestRate}% per tahun</p>
                        </div>
                        <div>
                            <p className="text-on-tertiary-container">Cicilan per Bulan</p>
                            <p className="font-medium">{formatRupiah(summary.monthlyPayment)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
