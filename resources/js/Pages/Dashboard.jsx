import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { formatBerat, formatRupiah, formatNumber } from '@/Utils/format';

export default function Dashboard({ stats, recentPanen = [], recentNotifikasi = [] }) {
    const defaultStats = stats || {
        totalPanenHariIni: 0,
        totalPanenBulanIni: 0,
        totalKumbungAktif: 0,
        totalBaglog: 0,
        totalKaryawan: 0,
        incomeBulanIni: 0,
        outcomeBulanIni: 0,
        bahanBakuLowStock: 0,
        produksiDalamProses: 0,
        notifikasiBelumDibaca: 0,
        saldoKas: 0,
        monitoringHariIni: 0,
    };

    const mainCards = [
        {
            title: 'Panen Hari Ini',
            value: formatBerat(defaultStats.totalPanenHariIni),
            icon: 'solar:scale-bold',
            color: 'bg-green-500',
        },
        {
            title: 'Panen Bulan Ini',
            value: formatBerat(defaultStats.totalPanenBulanIni),
            icon: 'solar:scale-bold',
            color: 'bg-green-600',
        },
        {
            title: 'Kumbung Aktif',
            value: defaultStats.totalKumbungAktif,
            icon: 'solar:home-2-bold',
            color: 'bg-blue-500',
        },
        {
            title: 'Total Baglog',
            value: formatNumber(defaultStats.totalBaglog),
            icon: 'solar:layers-bold',
            color: 'bg-purple-500',
        },
    ];

    const financeCards = [
        {
            title: 'Income Bulan Ini',
            value: 'Rp ' + formatNumber(defaultStats.incomeBulanIni),
            icon: 'solar:arrow-up-bold',
            color: 'bg-emerald-500',
        },
        {
            title: 'Outcome Bulan Ini',
            value: 'Rp ' + formatNumber(defaultStats.outcomeBulanIni),
            icon: 'solar:arrow-down-bold',
            color: 'bg-red-500',
        },
        {
            title: 'Saldo Kas',
            value: 'Rp ' + formatNumber(defaultStats.saldoKas),
            icon: 'solar:dollar-bold',
            color: defaultStats.saldoKas >= 0 ? 'bg-blue-500' : 'bg-red-600',
        },
    ];

    const operationalCards = [
        {
            title: 'Karyawan Aktif',
            value: defaultStats.totalKaryawan,
            icon: 'solar:users-group-rounded-bold',
            color: 'bg-orange-500',
        },
        {
            title: 'Produksi Berjalan',
            value: defaultStats.produksiDalamProses,
            icon: 'solar:test-tube-bold',
            color: 'bg-indigo-500',
        },
        {
            title: 'Monitoring Hari Ini',
            value: defaultStats.monitoringHariIni,
            icon: 'solar:sun-bold',
            color: 'bg-yellow-500',
        },
    ];

    const alertCards = [
        {
            title: 'Stok Rendah',
            value: defaultStats.bahanBakuLowStock,
            icon: 'solar:danger-triangle-bold',
            color: defaultStats.bahanBakuLowStock > 0 ? 'bg-red-500' : 'bg-gray-400',
            link: '/bahan-baku',
        },
        {
            title: 'Notifikasi',
            value: defaultStats.notifikasiBelumDibaca,
            icon: 'solar:bell-bold',
            color: defaultStats.notifikasiBelumDibaca > 0 ? 'bg-red-500' : 'bg-gray-400',
            link: '/notifikasi',
        },
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard" />

            {/* Alert Cards */}
            {(defaultStats.bahanBakuLowStock > 0 || defaultStats.notifikasiBelumDibaca > 0) && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <div className="flex items-center gap-4">
                        {defaultStats.bahanBakuLowStock > 0 && (
                            <Link href="/bahan-baku" className="flex items-center gap-2 text-yellow-700 hover:text-yellow-900">
                                <Icon icon="solar:danger-triangle-bold" className="w-5 h-5" />
                                <span className="font-medium">{defaultStats.bahanBakuLowStock} bahan baku stok rendah</span>
                            </Link>
                        )}
                        {defaultStats.notifikasiBelumDibaca > 0 && (
                            <Link href="/notifikasi" className="flex items-center gap-2 text-yellow-700 hover:text-yellow-900">
                                <Icon icon="solar:bell-bold" className="w-5 h-5" />
                                <span className="font-medium">{defaultStats.notifikasiBelumDibaca} notifikasi belum dibaca</span>
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {/* Main Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {mainCards.map((card, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4">
                            <div className="flex items-center">
                                <div className={card.color + ' p-3 rounded-lg'}>
                                    <Icon icon={card.icon} className="w-6 h-6 text-white" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-xs font-medium text-gray-500">{card.title}</p>
                                    <p className="text-lg font-semibold text-gray-900">{card.value}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Finance Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {financeCards.map((card, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className={card.color + ' p-3 rounded-lg'}>
                                    <Icon icon={card.icon} className="w-6 h-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">{card.title}</p>
                                    <p className="text-xl font-semibold text-gray-900">{card.value}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Operational Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {operationalCards.map((card, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className={card.color + ' p-3 rounded-lg'}>
                                    <Icon icon={card.icon} className="w-6 h-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">{card.title}</p>
                                    <p className="text-xl font-semibold text-gray-900">{card.value}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Recent Panen */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Panen Terakhir
                    </h3>
                    {recentPanen.length > 0 ? (
                        <div className="space-y-3">
                            {recentPanen.map((panen) => (
                                <div
                                    key={panen.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            {panen.kumbung?.nomor} - {panen.kumbung?.nama}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(panen.tanggal).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-green-600">
                                            {formatBerat(panen.berat_kg)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            Belum ada data panen
                        </div>
                    )}
                </div>

                {/* Recent Notifications */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Notifikasi Terbaru
                        </h3>
                        <Link href="/notifikasi" className="text-sm text-green-600 hover:text-green-700">
                            Lihat Semua
                        </Link>
                    </div>
                    {recentNotifikasi.length > 0 ? (
                        <div className="space-y-3">
                            {recentNotifikasi.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`p-3 rounded-lg border-l-4 ${
                                        notif.tipe === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                                        notif.tipe === 'danger' ? 'bg-red-50 border-red-500' :
                                        notif.tipe === 'success' ? 'bg-green-50 border-green-500' :
                                        'bg-blue-50 border-blue-500'
                                    }`}
                                >
                                    <p className="font-medium text-gray-800 text-sm">{notif.judul}</p>
                                    <p className="text-xs text-gray-500 mt-1">{notif.pesan}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            Tidak ada notifikasi baru
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Input Cepat
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                    <Link
                        href="/panen/create"
                        className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                    >
                        <Icon icon="solar:scale-bold" className="w-8 h-8 text-green-600 mb-2" />
                        <span className="text-sm font-medium text-green-700 text-center">Input Panen</span>
                    </Link>
                    <Link
                        href="/qr-absensi/scan"
                        className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                        <Icon icon="solar:qr-code-bold" className="w-8 h-8 text-blue-600 mb-2" />
                        <span className="text-sm font-medium text-blue-700 text-center">Scan Absensi</span>
                    </Link>
                    <Link
                        href="/monitoring-kumbung/create"
                        className="flex flex-col items-center justify-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
                    >
                        <Icon icon="solar:sun-bold" className="w-8 h-8 text-yellow-600 mb-2" />
                        <span className="text-sm font-medium text-yellow-700 text-center">Monitoring</span>
                    </Link>
                    <Link
                        href="/produksi-baglog/create"
                        className="flex flex-col items-center justify-center p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                        <Icon icon="solar:test-tube-bold" className="w-8 h-8 text-indigo-600 mb-2" />
                        <span className="text-sm font-medium text-indigo-700 text-center">Produksi Baglog</span>
                    </Link>
                    <Link
                        href="/kas/create"
                        className="flex flex-col items-center justify-center p-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                    >
                        <Icon icon="solar:dollar-bold" className="w-8 h-8 text-emerald-600 mb-2" />
                        <span className="text-sm font-medium text-emerald-700 text-center">Transaksi Kas</span>
                    </Link>
                    <Link
                        href="/penjualan/jamur/create"
                        className="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                    >
                        <Icon icon="solar:banknote-bold" className="w-8 h-8 text-purple-600 mb-2" />
                        <span className="text-sm font-medium text-purple-700 text-center">Jual Jamur</span>
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}
