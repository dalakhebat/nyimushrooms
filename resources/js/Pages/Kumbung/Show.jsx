import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';

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

export default function KumbungShow({ kumbung, baglogStats, siklusList = [], panenTanpaBaglog = [] }) {
    const getRoiBadge = (roi) => {
        if (roi === null || roi === undefined) {
            return <span className="text-slate-400">Belum ada data</span>;
        }
        if (roi >= 0) {
            return (
                <span className="text-2xl font-bold text-secondary">
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

    return (
        <AdminLayout title={`Detail Kumbung - ${kumbung.nama}`}>
            <Head title={`Kumbung ${kumbung.nama}`} />

            <div className="mb-6 flex items-center justify-between">
                <Link
                    href="/kumbung"
                    className="inline-flex items-center text-sm text-on-surface-variant hover:text-on-surface"
                >
                    <MIcon name="arrow_back" className="text-base mr-1" />
                    Kembali ke Daftar
                </Link>
                <Link
                    href={`/kumbung/${kumbung.id}/edit`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
                >
                    <MIcon name="edit" className="text-base mr-1" />
                    Edit Kumbung
                </Link>
            </div>

            {/* Header */}
            <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-6 mb-6">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center">
                            <span className="px-3 py-1 bg-emerald-100 text-primary rounded-full text-sm font-medium mr-3">
                                {kumbung.nomor}
                            </span>
                            <h1 className="text-2xl font-bold text-on-surface">{kumbung.nama}</h1>
                        </div>
                        <p className="text-on-tertiary-container mt-2">
                            {kumbung.status === 'aktif' ? (
                                <span className="inline-flex items-center text-secondary">
                                    <MIcon name="check_circle" className="text-base mr-1" />
                                    Aktif
                                </span>
                            ) : (
                                <span className="inline-flex items-center text-on-tertiary-container">
                                    <MIcon name="close" className="text-base mr-1" />
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
                        <p className="text-sm text-on-tertiary-container">ROI</p>
                        {getRoiBadge(kumbung.roi)}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                            <p className="text-xs text-on-tertiary-container">Kapasitas</p>
                            <p className="text-xl font-bold text-on-surface">{formatNumber(kumbung.kapasitas_baglog, 0)}</p>
                            <p className="text-xs text-slate-400">baglog</p>
                        </div>
                        <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                            <p className="text-xs text-on-tertiary-container">Baglog Aktif</p>
                            <p className="text-xl font-bold text-secondary">{formatNumber(kumbung.baglog_aktif, 0)}</p>
                            <p className="text-xs text-slate-400">
                                {kumbung.kapasitas_baglog > 0
                                    ? `${Math.round((kumbung.baglog_aktif / kumbung.kapasitas_baglog) * 100)}% terisi`
                                    : '-'
                                }
                            </p>
                        </div>
                        <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                            <p className="text-xs text-on-tertiary-container">Total Panen</p>
                            <p className="text-xl font-bold text-on-surface">{formatNumber(kumbung.total_panen)}</p>
                            <p className="text-xs text-slate-400">kg</p>
                        </div>
                        <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                            <p className="text-xs text-on-tertiary-container">Pendapatan</p>
                            <p className="text-lg font-bold text-secondary">{formatRupiah(kumbung.pendapatan_panen)}</p>
                        </div>
                    </div>

                    {/* Investment & Biaya */}
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-6">
                        <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center">
                            <MIcon name="account_balance_wallet" className="text-xl mr-2 text-amber-500" />
                            Investasi & Biaya
                        </h2>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="p-4 bg-amber-50 rounded-xl">
                                <p className="text-[10px] uppercase tracking-wider text-amber-600 font-bold">Biaya Pembangunan (CAPEX)</p>
                                <p className="text-xl font-headline font-extrabold text-amber-800">{formatRupiah(kumbung.biaya_pembangunan)}</p>
                                <p className="text-[11px] text-amber-600 mt-1">Investasi sekali — target BEP</p>
                            </div>
                            <div className="p-4 bg-surface-container-low rounded-xl">
                                <p className="text-[10px] uppercase tracking-wider text-on-tertiary-container font-bold">Biaya Baglog / Siklus (OPEX)</p>
                                <p className="text-xl font-headline font-extrabold text-on-surface">{formatRupiah(kumbung.biaya_baglog)}</p>
                                <p className="text-[11px] text-on-tertiary-container mt-1">Dipotong dari revenue setiap siklus</p>
                            </div>
                        </div>
                        {kumbung.total_profit_akumulasi !== undefined && (
                            <div className="p-4 bg-emerald-50 rounded-xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold">Total Profit Akumulasi</p>
                                        <p className="text-xl font-headline font-extrabold text-emerald-700">{formatRupiah(kumbung.total_profit_akumulasi)}</p>
                                    </div>
                                    {kumbung.avg_profit_per_siklus > 0 && (
                                        <div className="text-right">
                                            <p className="text-[10px] text-emerald-600">Rata-rata / siklus</p>
                                            <p className="text-sm font-bold text-emerald-700">{formatRupiah(kumbung.avg_profit_per_siklus)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* BEP Progress — based on biaya pembangunan */}
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-6">
                        <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center">
                            <MIcon name="target" className="text-xl mr-2 text-blue-500" />
                            Progress BEP (Break Even Point)
                        </h2>
                        <p className="text-xs text-on-tertiary-container mb-4">
                            Target: menutup biaya pembangunan {formatRupiah(kumbung.bep_target)} dari profit per siklus
                        </p>

                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-on-surface-variant">Progress</span>
                                <span className="font-bold">{kumbung.bep_progress}%</span>
                            </div>
                            <div className="w-full bg-surface-container-high rounded-full h-4">
                                <div
                                    className={`h-4 rounded-full transition-all ${
                                        kumbung.bep_progress >= 100 ? 'bg-emerald-500' : 'bg-blue-500'
                                    }`}
                                    style={{ width: `${Math.min(kumbung.bep_progress, 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-blue-50 rounded-xl">
                                <p className="text-sm text-blue-700">Profit Terkumpul</p>
                                <p className="text-lg font-headline font-bold text-blue-800">
                                    {formatRupiah(kumbung.total_profit_akumulasi)}
                                </p>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-xl">
                                <p className="text-sm text-orange-700">Sisa Target BEP</p>
                                <p className="text-lg font-bold text-orange-800">
                                    {kumbung.bep_sisa > 0 ? formatRupiah(kumbung.bep_sisa) : 'Tercapai!'}
                                </p>
                            </div>
                        </div>

                        {kumbung.bep_siklus && (
                            <div className="mt-4 p-3 bg-surface-container-low rounded-xl flex items-center justify-between text-sm">
                                <span className="text-on-tertiary-container">Estimasi BEP</span>
                                <span className="font-headline font-bold text-on-surface">
                                    ~{kumbung.bep_siklus} siklus ({kumbung.bep_bulan} bulan)
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Baglog Status */}
                    {baglogStats && (
                        <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-6">
                            <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center">
                                <MIcon name="inventory_2" className="text-xl mr-2 text-green-500" />
                                Status Baglog
                            </h2>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center p-3 bg-yellow-50 rounded-xl">
                                    <p className="text-2xl font-bold text-yellow-700">{formatNumber(baglogStats.produksi, 0)}</p>
                                    <p className="text-xs text-on-tertiary-container">Produksi</p>
                                </div>
                                <div className="text-center p-3 bg-emerald-50 rounded-xl">
                                    <p className="text-2xl font-bold text-secondary">{formatNumber(baglogStats.masuk_kumbung, 0)}</p>
                                    <p className="text-xs text-on-tertiary-container">Di Kumbung</p>
                                </div>
                                <div className="text-center p-3 bg-slate-50 rounded-xl">
                                    <p className="text-2xl font-bold text-slate-500">{formatNumber(baglogStats.selesai, 0)}</p>
                                    <p className="text-xs text-on-tertiary-container">Selesai</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Rekap Per Siklus */}
                    {siklusList.length > 0 && siklusList.map((siklus) => (
                        <div key={siklus.kode_batch} className="bg-surface-container-lowest rounded-xl shadow-clinical-sm overflow-hidden">
                            {/* Siklus Header */}
                            <div className={`px-6 py-4 flex items-center justify-between ${
                                siklus.status === 'selesai' ? 'bg-slate-50' :
                                siklus.status === 'masuk_kumbung' ? 'bg-emerald-50' : 'bg-yellow-50'
                            }`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                        siklus.status === 'selesai' ? 'bg-slate-200' :
                                        siklus.status === 'masuk_kumbung' ? 'bg-emerald-200' : 'bg-yellow-200'
                                    }`}>
                                        <span className="font-headline font-extrabold text-sm">S{siklus.siklus}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-headline font-bold text-on-surface">
                                            Siklus {siklus.siklus}
                                            <span className="ml-2 text-xs font-medium text-on-tertiary-container">
                                                ({siklus.kode_batch})
                                            </span>
                                        </h3>
                                        <p className="text-xs text-on-tertiary-container">
                                            {siklus.tanggal_tanam_formatted || '-'} • {formatNumber(siklus.jumlah_baglog, 0)} baglog
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                        siklus.status === 'selesai' ? 'bg-slate-200 text-slate-600' :
                                        siklus.status === 'masuk_kumbung' ? 'bg-emerald-200 text-emerald-700' :
                                        'bg-yellow-200 text-yellow-700'
                                    }`}>
                                        {siklus.status === 'masuk_kumbung' ? 'Berjalan' : siklus.status === 'selesai' ? 'Selesai' : siklus.status}
                                    </span>
                                </div>
                            </div>

                            {/* Siklus Stats */}
                            <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-outline-variant/10">
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-on-tertiary-container font-bold">Total Panen</p>
                                    <p className="text-lg font-headline font-extrabold text-on-surface">{formatNumber(siklus.total_kg)} kg</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-on-tertiary-container font-bold">Pendapatan</p>
                                    <p className="text-lg font-headline font-extrabold text-secondary">{formatRupiah(siklus.total_pendapatan)}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-on-tertiary-container font-bold">Biaya Baglog</p>
                                    <p className="text-lg font-headline font-extrabold text-red-500">- {formatRupiah(siklus.biaya_baglog)}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-on-tertiary-container font-bold">
                                        {siklus.status === 'selesai' ? 'Profit' : 'Profit (sementara)'}
                                    </p>
                                    <p className={`text-lg font-headline font-extrabold ${siklus.profit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                        {siklus.profit >= 0 ? '+' : ''}{formatRupiah(siklus.profit)}
                                    </p>
                                </div>
                            </div>

                            {/* Panen Table */}
                            {siklus.panens.length > 0 && (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-surface-container-low">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-[10px] font-bold text-on-tertiary-container uppercase tracking-wider">Mgg</th>
                                                <th className="px-4 py-2 text-left text-[10px] font-bold text-on-tertiary-container uppercase tracking-wider">Tanggal</th>
                                                <th className="px-4 py-2 text-right text-[10px] font-bold text-on-tertiary-container uppercase tracking-wider">Kg</th>
                                                <th className="px-4 py-2 text-right text-[10px] font-bold text-on-tertiary-container uppercase tracking-wider">Layak Jual</th>
                                                <th className="px-4 py-2 text-right text-[10px] font-bold text-on-tertiary-container uppercase tracking-wider">Reject</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-outline-variant/10">
                                            {siklus.panens.map((panen, idx) => (
                                                <tr key={panen.id} className="hover:bg-surface-container-low transition-colors">
                                                    <td className="px-4 py-2.5 text-xs text-on-tertiary-container font-medium">{idx + 1}</td>
                                                    <td className="px-4 py-2.5 text-sm text-on-surface-variant">{panen.tanggal_formatted}</td>
                                                    <td className="px-4 py-2.5 text-sm text-right font-bold text-on-surface">{formatNumber(panen.berat_kg)}</td>
                                                    <td className="px-4 py-2.5 text-sm text-right text-secondary">{formatNumber(panen.berat_layak_jual)}</td>
                                                    <td className="px-4 py-2.5 text-sm text-right text-red-500">{formatNumber(panen.berat_reject)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-surface-container-low">
                                            <tr>
                                                <td colSpan="2" className="px-4 py-2.5 text-xs font-bold text-on-surface uppercase">Total</td>
                                                <td className="px-4 py-2.5 text-sm text-right font-extrabold text-on-surface">
                                                    {formatNumber(siklus.panens.reduce((sum, p) => sum + parseFloat(p.berat_kg), 0))}
                                                </td>
                                                <td className="px-4 py-2.5 text-sm text-right font-bold text-secondary">
                                                    {formatNumber(siklus.panens.reduce((sum, p) => sum + parseFloat(p.berat_layak_jual), 0))}
                                                </td>
                                                <td className="px-4 py-2.5 text-sm text-right font-bold text-red-500">
                                                    {formatNumber(siklus.panens.reduce((sum, p) => sum + parseFloat(p.berat_reject), 0))}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Estimasi Profit */}
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-clinical-sm p-6 text-white">
                        <h3 className="text-lg font-bold mb-4">Estimasi Profit</h3>

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
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-6">
                        <h3 className="text-sm font-medium text-on-surface-variant mb-3">Informasi</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-on-tertiary-container">Harga Jual/kg</span>
                                <span className="font-medium">{formatRupiah(kumbung.harga_jual_per_kg)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-on-tertiary-container">Umur Baglog</span>
                                <span className="font-medium">{kumbung.umur_baglog_bulan || 5} bulan</span>
                            </div>
                            {kumbung.target_panen_kg > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-on-tertiary-container">Target Panen</span>
                                    <span className="font-medium">{formatNumber(kumbung.target_panen_kg)} kg</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-6">
                        <h3 className="text-sm font-medium text-on-surface-variant mb-3">Aksi Cepat</h3>
                        <div className="space-y-2">
                            {kumbung.baglog_aktif > 0 ? (
                                <Link
                                    href="/panen/create"
                                    className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
                                >
                                    <span className="text-sm text-secondary">Tambah Panen</span>
                                    <MIcon name="add_circle" className="text-xl text-secondary" />
                                </Link>
                            ) : (
                                <div className="p-3 bg-slate-50 rounded-xl">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-400">Tambah Panen</span>
                                        <MIcon name="info" className="text-base text-slate-400" />
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-1">Belum ada baglog masuk kumbung</p>
                                </div>
                            )}
                            <Link
                                href="/baglog"
                                className="flex items-center justify-between p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                            >
                                <span className="text-sm text-blue-700">Kelola Baglog</span>
                                <MIcon name="inventory_2" className="text-xl text-blue-600" />
                            </Link>
                            <Link
                                href="/monitoring-kumbung/create"
                                className="flex items-center justify-between p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
                            >
                                <span className="text-sm text-purple-700">Monitoring</span>
                                <MIcon name="show_chart" className="text-xl text-purple-600" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
