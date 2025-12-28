import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function KumbungCreate({ nextNomor }) {
    const { data, setData, post, processing, errors } = useForm({
        nama: '',
        kapasitas_baglog: '',
        status: 'aktif',
        tanggal_mulai: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/kumbung');
    };

    return (
        <AdminLayout title="Tambah Kumbung">
            <Head title="Tambah Kumbung" />

            <div className="max-w-2xl">
                <div className="mb-6">
                    <Link
                        href="/kumbung"
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-1" />
                        Kembali
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">
                        Tambah Kumbung Baru
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nomor Kumbung
                            </label>
                            <input
                                type="text"
                                value={nextNomor}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Nomor digenerate otomatis
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nama Kumbung <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                placeholder="Contoh: Kumbung Utama"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                            {errors.nama && (
                                <p className="mt-1 text-sm text-red-600">{errors.nama}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kapasitas Baglog <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={data.kapasitas_baglog}
                                onChange={(e) => setData('kapasitas_baglog', e.target.value)}
                                placeholder="Jumlah baglog maksimal"
                                min="0"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                            {errors.kapasitas_baglog && (
                                <p className="mt-1 text-sm text-red-600">{errors.kapasitas_baglog}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="aktif">Aktif</option>
                                <option value="nonaktif">Nonaktif</option>
                            </select>
                            {errors.status && (
                                <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tanggal Mulai
                            </label>
                            <input
                                type="date"
                                value={data.tanggal_mulai}
                                onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Tanggal mulai digunakan untuk tracking umur kumbung
                            </p>
                            {errors.tanggal_mulai && (
                                <p className="mt-1 text-sm text-red-600">{errors.tanggal_mulai}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-4">
                            <Link
                                href="/kumbung"
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
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
