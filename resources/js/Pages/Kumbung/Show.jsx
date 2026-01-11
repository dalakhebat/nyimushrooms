import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Icon } from '@iconify/react';

const formatRupiah = (amount) => {
    if (!amount) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const formatNumber = (num, decimals = 2) => {
    if (num === null || num === undefined) return '-';
    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
    }).format(num);
};

export default function KumbungShow({ kumbung, baglogStats, panenHistory }) {
    const getRoiBadge = (roi) => {
        if (roi === null || roi === undefined) {
            return <span className="text-gray-400">Belum ada data</span>;
        }
        if (roi >= 0) {
            return (
                <span className="text-2xl font-bold text-green-600">
                    +{formatNumber(roi, 1)}%
                </span>
            );
        }
        return (
            <span className="text-2xl font-bold text-red-600">
                {formatNumber(roi, 1)}%
            </span>
        );
    };

    const progressBep = kumbung.sisa_target_bep > 0 && kumbung.total_investasi > 0
        ? ((kumbung.total_panen / (kumbung.total_investasi / (kumbung.harga_jual_per_kg || 15000))) * 100)
        : 100;

    return (
        <AdminLayout title={`Detail Kumbung - ${kumbung.nama}`}>
            <Head title={`Kumbung ${kumbung.nama}`} />

            <div className="mb-6 flex items-center justify-between">
                <Link
                    href="/kumbung"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                    <Icon icon="solar:arrow-left-bold" className="w-4 h-4 mr-1" />
                    Kembali ke Daftar
                </Link>
                <Link
                    href={`/kumbung/${kumbung.id}/edit`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Icon icon="solar:pen-bold" className="w-4 h-4 mr-1" />
                    Edit Kumbung
                </Link>
            </div>

            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center">
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium mr-3">
                                {kumbung.nomor}
                            </span>
                            <h1 className="text-2xl font-bold text-gray-800">{kumbung.nama}</h1>
                        </div>
                        <p className="text-gray-500 mt-2">
                            {kumbung.status === 'aktif' ? (
                                <span className="inline-flex items-center text-green-600">
                                    <Icon icon="solar:check-circle-bold" className="w-4 h-4 mr-1" />
                                    Aktif
                                </span>
                            ) : (
                                <span className="inline-flex items-center text-gray-500">
                                    <Icon icon="solar:close-circle-bold" className="w-4 h-4 mr-1" />
                                    Nonaktif
                                </span>
                            )}
                            {kumbung.umur_hari && (
                                <span className="ml-4">
                                    Umur: {kumbung.umur_hari} hari
                                </span>
                            )}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">ROI</p>
                        {getRoiBadge(kumbung.roi)}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl shadow-sm p-4">
                            <p className="text-xs text-gray-500">Kapasitas</p>
                            <p className="text-xl font-bold text-gray-800">{formatNumber(kumbung.kapasitas_baglog, 0)}</p>
                            <p className="text-xs text-gray-400">baglog</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-4">
                            <p className="text-xs text-gray-500">Baglog Aktif</p>
                            <p className="text-xl font-bold text-green-600">{formatNumber(kumbung.baglog_aktif, 0)}</p>
                            <p className="text-xs text-gray-400">
                                {kumbung.kapasitas_baglog > 0
                                    ? `${Math.round((kumbung.baglog_aktif / kumbung.kapasitas_baglog) * 100)}% terisi`
                                    : '-'
                                }
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-4">
                            <p className="text-xs text-gray-500">Total Panen</p>
                            <p className="text-xl font-bold text-gray-800">{formatNumber(kumbung.total_panen)}</p>
                            <p className="text-xs text-gray-400">kg</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-4">
                            <p className="text-xs text-gray-500">Pendapatan</p>
                            <p className="text-lg font-bold text-green-600">{formatRupiah(kumbung.pendapatan_panen)}</p>
                        </div>
                    </div>

                    {/* Investment Section */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <Icon icon="solar:wallet-bold" className="w-5 h-5 mr-2 text-amber-500" />
                            Investasi
                        </h2>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Biaya Pembangunan</p>
                                <p className="text-lg font-semibold text-gray-800">{formatRupiah(kumbung.biaya_pembangunan)}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Biaya Baglog</p>
                                <p className="text-lg font-semibold text-gray-800">{formatRupiah(kumbung.biaya_baglog)}</p>
                            </div>
                            <div className="p-4 bg-amber-50 rounded-lg">
                                <p className="text-sm text-amber-700">Total Investasi</p>
                                <p className="text-lg font-bold text-amber-800">{formatRupiah(kumbung.total_investasi)}</p>
                            </div>
                        </div>
                    </div>

                    {/* BEP Progress */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <Icon icon="solar:target-bold" className="w-5 h-5 mr-2 text-blue-500" />
                            Progress BEP (Break Even Point)
                        </h2>

                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium">{Math.min(progressBep, 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                                <div
                                    className={`h-4 rounded-full transition-all ${
                                        progressBep >= 100 ? 'bg-green-500' : 'bg-blue-500'
                                    }`}
                                    style={{ width: `${Math.min(progressBep, 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-700">Target Panen BEP</p>
                                <p className="text-lg font-semibold text-blue-800">
                                    {formatNumber(kumbung.total_investasi / (kumbung.harga_jual_per_kg || 15000))} kg
                                </p>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-lg">
                                <p className="text-sm text-orange-700">Sisa Target</p>
                                <p className="text-lg font-semibold text-orange-800">
                                    {kumbung.sisa_target_bep > 0 ? `${formatNumber(kumbung.sisa_target_bep)} kg` : 'Tercapai!'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Baglog Status */}
                    {baglogStats && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <Icon icon="solar:box-bold" className="w-5 h-5 mr-2 text-green-500" />
                                Status Baglog
                            </h2>
                            <div className="grid grid-cols-5 gap-3">
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-bold text-gray-800">{formatNumber(baglogStats.produksi, 0)}</p>
                                    <p className="text-xs text-gray-500">Produksi</p>
                                </div>
                                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                    <p className="text-2xl font-bold text-yellow-700">{formatNumber(baglogStats.inkubasi, 0)}</p>
                                    <p className="text-xs text-gray-500">Inkubasi</p>
                                </div>
                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                    <p className="text-2xl font-bold text-blue-700">{formatNumber(baglogStats.pembibitan, 0)}</p>
                                    <p className="text-xs text-gray-500">Pembibitan</p>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                    <p className="text-2xl font-bold text-green-700">{formatNumber(baglogStats.masuk_kumbung, 0)}</p>
                                    <p className="text-xs text-gray-500">Di Kumbung</p>
                                </div>
                                <div className="text-center p-3 bg-purple-50 rounded-lg">
                                    <p className="text-2xl font-bold text-purple-700">{formatNumber(baglogStats.selesai, 0)}</p>
                                    <p className="text-xs text-gray-500">Selesai</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recent Panen */}
                    {panenHistory && panenHistory.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <Icon icon="solar:leaf-bold" className="w-5 h-5 mr-2 text-lime-500" />
                                Riwayat Panen Terakhir
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Tanggal</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total (kg)</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Layak Jual</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Reject</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {panenHistory.map((panen) => (
                                            <tr key={panen.id}>
                                                <td className="px-4 py-3 text-sm text-gray-700">{panen.tanggal_formatted}</td>
                                                <td className="px-4 py-3 text-sm text-right font-medium">{formatNumber(panen.berat_kg)}</td>
                                                <td className="px-4 py-3 text-sm text-right text-green-600">{formatNumber(panen.berat_layak_jual)}</td>
                                                <td className="px-4 py-3 text-sm text-right text-red-500">{formatNumber(panen.berat_reject)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Estimasi Profit */}
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
                        <h3 className="text-lg font-semibold mb-4">Estimasi Profit</h3>

                        {kumbung.estimasi_profit && (
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-green-100">Panen per Cycle</span>
                                    <span className="font-medium">{formatNumber(kumbung.estimasi_profit.panen_per_cycle)} kg</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-green-100">Panen per Tahun</span>
                                    <span className="font-medium">{formatNumber(kumbung.estimasi_profit.panen_per_tahun)} kg</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-green-100">Pendapatan/Tahun</span>
                                    <span className="font-medium">{formatRupiah(kumbung.estimasi_profit.pendapatan_per_tahun)}</span>
                                </div>
                                <hr className="border-green-400" />
                                <div className="flex justify-between">
                                    <span className="text-green-100">Estimasi BEP</span>
                                    <span className="font-bold text-lg">{formatNumber(kumbung.estimasi_profit.waktu_bep_bulan, 1)} bulan</span>
                                </div>
                            </div>
                        )}

                        <p className="mt-4 text-xs text-green-200">
                            * Estimasi berdasarkan yield 0.3 kg/baglog/cycle
                        </p>
                    </div>

                    {/* Info */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Informasi</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Harga Jual/kg</span>
                                <span className="font-medium">{formatRupiah(kumbung.harga_jual_per_kg)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Umur Baglog</span>
                                <span className="font-medium">{kumbung.umur_baglog_bulan || 5} bulan</span>
                            </div>
                            {kumbung.target_panen_kg > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Target Panen</span>
                                    <span className="font-medium">{formatNumber(kumbung.target_panen_kg)} kg</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Aksi Cepat</h3>
                        <div className="space-y-2">
                            <Link
                                href="/panen/create"
                                className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                            >
                                <span className="text-sm text-green-700">Tambah Panen</span>
                                <Icon icon="solar:add-circle-bold" className="w-5 h-5 text-green-600" />
                            </Link>
                            <Link
                                href="/baglog"
                                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                <span className="text-sm text-blue-700">Kelola Baglog</span>
                                <Icon icon="solar:box-bold" className="w-5 h-5 text-blue-600" />
                            </Link>
                            <Link
                                href="/monitoring-kumbung/create"
                                className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                            >
                                <span className="text-sm text-purple-700">Monitoring</span>
                                <Icon icon="solar:chart-2-bold" className="w-5 h-5 text-purple-600" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
