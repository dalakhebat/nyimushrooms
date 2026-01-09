import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function MonitoringKumbungEdit({ monitoring, kumbungs, karyawans }) {
    const { data, setData, put, processing, errors } = useForm({
        kumbung_id: monitoring.kumbung_id || '',
        tanggal: monitoring.tanggal?.split('T')[0] || '',
        waktu: monitoring.waktu || '',
        suhu: monitoring.suhu || '',
        kelembaban: monitoring.kelembaban || '',
        kondisi_baglog: monitoring.kondisi_baglog || 'baik',
        sudah_spray: monitoring.sudah_spray || false,
        sudah_siram: monitoring.sudah_siram || false,
        catatan: monitoring.catatan || '',
        karyawan_id: monitoring.karyawan_id || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/monitoring-kumbung/${monitoring.id}`);
    };

    return (
        <AdminLayout title="Edit Monitoring">
            <Head title="Edit Monitoring Kumbung" />

            <div className="max-w-2xl">
                <div className="mb-6">
                    <Link href="/monitoring-kumbung" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
                        <ArrowLeftIcon className="w-4 h-4 mr-1" />
                        Kembali
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">Edit Monitoring</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kumbung</label>
                            <select
                                value={data.kumbung_id}
                                onChange={(e) => setData('kumbung_id', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">Pilih Kumbung</option>
                                {kumbungs.map((k) => (
                                    <option key={k.id} value={k.id}>{k.nomor} - {k.nama}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                                <input type="date" value={data.tanggal} onChange={(e) => setData('tanggal', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Waktu</label>
                                <input type="time" value={data.waktu} onChange={(e) => setData('waktu', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Suhu (°C)</label>
                                <input type="number" value={data.suhu} onChange={(e) => setData('suhu', e.target.value)} step="0.1" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kelembaban (%)</label>
                                <input type="number" value={data.kelembaban} onChange={(e) => setData('kelembaban', e.target.value)} step="0.1" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kondisi Baglog</label>
                            <select value={data.kondisi_baglog} onChange={(e) => setData('kondisi_baglog', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                                <option value="baik">Baik</option>
                                <option value="cukup">Cukup</option>
                                <option value="buruk">Buruk</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-6">
                            <label className="flex items-center">
                                <input type="checkbox" checked={data.sudah_spray} onChange={(e) => setData('sudah_spray', e.target.checked)} className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                                <span className="ml-2 text-sm text-gray-700">Sudah Spray</span>
                            </label>
                            <label className="flex items-center">
                                <input type="checkbox" checked={data.sudah_siram} onChange={(e) => setData('sudah_siram', e.target.checked)} className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                                <span className="ml-2 text-sm text-gray-700">Sudah Siram</span>
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Petugas</label>
                            <select value={data.karyawan_id} onChange={(e) => setData('karyawan_id', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                                <option value="">Pilih Petugas</option>
                                {karyawans.map((k) => (<option key={k.id} value={k.id}>{k.nama}</option>))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                            <textarea value={data.catatan} onChange={(e) => setData('catatan', e.target.value)} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-4">
                            <Link href="/monitoring-kumbung" className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Batal</Link>
                            <button type="submit" disabled={processing} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50">{processing ? 'Menyimpan...' : 'Update'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
