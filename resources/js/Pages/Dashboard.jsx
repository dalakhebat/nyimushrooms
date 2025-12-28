import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import {
    ScaleIcon,
    CubeIcon,
    UsersIcon,
    BanknotesIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import { formatBerat, formatRupiah, formatNumber } from '@/Utils/format';

export default function Dashboard({ stats, recentPanen = [] }) {
    const defaultStats = stats || {
        totalPanenHariIni: 0,
        totalPanenBulanIni: 0,
        totalKumbungAktif: 0,
        totalBaglog: 0,
        totalKaryawan: 0,
        incomeBulanIni: 0,
        outcomeBulanIni: 0,
    };

    const cards = [
        {
            title: 'Panen Hari Ini',
            value: formatBerat(defaultStats.totalPanenHariIni),
            icon: ScaleIcon,
            color: 'bg-green-500',
        },
        {
            title: 'Panen Bulan Ini',
            value: formatBerat(defaultStats.totalPanenBulanIni),
            icon: ScaleIcon,
            color: 'bg-green-600',
        },
        {
            title: 'Kumbung Aktif',
            value: defaultStats.totalKumbungAktif,
            icon: CubeIcon,
            color: 'bg-blue-500',
        },
        {
            title: 'Total Baglog',
            value: formatNumber(defaultStats.totalBaglog),
            icon: CubeIcon,
            color: 'bg-purple-500',
        },
        {
            title: 'Karyawan Aktif',
            value: defaultStats.totalKaryawan,
            icon: UsersIcon,
            color: 'bg-orange-500',
        },
        {
            title: 'Income Bulan Ini',
            value: 'Rp ' + formatNumber(defaultStats.incomeBulanIni),
            icon: ArrowTrendingUpIcon,
            color: 'bg-emerald-500',
        },
        {
            title: 'Outcome Bulan Ini',
            value: 'Rp ' + formatNumber(defaultStats.outcomeBulanIni),
            icon: ArrowTrendingDownIcon,
            color: 'bg-red-500',
        },
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-sm overflow-hidden"
                    >
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className={card.color + ' p-3 rounded-lg'}>
                                    <card.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">
                                        {card.title}
                                    </p>
                                    <p className="text-xl font-semibold text-gray-900">
                                        {card.value}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Input Cepat
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <a
                            href="/panen/create"
                            className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                        >
                            <ScaleIcon className="w-6 h-6 text-green-600 mr-2" />
                            <span className="font-medium text-green-700">Input Panen</span>
                        </a>
                        <a
                            href="/absensi"
                            className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                            <UsersIcon className="w-6 h-6 text-blue-600 mr-2" />
                            <span className="font-medium text-blue-700">Input Absensi</span>
                        </a>
                        <a
                            href="/penjualan/jamur/create"
                            className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                        >
                            <BanknotesIcon className="w-6 h-6 text-purple-600 mr-2" />
                            <span className="font-medium text-purple-700">Jual Jamur</span>
                        </a>
                        <a
                            href="/penjualan/baglog/create"
                            className="flex items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                        >
                            <CubeIcon className="w-6 h-6 text-orange-600 mr-2" />
                            <span className="font-medium text-orange-700">Jual Baglog</span>
                        </a>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
