import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function PanenCreate({ kumbungs, today }) {
    const { data, setData, post, processing, errors } = useForm({
        kumbung_id: '',
        tanggal: today,
        berat_kg: '',
        berat_layak_jual: '',
        berat_reject: '',
        catatan: '',
    });

    // Auto-calculate reject when berat_kg or layak_jual changes
    const handleBeratChange = (value) => {
        setData('berat_kg', value);
        if (value && data.berat_layak_jual) {
            const reject = parseFloat(value) - parseFloat(data.berat_layak_jual);
            setData('berat_reject', reject >= 0 ? reject.toFixed(2) : '0');
        }
    };

    const handleLayakJualChange = (value) => {
        setData('berat_layak_jual', value);
        if (data.berat_kg && value) {
            const reject = parseFloat(data.berat_kg) - parseFloat(value);
            setData('berat_reject', reject >= 0 ? reject.toFixed(2) : '0');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/panen');
    };

    return (
        <AdminLayout title="Input Panen">
            <Head title="Input Panen" />

            <div className="max-w-2xl">
                <div className="mb-6">
                    <Link
                        href="/panen"
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-1" />
                        Kembali
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">
                        Input Data Panen
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kumbung <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.kumbung_id}
                                onChange={(e) => setData('kumbung_id', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">Pilih Kumbung</option>
                                {kumbungs.map((kumbung) => (
                                    <option key={kumbung.id} value={kumbung.id}>
                                        {kumbung.nomor} - {kumbung.nama}
                                    </option>
                                ))}
                            </select>
                            {errors.kumbung_id && (
                                <p className="mt-1 text-sm text-red-600">{errors.kumbung_id}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tanggal <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={data.tanggal}
                                onChange={(e) => setData('tanggal', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                            {errors.tanggal && (
                                <p className="mt-1 text-sm text-red-600">{errors.tanggal}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Berat Total (kg) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.berat_kg}
                                onChange={(e) => handleBeratChange(e.target.value)}
                                placeholder="Contoh: 5.5"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                            {errors.berat_kg && (
                                <p className="mt-1 text-sm text-red-600">{errors.berat_kg}</p>
                            )}
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                            <h3 className="text-sm font-medium text-gray-700">Sortir Hasil Panen</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-green-700 mb-1">
                                        Layak Jual (kg) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.berat_layak_jual}
                                        onChange={(e) => handleLayakJualChange(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50"
                                    />
                                    {errors.berat_layak_jual && (
                                        <p className="mt-1 text-sm text-red-600">{errors.berat_layak_jual}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-red-700 mb-1">
                                        Reject (kg) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.berat_reject}
                                        onChange={(e) => setData('berat_reject', e.target.value)}
                                        placeholder="0.00"
                                        className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50"
                                    />
                                    {errors.berat_reject && (
                                        <p className="mt-1 text-sm text-red-600">{errors.berat_reject}</p>
                                    )}
                                </div>
                            </div>

                            {data.berat_kg && (parseFloat(data.berat_layak_jual || 0) + parseFloat(data.berat_reject || 0)).toFixed(2) !== parseFloat(data.berat_kg).toFixed(2) && (
                                <p className="text-sm text-orange-600">
                                    Total sortir ({(parseFloat(data.berat_layak_jual || 0) + parseFloat(data.berat_reject || 0)).toFixed(2)} kg) harus sama dengan berat total ({parseFloat(data.berat_kg).toFixed(2)} kg)
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Catatan
                            </label>
                            <textarea
                                value={data.catatan}
                                onChange={(e) => setData('catatan', e.target.value)}
                                placeholder="Catatan tambahan (opsional)"
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                            {errors.catatan && (
                                <p className="mt-1 text-sm text-red-600">{errors.catatan}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-4">
                            <Link
                                href="/panen"
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
