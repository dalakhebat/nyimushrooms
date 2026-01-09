import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Icon } from '@iconify/react';

export default function KasbonCreate({ karyawans }) {
    const [formData, setFormData] = useState({
        karyawan_id: '',
        tanggal: new Date().toISOString().slice(0, 10),
        jumlah: '',
        keterangan: '',
    });

    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/kasbon', formData, {
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
        <AdminLayout title="Tambah Kasbon">
            <Head title="Tambah Kasbon" />

            <div className="mb-6">
                <Link
                    href="/kasbon"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                    <Icon icon="solar:arrow-left-bold" className="w-4 h-4 mr-1" />
                    Kembali ke Kasbon
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Form Kasbon Baru</h2>
                    <p className="text-sm text-gray-500 mt-1">Tambah data kasbon karyawan</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Karyawan <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.karyawan_id}
                            onChange={(e) => setFormData({ ...formData, karyawan_id: e.target.value })}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                                errors.karyawan_id ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Pilih Karyawan</option>
                            {karyawans.map((k) => (
                                <option key={k.id} value={k.id}>{k.nama}</option>
                            ))}
                        </select>
                        {errors.karyawan_id && (
                            <p className="text-sm text-red-500 mt-1">{errors.karyawan_id}</p>
                        )}
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
                            placeholder="Contoh: 500000"
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
                            placeholder="Contoh: Untuk keperluan..."
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
                            <Icon icon="solar:check-circle-bold" className="w-5 h-5 mr-2" />
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
