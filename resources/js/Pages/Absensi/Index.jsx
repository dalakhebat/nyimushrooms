import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';

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
            hadir: { class: 'bg-emerald-100 text-secondary', label: 'Hadir' },
            izin: { class: 'bg-blue-100 text-blue-700', label: 'Izin' },
            sakit: { class: 'bg-yellow-100 text-yellow-700', label: 'Sakit' },
            alpha: { class: 'bg-red-100 text-red-700', label: 'Alpha' },
        };
        return badges[status] || { class: 'bg-surface-container-low text-on-surface-variant', label: status };
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
            <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4 mb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-3">
                        <MIcon name="date_range" className="text-2xl text-on-tertiary-container" />
                        <div>
                            <p className="text-sm text-on-tertiary-container">Tanggal Absensi</p>
                            <p className="text-lg font-headline font-bold text-on-surface">{formatTanggal(tanggal)}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <input
                            type="date"
                            value={tanggal}
                            onChange={handleDateChange}
                            className="px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-green-500"
                        />
                        <Link
                            href="/absensi/rekap"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            <MIcon name="leaderboard" className="text-xl mr-1" />
                            Rekap
                        </Link>
                        <Link
                            href={'/absensi/create?tanggal=' + tanggal}
                            className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary transition-colors"
                        >
                            <MIcon name="add_circle" className="text-xl mr-1" />
                            Input Absensi
                        </Link>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-secondary p-3 rounded-xl flex-shrink-0">
                            <MIcon name="check_circle" className="text-2xl text-white" />
                        </div>
                        <div className="ml-4 min-w-0">
                            <p className="text-sm font-medium text-on-tertiary-container">Hadir</p>
                            <p className="text-2xl font-bold text-on-surface">{summary.hadir}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-blue-500 p-3 rounded-xl flex-shrink-0">
                            <MIcon name="description" className="text-2xl text-white" />
                        </div>
                        <div className="ml-4 min-w-0">
                            <p className="text-sm font-medium text-on-tertiary-container">Izin</p>
                            <p className="text-2xl font-bold text-on-surface">{summary.izin}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-yellow-500 p-3 rounded-xl flex-shrink-0">
                            <MIcon name="warning" className="text-2xl text-white" />
                        </div>
                        <div className="ml-4 min-w-0">
                            <p className="text-sm font-medium text-on-tertiary-container">Sakit</p>
                            <p className="text-2xl font-bold text-on-surface">{summary.sakit}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-red-500 p-3 rounded-xl flex-shrink-0">
                            <MIcon name="close" className="text-2xl text-white" />
                        </div>
                        <div className="ml-4 min-w-0">
                            <p className="text-sm font-medium text-on-tertiary-container">Alpha</p>
                            <p className="text-2xl font-bold text-on-surface">{summary.alpha}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-gray-400 p-3 rounded-xl flex-shrink-0">
                            <MIcon name="schedule" className="text-2xl text-white" />
                        </div>
                        <div className="ml-4 min-w-0">
                            <p className="text-sm font-medium text-on-tertiary-container">Belum Absen</p>
                            <p className="text-2xl font-bold text-on-surface">{summary.belumAbsen}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-purple-500 p-3 rounded-xl flex-shrink-0">
                            <MIcon name="groups" className="text-2xl text-white" />
                        </div>
                        <div className="ml-4 min-w-0">
                            <p className="text-sm font-medium text-on-tertiary-container">Total Aktif</p>
                            <p className="text-2xl font-bold text-on-surface">{summary.totalKaryawanAktif}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm">
                <div className="p-6 border-b border-outline-variant/15">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center">
                            <MIcon name="checklist" className="text-2xl text-blue-600 mr-3" />
                            <h2 className="text-lg font-headline font-bold text-on-surface">Data Absensi</h2>
                        </div>
                        <form onSubmit={handleSearch} className="flex items-center gap-2">
                            <div className="relative">
                                <MIcon name="search" className="text-base absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari nama karyawan..."
                                    className="pl-9 pr-3 py-2 border border-outline-variant/30 rounded-xl text-sm focus:ring-2 focus:ring-secondary focus:border-green-500 w-64"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary"
                            >
                                Cari
                            </button>
                            {search && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="px-4 py-2 bg-gray-200 text-on-surface-variant text-sm font-medium rounded-xl hover:bg-gray-300"
                                >
                                    Reset
                                </button>
                            )}
                        </form>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-surface-container-low">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase tracking-wider">
                                    Karyawan
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase tracking-wider">
                                    Catatan
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-on-tertiary-container uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {absensis.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-on-tertiary-container">
                                        Belum ada data absensi untuk tanggal ini
                                    </td>
                                </tr>
                            ) : (
                                absensis.map((absensi) => (
                                    <tr key={absensi.id} className="hover:bg-surface-container-low">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-sm font-medium text-on-surface">
                                                {absensi.karyawan?.nama || '-'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(absensi.status).class}`}>
                                                {getStatusBadge(absensi.status).label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-on-tertiary-container max-w-xs truncate">
                                            {absensi.catatan || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={'/absensi/' + absensi.id + '/edit'}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                                >
                                                    <MIcon name="edit" className="text-xl" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(absensi.id)}
                                                    disabled={deleting === absensi.id}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                                                >
                                                    <MIcon name="delete" className="text-xl" />
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
