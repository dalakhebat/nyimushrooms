import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';

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
                    className="inline-flex items-center text-sm text-on-surface-variant hover:text-on-surface"
                >
                    <MIcon name="arrow_back" className="text-base mr-1" />
                    Kembali ke Kasbon
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2">
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm overflow-hidden">
                        <div className="p-6 border-b border-outline-variant/15">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-on-surface">{kasbon.karyawan?.nama}</h2>
                                    <p className="text-sm text-on-tertiary-container mt-1">
                                        Tanggal Kasbon: {formatDate(kasbon.tanggal)}
                                    </p>
                                </div>
                                {kasbon.status === 'lunas' ? (
                                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-emerald-100 text-secondary">
                                        <MIcon name="check_circle" className="text-base mr-1" />
                                        Lunas
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-700">
                                        <MIcon name="schedule" className="text-base mr-1" />
                                        Belum Lunas
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Progress Bar */}
                            <div className="mb-6">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-on-surface-variant">Progress Pembayaran</span>
                                    <span className="font-medium text-on-surface">{persentase.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-primary h-3 rounded-full transition-all"
                                        style={{ width: `${persentase}%` }}
                                    />
                                </div>
                            </div>

                            {/* Amount Cards */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-surface-container-low p-4 rounded-xl text-center">
                                    <MIcon name="account_balance" className="text-3xl text-slate-400 mx-auto mb-2" />
                                    <p className="text-xs text-on-tertiary-container uppercase">Total Kasbon</p>
                                    <p className="text-lg font-headline font-bold text-on-surface">{formatCurrency(kasbon.jumlah)}</p>
                                </div>
                                <div className="bg-emerald-50 p-4 rounded-xl text-center">
                                    <MIcon name="check_circle" className="text-3xl text-green-500 mx-auto mb-2" />
                                    <p className="text-xs text-on-tertiary-container uppercase">Sudah Dibayar</p>
                                    <p className="text-lg font-bold text-secondary">{formatCurrency(sudahDibayar)}</p>
                                </div>
                                <div className="bg-red-50 p-4 rounded-xl text-center">
                                    <MIcon name="schedule" className="text-3xl text-red-500 mx-auto mb-2" />
                                    <p className="text-xs text-on-tertiary-container uppercase">Sisa</p>
                                    <p className="text-lg font-bold text-red-700">{formatCurrency(kasbon.sisa)}</p>
                                </div>
                            </div>

                            {/* Keterangan */}
                            {kasbon.keterangan && (
                                <div className="bg-surface-container-low p-4 rounded-xl">
                                    <p className="text-sm font-medium text-on-surface-variant mb-1">Keterangan:</p>
                                    <p className="text-on-surface-variant">{kasbon.keterangan}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Riwayat Pembayaran */}
                <div className="lg:col-span-1">
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm">
                        <div className="p-4 border-b border-outline-variant/15">
                            <h3 className="font-bold text-on-surface">Riwayat Pembayaran</h3>
                        </div>
                        <div className="p-4">
                            {kasbon.pembayarans && kasbon.pembayarans.length > 0 ? (
                                <div className="space-y-4">
                                    {kasbon.pembayarans.map((pembayaran) => (
                                        <div key={pembayaran.id} className="flex items-start space-x-3">
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                                    <MIcon name="payments" className="text-xl text-secondary" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-on-surface">
                                                    {formatCurrency(pembayaran.jumlah)}
                                                </p>
                                                <p className="text-xs text-on-tertiary-container">
                                                    {formatDate(pembayaran.tanggal)}
                                                </p>
                                                <p className="text-xs text-on-tertiary-container capitalize">
                                                    {pembayaran.metode === 'potong_gaji' ? 'Potong Gaji' : 'Bayar Langsung'}
                                                </p>
                                                {pembayaran.keterangan && (
                                                    <p className="text-xs text-slate-400 mt-1">{pembayaran.keterangan}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-on-tertiary-container text-center py-8">
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
