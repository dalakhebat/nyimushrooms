import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeftIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function KpiDetail({ karyawan, scanData, absensiData, bulan, tahun }) {
    const bulanOptions = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    return (
        <AdminLayout title={`KPI ${karyawan.nama}`}>
            <Head title={`KPI ${karyawan.nama}`} />

            <div className="mb-6">
                <Link href={`/kpi?bulan=${bulan}&tahun=${tahun}`} className="inline-flex items-center text-sm text-on-surface-variant hover:text-on-surface">
                    <ArrowLeftIcon className="w-4 h-4 mr-1" />
                    Kembali
                </Link>
            </div>

            {/* Header */}
            <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-6 mb-6">
                <div className="flex items-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-secondary">{karyawan.nama.charAt(0)}</span>
                    </div>
                    <div className="ml-4">
                        <h2 className="text-xl font-bold text-on-surface">{karyawan.nama}</h2>
                        <p className="text-sm text-on-tertiary-container">{bulanOptions[bulan - 1]} {tahun}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Scan Data */}
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm">
                    <div className="p-6 border-b border-outline-variant/15">
                        <h3 className="text-lg font-bold text-on-surface flex items-center">
                            <ClockIcon className="w-5 h-5 mr-2 text-secondary" />
                            Data Absensi QR
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-surface-container-low">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-on-tertiary-container uppercase">Tanggal</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-on-tertiary-container uppercase">Masuk</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-on-tertiary-container uppercase">Keluar</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-on-tertiary-container uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {scanData.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-8 text-center text-on-tertiary-container">Tidak ada data</td>
                                    </tr>
                                ) : (
                                    scanData.map((scan, index) => (
                                        <tr key={index} className="hover:bg-surface-container-low">
                                            <td className="px-4 py-3 text-sm text-on-surface-variant">{scan.tanggal_formatted}</td>
                                            <td className="px-4 py-3 text-sm text-on-surface-variant">{scan.jam_masuk || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-on-surface-variant">{scan.jam_keluar || '-'}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                                    scan.status === 'hadir' ? 'bg-emerald-100 text-primary' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {scan.status === 'hadir' ? 'Tepat' : 'Terlambat'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Absensi Data */}
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm">
                    <div className="p-6 border-b border-outline-variant/15">
                        <h3 className="text-lg font-bold text-on-surface flex items-center">
                            <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" />
                            Data Absensi Manual
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-surface-container-low">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-on-tertiary-container uppercase">Tanggal</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-on-tertiary-container uppercase">Status</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-on-tertiary-container uppercase">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {absensiData.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-4 py-8 text-center text-on-tertiary-container">Tidak ada data</td>
                                    </tr>
                                ) : (
                                    absensiData.map((absensi, index) => (
                                        <tr key={index} className="hover:bg-surface-container-low">
                                            <td className="px-4 py-3 text-sm text-on-surface-variant">{absensi.tanggal_formatted}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                                    absensi.status === 'hadir' ? 'bg-emerald-100 text-primary' :
                                                    absensi.status === 'izin' ? 'bg-blue-100 text-blue-800' :
                                                    absensi.status === 'sakit' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {absensi.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-on-tertiary-container">{absensi.keterangan || '-'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
