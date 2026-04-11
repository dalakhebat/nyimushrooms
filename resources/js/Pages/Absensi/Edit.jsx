import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';
import FormAlert from '@/Components/FormAlert';
import EmptyOption from '@/Components/EmptyOption';

export default function AbsensiEdit({ absensi }) {
    const { data, setData, put, processing, errors } = useForm({
        status: absensi.status || 'hadir',
        catatan: absensi.catatan || '',
    });

    const hasError = (field) => !!errors[field];

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
        { value: 'hadir', label: 'Hadir', class: 'bg-secondary' },
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
                        className="inline-flex items-center text-sm text-on-surface-variant hover:text-on-surface"
                    >
                        <MIcon name="arrow_back" className="text-base mr-1" />
                        Kembali
                    </Link>
                </div>

                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-6">
                    <h2 className="text-lg font-bold text-on-surface mb-6">
                        Edit Absensi
                    </h2>

                    {/* Info */}
                    <div className="bg-surface-container-low rounded-xl p-4 mb-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-on-tertiary-container">Karyawan</p>
                                <p className="font-medium text-on-surface">{absensi.karyawan_nama}</p>
                            </div>
                            <div>
                                <p className="text-sm text-on-tertiary-container">Tanggal</p>
                                <p className="font-medium text-on-surface">{formatTanggal(absensi.tanggal)}</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                    <FormAlert errors={errors} />

                        <div>
                            <label className="block text-sm font-medium text-on-surface-variant mb-3">
                                Status Kehadiran <span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {statusOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setData('status', opt.value)}
                                        className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                                            data.status === opt.value
                                                ? opt.class + ' text-white'
                                                : 'bg-surface-container-low text-on-surface-variant hover:bg-gray-200'
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
                            <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                Catatan
                            </label>
                            <textarea
                                value={data.catatan}
                                onChange={(e) => setData('catatan', e.target.value)}
                                placeholder="Catatan tambahan (opsional)"
                                rows="3"
                                className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-green-500"
                            />
                            {errors.catatan && (
                                <p className="mt-1 text-sm text-red-600">{errors.catatan}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-4">
                            <Link
                                href={'/absensi?tanggal=' + absensi.tanggal}
                                className="px-4 py-2 text-sm font-medium text-on-surface-variant bg-surface-container-low rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary transition-colors disabled:opacity-50"
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
