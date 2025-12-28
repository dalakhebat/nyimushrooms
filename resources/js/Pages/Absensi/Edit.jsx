import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function AbsensiEdit({ absensi }) {
    const { data, setData, put, processing, errors } = useForm({
        status: absensi.status || 'hadir',
        catatan: absensi.catatan || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put('/absensi/' + absensi.id);
    };

    const formatTanggal = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const statusOptions = [
        { value: 'hadir', label: 'Hadir', class: 'bg-green-500' },
        { value: 'izin', label: 'Izin', class: 'bg-blue-500' },
        { value: 'sakit', label: 'Sakit', class: 'bg-yellow-500' },
        { value: 'alpha', label: 'Alpha', class: 'bg-red-500' },
    ];

    return (
        <AdminLayout title="Edit Absensi">
            <Head title="Edit Absensi" />

            <div className="max-w-2xl">
                <div className="mb-6">
                    <Link
                        href={'/absensi?tanggal=' + absensi.tanggal}
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-1" />
                        Kembali
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">
                        Edit Absensi
                    </h2>

                    {/* Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Karyawan</p>
                                <p className="font-medium text-gray-900">{absensi.karyawan_nama}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Tanggal</p>
                                <p className="font-medium text-gray-900">{formatTanggal(absensi.tanggal)}</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Status Kehadiran <span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {statusOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setData('status', opt.value)}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                            data.status === opt.value
                                                ? opt.class + ' text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                            {errors.status && (
                                <p className="mt-1 text-sm text-red-600">{errors.status}</p>
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
                                href={'/absensi?tanggal=' + absensi.tanggal}
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
