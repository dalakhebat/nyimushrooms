import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Icon } from '@iconify/react';

export default function CustomerEdit({ customer }) {
    const { data, setData, put, processing, errors } = useForm({
        nama: customer.nama || '',
        no_hp: customer.no_hp || '',
        alamat: customer.alamat || '',
    });

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
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                    <Icon icon="solar:arrow-left-bold" className="w-4 h-4 mr-1" />
                    Kembali ke Daftar Customer
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm max-w-2xl">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Edit Customer</h2>
                    <p className="text-sm text-gray-600">Perbarui data customer</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Customer <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.nama}
                            onChange={(e) => setData('nama', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                        {errors.nama && <p className="mt-1 text-sm text-red-600">{errors.nama}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            No. HP / Telepon
                        </label>
                        <input
                            type="text"
                            value={data.no_hp}
                            onChange={(e) => setData('no_hp', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                        {errors.no_hp && <p className="mt-1 text-sm text-red-600">{errors.no_hp}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Alamat
                        </label>
                        <textarea
                            value={data.alamat}
                            onChange={(e) => setData('alamat', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                        {errors.alamat && <p className="mt-1 text-sm text-red-600">{errors.alamat}</p>}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                        <Link
                            href="/customer"
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                        >
                            {processing ? 'Menyimpan...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
