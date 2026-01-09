import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function QrAbsensiHistory({ scans, karyawans, filters }) {
    const [karyawanId, setKaryawanId] = useState(filters.karyawan_id || '');
    const [tanggalDari, setTanggalDari] = useState(filters.tanggal_dari || '');
    const [tanggalSampai, setTanggalSampai] = useState(filters.tanggal_sampai || '');

    const handleFilter = () => {
        router.get('/qr-absensi/history', {
            karyawan_id: karyawanId,
            tanggal_dari: tanggalDari,
            tanggal_sampai: tanggalSampai,
        }, { preserveState: true });
    };

    return (
        <AdminLayout title="Riwayat Absensi QR">
            <Head title="Riwayat Absensi QR" />

            <div className="mb-6">
                <Link href="/qr-absensi" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
                    <ArrowLeftIcon className="w-4 h-4 mr-1" />
                    Kembali
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Riwayat Absensi</h2>
                    <div className="flex flex-wrap gap-3">
                        <select
                            value={karyawanId}
                            onChange={(e) => setKaryawanId(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Semua Karyawan</option>
                            {karyawans.map((k) => (
                                <option key={k.id} value={k.id}>{k.nama}</option>
                            ))}
                        </select>
                        <input
                            type="date"
                            value={tanggalDari}
                            onChange={(e) => setTanggalDari(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="Dari tanggal"
                        />
                        <input
                            type="date"
                            value={tanggalSampai}
                            onChange={(e) => setTanggalSampai(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="Sampai tanggal"
                        />
                        <button
                            onClick={handleFilter}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            <MagnifyingGlassIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Karyawan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jam Masuk</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jam Keluar</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durasi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {scans.data.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        Tidak ada data
                                    </td>
                                </tr>
                            ) : (
                                scans.data.map((scan) => (
                                    <tr key={scan.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {new Date(scan.tanggal).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {scan.karyawan?.nama}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {scan.jam_masuk || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {scan.jam_keluar || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {scan.jam_masuk && scan.jam_keluar ? (() => {
                                                const masuk = new Date(`2000-01-01 ${scan.jam_masuk}`);
                                                const keluar = new Date(`2000-01-01 ${scan.jam_keluar}`);
                                                const diff = Math.floor((keluar - masuk) / 60000);
                                                const jam = Math.floor(diff / 60);
                                                const menit = diff % 60;
                                                return `${jam}j ${menit}m`;
                                            })() : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                scan.status === 'hadir' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {scan.status === 'hadir' ? 'Tepat Waktu' : 'Terlambat'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {scans.links && scans.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                        <div className="flex space-x-1">
                            {scans.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-3 py-1 text-sm rounded ${
                                        link.active ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
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
