import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Icon } from '@iconify/react';

export default function KumbungIndex({ kumbungs }) {
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

    return (
        <AdminLayout title="Kumbung">
            <Head title="Kumbung" />

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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nomor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nama
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kapasitas
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Umur (Hari)
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {kumbungs.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        Belum ada data kumbung
                                    </td>
                                </tr>
                            ) : (
                                kumbungs.map((kumbung) => (
                                    <tr key={kumbung.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {kumbung.nomor}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {kumbung.nama}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {kumbung.kapasitas_baglog} baglog
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(kumbung.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {kumbung.umur_hari !== null ? kumbung.umur_hari + ' hari' : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={'/kumbung/' + kumbung.id + '/edit'}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Icon icon="solar:pen-bold" className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(kumbung.id)}
                                                    disabled={deleting === kumbung.id}
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
