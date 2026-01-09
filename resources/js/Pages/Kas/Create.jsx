import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Icon } from '@iconify/react';

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
                    <Link href="/kas" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
                        <Icon icon="solar:arrow-left-bold" className="w-4 h-4 mr-1" />
                        Kembali
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">Tambah Transaksi Kas</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Transaksi</label>
                            <div className="flex rounded-lg border border-gray-200 p-1">
                                <button
                                    type="button"
                                    onClick={() => setData('tipe', 'masuk')}
                                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        data.tipe === 'masuk' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    Kas Masuk
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('tipe', 'keluar')}
                                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        data.tipe === 'keluar' ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    Kas Keluar
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                            <select
                                value={data.kategori}
                                onChange={(e) => setData('kategori', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">Pilih Kategori</option>
                                {kategoris.map((k) => (
                                    <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>
                                ))}
                            </select>
                            {errors.kategori && <p className="mt-1 text-sm text-red-600">{errors.kategori}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah (Rp)</label>
                            <input
                                type="number"
                                value={data.jumlah}
                                onChange={(e) => setData('jumlah', e.target.value)}
                                min="1"
                                placeholder="0"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                            {errors.jumlah && <p className="mt-1 text-sm text-red-600">{errors.jumlah}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                            <textarea
                                value={data.keterangan}
                                onChange={(e) => setData('keterangan', e.target.value)}
                                rows="3"
                                placeholder="Deskripsi transaksi..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                            {errors.keterangan && <p className="mt-1 text-sm text-red-600">{errors.keterangan}</p>}
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-4">
                            <Link href="/kas" className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 ${
                                    data.tipe === 'masuk' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
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
