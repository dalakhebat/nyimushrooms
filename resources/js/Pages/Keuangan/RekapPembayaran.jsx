import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { Icon } from '@iconify/react';

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
                            className="px-4 py-2 bg-white text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors flex items-center"
                        >
                            <Icon icon="solar:add-circle-bold" className="w-5 h-5 mr-2" />
                            Catat Pembayaran
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Sudah Dibayar</p>
                                <p className="text-xl font-bold text-green-600">{formatRupiah(summary.totalBayar)}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Icon icon="solar:check-circle-bold" className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Sisa Pokok</p>
                                <p className="text-xl font-bold text-red-600">{formatRupiah(summary.sisaPokok)}</p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-lg">
                                <Icon icon="solar:wallet-bold" className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Periode Terbayar</p>
                                <p className="text-xl font-bold text-blue-600">{summary.periodeTerakhir} / {summary.tenorMonths}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Icon icon="solar:calendar-bold" className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Sisa Periode</p>
                                <p className="text-xl font-bold text-purple-600">{summary.sisaPeriode} bulan</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Icon icon="solar:hourglass-bold" className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Progress Pembayaran</h2>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Periode Terbayar</span>
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
                                <span className="text-gray-600">Pokok Terbayar</span>
                                <span className="font-medium">{paidPercent.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-green-600 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(paidPercent, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Payment Form */}
                {showForm && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <Icon icon="solar:add-circle-bold" className="w-5 h-5 mr-2 text-emerald-600" />
                            Catat Pembayaran Baru
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Bayar *</label>
                                    <input
                                        type="date"
                                        value={data.tanggal_bayar}
                                        onChange={(e) => setData('tanggal_bayar', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    />
                                    {errors.tanggal_bayar && <p className="text-red-500 text-xs mt-1">{errors.tanggal_bayar}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Periode Ke *</label>
                                    <input
                                        type="number"
                                        value={data.periode_ke}
                                        onChange={(e) => setData('periode_ke', parseInt(e.target.value) || 0)}
                                        min="1"
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    />
                                    {errors.periode_ke && <p className="text-red-500 text-xs mt-1">{errors.periode_ke}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran</label>
                                    <select
                                        value={data.metode_pembayaran}
                                        onChange={(e) => setData('metode_pembayaran', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="transfer">Transfer Bank</option>
                                        <option value="tunai">Tunai</option>
                                        <option value="autodebet">Auto Debet</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Pokok *</label>
                                    <input
                                        type="number"
                                        value={data.jumlah_pokok}
                                        onChange={(e) => setData('jumlah_pokok', parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    />
                                    {errors.jumlah_pokok && <p className="text-red-500 text-xs mt-1">{errors.jumlah_pokok}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Bunga *</label>
                                    <input
                                        type="number"
                                        value={data.jumlah_bunga}
                                        onChange={(e) => setData('jumlah_bunga', parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    />
                                    {errors.jumlah_bunga && <p className="text-red-500 text-xs mt-1">{errors.jumlah_bunga}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Bayar</label>
                                    <input
                                        type="text"
                                        value={formatRupiah(data.jumlah_pokok + data.jumlah_bunga)}
                                        readOnly
                                        className="w-full px-3 py-2 bg-gray-100 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">No. Referensi</label>
                                    <input
                                        type="text"
                                        value={data.nomor_referensi}
                                        onChange={(e) => setData('nomor_referensi', e.target.value)}
                                        placeholder="Nomor bukti transfer"
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                                    <input
                                        type="text"
                                        value={data.keterangan}
                                        onChange={(e) => setData('keterangan', e.target.value)}
                                        placeholder="Catatan tambahan"
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Pembayaran'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Payment History Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                            <Icon icon="solar:clipboard-list-bold" className="w-5 h-5 mr-2 text-blue-600" />
                            Riwayat Pembayaran
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Periode</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Pokok</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Bunga</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metode</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referensi</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {pembayarans.length > 0 ? (
                                    pembayarans.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    Ke-{item.periode_ke}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{formatDate(item.tanggal_bayar)}</td>
                                            <td className="px-4 py-3 text-sm text-right text-gray-700">{formatRupiah(item.jumlah_pokok)}</td>
                                            <td className="px-4 py-3 text-sm text-right text-gray-500">{formatRupiah(item.jumlah_bunga)}</td>
                                            <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">{formatRupiah(item.total_bayar)}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 capitalize">{item.metode_pembayaran || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{item.nomor_referensi || '-'}</td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                    title="Hapus"
                                                >
                                                    <Icon icon="solar:trash-bin-trash-bold" className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                                            <Icon icon="solar:clipboard-remove-bold" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                            <p>Belum ada data pembayaran</p>
                                            <p className="text-sm">Klik "Catat Pembayaran" untuk menambah data</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {pembayarans.length > 0 && (
                        <div className="p-4 bg-gray-50 border-t">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Total {pembayarans.length} pembayaran</span>
                                <div className="space-x-4">
                                    <span className="text-gray-600">Pokok: <strong>{formatRupiah(summary.totalPokok)}</strong></span>
                                    <span className="text-gray-600">Bunga: <strong>{formatRupiah(summary.totalBunga)}</strong></span>
                                    <span className="text-gray-800 font-semibold">Total: {formatRupiah(summary.totalBayar)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Loan Info */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-600 mb-3">Informasi Kredit</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Jumlah Pinjaman</p>
                            <p className="font-medium">{formatRupiah(summary.loanAmount)}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Tenor</p>
                            <p className="font-medium">{summary.tenorMonths / 12} Tahun ({summary.tenorMonths} bulan)</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Bunga</p>
                            <p className="font-medium">{summary.interestRate}% per tahun</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Cicilan per Bulan</p>
                            <p className="font-medium">{formatRupiah(summary.monthlyPayment)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
