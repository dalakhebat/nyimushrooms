import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import MIcon from '@/Components/MIcon';

const FEATURES = [
    {
        icon: 'science',
        title: 'Produksi Baglog',
        desc: 'Tracking produksi baglog dari pencampuran media, sterilisasi, inokulasi sampai inkubasi siap salur.',
    },
    {
        icon: 'house',
        title: 'Manajemen Kumbung',
        desc: 'Peta kumbung war-room style, monitoring suhu kelembaban, dan profitability per kumbung.',
    },
    {
        icon: 'eco',
        title: 'Catat Panen Harian',
        desc: 'Input panen jamur per kumbung, lacak yield real-time, dan otomatis sinkron ke laporan keuangan.',
    },
    {
        icon: 'storefront',
        title: 'Penjualan & Customer',
        desc: 'Kelola penjualan baglog & jamur, customer database, dan stok jamur fresh tiap hari.',
    },
    {
        icon: 'groups',
        title: 'Absensi QR & Penggajian',
        desc: 'Absensi karyawan via QR code, perhitungan gaji mingguan otomatis, kasbon, dan slip gaji PDF.',
    },
    {
        icon: 'analytics',
        title: 'Dashboard Eksekutif',
        desc: 'Laporan kas keluar masuk, simulasi kredit, target operasional, dan tracking investasi Transolindo.',
    },
];

const STATS = [
    { value: '24/7', label: 'Sistem Operasional' },
    { value: '6+', label: 'Modul Terintegrasi' },
    { value: '100%', label: 'Paperless Workflow' },
    { value: 'Real-time', label: 'Data & Reporting' },
];

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Defila Solusi Bersama Indonesia — Mushroom Factory" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
                {/* Top nav */}
                <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-outline-variant/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ApplicationLogo className="w-9 h-9" />
                            <div>
                                <p className="font-extrabold text-primary text-sm font-headline tracking-tight leading-tight">
                                    Defila Solusi
                                </p>
                                <p className="text-[10px] text-on-tertiary-container leading-tight">
                                    Mushroom Factory
                                </p>
                            </div>
                        </div>

                        <nav className="hidden md:flex items-center gap-6 text-sm text-on-surface-variant">
                            <a href="#fitur" className="hover:text-primary transition-colors">Fitur</a>
                            <a href="#tentang" className="hover:text-primary transition-colors">Tentang</a>
                            <a href="#kontak" className="hover:text-primary transition-colors">Kontak</a>
                        </nav>

                        <div className="flex items-center gap-2">
                            {auth?.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="px-4 py-2 text-sm text-on-surface-variant hover:text-primary transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/ajukan"
                                        className="px-4 py-2 primary-gradient text-white rounded-xl text-sm font-medium shadow-clinical-sm hover:opacity-90 transition-all inline-flex items-center"
                                    >
                                        <MIcon name="receipt_long" className="text-base mr-1" />
                                        <span className="hidden sm:inline">Form Pengajuan</span>
                                        <span className="sm:hidden">Ajukan</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hero */}
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute -top-32 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
                        <div className="absolute top-40 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 md:pt-20 pb-16 md:pb-24">
                        <div className="grid lg:grid-cols-2 gap-10 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-secondary text-xs font-medium rounded-full border border-emerald-200/60 mb-5">
                                    <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                                    Sistem terintegrasi · Aktif 2026
                                </div>

                                <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary leading-[1.1] tracking-tight">
                                    Solusi Budidaya Jamur{' '}
                                    <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                                        Modern & Terukur
                                    </span>
                                </h1>

                                <p className="mt-5 text-lg text-on-surface-variant max-w-xl leading-relaxed">
                                    Defila Solusi Bersama Indonesia mengelola produksi baglog, kumbung, panen jamur, sampai keuangan dalam satu sistem terpadu.
                                </p>

                                <div className="mt-8 flex flex-wrap gap-3">
                                    <Link
                                        href="/ajukan"
                                        className="px-6 py-3 primary-gradient text-white rounded-xl font-bold shadow-clinical hover:opacity-90 transition-all inline-flex items-center"
                                    >
                                        <MIcon name="receipt_long" className="text-lg mr-2" />
                                        Ajukan Pengeluaran
                                    </Link>
                                    {!auth?.user && (
                                        <Link
                                            href={route('login')}
                                            className="px-6 py-3 bg-white text-primary border-2 border-primary/15 rounded-xl font-bold hover:border-primary/30 transition-all inline-flex items-center"
                                        >
                                            <MIcon name="login" className="text-lg mr-2" />
                                            Login Admin
                                        </Link>
                                    )}
                                </div>

                                <div className="mt-8 flex items-center gap-3 text-xs text-on-tertiary-container">
                                    <MIcon name="verified" className="text-secondary text-base" />
                                    <span>Ribuan baglog tercatat · Multi-kumbung · Real-time monitoring</span>
                                </div>
                            </div>

                            {/* Hero card */}
                            <div className="relative">
                                <div className="absolute inset-0 primary-gradient rounded-3xl blur-2xl opacity-20" />
                                <div className="relative bg-white rounded-3xl shadow-clinical-lg p-6 md:p-8 border border-outline-variant/10">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl primary-gradient flex items-center justify-center text-white">
                                                <MIcon name="biotech" className="text-2xl" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-on-tertiary-container">Production Tracker</p>
                                                <p className="font-bold text-primary">Live Dashboard</p>
                                            </div>
                                        </div>
                                        <span className="text-xs px-2 py-1 bg-emerald-100 text-secondary rounded-full font-medium">
                                            ONLINE
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-5">
                                        <div className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100/60">
                                            <p className="text-xs text-on-tertiary-container">Baglog Aktif</p>
                                            <p className="text-2xl font-extrabold text-primary mt-1">12.450</p>
                                            <p className="text-[10px] text-secondary mt-1 flex items-center gap-1">
                                                <MIcon name="trending_up" className="text-xs" />
                                                +8% bulan ini
                                            </p>
                                        </div>
                                        <div className="p-4 bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100/60">
                                            <p className="text-xs text-on-tertiary-container">Panen Hari Ini</p>
                                            <p className="text-2xl font-extrabold text-secondary mt-1">142 kg</p>
                                            <p className="text-[10px] text-on-tertiary-container mt-1">7 kumbung aktif</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2.5">
                                        {[
                                            { label: 'Kumbung A1', val: '24kg', pct: 85 },
                                            { label: 'Kumbung B2', val: '18kg', pct: 64 },
                                            { label: 'Kumbung C3', val: '21kg', pct: 75 },
                                        ].map((k) => (
                                            <div key={k.label}>
                                                <div className="flex items-center justify-between text-xs mb-1">
                                                    <span className="text-on-surface-variant font-medium">{k.label}</span>
                                                    <span className="text-on-tertiary-container">{k.val}</span>
                                                </div>
                                                <div className="h-2 bg-surface-container-low rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full primary-gradient rounded-full"
                                                        style={{ width: `${k.pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="bg-primary py-10 md:py-14">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
                            {STATS.map((s) => (
                                <div key={s.label}>
                                    <p className="text-3xl md:text-4xl font-extrabold font-headline tracking-tight">
                                        {s.value}
                                    </p>
                                    <p className="text-xs md:text-sm text-blue-200 mt-1">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section id="fitur" className="py-16 md:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="text-center max-w-2xl mx-auto mb-12">
                            <span className="text-xs font-bold text-secondary uppercase tracking-widest">
                                Fitur Lengkap
                            </span>
                            <h2 className="mt-2 font-headline text-3xl md:text-4xl font-extrabold text-primary">
                                Semua kebutuhan operasional dalam satu sistem
                            </h2>
                            <p className="mt-3 text-on-surface-variant">
                                Dari hulu produksi sampai laporan keuangan eksekutif — tidak perlu lompat-lompat aplikasi.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {FEATURES.map((f) => (
                                <div
                                    key={f.title}
                                    className="bg-white rounded-2xl p-6 shadow-clinical-sm border border-outline-variant/10 hover:shadow-clinical hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-secondary mb-4">
                                        <MIcon name={f.icon} className="text-2xl" />
                                    </div>
                                    <h3 className="font-headline font-bold text-lg text-primary mb-1.5">
                                        {f.title}
                                    </h3>
                                    <p className="text-sm text-on-surface-variant leading-relaxed">
                                        {f.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About */}
                <section id="tentang" className="py-16 md:py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <span className="text-xs font-bold text-secondary uppercase tracking-widest">
                                    Tentang Defila
                                </span>
                                <h2 className="mt-2 font-headline text-3xl md:text-4xl font-extrabold text-primary">
                                    Mushroom factory dengan pendekatan data-driven
                                </h2>
                                <p className="mt-4 text-on-surface-variant leading-relaxed">
                                    Defila Solusi Bersama Indonesia bergerak di budidaya jamur tiram skala industri. Kami percaya budidaya modern butuh pencatatan yang rapi — dari setiap baglog yang masuk inkubasi sampai setiap kilogram jamur yang keluar pintu.
                                </p>
                                <p className="mt-3 text-on-surface-variant leading-relaxed">
                                    Sistem internal ini lahir dari kebutuhan operasional sehari-hari: tahu berapa biaya per baglog, berapa yield per kumbung, kapan kumbung paling produktif, dan ke mana kas Defila mengalir.
                                </p>

                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <MIcon name="check_circle" className="text-secondary text-xl mt-0.5" />
                                        <div>
                                            <p className="font-bold text-sm text-primary">Tracking ketat</p>
                                            <p className="text-xs text-on-surface-variant">Setiap baglog & panen tercatat</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MIcon name="check_circle" className="text-secondary text-xl mt-0.5" />
                                        <div>
                                            <p className="font-bold text-sm text-primary">Paperless</p>
                                            <p className="text-xs text-on-surface-variant">Approval & TTD digital</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MIcon name="check_circle" className="text-secondary text-xl mt-0.5" />
                                        <div>
                                            <p className="font-bold text-sm text-primary">Multi-role</p>
                                            <p className="text-xs text-on-surface-variant">Owner, manager, karyawan</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MIcon name="check_circle" className="text-secondary text-xl mt-0.5" />
                                        <div>
                                            <p className="font-bold text-sm text-primary">Cloud-based</p>
                                            <p className="text-xs text-on-surface-variant">Akses dari mana saja</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="aspect-square max-w-md mx-auto relative">
                                    <div className="absolute inset-0 primary-gradient rounded-[2.5rem] rotate-3" />
                                    <div className="absolute inset-2 bg-white rounded-[2.5rem] -rotate-3 flex items-center justify-center p-10 shadow-clinical-lg">
                                        <ApplicationLogo className="w-full h-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section id="kontak" className="py-16 md:py-20">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6">
                        <div className="primary-gradient rounded-3xl p-8 md:p-14 text-center text-white shadow-clinical-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-32 translate-x-32" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-32 -translate-x-32" />

                            <div className="relative">
                                <h2 className="font-headline text-3xl md:text-4xl font-extrabold leading-tight">
                                    Perlu mengajukan pengeluaran?
                                </h2>
                                <p className="mt-3 text-blue-100 max-w-xl mx-auto">
                                    Form pengajuan online — tanpa login, tanpa ribet. Kasih nama, jumlah, keterangan, lalu tanda tangan digital. Cair setelah disetujui management.
                                </p>
                                <div className="mt-7 flex flex-wrap justify-center gap-3">
                                    <Link
                                        href="/ajukan"
                                        className="px-6 py-3 bg-white text-primary rounded-xl font-bold hover:bg-blue-50 transition-all inline-flex items-center"
                                    >
                                        <MIcon name="edit_note" className="text-lg mr-2" />
                                        Buka Form Pengajuan
                                    </Link>
                                    <Link
                                        href="/absensi-publik"
                                        className="px-6 py-3 bg-white/10 backdrop-blur text-white border border-white/20 rounded-xl font-bold hover:bg-white/15 transition-all inline-flex items-center"
                                    >
                                        <MIcon name="qr_code_scanner" className="text-lg mr-2" />
                                        Absensi QR
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-primary text-blue-100 py-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="grid md:grid-cols-3 gap-8 items-start">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                        <ApplicationLogo className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="font-extrabold text-white text-sm font-headline">Defila Solusi</p>
                                        <p className="text-[10px] text-blue-200">Bersama Indonesia</p>
                                    </div>
                                </div>
                                <p className="mt-4 text-xs leading-relaxed max-w-xs">
                                    Mushroom factory & sistem manajemen budidaya jamur modern.
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-white uppercase tracking-widest mb-3">Akses Cepat</p>
                                <ul className="space-y-2 text-xs">
                                    <li><Link href="/ajukan" className="hover:text-white transition-colors">Form Pengajuan Pengeluaran</Link></li>
                                    <li><Link href="/absensi-publik" className="hover:text-white transition-colors">Absensi QR Karyawan</Link></li>
                                    <li><Link href={route('login')} className="hover:text-white transition-colors">Login Admin</Link></li>
                                </ul>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-white uppercase tracking-widest mb-3">Kontak</p>
                                <ul className="space-y-2 text-xs">
                                    <li className="flex items-center gap-2">
                                        <MIcon name="link" className="text-sm" />
                                        defilasolusi.com
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <MIcon name="mail" className="text-sm" />
                                        admin@defilasolusi.com
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3 text-xs">
                            <p>© {new Date().getFullYear()} Defila Solusi Bersama Indonesia. All rights reserved.</p>
                            <p className="text-blue-200/70">Mushroom Factory · Internal System</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
