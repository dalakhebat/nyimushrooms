import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Icon } from '@iconify/react';

export default function AbsensiIndex({ absensis, filters, summary, today }) {
    const [deleting, setDeleting] = useState(null);
    const [tanggal, setTanggal] = useState(filters.tanggal || today);
    const [search, setSearch] = useState(filters.search || '');

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setTanggal(newDate);
        router.get('/absensi', { tanggal: newDate, search }, { preserveState: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/absensi', { tanggal, search }, { preserveState: true });
    };

    const handleClearSearch = () => {
        setSearch('');
        router.get('/absensi', { tanggal }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus absensi ini?')) {
            setDeleting(id);
            router.delete('/absensi/' + id, {
                onFinish: () => setDeleting(null),
            });
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            hadir: { class: 'bg-green-100 text-green-700', label: 'Hadir' },
            izin: { class: 'bg-blue-100 text-blue-700', label: 'Izin' },
            sakit: { class: 'bg-yellow-100 text-yellow-700', label: 'Sakit' },
            alpha: { class: 'bg-red-100 text-red-700', label: 'Alpha' },
        };
        return badges[status] || { class: 'bg-gray-100 text-gray-700', label: status };
    };

    const formatTanggal = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <AdminLayout title="Absensi">
            <Head title="Absensi" />

            {/* Date Selector */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-3">
                        <Icon icon="solar:calendar-bold" className="w-6 h-6 text-gray-500" />
                        <div>
                            <p className="text-sm text-gray-500">Tanggal Absensi</p>
                            <p className="text-lg font-semibold text-gray-800">{formatTanggal(tanggal)}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <input
                            type="date"
                            value={tanggal}
                            onChange={handleDateChange}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <Link
                            href="/absensi/rekap"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Icon icon="solar:chart-bold" className="w-5 h-5 mr-1" />
                            Rekap
                        </Link>
                        <Link
                            href={'/absensi/create?tanggal=' + tanggal}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Icon icon="solar:add-circle-bold" className="w-5 h-5 mr-1" />
                            Input Absensi
                        </Link>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-green-500 p-3 rounded-lg flex-shrink-0">
                            <Icon icon="solar:check-circle-bold" className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4 min-w-0">
                            <p className="text-sm font-medium text-gray-500">Hadir</p>
                            <p className="text-2xl font-semibold text-gray-900">{summary.hadir}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-blue-500 p-3 rounded-lg flex-shrink-0">
                            <Icon icon="solar:document-bold" className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4 min-w-0">
                            <p className="text-sm font-medium text-gray-500">Izin</p>
                            <p className="text-2xl font-semibold text-gray-900">{summary.izin}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-yellow-500 p-3 rounded-lg flex-shrink-0">
                            <Icon icon="solar:danger-triangle-bold" className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4 min-w-0">
                            <p className="text-sm font-medium text-gray-500">Sakit</p>
                            <p className="text-2xl font-semibold text-gray-900">{summary.sakit}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-red-500 p-3 rounded-lg flex-shrink-0">
                            <Icon icon="solar:close-circle-bold" className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4 min-w-0">
                            <p className="text-sm font-medium text-gray-500">Alpha</p>
                            <p className="text-2xl font-semibold text-gray-900">{summary.alpha}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-gray-400 p-3 rounded-lg flex-shrink-0">
                            <Icon icon="solar:clock-circle-bold" className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4 min-w-0">
                            <p className="text-sm font-medium text-gray-500">Belum Absen</p>
                            <p className="text-2xl font-semibold text-gray-900">{summary.belumAbsen}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-purple-500 p-3 rounded-lg flex-shrink-0">
                            <Icon icon="solar:users-group-rounded-bold" className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4 min-w-0">
                            <p className="text-sm font-medium text-gray-500">Total Aktif</p>
                            <p className="text-2xl font-semibold text-gray-900">{summary.totalKaryawanAktif}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center">
                            <Icon icon="solar:clipboard-check-bold" className="w-6 h-6 text-blue-600 mr-3" />
                            <h2 className="text-lg font-semibold text-gray-800">Data Absensi</h2>
                        </div>
                        <form onSubmit={handleSearch} className="flex items-center gap-2">
                            <div className="relative">
                                <Icon icon="solar:magnifer-bold" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari nama karyawan..."
                                    className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 w-64"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                            >
                                Cari
                            </button>
                            {search && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300"
                                >
                                    Reset
                                </button>
                            )}
                        </form>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Karyawan
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Catatan
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {absensis.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        Belum ada data absensi untuk tanggal ini
                                    </td>
                                </tr>
                            ) : (
                                absensis.map((absensi) => (
                                    <tr key={absensi.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-sm font-medium text-gray-900">
                                                {absensi.karyawan?.nama || '-'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(absensi.status).class}`}>
                                                {getStatusBadge(absensi.status).label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                            {absensi.catatan || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={'/absensi/' + absensi.id + '/edit'}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Icon icon="solar:pen-bold" className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(absensi.id)}
                                                    disabled={deleting === absensi.id}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    <Icon icon="solar:trash-bin-trash-bold" className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
