import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Icon } from '@iconify/react';

export default function KumbungEdit({ kumbung }) {
    const { data, setData, put, processing, errors } = useForm({
        nama: kumbung.nama || '',
        kapasitas_baglog: kumbung.kapasitas_baglog || '',
        status: kumbung.status || 'aktif',
        tanggal_mulai: kumbung.tanggal_mulai || '',
        biaya_pembangunan: kumbung.biaya_pembangunan || '',
        biaya_baglog: kumbung.biaya_baglog || '',
        target_panen_kg: kumbung.target_panen_kg || '',
        harga_jual_per_kg: kumbung.harga_jual_per_kg || '15000',
        umur_baglog_bulan: kumbung.umur_baglog_bulan || '5',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put('/kumbung/' + kumbung.id);
    };

    // Calculate total investasi
    const totalInvestasi = (parseFloat(data.biaya_pembangunan) || 0) + (parseFloat(data.biaya_baglog) || 0);

    // Calculate estimated profit
    const kapasitas = parseInt(data.kapasitas_baglog) || 0;
    const hargaJual = parseFloat(data.harga_jual_per_kg) || 15000;
    const umurBulan = parseInt(data.umur_baglog_bulan) || 5;
    const yieldPerBaglog = 0.3; // kg per baglog per cycle

    const estimasiPanenPerCycle = kapasitas * yieldPerBaglog;
    const cyclesPerYear = 12 / umurBulan;
    const estimasiPanenPerTahun = estimasiPanenPerCycle * cyclesPerYear;
    const estimasiPendapatanPerTahun = estimasiPanenPerTahun * hargaJual;
    const waktuBepBulan = totalInvestasi > 0 ? (totalInvestasi / (estimasiPendapatanPerTahun / 12)) : 0;

    // Calculate target BEP
    const targetPanenBep = totalInvestasi / hargaJual;

    const formatRupiah = (amount) => {
        if (!amount) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AdminLayout title="Edit Kumbung">
            <Head title="Edit Kumbung" />

            <div className="max-w-4xl">
                <div className="mb-6">
                    <Link
                        href="/kumbung"
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                        <Icon icon="solar:arrow-left-bold" className="w-4 h-4 mr-1" />
                        Kembali
                    </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Form */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-6">
                                    Edit Kumbung: {kumbung.nomor}
                                </h2>

                                <div className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nomor Kumbung
                                            </label>
                                            <input
                                                type="text"
                                                value={kumbung.nomor}
                                                readOnly
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                Nomor tidak dapat diubah
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Status <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={data.status}
                                                onChange={(e) => setData('status', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            >
                                                <option value="aktif">Aktif</option>
                                                <option value="nonaktif">Nonaktif</option>
                                            </select>
                                            {errors.status && (
                                                <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nama Kumbung <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.nama}
                                            onChange={(e) => setData('nama', e.target.value)}
                                            placeholder="Contoh: Kumbung Utama"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                        {errors.nama && (
                                            <p className="mt-1 text-sm text-red-600">{errors.nama}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Kapasitas Baglog <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={data.kapasitas_baglog}
                                                onChange={(e) => setData('kapasitas_baglog', e.target.value)}
                                                placeholder="Contoh: 40000"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            />
                                            {kumbung.baglog_aktif > 0 && (
                                                <p className="mt-1 text-xs text-amber-600">
                                                    Baglog aktif: {kumbung.baglog_aktif} (min kapasitas)
                                                </p>
                                            )}
                                            {errors.kapasitas_baglog && (
                                                <p className="mt-1 text-sm text-red-600">{errors.kapasitas_baglog}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tanggal Mulai
                                            </label>
                                            <input
                                                type="date"
                                                value={data.tanggal_mulai}
                                                onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            />
                                            {errors.tanggal_mulai && (
                                                <p className="mt-1 text-sm text-red-600">{errors.tanggal_mulai}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-6">
                                    <Icon icon="solar:wallet-bold" className="w-5 h-5 inline mr-2 text-amber-500" />
                                    Investasi
                                </h2>

                                <div className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Biaya Pembangunan
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2.5 text-gray-500">Rp</span>
                                                <input
                                                    type="number"
                                                    value={data.biaya_pembangunan}
                                                    onChange={(e) => setData('biaya_pembangunan', e.target.value)}
                                                    placeholder="100000000"
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                />
                                            </div>
                                            {errors.biaya_pembangunan && (
                                                <p className="mt-1 text-sm text-red-600">{errors.biaya_pembangunan}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Biaya Baglog
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2.5 text-gray-500">Rp</span>
                                                <input
                                                    type="number"
                                                    value={data.biaya_baglog}
                                                    onChange={(e) => setData('biaya_baglog', e.target.value)}
                                                    placeholder="88000000"
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                />
                                            </div>
                                            {errors.biaya_baglog && (
                                                <p className="mt-1 text-sm text-red-600">{errors.biaya_baglog}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-amber-50 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-amber-800">Total Investasi</span>
                                            <span className="text-lg font-bold text-amber-900">{formatRupiah(totalInvestasi)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-6">
                                    <Icon icon="solar:chart-bold" className="w-5 h-5 inline mr-2 text-green-500" />
                                    Target & Kalkulasi
                                </h2>

                                <div className="space-y-5">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Harga Jual per Kg
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2.5 text-gray-500">Rp</span>
                                                <input
                                                    type="number"
                                                    value={data.harga_jual_per_kg}
                                                    onChange={(e) => setData('harga_jual_per_kg', e.target.value)}
                                                    placeholder="15000"
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                />
                                            </div>
                                            {errors.harga_jual_per_kg && (
                                                <p className="mt-1 text-sm text-red-600">{errors.harga_jual_per_kg}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Umur Baglog (bulan)
                                            </label>
                                            <input
                                                type="number"
                                                value={data.umur_baglog_bulan}
                                                onChange={(e) => setData('umur_baglog_bulan', e.target.value)}
                                                placeholder="5"
                                                min="1"
                                                max="24"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            />
                                            {errors.umur_baglog_bulan && (
                                                <p className="mt-1 text-sm text-red-600">{errors.umur_baglog_bulan}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Target Panen (kg)
                                            </label>
                                            <input
                                                type="number"
                                                value={data.target_panen_kg}
                                                onChange={(e) => setData('target_panen_kg', e.target.value)}
                                                placeholder="Optional"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            />
                                            {errors.target_panen_kg && (
                                                <p className="mt-1 text-sm text-red-600">{errors.target_panen_kg}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Estimasi */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
                                <h3 className="text-lg font-semibold mb-4">Estimasi Profit</h3>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-100">Panen per Cycle</span>
                                        <span className="font-medium">{estimasiPanenPerCycle.toFixed(0)} kg</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-100">Panen per Tahun</span>
                                        <span className="font-medium">{estimasiPanenPerTahun.toFixed(0)} kg</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-100">Pendapatan/Tahun</span>
                                        <span className="font-medium">{formatRupiah(estimasiPendapatanPerTahun)}</span>
                                    </div>
                                    <hr className="border-green-400" />
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-100">Target BEP</span>
                                        <span className="font-medium">{targetPanenBep.toFixed(0)} kg</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-100">Waktu BEP</span>
                                        <span className="font-bold text-lg">{waktuBepBulan.toFixed(1)} bulan</span>
                                    </div>
                                </div>

                                <p className="mt-4 text-xs text-green-200">
                                    * Estimasi berdasarkan yield 0.3 kg/baglog/cycle
                                </p>
                            </div>

                            {/* Current Stats */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Status Saat Ini</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Baglog Aktif</span>
                                        <span className="font-medium">{kumbung.baglog_aktif || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Kapasitas Tersedia</span>
                                        <span className="font-medium">{kumbung.kapasitas_tersedia || 0}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full px-4 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Update Kumbung'}
                                </button>
                                <Link
                                    href="/kumbung"
                                    className="w-full px-4 py-3 text-sm font-medium text-center text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Batal
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
