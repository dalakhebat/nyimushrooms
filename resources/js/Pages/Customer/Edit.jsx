import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';
import FormAlert from '@/Components/FormAlert';

export default function CustomerEdit({ customer }) {
    const { data, setData, put, processing, errors } = useForm({
        nama: customer.nama || '',
        no_hp: customer.no_hp || '',
        alamat: customer.alamat || '',
    });

    const hasError = (field) => !!errors[field];

    const handleSubmit = (e) => {
        e.preventDefault();
        put('/customer/' + customer.id);
    };

    return (
        <AdminLayout title="Edit Customer">
            <Head title="Edit Customer" />

            <div className="mb-6">
                <Link
                    href="/customer"
                    className="inline-flex items-center text-sm text-on-surface-variant hover:text-on-surface"
                >
                    <MIcon name="arrow_back" className="text-base mr-1" />
                    Kembali ke Daftar Customer
                </Link>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm max-w-2xl">
                <div className="p-6 border-b border-outline-variant/15">
                    <h2 className="text-lg font-headline font-bold text-on-surface">Edit Customer</h2>
                    <p className="text-sm text-on-surface-variant">Perbarui data customer</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <FormAlert errors={errors} />

                    <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-1">
                            Nama Customer <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.nama}
                            onChange={(e) => setData('nama', e.target.value)}
                            className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                        />
                        {errors.nama && <p className="mt-1 text-sm text-red-600">{errors.nama}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-1">
                            No. HP / Telepon
                        </label>
                        <input
                            type="text"
                            value={data.no_hp}
                            onChange={(e) => setData('no_hp', e.target.value)}
                            className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                        />
                        {errors.no_hp && <p className="mt-1 text-sm text-red-600">{errors.no_hp}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-1">
                            Alamat
                        </label>
                        <textarea
                            value={data.alamat}
                            onChange={(e) => setData('alamat', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                        />
                        {errors.alamat && <p className="mt-1 text-sm text-red-600">{errors.alamat}</p>}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                        <Link
                            href="/customer"
                            className="px-4 py-2 text-on-surface-variant hover:bg-surface-container-low rounded-xl"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary disabled:bg-gray-400"
                        >
                            {processing ? 'Menyimpan...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
