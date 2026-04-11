import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';

export default function MonitoringKumbungIndex({ monitorings, todayMonitoring, kumbungs, filters }) {
    const [deleting, setDeleting] = useState(null);

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus data monitoring ini?')) {
            setDeleting(id);
            router.delete(`/monitoring-kumbung/${id}`, { onFinish: () => setDeleting(null) });
        }
    };

    const getSuhuStatus = (suhu) => {
        if (!suhu) return { color: 'gray', label: '-' };
        if (suhu >= 24 && suhu <= 28) return { color: 'green', label: 'Optimal' };
        if (suhu >= 20 && suhu <= 32) return { color: 'yellow', label: 'OK' };
        return { color: 'red', label: 'Warning' };
    };

    const getKelembabanStatus = (kelembaban) => {
        if (!kelembaban) return { color: 'gray', label: '-' };
        if (kelembaban >= 80 && kelembaban <= 90) return { color: 'green', label: 'Optimal' };
        if (kelembaban >= 70 && kelembaban <= 95) return { color: 'yellow', label: 'OK' };
        return { color: 'red', label: 'Warning' };
    };

    return (
        <AdminLayout title="Monitoring Kumbung">
            <Head title="Monitoring Kumbung" />

            {/* Today's Status */}
            <div className="mb-6">
                <h3 className="text-lg font-bold text-on-surface mb-3">Status Hari Ini</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {todayMonitoring.map((item) => (
                        <div key={item.kumbung.id} className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium text-on-surface">{item.kumbung.nama}</h4>
                                <span className="text-xs text-on-tertiary-container">{item.kumbung.nomor}</span>
                            </div>
                            {item.monitoring ? (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-on-tertiary-container flex items-center">
                                            <MIcon name="light_mode" className="text-base mr-1" /> Suhu
                                        </span>
                                        <span className={`text-sm font-medium ${
                                            getSuhuStatus(item.monitoring.suhu).color === 'green' ? 'text-secondary' :
                                            getSuhuStatus(item.monitoring.suhu).color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                                        }`}>
                                            {item.monitoring.suhu}°C
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-on-tertiary-container flex items-center">
                                            <MIcon name="cloud" className="text-base mr-1" /> Kelembaban
                                        </span>
                                        <span className={`text-sm font-medium ${
                                            getKelembabanStatus(item.monitoring.kelembaban).color === 'green' ? 'text-secondary' :
                                            getKelembabanStatus(item.monitoring.kelembaban).color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                                        }`}>
                                            {item.monitoring.kelembaban}%
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2 pt-2">
                                        {item.monitoring.sudah_spray && (
                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Spray</span>
                                        )}
                                        {item.monitoring.sudah_siram && (
                                            <span className="px-2 py-0.5 bg-cyan-100 text-cyan-800 text-xs rounded-full">Siram</span>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400">Belum ada data hari ini</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm">
                <div className="p-6 border-b border-outline-variant/15">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-headline font-bold text-on-surface">Riwayat Monitoring</h2>
                        <Link
                            href="/monitoring-kumbung/create"
                            className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary"
                        >
                            <MIcon name="add_circle" className="text-xl mr-1" />
                            Input Monitoring
                        </Link>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-surface-container-low">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Waktu</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Kumbung</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Suhu</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Kelembaban</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Kondisi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Perawatan</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-on-tertiary-container uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {monitorings.data.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-on-tertiary-container">
                                        Belum ada data monitoring
                                    </td>
                                </tr>
                            ) : (
                                monitorings.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-surface-container-low">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                                            {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">{item.waktu}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">{item.kumbung?.nama}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`${
                                                getSuhuStatus(item.suhu).color === 'green' ? 'text-secondary' :
                                                getSuhuStatus(item.suhu).color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                                            }`}>
                                                {item.suhu ? `${item.suhu}°C` : '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`${
                                                getKelembabanStatus(item.kelembaban).color === 'green' ? 'text-secondary' :
                                                getKelembabanStatus(item.kelembaban).color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                                            }`}>
                                                {item.kelembaban ? `${item.kelembaban}%` : '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                item.kondisi_baglog === 'baik' ? 'bg-emerald-100 text-primary' :
                                                item.kondisi_baglog === 'cukup' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {item.kondisi_baglog}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex space-x-1">
                                                {item.sudah_spray && <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Spray</span>}
                                                {item.sudah_siram && <span className="px-2 py-0.5 bg-cyan-100 text-cyan-800 text-xs rounded-full">Siram</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link href={`/monitoring-kumbung/${item.id}/edit`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl">
                                                    <MIcon name="edit" className="text-xl" />
                                                </Link>
                                                <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id} className="p-2 text-red-600 hover:bg-red-50 rounded-xl disabled:opacity-50">
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
