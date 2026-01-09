import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Icon } from '@iconify/react';

export default function PembelianBahanBakuCreate({ suppliers, bahanBakus }) {
    const { data, setData, post, processing, errors } = useForm({
        supplier_id: '',
        bahan_baku_id: '',
        tanggal: new Date().toISOString().split('T')[0],
        jumlah: '',
        harga_satuan: '',
        status: 'pending',
        catatan: '',
    });

    const selectedBahanBaku = bahanBakus.find(b => b.id == data.bahan_baku_id);
    const totalHarga = (data.jumlah || 0) * (data.harga_satuan || 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/pembelian-bahan-baku');
    };

    const formatRupiah = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };

    return (
        <AdminLayout title="Tambah Pembelian">
            <Head title="Tambah Pembelian Bahan Baku" />

            <div className="max-w-2xl">
                <div className="mb-6">
                    <Link href="/pembelian-bahan-baku" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
                        <Icon icon="solar:arrow-left-bold" className="w-4 h-4 mr-1" />
                        Kembali
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">Tambah Pembelian Bahan Baku</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bahan Baku <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.bahan_baku_id}
                                onChange={(e) => {
                                    setData('bahan_baku_id', e.target.value);
                                    const bb = bahanBakus.find(b => b.id == e.target.value);
                                    if (bb) setData('harga_satuan', bb.harga_terakhir || '');
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">Pilih Bahan Baku</option>
                                {bahanBakus.map((bb) => (
                                    <option key={bb.id} value={bb.id}>
                                        {bb.nama} ({bb.satuan}) - Stok: {bb.stok}
                                    </option>
                                ))}
                            </select>
                            {errors.bahan_baku_id && <p className="mt-1 text-sm text-red-600">{errors.bahan_baku_id}</p>}
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
                                    Jumlah <span className="text-red-500">*</span>
                                </label>
                                <div className="flex">
                                    <input
                                        type="number"
                                        value={data.jumlah}
                                        onChange={(e) => setData('jumlah', e.target.value)}
                                        min="1"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500"
                                    />
                                    <span className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600">
                                        {selectedBahanBaku?.satuan || '-'}
                                    </span>
                                </div>
                                {errors.jumlah && <p className="mt-1 text-sm text-red-600">{errors.jumlah}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Harga Satuan <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.harga_satuan}
                                    onChange={(e) => setData('harga_satuan', e.target.value)}
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                                {errors.harga_satuan && <p className="mt-1 text-sm text-red-600">{errors.harga_satuan}</p>}
                            </div>
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
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
