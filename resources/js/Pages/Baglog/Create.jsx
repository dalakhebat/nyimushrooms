import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function BaglogCreate({ kumbungs }) {
    const { data, setData, post, processing, errors } = useForm({
        kode_batch: '',
        jumlah: '',
        tanggal_produksi: new Date().toISOString().slice(0, 10),
        kumbung_id: '',
        tanggal_tanam: '',
        status: 'produksi',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/baglog');
    };

    // Generate suggested batch code
    const generateBatchCode = () => {
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        setData('kode_batch', `BL${year}${month}${day}-${random}`);
    };

    return (
        <AdminLayout title="Tambah Baglog">
            <Head title="Tambah Baglog" />

            <div className="mb-6">
                <Link
                    href="/baglog"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeftIcon className="w-4 h-4 mr-1" />
                    Kembali ke Daftar Baglog
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm max-w-2xl">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Tambah Baglog Baru</h2>
                    <p className="text-sm text-gray-600">Catat produksi atau pembelian baglog</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Kode Batch <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={data.kode_batch}
                                onChange={(e) => setData('kode_batch', e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="Contoh: BL241228-001"
                            />
                            <button
                                type="button"
                                onClick={generateBatchCode}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                Generate
                            </button>
                        </div>
                        {errors.kode_batch && <p className="mt-1 text-sm text-red-600">{errors.kode_batch}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Jumlah Baglog <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={data.jumlah}
                                onChange={(e) => setData('jumlah', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="0"
                                min="1"
                            />
                            {errors.jumlah && <p className="mt-1 text-sm text-red-600">{errors.jumlah}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tanggal Produksi <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={data.tanggal_produksi}
                                onChange={(e) => setData('tanggal_produksi', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                            {errors.tanggal_produksi && <p className="mt-1 text-sm text-red-600">{errors.tanggal_produksi}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                            <option value="produksi">Produksi</option>
                            <option value="inkubasi">Inkubasi</option>
                            <option value="pembibitan">Pembibitan</option>
                            <option value="masuk_kumbung">Masuk Kumbung</option>
                            <option value="dijual">Dijual</option>
                            <option value="selesai">Selesai</option>
                        </select>
                        {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                    </div>

                    {(data.status === 'masuk_kumbung' || data.status === 'dijual' || data.status === 'selesai') && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kumbung
                                </label>
                                <select
                                    value={data.kumbung_id}
                                    onChange={(e) => setData('kumbung_id', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Pilih Kumbung</option>
                                    {kumbungs.map((k) => (
                                        <option key={k.id} value={k.id}>{k.nama}</option>
                                    ))}
                                </select>
                                {errors.kumbung_id && <p className="mt-1 text-sm text-red-600">{errors.kumbung_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tanggal Masuk Kumbung
                                </label>
                                <input
                                    type="date"
                                    value={data.tanggal_tanam}
                                    onChange={(e) => setData('tanggal_tanam', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                                <p className="mt-1 text-xs text-gray-500">Estimasi selesai akan dihitung otomatis (5 bulan)</p>
                                {errors.tanggal_tanam && <p className="mt-1 text-sm text-red-600">{errors.tanggal_tanam}</p>}
                            </div>
                        </>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                        <Link
                            href="/baglog"
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
