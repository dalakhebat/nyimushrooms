import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';
import FormAlert from '@/Components/FormAlert';

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
                    className="inline-flex items-center text-sm text-on-surface-variant hover:text-on-surface"
                >
                    <MIcon name="arrow_back" className="text-base mr-1" />
                    Kembali ke Kasbon
                </Link>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm">
                <div className="p-6 border-b border-outline-variant/15">
                    <h2 className="text-lg font-headline font-bold text-on-surface">Edit Kasbon</h2>
                    <p className="text-sm text-on-tertiary-container mt-1">
                        Karyawan: <span className="font-medium">{kasbon.karyawan?.nama}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <FormAlert errors={errors} />

                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <p className="text-sm text-yellow-700">
                            <strong>Catatan:</strong> Sudah dibayar: {formatCurrency(kasbon.jumlah - kasbon.sisa)} |
                            Sisa: {formatCurrency(kasbon.sisa)}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-1">
                            Tanggal <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={formData.tanggal}
                            onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-secondary ${
                                errors.tanggal ? 'border-red-500' : 'border-outline-variant/30'
                            }`}
                        />
                        {errors.tanggal && (
                            <p className="text-sm text-red-500 mt-1">{errors.tanggal}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-1">
                            Jumlah <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={formData.jumlah}
                            onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
                            min="1"
                            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-secondary ${
                                errors.jumlah ? 'border-red-500' : 'border-outline-variant/30'
                            }`}
                        />
                        {formData.jumlah > 0 && (
                            <p className="text-sm text-secondary mt-1">{formatCurrency(formData.jumlah)}</p>
                        )}
                        {errors.jumlah && (
                            <p className="text-sm text-red-500 mt-1">{errors.jumlah}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-1">
                            Keterangan
                        </label>
                        <textarea
                            value={formData.keterangan}
                            onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                            rows={3}
                            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-secondary ${
                                errors.keterangan ? 'border-red-500' : 'border-outline-variant/30'
                            }`}
                        />
                        {errors.keterangan && (
                            <p className="text-sm text-red-500 mt-1">{errors.keterangan}</p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Link
                            href="/kasbon"
                            className="px-4 py-2 text-on-surface-variant hover:bg-surface-container-low rounded-xl"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            className="inline-flex items-center px-6 py-2 bg-primary text-white font-medium rounded-xl hover:bg-primary"
                        >
                            <MIcon name="check_circle" className="text-xl mr-2" />
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
