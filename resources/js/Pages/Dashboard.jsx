import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import MIcon from '@/Components/MIcon';
import { formatBerat, formatNumber } from '@/Utils/format';

export default function Dashboard({ stats, recentPanen = [], recentNotifikasi = [] }) {
    const s = stats || {
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

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard" />

            {/* Content Header */}
            <div className="mb-8 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-1">Production Hub</h1>
                    <p className="text-on-tertiary-container text-sm">Real-time monitoring untuk seluruh operasional farm.</p>
                </div>
                <div className="flex gap-3">
                    {s.bahanBakuLowStock > 0 && (
                        <Link href="/bahan-baku" className="bg-error-container text-on-error-container px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
                            <MIcon name="warning" className="text-sm" />
                            {s.bahanBakuLowStock} Stok Rendah
                        </Link>
                    )}
                    <div className="bg-secondary-fixed text-on-secondary-fixed px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                        SYSTEM NORMAL
                    </div>
                </div>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Hero Yield Card */}
                <div className="md:col-span-8 glass-panel rounded-xl shadow-clinical p-8 overflow-hidden relative border border-white/20">
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <span className="text-on-tertiary-container uppercase tracking-widest font-bold text-[10px]">Hasil Panen Bulan Ini</span>
                            <div className="flex items-baseline gap-4 mt-2">
                                <h2 className="text-5xl font-headline font-extrabold text-on-surface tracking-tighter">
                                    {formatBerat(s.totalPanenBulanIni)}
                                </h2>
                            </div>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-8">
                            <div>
                                <p className="text-on-tertiary-container text-xs font-medium mb-1">Panen Hari Ini</p>
                                <p className="text-xl font-headline font-bold text-secondary">{formatBerat(s.totalPanenHariIni)}</p>
                            </div>
                            <div>
                                <p className="text-on-tertiary-container text-xs font-medium mb-1">Kumbung Aktif</p>
                                <p className="text-xl font-headline font-bold text-primary">{s.totalKumbungAktif} Unit</p>
                            </div>
                            <div>
                                <p className="text-on-tertiary-container text-xs font-medium mb-1">Total Baglog</p>
                                <p className="text-xl font-headline font-bold text-on-surface">{formatNumber(s.totalBaglog)}</p>
                            </div>
                        </div>
                    </div>
                    {/* Decorative */}
                    <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-[0.06] pointer-events-none flex items-center justify-center">
                        <MIcon name="mushroom" className="!text-[200px]" fill />
                    </div>
                </div>

                {/* Sensor / Finance Cards */}
                <div className="md:col-span-4 grid grid-cols-1 gap-4">
                    <div className="bg-surface-container-lowest rounded-xl p-5 shadow-clinical flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <MIcon name="trending_up" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-on-tertiary-container font-bold">Income</p>
                                <p className="text-lg font-headline font-extrabold text-on-surface">Rp {formatNumber(s.incomeBulanIni)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest rounded-xl p-5 shadow-clinical flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                                <MIcon name="trending_down" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-on-tertiary-container font-bold">Outcome</p>
                                <p className="text-lg font-headline font-extrabold text-on-surface">Rp {formatNumber(s.outcomeBulanIni)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest rounded-xl p-5 shadow-clinical flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <MIcon name="account_balance" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-on-tertiary-container font-bold">Saldo Kas</p>
                                <p className="text-lg font-headline font-extrabold text-on-surface">Rp {formatNumber(s.saldoKas)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Operational Mini Cards */}
                <div className="md:col-span-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: 'Karyawan', value: s.totalKaryawan, icon: 'groups', color: 'bg-indigo-50 text-indigo-600' },
                        { label: 'Produksi', value: s.produksiDalamProses, icon: 'science', color: 'bg-violet-50 text-violet-600' },
                        { label: 'Monitoring', value: s.monitoringHariIni, icon: 'thermostat', color: 'bg-cyan-50 text-cyan-600' },
                        { label: 'Notifikasi', value: s.notifikasiBelumDibaca, icon: 'notifications_active', color: s.notifikasiBelumDibaca > 0 ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-400' },
                    ].map((item) => (
                        <div key={item.label} className="bg-surface-container-lowest rounded-xl p-5 shadow-clinical flex items-center gap-4 transition-all hover:translate-x-1 duration-200">
                            <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
                                <MIcon name={item.icon} />
                            </div>
                            <div>
                                <p className="text-xl font-headline font-extrabold text-on-surface leading-none">{item.value}</p>
                                <p className="text-[10px] uppercase tracking-wider text-on-tertiary-container font-bold mt-0.5">{item.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Panen List */}
                <div className="md:col-span-8 bg-surface-container-lowest rounded-xl shadow-clinical p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-headline font-bold text-on-surface">Panen Terakhir</h3>
                        <Link href="/panen" className="text-secondary text-xs font-bold hover:underline">Lihat Semua</Link>
                    </div>
                    <div className="space-y-3">
                        {recentPanen.length > 0 ? (
                            recentPanen.map((panen) => (
                                <div key={panen.id} className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl group transition-all hover:translate-x-1 duration-200">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                                        <MIcon name="eco" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <span className="font-bold text-sm text-on-surface">{panen.kumbung?.nomor} - {panen.kumbung?.nama}</span>
                                            <span className="font-headline font-extrabold text-secondary text-sm">{formatBerat(panen.berat_kg)}</span>
                                        </div>
                                        <span className="text-[10px] text-on-tertiary-container font-medium">
                                            {new Date(panen.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <MIcon name="eco" className="!text-5xl text-slate-200 block mx-auto mb-3" />
                                <p className="text-sm text-on-tertiary-container">Belum ada data panen</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Notifications Panel */}
                <div className="md:col-span-4 bg-surface-container-lowest rounded-xl shadow-clinical p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-headline font-bold text-on-surface">Notifikasi</h3>
                        <Link href="/notifikasi" className="text-secondary text-xs font-bold hover:underline">Semua</Link>
                    </div>
                    <div className="space-y-5 flex-1">
                        {recentNotifikasi.length > 0 ? (
                            recentNotifikasi.map((notif) => (
                                <div key={notif.id} className="flex gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        notif.tipe === 'warning' ? 'bg-amber-100' :
                                        notif.tipe === 'danger' ? 'bg-error-container' :
                                        notif.tipe === 'success' ? 'bg-emerald-100' :
                                        'bg-secondary-fixed'
                                    }`}>
                                        <MIcon name={
                                            notif.tipe === 'warning' ? 'warning' :
                                            notif.tipe === 'danger' ? 'error' :
                                            notif.tipe === 'success' ? 'check_circle' : 'info'
                                        } className={`text-lg ${
                                            notif.tipe === 'warning' ? 'text-amber-600' :
                                            notif.tipe === 'danger' ? 'text-error' :
                                            notif.tipe === 'success' ? 'text-secondary' : 'text-secondary'
                                        }`} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-on-surface">{notif.judul}</p>
                                        <p className="text-xs text-on-tertiary-container mt-1">{notif.pesan}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <MIcon name="notifications_none" className="!text-5xl text-slate-200 block mx-auto mb-3" />
                                <p className="text-sm text-on-tertiary-container">Tidak ada notifikasi baru</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="md:col-span-12 bg-surface-container-lowest rounded-xl shadow-clinical p-6">
                    <h3 className="text-lg font-headline font-bold text-on-surface mb-5">Aksi Cepat</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {[
                            { href: '/panen/create', icon: 'scale', label: 'Input Panen', color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
                            { href: '/qr-absensi/scan', icon: 'qr_code_scanner', label: 'Scan Absensi', color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
                            { href: '/monitoring-kumbung/create', icon: 'thermostat', label: 'Monitoring', color: 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100' },
                            { href: '/produksi-baglog/create', icon: 'science', label: 'Produksi', color: 'bg-violet-50 text-violet-600 hover:bg-violet-100' },
                            { href: '/kas/create', icon: 'account_balance', label: 'Transaksi Kas', color: 'bg-amber-50 text-amber-600 hover:bg-amber-100' },
                            { href: '/penjualan/jamur/create', icon: 'mushroom', label: 'Jual Jamur', color: 'bg-pink-50 text-pink-600 hover:bg-pink-100' },
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center justify-center p-5 rounded-xl ${item.color} transition-all hover:translate-x-1 active:scale-95 duration-200`}
                            >
                                <MIcon name={item.icon} className="!text-3xl mb-2" />
                                <span className="text-[11px] font-bold text-center">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
