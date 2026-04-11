import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { formatBerat } from '@/Utils/format';
import FormAlert from '@/Components/FormAlert';
import EmptyOption from '@/Components/EmptyOption';

export default function CreateJamur({ customers, stockJamur }) {
    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        tanggal: new Date().toISOString().slice(0, 10),
        berat_kg: '',
        harga_per_kg: '',
        status: 'pending',
        catatan: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/penjualan/jamur');
    };

    const formatCurrency = (num) => {
        if (!num) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
    };

    const totalHarga = (data.berat_kg || 0) * (data.harga_per_kg || 0);
    const exceedsStock = parseFloat(data.berat_kg || 0) > stockJamur;

    return (
        <AdminLayout title="Tambah Penjualan Jamur">
            <Head title="Tambah Penjualan Jamur" />

            <div className="mb-6">
                <Link
                    href="/penjualan?tipe=jamur"
                    className="inline-flex items-center text-sm text-on-surface-variant hover:text-on-surface"
                >
                    <ArrowLeftIcon className="w-4 h-4 mr-1" />
                    Kembali ke Daftar Penjualan
                </Link>
            </div>

            {/* Stock Info */}
            <div className={`mb-4 p-4 rounded-xl ${stockJamur > 0 ? 'bg-blue-50 border border-blue-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-on-surface-variant">Stock Jamur Layak Jual Tersedia</p>
                        <p className={`text-2xl font-bold ${stockJamur > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            {formatBerat(stockJamur)}
                        </p>
                    </div>
                    {stockJamur <= 0 && (
                        <div className="flex items-center text-red-600">
                            <ExclamationTriangleIcon className="w-6 h-6 mr-2" />
                            <span className="text-sm font-medium">Stock Habis!</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm max-w-2xl">
                <div className="p-6 border-b border-outline-variant/15">
                    <h2 className="text-lg font-headline font-bold text-on-surface">Tambah Penjualan Jamur</h2>
                    <p className="text-sm text-on-surface-variant">Catat penjualan jamur baru</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <FormAlert errors={errors} />

                    <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-1">
                            Customer
                        </label>

                        {customers.length === 0 ? (

                            <EmptyOption label="Customer" href="/customer/create" />

                        ) : (

                        <select
                            value={data.customer_id}
                            onChange={(e) => setData('customer_id', e.target.value)}
                            className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                        >
                            <option value="">Umum (tanpa customer)</option>
                            {customers.map((c) => (
                                <option key={c.id} value={c.id}>{c.nama}</option>
                            ))}
                        </select>

                        )}
                        {errors.customer_id && <p className="mt-1 text-sm text-red-600">{errors.customer_id}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-1">
                            Tanggal <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={data.tanggal}
                            onChange={(e) => setData('tanggal', e.target.value)}
                            className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                        />
                        {errors.tanggal && <p className="mt-1 text-sm text-red-600">{errors.tanggal}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                Berat (kg) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.berat_kg}
                                onChange={(e) => setData('berat_kg', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-xl focus:ring-2 ${exceedsStock ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-outline-variant/30 focus:ring-secondary'}`}
                                placeholder="0.00"
                                min="0.1"
                                max={stockJamur}
                            />
                            {errors.berat_kg && <p className="mt-1 text-sm text-red-600">{errors.berat_kg}</p>}
                            {exceedsStock && !errors.berat_kg && (
                                <p className="mt-1 text-sm text-red-600">
                                    Melebihi stock! Maksimal: {formatBerat(stockJamur)}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                Harga per kg <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={data.harga_per_kg}
                                onChange={(e) => setData('harga_per_kg', e.target.value)}
                                className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                                placeholder="0"
                                min="0"
                            />
                            {errors.harga_per_kg && <p className="mt-1 text-sm text-red-600">{errors.harga_per_kg}</p>}
                        </div>
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-xl">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-on-surface-variant">Total Harga:</span>
                            <span className="text-xl font-bold text-secondary">{formatCurrency(totalHarga)}</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-1">
                            Status Pembayaran <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                        >
                            <option value="pending">Pending (Belum Bayar)</option>
                            <option value="lunas">Lunas</option>
                        </select>
                        {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-1">
                            Catatan
                        </label>
                        <textarea
                            value={data.catatan}
                            onChange={(e) => setData('catatan', e.target.value)}
                            className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                            rows="3"
                            placeholder="Catatan tambahan..."
                        />
                        {errors.catatan && <p className="mt-1 text-sm text-red-600">{errors.catatan}</p>}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                        <Link
                            href="/penjualan?tipe=jamur"
                            className="px-4 py-2 text-on-surface-variant hover:bg-surface-container-low rounded-xl"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing || exceedsStock || stockJamur <= 0}
                            className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
