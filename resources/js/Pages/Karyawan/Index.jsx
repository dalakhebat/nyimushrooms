import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';
import { formatRupiah } from '@/Utils/format';

export default function KaryawanIndex({ karyawans, filters, summary }) {
    const [filterOpen, setFilterOpen] = useState(false);
    const [deleting, setDeleting] = useState(null);

    const [filterData, setFilterData] = useState({
        search: filters.search || '',
        status: filters.status || '',
        tipe_gaji: filters.tipe_gaji || '',
        bagian: filters.bagian || '',
        sort_by: filters.sort_by || 'nama',
        sort_dir: filters.sort_dir || 'asc',
    });

    const handleFilter = (e) => {
        e.preventDefault();
        router.get('/karyawan', filterData, { preserveState: true });
    };

    const handleReset = () => {
        setFilterData({ search: '', status: '', tipe_gaji: '', bagian: '', sort_by: 'nama', sort_dir: 'asc' });
        router.get('/karyawan');
    };

    const handleSort = (sortBy) => {
        let newDir = 'asc';
        if (filterData.sort_by === sortBy && filterData.sort_dir === 'asc') {
            newDir = 'desc';
        }
        const newFilterData = { ...filterData, sort_by: sortBy, sort_dir: newDir };
        setFilterData(newFilterData);
        router.get('/karyawan', newFilterData, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus karyawan ini?')) {
            setDeleting(id);
            router.delete('/karyawan/' + id, {
                onFinish: () => setDeleting(null),
            });
        }
    };

    const getTipeGajiLabel = (tipe) => {
        const labels = {
            mingguan: 'Mingguan',
            bulanan: 'Bulanan',
            borongan: 'Borongan',
        };
        return labels[tipe] || tipe;
    };

    const getTipeGajiBadgeClass = (tipe) => {
        const classes = {
            mingguan: 'bg-blue-100 text-blue-700',
            bulanan: 'bg-purple-100 text-purple-700',
            borongan: 'bg-orange-100 text-orange-700',
        };
        return classes[tipe] || 'bg-surface-container-low text-on-surface-variant';
    };

    return (
        <AdminLayout title="Karyawan">
            <Head title="Karyawan" />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-secondary p-3 rounded-xl">
                            <MIcon name="groups" className="text-2xl text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-on-tertiary-container">Karyawan Aktif</p>
                            <p className="text-2xl font-bold text-on-surface">{summary.totalAktif}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-gray-400 p-3 rounded-xl">
                            <MIcon name="groups" className="text-2xl text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-on-tertiary-container">Karyawan Nonaktif</p>
                            <p className="text-2xl font-bold text-on-surface">{summary.totalNonaktif}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm">
                <div className="p-6 border-b border-outline-variant/15">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <MIcon name="groups" className="text-2xl text-orange-600 mr-2" />
                            <h2 className="text-lg font-headline font-bold text-on-surface">Data Karyawan</h2>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setFilterOpen(!filterOpen)}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-on-surface-variant bg-surface-container-low rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                <MIcon name="filter_list" className="text-xl mr-1" />
                                Filter
                            </button>
                            <Link
                                href="/karyawan/create"
                                className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary transition-colors"
                            >
                                <MIcon name="add_circle" className="text-xl mr-1" />
                                Tambah Karyawan
                            </Link>
                        </div>
                    </div>

                    {/* Filter Form */}
                    {filterOpen && (
                        <form onSubmit={handleFilter} className="mt-4 p-4 bg-surface-container-low rounded-xl">
                            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                        Cari Nama
                                    </label>
                                    <div className="relative">
                                        <MIcon name="search" className="text-base absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={filterData.search}
                                            onChange={(e) => setFilterData({ ...filterData, search: e.target.value })}
                                            placeholder="Nama karyawan..."
                                            className="w-full pl-9 pr-3 py-2 border border-outline-variant/30 rounded-xl text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                        Bagian
                                    </label>
                                    <select
                                        value={filterData.bagian}
                                        onChange={(e) => setFilterData({ ...filterData, bagian: e.target.value })}
                                        className="w-full px-3 py-2 border border-outline-variant/30 rounded-xl text-sm"
                                    >
                                        <option value="">Semua Bagian</option>
                                        <option value="KANTOR">Kantor</option>
                                        <option value="UMUM">Umum</option>
                                        <option value="PANEN">Panen</option>
                                        <option value="BIBIT">Bibit</option>
                                        <option value="PENGAYAKAN">Pengayakan</option>
                                        <option value="PENGADUKAN">Pengadukan</option>
                                        <option value="PENGANTONGAN">Pengantongan</option>
                                        <option value="AUTOCLOVE">Autoclove</option>
                                        <option value="STEAMER">Steamer</option>
                                        <option value="INOKULASI">Inokulasi</option>
                                        <option value="INKUBASI 2">Inkubasi 2</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                        Urutkan
                                    </label>
                                    <select
                                        value={`${filterData.sort_by}-${filterData.sort_dir}`}
                                        onChange={(e) => {
                                            const [sortBy, sortDir] = e.target.value.split('-');
                                            setFilterData({ ...filterData, sort_by: sortBy, sort_dir: sortDir });
                                        }}
                                        className="w-full px-3 py-2 border border-outline-variant/30 rounded-xl text-sm"
                                    >
                                        <option value="nama-asc">Nama (A-Z)</option>
                                        <option value="nama-desc">Nama (Z-A)</option>
                                        <option value="nominal_gaji-desc">Gaji Tertinggi</option>
                                        <option value="nominal_gaji-asc">Gaji Terendah</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={filterData.status}
                                        onChange={(e) => setFilterData({ ...filterData, status: e.target.value })}
                                        className="w-full px-3 py-2 border border-outline-variant/30 rounded-xl text-sm"
                                    >
                                        <option value="">Semua Status</option>
                                        <option value="aktif">Aktif</option>
                                        <option value="nonaktif">Nonaktif</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                        Tipe Gaji
                                    </label>
                                    <select
                                        value={filterData.tipe_gaji}
                                        onChange={(e) => setFilterData({ ...filterData, tipe_gaji: e.target.value })}
                                        className="w-full px-3 py-2 border border-outline-variant/30 rounded-xl text-sm"
                                    >
                                        <option value="">Semua Tipe</option>
                                        <option value="mingguan">Mingguan</option>
                                        <option value="bulanan">Bulanan</option>
                                        <option value="borongan">Borongan</option>
                                    </select>
                                </div>
                                <div className="flex items-end space-x-2">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary"
                                    >
                                        Terapkan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="px-4 py-2 bg-gray-200 text-on-surface-variant text-sm font-medium rounded-xl hover:bg-gray-300"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-surface-container-low">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase tracking-wider">
                                    Nama
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase tracking-wider">
                                    Bagian
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase tracking-wider">
                                    No. HP
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase tracking-wider">
                                    Tipe Gaji
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase tracking-wider">
                                    Nominal
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-on-tertiary-container uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {karyawans.data.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-on-tertiary-container">
                                        Belum ada data karyawan
                                    </td>
                                </tr>
                            ) : (
                                karyawans.data.map((karyawan) => (
                                    <tr key={karyawan.id} className="hover:bg-surface-container-low">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <p className="text-sm font-medium text-on-surface">{karyawan.nama}</p>
                                                <p className="text-xs text-on-tertiary-container">
                                                    Masuk: {karyawan.tanggal_masuk_formatted}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-surface-container-low text-on-surface-variant">
                                                {karyawan.bagian || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                                            {karyawan.no_hp || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTipeGajiBadgeClass(karyawan.tipe_gaji)}`}>
                                                {getTipeGajiLabel(karyawan.tipe_gaji)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">
                                            {formatRupiah(karyawan.nominal_gaji)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                karyawan.status === 'aktif'
                                                    ? 'bg-emerald-100 text-secondary'
                                                    : 'bg-surface-container-low text-on-surface-variant'
                                            }`}>
                                                {karyawan.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={'/karyawan/' + karyawan.id + '/edit'}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                                >
                                                    <MIcon name="edit" className="text-xl" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(karyawan.id)}
                                                    disabled={deleting === karyawan.id}
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

                {/* Pagination */}
                {karyawans.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-outline-variant/15">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-on-surface-variant">
                                Menampilkan {karyawans.from} - {karyawans.to} dari {karyawans.total} data
                            </p>
                            <div className="flex space-x-2">
                                {karyawans.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 text-sm rounded ${
                                            link.active
                                                ? 'bg-primary text-white'
                                                : link.url
                                                ? 'bg-surface-container-low text-on-surface-variant hover:bg-gray-200'
                                                : 'bg-surface-container-low text-slate-400 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
