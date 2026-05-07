import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';

const STATUS_BADGES = {
    diajukan: { label: 'Diajukan', className: 'bg-yellow-100 text-yellow-800', icon: 'schedule' },
    disetujui: { label: 'Disetujui', className: 'bg-blue-100 text-blue-800', icon: 'check_circle' },
    cair: { label: 'Cair', className: 'bg-emerald-100 text-secondary', icon: 'done_all' },
    ditolak: { label: 'Ditolak', className: 'bg-red-100 text-red-700', icon: 'cancel' },
};

export default function PengajuanIndex({ pengajuans, summary, kategoris, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [kategori, setKategori] = useState(filters.kategori || '');

    const formatRupiah = (v) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

    const formatDate = (d) =>
        new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    const handleFilter = () => {
        router.get('/pengajuan', { search, status, kategori }, { preserveState: true, replace: true });
    };

    const handleReset = () => {
        setSearch('');
        setStatus('');
        setKategori('');
        router.get('/pengajuan', {}, { preserveState: true, replace: true });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus pengajuan ini?')) {
            router.delete(`/pengajuan/${id}`);
        }
    };

    return (
        <AdminLayout title="Pengajuan Pengeluaran">
            <Head title="Pengajuan Pengeluaran" />

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                    <p className="text-xs text-on-tertiary-container uppercase">Diajukan</p>
                    <p className="text-2xl font-bold text-yellow-700 mt-1">{summary.diajukan}</p>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                    <p className="text-xs text-on-tertiary-container uppercase">Disetujui</p>
                    <p className="text-2xl font-bold text-blue-700 mt-1">{summary.disetujui}</p>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                    <p className="text-xs text-on-tertiary-container uppercase">Cair</p>
                    <p className="text-2xl font-bold text-secondary mt-1">{summary.cair}</p>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                    <p className="text-xs text-on-tertiary-container uppercase">Ditolak</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">{summary.ditolak}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl shadow-clinical-sm p-4 col-span-2 md:col-span-1">
                    <p className="text-xs text-on-tertiary-container uppercase">Cair Bulan Ini</p>
                    <p className="text-lg font-bold text-secondary mt-1">{formatRupiah(summary.totalCairBulanIni)}</p>
                </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm">
                <div className="p-6 border-b border-outline-variant/15">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <h2 className="text-lg font-headline font-bold text-on-surface">Daftar Pengajuan</h2>
                        <Link
                            href="/pengajuan/create"
                            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:opacity-90"
                        >
                            <MIcon name="add" className="text-base mr-1" />
                            Pengajuan Baru
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                            placeholder="Cari nomor / penerima..."
                            className="px-4 py-2 border border-outline-variant/30 rounded-xl text-sm focus:ring-2 focus:ring-secondary"
                        />
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="px-4 py-2 border border-outline-variant/30 rounded-xl text-sm focus:ring-2 focus:ring-secondary"
                        >
                            <option value="">Semua Status</option>
                            <option value="diajukan">Diajukan</option>
                            <option value="disetujui">Disetujui</option>
                            <option value="cair">Cair</option>
                            <option value="ditolak">Ditolak</option>
                        </select>
                        <select
                            value={kategori}
                            onChange={(e) => setKategori(e.target.value)}
                            className="px-4 py-2 border border-outline-variant/30 rounded-xl text-sm focus:ring-2 focus:ring-secondary"
                        >
                            <option value="">Semua Kategori</option>
                            {kategoris.map((k) => (
                                <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>
                            ))}
                        </select>
                        <div className="flex gap-2">
                            <button
                                onClick={handleFilter}
                                className="flex-1 px-4 py-2 bg-secondary text-white rounded-xl text-sm font-medium hover:opacity-90"
                            >
                                Filter
                            </button>
                            <button
                                onClick={handleReset}
                                className="px-4 py-2 bg-surface-container-low text-on-surface-variant rounded-xl text-sm hover:bg-gray-200"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-surface-container-low">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Nomor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Pemohon</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Penerima</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Kategori</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-on-tertiary-container uppercase">Jumlah</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-on-tertiary-container uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-on-tertiary-container uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                            {pengajuans.data.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-on-tertiary-container">
                                        <MIcon name="receipt" className="text-4xl opacity-30" />
                                        <p className="mt-2 text-sm">Belum ada pengajuan</p>
                                    </td>
                                </tr>
                            ) : (
                                pengajuans.data.map((p) => {
                                    const badge = STATUS_BADGES[p.status];
                                    return (
                                        <tr key={p.id} className="hover:bg-surface-container-low/50">
                                            <td className="px-6 py-4 font-mono text-sm font-medium text-on-surface">{p.nomor}</td>
                                            <td className="px-6 py-4 text-sm text-on-surface-variant">{formatDate(p.tanggal_pengajuan)}</td>
                                            <td className="px-6 py-4 text-sm text-on-surface-variant">
                                                {p.pemohon?.name || p.pemohon_nama}
                                                {!p.pemohon_id && (
                                                    <span className="ml-1 text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">PUBLIK</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-on-surface">{p.tujuan_penerima}</td>
                                            <td className="px-6 py-4 text-sm text-on-surface-variant capitalize">{p.kategori}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-on-surface text-right">{formatRupiah(p.jumlah)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${badge.className}`}>
                                                    <MIcon name={badge.icon} className="text-sm mr-1" />
                                                    {badge.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/pengajuan/${p.id}`}
                                                        className="text-secondary hover:text-primary"
                                                        title="Detail"
                                                    >
                                                        <MIcon name="visibility" className="text-base" />
                                                    </Link>
                                                    <a
                                                        href={`/pengajuan/${p.id}/pdf`}
                                                        className="text-blue-600 hover:text-blue-700"
                                                        title="Download PDF"
                                                    >
                                                        <MIcon name="download" className="text-base" />
                                                    </a>
                                                    {p.status !== 'cair' && (
                                                        <button
                                                            onClick={() => handleDelete(p.id)}
                                                            className="text-red-600 hover:text-red-700"
                                                            title="Hapus"
                                                        >
                                                            <MIcon name="delete" className="text-base" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pengajuans.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-outline-variant/15 flex items-center justify-between">
                        <p className="text-sm text-on-surface-variant">
                            Menampilkan {pengajuans.from}-{pengajuans.to} dari {pengajuans.total}
                        </p>
                        <div className="flex gap-2">
                            {pengajuans.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    preserveScroll
                                    className={`px-3 py-1.5 text-sm rounded-lg ${
                                        link.active
                                            ? 'bg-primary text-white'
                                            : link.url
                                            ? 'bg-surface-container-low text-on-surface-variant hover:bg-gray-200'
                                            : 'text-on-tertiary-container opacity-50 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
