import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
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

export default function KumbungIndex({ kumbungs, summary }) {
    const [deleting, setDeleting] = useState(null);

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus kumbung ini?')) {
            setDeleting(id);
            router.delete('/kumbung/' + id, {
                onFinish: () => setDeleting(null),
            });
        }
    };

    const getStatusBadge = (status) => {
        if (status === 'aktif') {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-primary">
                    Aktif
                </span>
            );
        }
        return (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-surface-container-low text-on-surface">
                Nonaktif
            </span>
        );
    };

    const getRoiBadge = (roi) => {
        if (roi === null || roi === undefined) {
            return <span className="text-slate-400">-</span>;
        }
        if (roi >= 0) {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-primary">
                    {formatNumber(roi, 1)}%
                </span>
            );
        }
        return (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                {formatNumber(roi, 1)}%
            </span>
        );
    };

    return (
        <AdminLayout title="Kumbung">
            <Head title="Kumbung" />

            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-on-tertiary-container">Total Kumbung</p>
                                <p className="text-xl font-bold text-on-surface">{summary.total_kumbung}</p>
                            </div>
                            <MIcon name="house" className="text-3xl text-green-500" />
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-on-tertiary-container">Total Kapasitas</p>
                                <p className="text-xl font-bold text-on-surface">{formatNumber(summary.total_kapasitas, 0)}</p>
                            </div>
                            <MIcon name="inventory_2" className="text-3xl text-blue-500" />
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-on-tertiary-container">Baglog Aktif</p>
                                <p className="text-xl font-bold text-on-surface">{formatNumber(summary.total_baglog_aktif, 0)}</p>
                            </div>
                            <MIcon name="eco" className="text-3xl text-emerald-500" />
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-on-tertiary-container">Total Investasi</p>
                                <p className="text-lg font-headline font-bold text-on-surface">{formatRupiah(summary.total_investasi)}</p>
                            </div>
                            <MIcon name="account_balance_wallet" className="text-3xl text-amber-500" />
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-on-tertiary-container">Total Panen</p>
                                <p className="text-xl font-bold text-on-surface">{formatNumber(summary.total_panen)} kg</p>
                            </div>
                            <MIcon name="eco" className="text-3xl text-lime-500" />
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-on-tertiary-container">Total Pendapatan</p>
                                <p className="text-lg font-bold text-secondary">{formatRupiah(summary.total_pendapatan)}</p>
                            </div>
                            <MIcon name="savings" className="text-3xl text-green-500" />
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm">
                <div className="p-6 border-b border-outline-variant/15">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <MIcon name="house" className="text-2xl text-secondary mr-2" />
                            <h2 className="text-lg font-headline font-bold text-on-surface">
                                Daftar Kumbung
                            </h2>
                        </div>
                        <Link
                            href="/kumbung/create"
                            className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary transition-colors"
                        >
                            <MIcon name="add_circle" className="text-xl mr-1" />
                            Tambah Kumbung
                        </Link>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-surface-container-low">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase tracking-wider">
                                    Kumbung
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase tracking-wider">
                                    Kapasitas
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase tracking-wider">
                                    Investasi
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase tracking-wider">
                                    Panen
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase tracking-wider">
                                    Pendapatan
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase tracking-wider">
                                    ROI
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-on-tertiary-container uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {kumbungs.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-on-tertiary-container">
                                        Belum ada data kumbung
                                    </td>
                                </tr>
                            ) : (
                                kumbungs.map((kumbung) => (
                                    <tr key={kumbung.id} className="hover:bg-surface-container-low">
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div>
                                                <p className="text-sm font-medium text-on-surface">{kumbung.nama}</p>
                                                <p className="text-xs text-on-tertiary-container">{kumbung.nomor}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div>
                                                <p className="text-sm text-on-surface">
                                                    {formatNumber(kumbung.baglog_aktif, 0)} / {formatNumber(kumbung.kapasitas_baglog, 0)}
                                                </p>
                                                <p className="text-xs text-on-tertiary-container">
                                                    {kumbung.kapasitas_baglog > 0
                                                        ? `${Math.round((kumbung.baglog_aktif / kumbung.kapasitas_baglog) * 100)}% terisi`
                                                        : '-'
                                                    }
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div>
                                                <p className="text-sm text-on-surface">{formatRupiah(kumbung.total_investasi)}</p>
                                                {kumbung.biaya_pembangunan > 0 && (
                                                    <p className="text-xs text-on-tertiary-container">
                                                        Bangun: {formatRupiah(kumbung.biaya_pembangunan)}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div>
                                                <p className="text-sm text-on-surface">{formatNumber(kumbung.total_panen)} kg</p>
                                                {kumbung.sisa_target_bep > 0 && (
                                                    <p className="text-xs text-orange-600">
                                                        BEP: {formatNumber(kumbung.sisa_target_bep)} kg lagi
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <p className="text-sm font-medium text-secondary">
                                                {formatRupiah(kumbung.pendapatan_panen)}
                                            </p>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            {getRoiBadge(kumbung.roi)}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            {getStatusBadge(kumbung.status)}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex items-center justify-end space-x-1">
                                                <Link
                                                    href={'/kumbung/' + kumbung.id}
                                                    className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-colors"
                                                    title="Lihat Detail"
                                                >
                                                    <MIcon name="visibility" className="text-xl" />
                                                </Link>
                                                <Link
                                                    href={'/kumbung/' + kumbung.id + '/edit'}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                                    title="Edit"
                                                >
                                                    <MIcon name="edit" className="text-xl" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(kumbung.id)}
                                                    disabled={deleting === kumbung.id}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                                                    title="Hapus"
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
