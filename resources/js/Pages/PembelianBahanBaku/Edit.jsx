import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Icon } from '@iconify/react';

export default function PembelianBahanBakuEdit({ pembelian, suppliers, bahanBakus }) {
    const { data, setData, put, processing, errors } = useForm({
        supplier_id: pembelian.supplier_id || '',
        tanggal: pembelian.tanggal?.split('T')[0] || '',
        harga_satuan: pembelian.harga_satuan || '',
        status: pembelian.status || 'pending',
        catatan: pembelian.catatan || '',
    });

    const totalHarga = pembelian.jumlah * (data.harga_satuan || 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/pembelian-bahan-baku/${pembelian.id}`);
    };

    const formatRupiah = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };

    return (
        <AdminLayout title="Edit Pembelian">
            <Head title="Edit Pembelian Bahan Baku" />

            <div className="max-w-2xl">
                <div className="mb-6">
                    <Link href="/pembelian-bahan-baku" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
                        <Icon icon="solar:arrow-left-bold" className="w-4 h-4 mr-1" />
                        Kembali
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">Edit Pembelian: {pembelian.kode_transaksi}</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bahan Baku</label>
                            <input
                                type="text"
                                value={`${pembelian.bahan_baku?.nama} (${pembelian.bahan_baku?.satuan})`}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                            />
                            <p className="mt-1 text-xs text-gray-500">Bahan baku tidak dapat diubah</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                            <input
                                type="text"
                                value={`${pembelian.jumlah} ${pembelian.bahan_baku?.satuan}`}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                            />
                            <p className="mt-1 text-xs text-gray-500">Jumlah tidak dapat diubah karena sudah mempengaruhi stok</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                            <select
                                value={data.supplier_id}
                                onChange={(e) => setData('supplier_id', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">Pilih Supplier (Opsional)</option>
                                {suppliers.map((s) => (
                                    <option key={s.id} value={s.id}>{s.nama}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                            <input
                                type="date"
                                value={data.tanggal}
                                onChange={(e) => setData('tanggal', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                            {errors.tanggal && <p className="mt-1 text-sm text-red-600">{errors.tanggal}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Harga Satuan</label>
                            <input
                                type="number"
                                value={data.harga_satuan}
                                onChange={(e) => setData('harga_satuan', e.target.value)}
                                min="0"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                            {errors.harga_satuan && <p className="mt-1 text-sm text-red-600">{errors.harga_satuan}</p>}
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Total Harga:</span>
                                <span className="text-xl font-bold text-gray-800">{formatRupiah(totalHarga)}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status Pembayaran</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            >
                                <option value="pending">Pending</option>
                                <option value="lunas">Lunas</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                            <textarea
                                value={data.catatan}
                                onChange={(e) => setData('catatan', e.target.value)}
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-4">
                            <Link href="/pembelian-bahan-baku" className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Update'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
