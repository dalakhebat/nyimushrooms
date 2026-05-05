import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

// Material Symbol helper
function MIcon({ name, fill, className = '' }) {
    return (
        <span
            className={`material-symbols-outlined ${className}`}
            style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
        >
            {name}
        </span>
    );
}

// Navigation berdasarkan workflow sistem
const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
    { name: 'Dashboard Eksekutif', href: '/dashboard-eksekutif', icon: 'leaderboard' },

    { type: 'section', name: 'Produksi' },
    {
        name: 'Inventory',
        icon: 'inventory_2',
        children: [
            { name: 'Supplier', href: '/supplier', icon: 'domain' },
            { name: 'Bahan Baku', href: '/bahan-baku', icon: 'archive' },
            { name: 'Pembelian Bahan', href: '/pembelian-bahan-baku', icon: 'shopping_cart' },
        ],
    },
    { name: 'Produksi Baglog', href: '/produksi-baglog', icon: 'science' },
    { name: 'Stok Baglog', href: '/baglog', icon: 'layers' },

    { type: 'section', name: 'Budidaya' },
    { name: 'Peta Kumbung', href: '/peta-kumbung', icon: 'map' },
    { name: 'Kumbung', href: '/kumbung', icon: 'house' },
    { name: 'Monitoring', href: '/monitoring-kumbung', icon: 'thermostat' },
    { name: 'Panen', href: '/panen', icon: 'eco' },

    { type: 'section', name: 'Sales' },
    { name: 'Customer', href: '/customer', icon: 'groups' },
    { name: 'Penjualan', href: '/penjualan', icon: 'storefront' },

    { type: 'section', name: 'SDM' },
    { name: 'Karyawan', href: '/karyawan', icon: 'person' },
    {
        name: 'Absensi',
        icon: 'schedule',
        children: [
            { name: 'Absensi Harian', href: '/absensi', icon: 'event_available' },
            { name: 'Absensi Mingguan', href: '/absensi/mingguan', icon: 'date_range' },
            { name: 'QR Code', href: '/qr-absensi', icon: 'qr_code_scanner' },
            { name: 'Rekap Absensi', href: '/absensi/rekap', icon: 'summarize' },
        ],
    },
    {
        name: 'Penggajian',
        icon: 'account_balance_wallet',
        children: [
            { name: 'Proses Gaji', href: '/penggajian/create', icon: 'credit_card' },
            { name: 'Riwayat Gaji', href: '/penggajian', icon: 'receipt_long' },
            { name: 'Pengaturan Upah', href: '/pengaturan-gaji', icon: 'tune' },
        ],
    },
    { name: 'Kasbon', href: '/kasbon', icon: 'payments' },
    { name: 'KPI Karyawan', href: '/kpi', icon: 'leaderboard' },

    { type: 'section', name: 'Keuangan' },
    { name: 'Kas', href: '/kas', icon: 'account_balance' },
    { name: 'Pengajuan', href: '/pengajuan', icon: 'request_quote' },
    { name: 'Laporan', href: '/laporan', icon: 'analytics' },
    {
        name: 'Perencanaan',
        icon: 'calculate',
        children: [
            { name: 'Simulasi Kredit', href: '/keuangan/simulasi-kredit', icon: 'show_chart' },
            { name: 'Target Operasional', href: '/keuangan/target-operasional', icon: 'target' },
            { name: 'Rekap Pembayaran', href: '/keuangan/rekap-pembayaran', icon: 'checklist' },
            { name: 'Transolindo', href: '/keuangan/transolindo', icon: 'diamond' },
        ],
    },

    { type: 'section', name: 'Sistem' },
    { name: 'Notifikasi', href: '/notifikasi', icon: 'notifications' },
];

export default function AdminLayout({ children, title }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

    const currentPath = window.location.pathname;

    const toggleDropdown = (name) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    const isChildActive = (children) => {
        return children?.some(child => currentPath.startsWith(child.href));
    };

    return (
        <div className="min-h-screen bg-surface-container-low">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-primary/20 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-50 flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between px-4 py-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl primary-gradient flex items-center justify-center text-white">
                            <MIcon name="biotech" />
                        </div>
                        <div>
                            <p className="font-extrabold text-primary text-sm font-headline">Defila Solusi</p>
                            <p className="text-[10px] text-on-tertiary-container">Mushroom Factory</p>
                        </div>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <MIcon name="close" />
                    </button>
                </div>

                <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
                    {navigation.map((item, index) => (
                        item.type === 'section' ? (
                            <div key={item.name} className={`px-4 pt-6 pb-2 ${index > 0 ? 'mt-1' : ''}`}>
                                <span className="text-[10px] font-bold text-on-tertiary-container uppercase tracking-[0.15em]">
                                    {item.name}
                                </span>
                            </div>
                        ) : item.children ? (
                            <div key={item.name}>
                                <button
                                    onClick={() => toggleDropdown(item.name)}
                                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                                        isChildActive(item.children) || openDropdown === item.name
                                            ? 'bg-white text-secondary shadow-clinical-sm'
                                            : 'text-slate-500 hover:bg-blue-50/50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <MIcon name={item.icon} className="text-xl" />
                                        <span className="font-headline">{item.name}</span>
                                    </div>
                                    <MIcon name="expand_more" className={`text-lg transition-transform duration-200 ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                                </button>
                                {(openDropdown === item.name || isChildActive(item.children)) && (
                                    <div className="mt-1 ml-4 space-y-0.5">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.name}
                                                href={child.href}
                                                className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition-all duration-200 ${
                                                    currentPath === child.href
                                                        ? 'bg-white text-secondary font-semibold shadow-clinical-sm'
                                                        : 'text-slate-400 hover:bg-blue-50/50 hover:text-slate-600'
                                                }`}
                                            >
                                                <MIcon name={child.icon} className="text-lg" />
                                                {child.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 hover:translate-x-1 ${
                                    currentPath.startsWith(item.href)
                                        ? 'bg-white text-secondary shadow-clinical-sm'
                                        : 'text-slate-500 hover:bg-blue-50/50'
                                }`}
                            >
                                <MIcon name={item.icon} className="text-xl" fill={currentPath.startsWith(item.href)} />
                                <span className="font-headline">{item.name}</span>
                            </Link>
                        )
                    ))}
                </nav>
            </div>

            {/* Desktop sidebar */}
            <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 bg-slate-50 border-r border-slate-200/20 z-40">
                {/* Logo */}
                <div className="flex items-center gap-3 px-5 py-6">
                    <div className="w-10 h-10 rounded-xl primary-gradient flex items-center justify-center text-white shadow-clinical">
                        <MIcon name="biotech" />
                    </div>
                    <div>
                        <p className="font-extrabold text-primary text-sm font-headline tracking-tight">Defila Solusi</p>
                        <p className="text-[10px] text-on-tertiary-container">Mushroom Factory</p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
                    {navigation.map((item, index) => (
                        item.type === 'section' ? (
                            <div key={item.name} className={`px-4 pt-6 pb-2 ${index > 0 ? 'mt-1' : ''}`}>
                                <span className="text-[10px] font-bold text-on-tertiary-container uppercase tracking-[0.15em]">
                                    {item.name}
                                </span>
                            </div>
                        ) : item.children ? (
                            <div key={item.name}>
                                <button
                                    onClick={() => toggleDropdown(item.name)}
                                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                                        isChildActive(item.children) || openDropdown === item.name
                                            ? 'bg-white text-secondary shadow-clinical-sm'
                                            : 'text-slate-500 hover:bg-blue-50/50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <MIcon name={item.icon} className="text-xl" />
                                        <span className="font-headline">{item.name}</span>
                                    </div>
                                    <MIcon name="expand_more" className={`text-lg transition-transform duration-200 ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                                </button>
                                {(openDropdown === item.name || isChildActive(item.children)) && (
                                    <div className="mt-1 ml-4 space-y-0.5">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.name}
                                                href={child.href}
                                                className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition-all duration-200 hover:translate-x-1 ${
                                                    currentPath === child.href
                                                        ? 'bg-white text-secondary font-semibold shadow-clinical-sm'
                                                        : 'text-slate-400 hover:bg-blue-50/50 hover:text-slate-600'
                                                }`}
                                            >
                                                <MIcon name={child.icon} className="text-lg" />
                                                {child.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 hover:translate-x-1 ${
                                    currentPath.startsWith(item.href)
                                        ? 'bg-white text-secondary shadow-clinical-sm'
                                        : 'text-slate-500 hover:bg-blue-50/50'
                                }`}
                            >
                                <MIcon name={item.icon} className="text-xl" fill={currentPath.startsWith(item.href)} />
                                <span className="font-headline">{item.name}</span>
                            </Link>
                        )
                    ))}
                </nav>

                {/* Bottom actions */}
                <div className="p-4 border-t border-slate-200/20 space-y-1">
                    <Link href="/panen/create" className="block w-full primary-gradient text-white font-headline text-sm font-bold py-3 rounded-xl shadow-clinical text-center hover:opacity-90 active:scale-[0.98] transition-all">
                        Input Panen Baru
                    </Link>
                </div>
            </aside>

            {/* Top Nav Bar */}
            <header className="lg:ml-64 sticky top-0 z-30 bg-white/70 backdrop-blur-xl shadow-clinical">
                <div className="flex justify-between items-center w-full px-6 h-16">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 text-slate-500 hover:bg-blue-50/50 rounded-xl transition-all"
                        >
                            <MIcon name="menu" />
                        </button>
                        <div>
                            <h1 className="text-lg font-headline font-extrabold text-on-surface tracking-tight">{title || 'Dashboard'}</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/notifikasi" className="p-2 text-slate-500 hover:bg-blue-50/50 rounded-full transition-all active:scale-95 duration-200">
                            <MIcon name="notifications" />
                        </Link>
                        <button className="p-2 text-slate-500 hover:bg-blue-50/50 rounded-full transition-all active:scale-95 duration-200">
                            <MIcon name="settings" />
                        </button>

                        {/* User menu */}
                        <div className="relative ml-2">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                            >
                                <div className="w-8 h-8 rounded-full primary-gradient flex items-center justify-center text-white text-xs font-bold">
                                    {auth.user.name?.charAt(0)}
                                </div>
                            </button>

                            {userMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                                    <div className="absolute right-0 mt-3 w-56 bg-surface-container-lowest rounded-xl shadow-clinical-lg py-2 z-20 border border-outline-variant/15">
                                        <div className="px-4 py-3 border-b border-outline-variant/15">
                                            <p className="font-bold text-sm text-on-surface font-headline">{auth.user.name}</p>
                                            <p className="text-[11px] text-on-tertiary-container">{auth.user.email}</p>
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-blue-50/50 transition-colors"
                                        >
                                            <MIcon name="person" className="text-lg" />
                                            Profile
                                        </Link>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-600 hover:bg-blue-50/50 transition-colors"
                                        >
                                            <MIcon name="logout" className="text-lg" />
                                            Logout
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content canvas */}
            <main className="lg:ml-64 p-6 lg:p-8">
                {children}
            </main>
        </div>
    );
}
