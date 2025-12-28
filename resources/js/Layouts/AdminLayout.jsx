import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    BuildingStorefrontIcon,
    ScaleIcon,
    UsersIcon,
    ClipboardDocumentCheckIcon,
    BanknotesIcon,
    CubeIcon,
    TruckIcon,
    UserGroupIcon,
    ShoppingCartIcon,
    DocumentChartBarIcon,
    Bars3Icon,
    XMarkIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    ArrowRightOnRectangleIcon,
    UserCircleIcon,
    CurrencyDollarIcon,
    Cog6ToothIcon,
    CalendarDaysIcon,
    ListBulletIcon,
} from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Kumbung', href: '/kumbung', icon: BuildingStorefrontIcon },
    { name: 'Panen', href: '/panen', icon: ScaleIcon },
    { name: 'Karyawan', href: '/karyawan', icon: UsersIcon },
    { name: 'Absensi', href: '/absensi', icon: ClipboardDocumentCheckIcon },
    {
        name: 'Penggajian',
        icon: BanknotesIcon,
        children: [
            { name: 'Input Absensi Mingguan', href: '/absensi/mingguan', icon: CalendarDaysIcon },
            { name: 'Proses Gaji', href: '/penggajian/create', icon: BanknotesIcon },
            { name: 'Riwayat Penggajian', href: '/penggajian', icon: ListBulletIcon },
        ],
    },
    { name: 'Kasbon', href: '/kasbon', icon: CurrencyDollarIcon },
    { name: 'Baglog', href: '/baglog', icon: CubeIcon },
    { name: 'Supplier', href: '/supplier', icon: TruckIcon },
    { name: 'Customer', href: '/customer', icon: UserGroupIcon },
    { name: 'Penjualan', href: '/penjualan', icon: ShoppingCartIcon },
    { name: 'Laporan', href: '/laporan', icon: DocumentChartBarIcon },
    { name: 'Pengaturan Gaji', href: '/pengaturan-gaji', icon: Cog6ToothIcon },
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
        <div className="min-h-screen bg-gray-100">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-green-800 transform transition-transform duration-300 ease-in-out lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between h-16 px-4 bg-green-900">
                    <span className="text-xl font-bold text-white">Nyimushroom</span>
                    <button onClick={() => setSidebarOpen(false)} className="text-white">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <nav className="mt-4 px-2 space-y-1">
                    {navigation.map((item) => (
                        item.children ? (
                            <div key={item.name}>
                                <button
                                    onClick={() => toggleDropdown(item.name)}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                        isChildActive(item.children) || openDropdown === item.name
                                            ? 'bg-green-900 text-white'
                                            : 'text-green-100 hover:bg-green-700'
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <item.icon className="w-5 h-5 mr-3" />
                                        {item.name}
                                    </div>
                                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                                </button>
                                {(openDropdown === item.name || isChildActive(item.children)) && (
                                    <div className="mt-1 ml-4 space-y-1">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.name}
                                                href={child.href}
                                                className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                                                    currentPath === child.href
                                                        ? 'bg-green-700 text-white'
                                                        : 'text-green-200 hover:bg-green-700 hover:text-white'
                                                }`}
                                            >
                                                <child.icon className="w-4 h-4 mr-2" />
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
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    currentPath.startsWith(item.href)
                                        ? 'bg-green-900 text-white'
                                        : 'text-green-100 hover:bg-green-700'
                                }`}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </Link>
                        )
                    ))}
                </nav>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col flex-grow bg-green-800 overflow-y-auto">
                    <div className="flex items-center h-16 px-4 bg-green-900">
                        <span className="text-xl font-bold text-white">Nyimushroom</span>
                    </div>
                    <nav className="mt-4 flex-1 px-2 space-y-1">
                        {navigation.map((item) => (
                            item.children ? (
                                <div key={item.name}>
                                    <button
                                        onClick={() => toggleDropdown(item.name)}
                                        className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                            isChildActive(item.children) || openDropdown === item.name
                                                ? 'bg-green-900 text-white'
                                                : 'text-green-100 hover:bg-green-700'
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <item.icon className="w-5 h-5 mr-3" />
                                            {item.name}
                                        </div>
                                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                                    </button>
                                    {(openDropdown === item.name || isChildActive(item.children)) && (
                                        <div className="mt-1 ml-4 space-y-1">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.name}
                                                    href={child.href}
                                                    className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                                                        currentPath === child.href
                                                            ? 'bg-green-700 text-white'
                                                            : 'text-green-200 hover:bg-green-700 hover:text-white'
                                                    }`}
                                                >
                                                    <child.icon className="w-4 h-4 mr-2" />
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
                                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                        currentPath.startsWith(item.href)
                                            ? 'bg-green-900 text-white'
                                            : 'text-green-100 hover:bg-green-700'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.name}
                                </Link>
                            )
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top header */}
                <header className="sticky top-0 z-30 bg-white shadow">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                            >
                                <Bars3Icon className="w-6 h-6" />
                            </button>
                            <h1 className="ml-2 lg:ml-0 text-xl font-semibold text-gray-800">
                                {title || 'Dashboard'}
                            </h1>
                        </div>

                        {/* User menu */}
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                            >
                                <UserCircleIcon className="w-8 h-8" />
                                <span className="hidden sm:block font-medium">{auth.user.name}</span>
                                <ChevronDownIcon className="w-4 h-4" />
                            </button>

                            {userMenuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setUserMenuOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20">
                                        <Link
                                            href="/profile"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <UserCircleIcon className="w-5 h-5 mr-2" />
                                            Profile
                                        </Link>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                                            Logout
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
