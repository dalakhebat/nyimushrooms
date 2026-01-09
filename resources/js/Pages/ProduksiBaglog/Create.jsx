import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ProduksiBaglogCreate({ nextKode, karyawans, bahanBakus }) {
    const { data, setData, post, processing, errors } = useForm({
        tanggal: new Date().toISOString().split('T')[0],
        jumlah_baglog: '',
        karyawan_id: '',
        catatan: '',
        bahan_bakus: [{ bahan_baku_id: '', jumlah: '' }],
    });

    const addBahanBaku = () => {
        setData('bahan_bakus', [...data.bahan_bakus, { bahan_baku_id: '', jumlah: '' }]);
    };

    const removeBahanBaku = (index) => {
        const newBahanBakus = data.bahan_bakus.filter((_, i) => i !== index);
        setData('bahan_bakus', newBahanBakus);
    };

    const updateBahanBaku = (index, field, value) => {
        const newBahanBakus = [...data.bahan_bakus];
        newBahanBakus[index][field] = value;
        setData('bahan_bakus', newBahanBakus);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/produksi-baglog');
    };

    const getBahanBakuInfo = (id) => {
        return bahanBakus.find(b => b.id == id);
    };

    return (
        <AdminLayout title="Produksi Baru">
            <Head title="Produksi Baglog Baru" />

            <div className="max-w-3xl">
                <div className="mb-6">
                    <Link href="/produksi-baglog" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
                        <ArrowLeftIcon className="w-4 h-4 mr-1" />
                        Kembali
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">Produksi Baglog Baru</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kode Produksi</label>
                                <input
                                    type="text"
                                    value={nextKode}
                                    readOnly
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                                />
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
                                    min="1"
                                    placeholder="Contoh: 100"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                                {errors.jumlah_baglog && <p className="mt-1 text-sm text-red-600">{errors.jumlah_baglog}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Operator</label>
                                <select
                                    value={data.karyawan_id}
                                    onChange={(e) => setData('karyawan_id', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Pilih Karyawan</option>
                                    {karyawans.map((k) => (
                                        <option key={k.id} value={k.id}>{k.nama}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Bahan Baku */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Bahan Baku yang Digunakan <span className="text-red-500">*</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={addBahanBaku}
                                    className="inline-flex items-center px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg"
                                >
                                    <PlusIcon className="w-4 h-4 mr-1" />
                                    Tambah
                                </button>
                            </div>

                            <div className="space-y-3">
                                {data.bahan_bakus.map((item, index) => (
                                    <div key={index} className="flex gap-3 items-start">
                                        <div className="flex-1">
                                            <select
                                                value={item.bahan_baku_id}
                                                onChange={(e) => updateBahanBaku(index, 'bahan_baku_id', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                            >
                                                <option value="">Pilih Bahan Baku</option>
                                                {bahanBakus.map((bb) => (
                                                    <option key={bb.id} value={bb.id}>
                                                        {bb.nama} (Stok: {bb.stok} {bb.satuan})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="w-32">
                                            <div className="flex">
                                                <input
                                                    type="number"
                                                    value={item.jumlah}
                                                    onChange={(e) => updateBahanBaku(index, 'jumlah', e.target.value)}
                                                    min="1"
                                                    placeholder="Jumlah"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500"
                                                />
                                                <span className="px-2 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600 text-sm">
                                                    {getBahanBakuInfo(item.bahan_baku_id)?.satuan || '-'}
                                                </span>
                                            </div>
                                        </div>
                                        {data.bahan_bakus.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeBahanBaku(index)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {errors.bahan_bakus && <p className="mt-1 text-sm text-red-600">{errors.bahan_bakus}</p>}
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
                            <Link href="/produksi-baglog" className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Mulai Produksi'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
