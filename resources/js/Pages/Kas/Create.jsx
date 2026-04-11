import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';
import FormAlert from '@/Components/FormAlert';

export default function KasCreate({ kategoris }) {
    const { data, setData, post, processing, errors } = useForm({
        tanggal: new Date().toISOString().split('T')[0],
        tipe: 'masuk',
        kategori: '',
        jumlah: '',
        keterangan: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/kas');
    };

    return (
        <AdminLayout title="Tambah Transaksi Kas">
            <Head title="Tambah Transaksi Kas" />

            <div className="max-w-2xl">
                <div className="mb-6">
                    <Link href="/kas" className="inline-flex items-center text-sm text-on-surface-variant hover:text-on-surface">
                        <MIcon name="arrow_back" className="text-base mr-1" />
                        Kembali
                    </Link>
                </div>

                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-6">
                    <h2 className="text-lg font-bold text-on-surface mb-6">Tambah Transaksi Kas</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                    <FormAlert errors={errors} />

                        <div>
                            <label className="block text-sm font-medium text-on-surface-variant mb-1">Tanggal</label>
                            <input
                                type="date"
                                value={data.tanggal}
                                onChange={(e) => setData('tanggal', e.target.value)}
                                className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                            />
                            {errors.tanggal && <p className="mt-1 text-sm text-red-600">{errors.tanggal}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-on-surface-variant mb-2">Tipe Transaksi</label>
                            <div className="flex rounded-xl border border-outline-variant/15 p-1">
                                <button
                                    type="button"
                                    onClick={() => setData('tipe', 'masuk')}
                                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        data.tipe === 'masuk' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-low'
                                    }`}
                                >
                                    Kas Masuk
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('tipe', 'keluar')}
                                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        data.tipe === 'keluar' ? 'bg-red-600 text-white' : 'text-on-surface-variant hover:bg-surface-container-low'
                                    }`}
                                >
                                    Kas Keluar
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-on-surface-variant mb-1">Kategori</label>
                            <select
                                value={data.kategori}
                                onChange={(e) => setData('kategori', e.target.value)}
                                className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                            >
                                <option value="">Pilih Kategori</option>
                                {kategoris.map((k) => (
                                    <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>
                                ))}
                            </select>
                            {errors.kategori && <p className="mt-1 text-sm text-red-600">{errors.kategori}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-on-surface-variant mb-1">Jumlah (Rp)</label>
                            <input
                                type="number"
                                value={data.jumlah}
                                onChange={(e) => setData('jumlah', e.target.value)}
                                min="1"
                                placeholder="0"
                                className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                            />
                            {errors.jumlah && <p className="mt-1 text-sm text-red-600">{errors.jumlah}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-on-surface-variant mb-1">Keterangan</label>
                            <textarea
                                value={data.keterangan}
                                onChange={(e) => setData('keterangan', e.target.value)}
                                rows="3"
                                placeholder="Deskripsi transaksi..."
                                className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                            />
                            {errors.keterangan && <p className="mt-1 text-sm text-red-600">{errors.keterangan}</p>}
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-4">
                            <Link href="/kas" className="px-4 py-2 text-sm font-medium text-on-surface-variant bg-surface-container-low rounded-xl hover:bg-gray-200">
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`px-4 py-2 text-sm font-medium text-white rounded-xl disabled:opacity-50 ${
                                    data.tipe === 'masuk' ? 'bg-primary hover:bg-primary' : 'bg-red-600 hover:bg-red-700'
                                }`}
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
