import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function BahanBakuEdit({ bahanBaku, kategoris, satuans }) {
    const { data, setData, put, processing, errors } = useForm({
        nama: bahanBaku.nama || '',
        satuan: bahanBaku.satuan || '',
        kategori: bahanBaku.kategori || '',
        stok_minimum: bahanBaku.stok_minimum || 10,
        harga_terakhir: bahanBaku.harga_terakhir || '',
        keterangan: bahanBaku.keterangan || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/bahan-baku/${bahanBaku.id}`);
    };

    return (
        <AdminLayout title="Edit Bahan Baku">
            <Head title="Edit Bahan Baku" />

            <div className="max-w-2xl">
                <div className="mb-6">
                    <Link
                        href="/bahan-baku"
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-1" />
                        Kembali
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">Edit Bahan Baku: {bahanBaku.kode}</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kode</label>
                            <input
                                type="text"
                                value={bahanBaku.kode}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stok Saat Ini</label>
                            <input
                                type="text"
                                value={`${bahanBaku.stok} ${bahanBaku.satuan}`}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                            />
                            <p className="mt-1 text-xs text-gray-500">Stok diupdate melalui pembelian atau adjustment</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nama Bahan Baku <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                            {errors.nama && <p className="mt-1 text-sm text-red-600">{errors.nama}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kategori <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.kategori}
                                    onChange={(e) => setData('kategori', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="">Pilih Kategori</option>
                                    {kategoris.map((k) => (
                                        <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>
                                    ))}
                                </select>
                                {errors.kategori && <p className="mt-1 text-sm text-red-600">{errors.kategori}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Satuan <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.satuan}
                                    onChange={(e) => setData('satuan', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="">Pilih Satuan</option>
                                    {satuans.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                                {errors.satuan && <p className="mt-1 text-sm text-red-600">{errors.satuan}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Stok Minimum <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.stok_minimum}
                                    onChange={(e) => setData('stok_minimum', e.target.value)}
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                                {errors.stok_minimum && <p className="mt-1 text-sm text-red-600">{errors.stok_minimum}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Harga Terakhir</label>
                                <input
                                    type="number"
                                    value={data.harga_terakhir}
                                    onChange={(e) => setData('harga_terakhir', e.target.value)}
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                                {errors.harga_terakhir && <p className="mt-1 text-sm text-red-600">{errors.harga_terakhir}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                            <textarea
                                value={data.keterangan}
                                onChange={(e) => setData('keterangan', e.target.value)}
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-4">
                            <Link
                                href="/bahan-baku"
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
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
