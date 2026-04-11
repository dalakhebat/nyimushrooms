import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';
import FormAlert from '@/Components/FormAlert';

export default function BahanBakuCreate({ nextKode, kategoris, satuans }) {
    const { data, setData, post, processing, errors } = useForm({
        nama: '',
        satuan: '',
        kategori: '',
        stok_minimum: 10,
        harga_terakhir: '',
        keterangan: '',
    });

    const hasError = (field) => !!errors[field];

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/bahan-baku');
    };

    return (
        <AdminLayout title="Tambah Bahan Baku">
            <Head title="Tambah Bahan Baku" />

            <div className="max-w-2xl">
                <div className="mb-6">
                    <Link
                        href="/bahan-baku"
                        className="inline-flex items-center text-sm text-on-surface-variant hover:text-on-surface"
                    >
                        <MIcon name="arrow_back" className="text-base mr-1" />
                        Kembali
                    </Link>
                </div>

                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-6">
                    <h2 className="text-lg font-bold text-on-surface mb-6">Tambah Bahan Baku Baru</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                    <FormAlert errors={errors} />

                        <div>
                            <label className="block text-sm font-medium text-on-surface-variant mb-1">Kode</label>
                            <input
                                type="text"
                                value={nextKode}
                                readOnly
                                className="w-full px-4 py-2 border border-outline-variant/15 rounded-xl bg-surface-container-low text-on-surface-variant cursor-not-allowed"
                            />
                            <p className="mt-1 text-xs text-on-tertiary-container">Kode digenerate otomatis</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                Nama Bahan Baku <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                placeholder="Contoh: Serbuk Kayu"
                                className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-green-500"
                            />
                            {errors.nama && <p className="mt-1 text-sm text-red-600">{errors.nama}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                    Kategori <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.kategori}
                                    onChange={(e) => setData('kategori', e.target.value)}
                                    className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-green-500"
                                >
                                    <option value="">Pilih Kategori</option>
                                    {kategoris.map((k) => (
                                        <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>
                                    ))}
                                </select>
                                {errors.kategori && <p className="mt-1 text-sm text-red-600">{errors.kategori}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                    Satuan <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.satuan}
                                    onChange={(e) => setData('satuan', e.target.value)}
                                    className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-green-500"
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
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                    Stok Minimum <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.stok_minimum}
                                    onChange={(e) => setData('stok_minimum', e.target.value)}
                                    min="0"
                                    className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-green-500"
                                />
                                <p className="mt-1 text-xs text-on-tertiary-container">Alert jika stok di bawah nilai ini</p>
                                {errors.stok_minimum && <p className="mt-1 text-sm text-red-600">{errors.stok_minimum}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">Harga Terakhir</label>
                                <input
                                    type="number"
                                    value={data.harga_terakhir}
                                    onChange={(e) => setData('harga_terakhir', e.target.value)}
                                    min="0"
                                    placeholder="0"
                                    className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-green-500"
                                />
                                {errors.harga_terakhir && <p className="mt-1 text-sm text-red-600">{errors.harga_terakhir}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-on-surface-variant mb-1">Keterangan</label>
                            <textarea
                                value={data.keterangan}
                                onChange={(e) => setData('keterangan', e.target.value)}
                                rows="3"
                                placeholder="Keterangan tambahan..."
                                className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-green-500"
                            />
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-4">
                            <Link
                                href="/bahan-baku"
                                className="px-4 py-2 text-sm font-medium text-on-surface-variant bg-surface-container-low rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary transition-colors disabled:opacity-50"
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
