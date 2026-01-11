import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Icon } from '@iconify/react';

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
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Aktif
                </span>
            );
        }
        return (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                Nonaktif
            </span>
        );
    };

    const getRoiBadge = (roi) => {
        if (roi === null || roi === undefined) {
            return <span className="text-gray-400">-</span>;
        }
        if (roi >= 0) {
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
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
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500">Total Kumbung</p>
                                <p className="text-xl font-bold text-gray-800">{summary.total_kumbung}</p>
                            </div>
                            <Icon icon="solar:home-2-bold" className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500">Total Kapasitas</p>
                                <p className="text-xl font-bold text-gray-800">{formatNumber(summary.total_kapasitas, 0)}</p>
                            </div>
                            <Icon icon="solar:box-bold" className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500">Baglog Aktif</p>
                                <p className="text-xl font-bold text-gray-800">{formatNumber(summary.total_baglog_aktif, 0)}</p>
                            </div>
                            <Icon icon="solar:leaf-bold" className="w-8 h-8 text-emerald-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500">Total Investasi</p>
                                <p className="text-lg font-bold text-gray-800">{formatRupiah(summary.total_investasi)}</p>
                            </div>
                            <Icon icon="solar:wallet-bold" className="w-8 h-8 text-amber-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500">Total Panen</p>
                                <p className="text-xl font-bold text-gray-800">{formatNumber(summary.total_panen)} kg</p>
                            </div>
                            <Icon icon="solar:leaf-bold" className="w-8 h-8 text-lime-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500">Total Pendapatan</p>
                                <p className="text-lg font-bold text-green-600">{formatRupiah(summary.total_pendapatan)}</p>
                            </div>
                            <Icon icon="solar:money-bag-bold" className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Icon icon="solar:home-2-bold" className="w-6 h-6 text-green-600 mr-2" />
                            <h2 className="text-lg font-semibold text-gray-800">
                                Daftar Kumbung
                            </h2>
                        </div>
                        <Link
                            href="/kumbung/create"
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Icon icon="solar:add-circle-bold" className="w-5 h-5 mr-1" />
                            Tambah Kumbung
                        </Link>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kumbung
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kapasitas
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Investasi
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Panen
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Pendapatan
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ROI
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {kumbungs.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                        Belum ada data kumbung
                                    </td>
                                </tr>
                            ) : (
                                kumbungs.map((kumbung) => (
                                    <tr key={kumbung.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{kumbung.nama}</p>
                                                <p className="text-xs text-gray-500">{kumbung.nomor}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div>
                                                <p className="text-sm text-gray-900">
                                                    {formatNumber(kumbung.baglog_aktif, 0)} / {formatNumber(kumbung.kapasitas_baglog, 0)}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {kumbung.kapasitas_baglog > 0
                                                        ? `${Math.round((kumbung.baglog_aktif / kumbung.kapasitas_baglog) * 100)}% terisi`
                                                        : '-'
                                                    }
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div>
                                                <p className="text-sm text-gray-900">{formatRupiah(kumbung.total_investasi)}</p>
                                                {kumbung.biaya_pembangunan > 0 && (
                                                    <p className="text-xs text-gray-500">
                                                        Bangun: {formatRupiah(kumbung.biaya_pembangunan)}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div>
                                                <p className="text-sm text-gray-900">{formatNumber(kumbung.total_panen)} kg</p>
                                                {kumbung.sisa_target_bep > 0 && (
                                                    <p className="text-xs text-orange-600">
                                                        BEP: {formatNumber(kumbung.sisa_target_bep)} kg lagi
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <p className="text-sm font-medium text-green-600">
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
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="Lihat Detail"
                                                >
                                                    <Icon icon="solar:eye-bold" className="w-5 h-5" />
                                                </Link>
                                                <Link
                                                    href={'/kumbung/' + kumbung.id + '/edit'}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Icon icon="solar:pen-bold" className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(kumbung.id)}
                                                    disabled={deleting === kumbung.id}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Hapus"
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
