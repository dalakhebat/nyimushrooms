import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';
import FormAlert from '@/Components/FormAlert';

export default function PenggajianEdit({ penggajian }) {
    const { data, setData, put, processing, errors } = useForm({
        bonus: penggajian.bonus || 0,
        potongan_kasbon: penggajian.potongan_kasbon || 0,
        catatan: penggajian.catatan || '',
    });

    const hasError = (field) => !!errors[field];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const calculateTotal = () => {
        return penggajian.gaji_pokok + Number(data.bonus) - penggajian.potongan - Number(data.potongan_kasbon);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put('/penggajian/' + penggajian.id);
    };

    return (
        <AdminLayout title="Edit Penggajian">
            <Head title="Edit Penggajian" />

            <div className="max-w-2xl">
                <div className="mb-6">
                    <Link
                        href={'/penggajian/' + penggajian.id}
                        className="inline-flex items-center text-sm text-on-surface-variant hover:text-on-surface"
                    >
                        <MIcon name="arrow_back" className="text-base mr-1" />
                        Kembali ke Detail
                    </Link>
                </div>

                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-6">
                    <h2 className="text-lg font-bold text-on-surface mb-6">
                        Edit Penggajian - {penggajian.karyawan.nama}
                    </h2>

                    <div className="mb-6 p-4 bg-surface-container-low rounded-xl">
                        <p className="text-sm text-on-surface-variant mb-2">Periode: <span className="font-medium">{penggajian.periode_formatted}</span></p>
                        <p className="text-sm text-on-surface-variant mb-2">Jumlah Hadir: <span className="font-medium">{penggajian.jumlah_hadir} hari</span></p>
                        <p className="text-sm text-on-surface-variant mb-2">Gaji Pokok: <span className="font-medium">{formatCurrency(penggajian.gaji_pokok)}</span></p>
                        <p className="text-sm text-on-surface-variant">Potongan Absensi: <span className="font-medium text-red-600">-{formatCurrency(penggajian.potongan)}</span></p>
                    </div>

                    {/* Kasbon Info */}
                    {penggajian.sisa_kasbon > 0 && (
                        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                            <div className="flex items-start">
                                <MIcon name="warning" className="text-xl text-orange-500 mt-0.5 mr-2" />
                                <div>
                                    <p className="text-sm font-medium text-orange-800">Karyawan ini memiliki kasbon aktif</p>
                                    <p className="text-sm text-orange-700 mt-1">
                                        Sisa Kasbon: <span className="font-bold">{formatCurrency(penggajian.sisa_kasbon)}</span>
                                    </p>
                                    <p className="text-xs text-orange-600 mt-1">
                                        Anda dapat memotong sebagian atau seluruh kasbon dari gaji ini.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                    <FormAlert errors={errors} />

                        <div>
                            <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                Bonus
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-on-tertiary-container">
                                    Rp
                                </span>
                                <input
                                    type="number"
                                    value={data.bonus}
                                    onChange={(e) => setData('bonus', e.target.value)}
                                    placeholder="0"
                                    min="0"
                                    className="w-full pl-12 pr-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-green-500"
                                />
                            </div>
                            {errors.bonus && (
                                <p className="mt-1 text-sm text-red-600">{errors.bonus}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                Potongan Kasbon
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-on-tertiary-container">
                                    Rp
                                </span>
                                <input
                                    type="number"
                                    value={data.potongan_kasbon}
                                    onChange={(e) => setData('potongan_kasbon', e.target.value)}
                                    placeholder="0"
                                    min="0"
                                    max={penggajian.sisa_kasbon}
                                    className="w-full pl-12 pr-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-green-500"
                                />
                            </div>
                            {penggajian.sisa_kasbon > 0 && (
                                <p className="mt-1 text-xs text-on-tertiary-container">
                                    Maksimal: {formatCurrency(penggajian.sisa_kasbon)}
                                </p>
                            )}
                            {errors.potongan_kasbon && (
                                <p className="mt-1 text-sm text-red-600">{errors.potongan_kasbon}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                Catatan
                            </label>
                            <textarea
                                value={data.catatan}
                                onChange={(e) => setData('catatan', e.target.value)}
                                placeholder="Catatan tambahan..."
                                rows="2"
                                className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-green-500"
                            />
                            {errors.catatan && (
                                <p className="mt-1 text-sm text-red-600">{errors.catatan}</p>
                            )}
                        </div>

                        {/* Total Preview */}
                        <div className="p-4 bg-emerald-50 rounded-xl border border-green-200">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-on-surface-variant">Total Diterima:</span>
                                <span className="text-xl font-bold text-secondary">
                                    {formatCurrency(Math.max(0, calculateTotal()))}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-4">
                            <Link
                                href={'/penggajian/' + penggajian.id}
                                className="px-4 py-2 text-sm font-medium text-on-surface-variant bg-surface-container-low rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
