import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';

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
                <Link href="/qr-absensi" className="inline-flex items-center text-sm text-on-surface-variant hover:text-on-surface">
                    <MIcon name="arrow_back" className="text-base mr-1" />
                    Kembali
                </Link>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm">
                <div className="p-6 border-b border-outline-variant/15">
                    <h2 className="text-lg font-bold text-on-surface mb-4">Riwayat Absensi</h2>
                    <div className="flex flex-wrap gap-3">
                        <select
                            value={karyawanId}
                            onChange={(e) => setKaryawanId(e.target.value)}
                            className="px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
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
                            className="px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                            placeholder="Dari tanggal"
                        />
                        <input
                            type="date"
                            value={tanggalSampai}
                            onChange={(e) => setTanggalSampai(e.target.value)}
                            className="px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                            placeholder="Sampai tanggal"
                        />
                        <button
                            onClick={handleFilter}
                            className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary"
                        >
                            <MIcon name="search" className="text-xl" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-surface-container-low">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Karyawan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Jam Masuk</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Jam Keluar</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Durasi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {scans.data.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-on-tertiary-container">
                                        Tidak ada data
                                    </td>
                                </tr>
                            ) : (
                                scans.data.map((scan) => (
                                    <tr key={scan.id} className="hover:bg-surface-container-low">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                                            {new Date(scan.tanggal).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">
                                            {scan.karyawan?.nama}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                                            {scan.jam_masuk || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                                            {scan.jam_keluar || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
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
                                                scan.status === 'hadir' ? 'bg-emerald-100 text-primary' : 'bg-yellow-100 text-yellow-800'
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
                    <div className="px-6 py-4 border-t border-outline-variant/15">
                        <div className="flex space-x-1">
                            {scans.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-3 py-1 text-sm rounded ${
                                        link.active ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant hover:bg-gray-200'
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
