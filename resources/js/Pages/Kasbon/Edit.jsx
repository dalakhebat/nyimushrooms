import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    ArrowLeftIcon,
    CheckIcon,
} from '@heroicons/react/24/outline';

export default function KasbonEdit({ kasbon, karyawans }) {
    const [formData, setFormData] = useState({
        tanggal: kasbon.tanggal.split('T')[0],
        jumlah: kasbon.jumlah,
        keterangan: kasbon.keterangan || '',
    });

    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(`/kasbon/${kasbon.id}`, formData, {
            onError: (errors) => setErrors(errors),
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AdminLayout title="Edit Kasbon">
            <Head title="Edit Kasbon" />

            <div className="mb-6">
                <Link
                    href="/kasbon"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeftIcon className="w-4 h-4 mr-1" />
                    Kembali ke Kasbon
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Edit Kasbon</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Karyawan: <span className="font-medium">{kasbon.karyawan?.nama}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-700">
                            <strong>Catatan:</strong> Sudah dibayar: {formatCurrency(kasbon.jumlah - kasbon.sisa)} |
                            Sisa: {formatCurrency(kasbon.sisa)}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tanggal <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={formData.tanggal}
                            onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                                errors.tanggal ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.tanggal && (
                            <p className="text-sm text-red-500 mt-1">{errors.tanggal}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Jumlah <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={formData.jumlah}
                            onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
                            min="1"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                                errors.jumlah ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {formData.jumlah > 0 && (
                            <p className="text-sm text-green-600 mt-1">{formatCurrency(formData.jumlah)}</p>
                        )}
                        {errors.jumlah && (
                            <p className="text-sm text-red-500 mt-1">{errors.jumlah}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Keterangan
                        </label>
                        <textarea
                            value={formData.keterangan}
                            onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                            rows={3}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                                errors.keterangan ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.keterangan && (
                            <p className="text-sm text-red-500 mt-1">{errors.keterangan}</p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Link
                            href="/kasbon"
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            className="inline-flex items-center px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
                        >
                            <CheckIcon className="w-5 h-5 mr-2" />
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
