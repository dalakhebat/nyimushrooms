import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function EditBaglog({ penjualan, customers, stockBaglog }) {
    const { data, setData, put, processing, errors } = useForm({
        customer_id: penjualan.customer_id || '',
        tanggal: penjualan.tanggal || '',
        jumlah_baglog: penjualan.jumlah_baglog || '',
        harga_satuan: penjualan.harga_satuan || '',
        status: penjualan.status || 'pending',
        catatan: penjualan.catatan || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put('/penjualan/baglog/' + penjualan.id);
    };

    const formatCurrency = (num) => {
        if (!num) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
    };

    const totalHarga = (data.jumlah_baglog || 0) * (data.harga_satuan || 0);
    const exceedsStock = parseInt(data.jumlah_baglog || 0) > stockBaglog;

    return (
        <AdminLayout title="Edit Penjualan Baglog">
            <Head title="Edit Penjualan Baglog" />

            <div className="mb-6">
                <Link
                    href="/penjualan?tipe=baglog"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeftIcon className="w-4 h-4 mr-1" />
                    Kembali ke Daftar Penjualan
                </Link>
            </div>

            {/* Stock Info */}
            <div className={`mb-4 p-4 rounded-lg ${stockBaglog > 0 ? 'bg-blue-50 border border-blue-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-700">Stock Baglog Tersedia (Pembibitan)</p>
                        <p className={`text-2xl font-bold ${stockBaglog > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            {stockBaglog.toLocaleString('id-ID')} baglog
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Termasuk {penjualan.jumlah_baglog} baglog dari record ini
                        </p>
                    </div>
                    {stockBaglog === 0 && (
                        <div className="flex items-center text-red-600">
                            <ExclamationTriangleIcon className="w-6 h-6 mr-2" />
                            <span className="text-sm font-medium">Stock Habis!</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm max-w-2xl">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Edit Penjualan Baglog</h2>
                    <p className="text-sm text-gray-600">Perbarui data penjualan baglog</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Customer
                        </label>
                        <select
                            value={data.customer_id}
                            onChange={(e) => setData('customer_id', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Umum (tanpa customer)</option>
                            {customers.map((c) => (
                                <option key={c.id} value={c.id}>{c.nama}</option>
                            ))}
                        </select>
                        {errors.customer_id && <p className="mt-1 text-sm text-red-600">{errors.customer_id}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tanggal <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={data.tanggal}
                            onChange={(e) => setData('tanggal', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                        {errors.tanggal && <p className="mt-1 text-sm text-red-600">{errors.tanggal}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Jumlah Baglog <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={data.jumlah_baglog}
                                onChange={(e) => setData('jumlah_baglog', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${exceedsStock ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-gray-300 focus:ring-green-500'}`}
                                placeholder="0"
                                min="1"
                                max={stockBaglog}
                            />
                            {errors.jumlah_baglog && <p className="mt-1 text-sm text-red-600">{errors.jumlah_baglog}</p>}
                            {exceedsStock && !errors.jumlah_baglog && (
                                <p className="mt-1 text-sm text-red-600">
                                    Melebihi stock! Maksimal: {stockBaglog.toLocaleString('id-ID')} baglog
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Harga Satuan <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={data.harga_satuan}
                                onChange={(e) => setData('harga_satuan', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="0"
                                min="0"
                            />
                            {errors.harga_satuan && <p className="mt-1 text-sm text-red-600">{errors.harga_satuan}</p>}
                        </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Total Harga:</span>
                            <span className="text-xl font-bold text-green-600">{formatCurrency(totalHarga)}</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status Pembayaran <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                            <option value="pending">Pending (Belum Bayar)</option>
                            <option value="lunas">Lunas</option>
                        </select>
                        {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Catatan
                        </label>
                        <textarea
                            value={data.catatan}
                            onChange={(e) => setData('catatan', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            rows="3"
                            placeholder="Catatan tambahan..."
                        />
                        {errors.catatan && <p className="mt-1 text-sm text-red-600">{errors.catatan}</p>}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                        <Link
                            href="/penjualan?tipe=baglog"
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing || exceedsStock}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Menyimpan...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
