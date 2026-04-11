import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';

export default function QrAbsensiIndex({ qrCode, scansToday, belumScan, summary }) {
    const handleGenerateNew = () => {
        if (confirm('Generate QR code baru? QR lama akan tidak berlaku.')) {
            router.post('/qr-absensi/generate');
        }
    };

    return (
        <AdminLayout title="Absensi QR Code">
            <Head title="Absensi QR Code" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* QR Code Section */}
                <div className="lg:col-span-1">
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-headline font-bold text-on-surface">QR Code Hari Ini</h2>
                            <button
                                onClick={handleGenerateNew}
                                className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-xl"
                                title="Generate QR Baru"
                            >
                                <MIcon name="refresh" className="text-xl" />
                            </button>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="bg-surface-container-lowest p-4 rounded-xl border-2 border-outline-variant/15 mb-4">
                                <div className="w-48 h-48 flex items-center justify-center bg-surface-container-low rounded">
                                    <div className="text-center">
                                        <MIcon name="qr_code_scanner" className="text-4xl text-slate-400 mx-auto" />
                                        <p className="text-xs text-on-tertiary-container mt-2 font-mono break-all px-2">{qrCode.kode_qr}</p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-on-tertiary-container mb-2">
                                Berlaku: {qrCode.berlaku_mulai} - {qrCode.berlaku_sampai}
                            </p>
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                                qrCode.is_active ? 'bg-emerald-100 text-primary' : 'bg-red-100 text-red-800'
                            }`}>
                                {qrCode.is_active ? 'Aktif' : 'Tidak Aktif'}
                            </span>
                        </div>

                        <div className="mt-6">
                            <Link
                                href="/qr-absensi/scan"
                                className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary"
                            >
                                <MIcon name="qr_code_scanner" className="text-xl mr-2" />
                                Scan Absensi
                            </Link>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-6 mt-6">
                        <h3 className="text-sm font-medium text-on-surface-variant mb-4">Ringkasan Hari Ini</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-on-tertiary-container flex items-center">
                                    <MIcon name="groups" className="text-base mr-2" /> Total Karyawan
                                </span>
                                <span className="font-bold">{summary.totalKaryawan}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-on-tertiary-container flex items-center">
                                    <MIcon name="check_circle" className="text-base mr-2 text-green-500" /> Sudah Masuk
                                </span>
                                <span className="font-bold text-secondary">{summary.sudahMasuk}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-on-tertiary-container flex items-center">
                                    <MIcon name="close" className="text-base mr-2 text-red-500" /> Belum Masuk
                                </span>
                                <span className="font-bold text-red-600">{summary.belumMasuk}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-on-tertiary-container flex items-center">
                                    <MIcon name="schedule" className="text-base mr-2 text-yello" /> Terlambat
                                </span>
                                <span className="font-bold text-yellow-600">{summary.terlambat}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scan List */}
                <div className="lg:col-span-2">
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm">
                        <div className="p-6 border-b border-outline-variant/15">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-headline font-bold text-on-surface">Absensi Hari Ini</h2>
                                <Link href="/qr-absensi/history" className="text-sm text-secondary hover:text-secondary">
                                    Lihat Riwayat
                                </Link>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-surface-container-low">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Karyawan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Jam Masuk</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Jam Keluar</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {scansToday.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center text-on-tertiary-container">
                                                Belum ada yang scan hari ini
                                            </td>
                                        </tr>
                                    ) : (
                                        scansToday.map((scan) => (
                                            <tr key={scan.id} className="hover:bg-surface-container-low">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">
                                                    {scan.karyawan?.nama}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                                                    {scan.jam_masuk || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                                                    {scan.jam_keluar || '-'}
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
                    </div>

                    {/* Belum Scan */}
                    {belumScan.length > 0 && (
                        <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm mt-6">
                            <div className="p-6 border-b border-outline-variant/15">
                                <h2 className="text-lg font-headline font-bold text-on-surface">Belum Scan ({belumScan.length})</h2>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-wrap gap-2">
                                    {belumScan.map((karyawan) => (
                                        <span key={karyawan.id} className="px-3 py-1 bg-red-50 text-red-700 text-sm rounded-full">
                                            {karyawan.nama}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
