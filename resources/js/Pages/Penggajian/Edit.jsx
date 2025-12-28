import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function PenggajianEdit({ penggajian }) {
    const { data, setData, put, processing, errors } = useForm({
        bonus: penggajian.bonus || 0,
        potongan_kasbon: penggajian.potongan_kasbon || 0,
        catatan: penggajian.catatan || '',
    });

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
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-1" />
                        Kembali ke Detail
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">
                        Edit Penggajian - {penggajian.karyawan.nama}
                    </h2>

                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">Periode: <span className="font-medium">{penggajian.periode_formatted}</span></p>
                        <p className="text-sm text-gray-600 mb-2">Jumlah Hadir: <span className="font-medium">{penggajian.jumlah_hadir} hari</span></p>
                        <p className="text-sm text-gray-600 mb-2">Gaji Pokok: <span className="font-medium">{formatCurrency(penggajian.gaji_pokok)}</span></p>
                        <p className="text-sm text-gray-600">Potongan Absensi: <span className="font-medium text-red-600">-{formatCurrency(penggajian.potongan)}</span></p>
                    </div>

                    {/* Kasbon Info */}
                    {penggajian.sisa_kasbon > 0 && (
                        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-start">
                                <ExclamationTriangleIcon className="w-5 h-5 text-orange-500 mt-0.5 mr-2" />
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bonus
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    Rp
                                </span>
                                <input
                                    type="number"
                                    value={data.bonus}
                                    onChange={(e) => setData('bonus', e.target.value)}
                                    placeholder="0"
                                    min="0"
                                    className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            {errors.bonus && (
                                <p className="mt-1 text-sm text-red-600">{errors.bonus}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Potongan Kasbon
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    Rp
                                </span>
                                <input
                                    type="number"
                                    value={data.potongan_kasbon}
                                    onChange={(e) => setData('potongan_kasbon', e.target.value)}
                                    placeholder="0"
                                    min="0"
                                    max={penggajian.sisa_kasbon}
                                    className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            {penggajian.sisa_kasbon > 0 && (
                                <p className="mt-1 text-xs text-gray-500">
                                    Maksimal: {formatCurrency(penggajian.sisa_kasbon)}
                                </p>
                            )}
                            {errors.potongan_kasbon && (
                                <p className="mt-1 text-sm text-red-600">{errors.potongan_kasbon}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Catatan
                            </label>
                            <textarea
                                value={data.catatan}
                                onChange={(e) => setData('catatan', e.target.value)}
                                placeholder="Catatan tambahan..."
                                rows="2"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                            {errors.catatan && (
                                <p className="mt-1 text-sm text-red-600">{errors.catatan}</p>
                            )}
                        </div>

                        {/* Total Preview */}
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">Total Diterima:</span>
                                <span className="text-xl font-bold text-green-700">
                                    {formatCurrency(Math.max(0, calculateTotal()))}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-4">
                            <Link
                                href={'/penggajian/' + penggajian.id}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
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
