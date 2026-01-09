import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Icon } from '@iconify/react';

export default function KasbonShow({ kasbon }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const sudahDibayar = kasbon.jumlah - kasbon.sisa;
    const persentase = (sudahDibayar / kasbon.jumlah) * 100;

    return (
        <AdminLayout title="Detail Kasbon">
            <Head title="Detail Kasbon" />

            <div className="mb-6">
                <Link
                    href="/kasbon"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                    <Icon icon="solar:arrow-left-bold" className="w-4 h-4 mr-1" />
                    Kembali ke Kasbon
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{kasbon.karyawan?.nama}</h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Tanggal Kasbon: {formatDate(kasbon.tanggal)}
                                    </p>
                                </div>
                                {kasbon.status === 'lunas' ? (
                                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-700">
                                        <Icon icon="solar:check-circle-bold" className="w-4 h-4 mr-1" />
                                        Lunas
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-700">
                                        <Icon icon="solar:clock-circle-bold" className="w-4 h-4 mr-1" />
                                        Belum Lunas
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Progress Bar */}
                            <div className="mb-6">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-600">Progress Pembayaran</span>
                                    <span className="font-medium text-gray-900">{persentase.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-green-600 h-3 rounded-full transition-all"
                                        style={{ width: `${persentase}%` }}
                                    />
                                </div>
                            </div>

                            {/* Amount Cards */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-gray-50 p-4 rounded-lg text-center">
                                    <Icon icon="solar:dollar-bold" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-xs text-gray-500 uppercase">Total Kasbon</p>
                                    <p className="text-lg font-bold text-gray-900">{formatCurrency(kasbon.jumlah)}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg text-center">
                                    <Icon icon="solar:check-circle-bold" className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                    <p className="text-xs text-gray-500 uppercase">Sudah Dibayar</p>
                                    <p className="text-lg font-bold text-green-700">{formatCurrency(sudahDibayar)}</p>
                                </div>
                                <div className="bg-red-50 p-4 rounded-lg text-center">
                                    <Icon icon="solar:clock-circle-bold" className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                    <p className="text-xs text-gray-500 uppercase">Sisa</p>
                                    <p className="text-lg font-bold text-red-700">{formatCurrency(kasbon.sisa)}</p>
                                </div>
                            </div>

                            {/* Keterangan */}
                            {kasbon.keterangan && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Keterangan:</p>
                                    <p className="text-gray-600">{kasbon.keterangan}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Riwayat Pembayaran */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-800">Riwayat Pembayaran</h3>
                        </div>
                        <div className="p-4">
                            {kasbon.pembayarans && kasbon.pembayarans.length > 0 ? (
                                <div className="space-y-4">
                                    {kasbon.pembayarans.map((pembayaran) => (
                                        <div key={pembayaran.id} className="flex items-start space-x-3">
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                    <Icon icon="solar:banknote-bold" className="w-5 h-5 text-green-600" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {formatCurrency(pembayaran.jumlah)}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {formatDate(pembayaran.tanggal)}
                                                </p>
                                                <p className="text-xs text-gray-500 capitalize">
                                                    {pembayaran.metode === 'potong_gaji' ? 'Potong Gaji' : 'Bayar Langsung'}
                                                </p>
                                                {pembayaran.keterangan && (
                                                    <p className="text-xs text-gray-400 mt-1">{pembayaran.keterangan}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-8">
                                    Belum ada pembayaran
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
