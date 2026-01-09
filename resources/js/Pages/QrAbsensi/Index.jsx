import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Icon } from '@iconify/react';

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
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">QR Code Hari Ini</h2>
                            <button
                                onClick={handleGenerateNew}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                title="Generate QR Baru"
                            >
                                <Icon icon="solar:refresh-bold" className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4">
                                <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded">
                                    <div className="text-center">
                                        <Icon icon="solar:qr-code-bold" className="w-24 h-24 text-gray-400 mx-auto" />
                                        <p className="text-xs text-gray-500 mt-2 font-mono break-all px-2">{qrCode.kode_qr}</p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">
                                Berlaku: {qrCode.berlaku_mulai} - {qrCode.berlaku_sampai}
                            </p>
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                                qrCode.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {qrCode.is_active ? 'Aktif' : 'Tidak Aktif'}
                            </span>
                        </div>

                        <div className="mt-6">
                            <Link
                                href="/qr-absensi/scan"
                                className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                <Icon icon="solar:qr-code-bold" className="w-5 h-5 mr-2" />
                                Scan Absensi
                            </Link>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">Ringkasan Hari Ini</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 flex items-center">
                                    <Icon icon="solar:users-group-rounded-bold" className="w-4 h-4 mr-2" /> Total Karyawan
                                </span>
                                <span className="font-semibold">{summary.totalKaryawan}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 flex items-center">
                                    <Icon icon="solar:check-circle-bold" className="w-4 h-4 mr-2 text-green-500" /> Sudah Masuk
                                </span>
                                <span className="font-semibold text-green-600">{summary.sudahMasuk}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 flex items-center">
                                    <Icon icon="solar:close-circle-bold" className="w-4 h-4 mr-2 text-red-500" /> Belum Masuk
                                </span>
                                <span className="font-semibold text-red-600">{summary.belumMasuk}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 flex items-center">
                                    <Icon icon="solar:clock-circle-bold" className="w-4 h-4 mr-2 text-yellow-500" /> Terlambat
                                </span>
                                <span className="font-semibold text-yellow-600">{summary.terlambat}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scan List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-800">Absensi Hari Ini</h2>
                                <Link href="/qr-absensi/history" className="text-sm text-green-600 hover:text-green-700">
                                    Lihat Riwayat
                                </Link>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Karyawan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jam Masuk</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jam Keluar</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {scansToday.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                                Belum ada yang scan hari ini
                                            </td>
                                        </tr>
                                    ) : (
                                        scansToday.map((scan) => (
                                            <tr key={scan.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {scan.karyawan?.nama}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {scan.jam_masuk || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {scan.jam_keluar || '-'}
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
                    </div>

                    {/* Belum Scan */}
                    {belumScan.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm mt-6">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-800">Belum Scan ({belumScan.length})</h2>
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
