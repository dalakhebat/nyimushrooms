import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    ArrowLeftIcon,
    DocumentArrowDownIcon,
    CheckCircleIcon,
    ClockIcon,
    BanknotesIcon,
    UserIcon,
    CalendarIcon,
    PencilSquareIcon,
} from '@heroicons/react/24/outline';

export default function PenggajianShow({ penggajian }) {
    const [showBayarModal, setShowBayarModal] = useState(false);
    const [tanggalBayar, setTanggalBayar] = useState(new Date().toISOString().slice(0, 10));
    const [showKoreksiModal, setShowKoreksiModal] = useState(false);
    const [selectedAbsensi, setSelectedAbsensi] = useState(null);
    const [koreksiStatus, setKoreksiStatus] = useState('');

    // Combine all absences for koreksi modal
    const allAbsensi = [
        ...(penggajian.detail_kehadiran?.hadir || []).map(a => ({ ...a, status: 'hadir' })),
        ...(penggajian.detail_kehadiran?.izin || []).map(a => ({ ...a, status: 'izin' })),
        ...(penggajian.detail_kehadiran?.sakit || []).map(a => ({ ...a, status: 'sakit' })),
        ...(penggajian.detail_kehadiran?.alpha || []).map(a => ({ ...a, status: 'alpha' })),
    ].sort((a, b) => new Date(a.tanggal_full) - new Date(b.tanggal_full));

    const handleKoreksi = () => {
        if (!selectedAbsensi || !koreksiStatus) return;

        router.patch(`/absensi/${selectedAbsensi.id}`, {
            status: koreksiStatus,
        }, {
            onSuccess: () => {
                setShowKoreksiModal(false);
                setSelectedAbsensi(null);
                setKoreksiStatus('');
            }
        });
    };

    const handleBayar = () => {
        router.post(`/penggajian/${penggajian.id}/bayar`, {
            tanggal_bayar: tanggalBayar,
        }, {
            onSuccess: () => setShowBayarModal(false),
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getTipeGajiBadge = (tipeGaji) => {
        const badges = {
            bulanan: { class: 'bg-purple-100 text-purple-700', label: 'Bulanan' },
            mingguan: { class: 'bg-blue-100 text-blue-700', label: 'Mingguan' },
            borongan: { class: 'bg-orange-100 text-orange-700', label: 'Borongan' },
        };
        return badges[tipeGaji] || { class: 'bg-gray-100 text-gray-700', label: tipeGaji };
    };

    return (
        <AdminLayout title="Detail Slip Gaji">
            <Head title="Detail Slip Gaji" />

            <div className="mb-6 flex items-center justify-between">
                <Link
                    href="/penggajian"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeftIcon className="w-4 h-4 mr-1" />
                    Kembali ke Penggajian
                </Link>
                <div className="flex items-center space-x-3">
                    {penggajian.status === 'pending' && (
                        <>
                            <Link
                                href={`/penggajian/${penggajian.id}/edit`}
                                className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600"
                            >
                                <PencilSquareIcon className="w-5 h-5 mr-1" />
                                Edit
                            </Link>
                            <button
                                onClick={() => setShowBayarModal(true)}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                            >
                                <BanknotesIcon className="w-5 h-5 mr-1" />
                                Bayar Sekarang
                            </button>
                        </>
                    )}
                    <a
                        href={`/penggajian/${penggajian.id}/slip-pdf`}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                    >
                        <DocumentArrowDownIcon className="w-5 h-5 mr-1" />
                        Download PDF
                    </a>
                </div>
            </div>

            {/* Slip Gaji Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-green-700 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">SLIP GAJI</h1>
                            <p className="text-green-200 mt-1">Defila Solusi Bersama Indonesia</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-green-200">Periode</p>
                            <p className="text-lg font-semibold">{penggajian.periode_formatted}</p>
                        </div>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="px-6 py-3 bg-gray-50 border-b flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {penggajian.status === 'dibayar' ? (
                            <>
                                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-medium text-green-600">
                                    Dibayar pada {penggajian.tanggal_bayar_formatted}
                                </span>
                            </>
                        ) : (
                            <>
                                <ClockIcon className="w-5 h-5 text-yellow-600" />
                                <span className="text-sm font-medium text-yellow-600">Belum Dibayar</span>
                            </>
                        )}
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                        <p>Dibuat: {penggajian.created_at}</p>
                        {penggajian.updated_at !== penggajian.created_at && (
                            <p>Diupdate: {penggajian.updated_at}</p>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Karyawan Info */}
                    <div className="flex items-start mb-6 pb-6 border-b border-gray-200">
                        <div className="bg-green-100 p-3 rounded-full mr-4">
                            <UserIcon className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{penggajian.karyawan.nama}</h2>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${getTipeGajiBadge(penggajian.karyawan.tipe_gaji).class}`}>
                                {getTipeGajiBadge(penggajian.karyawan.tipe_gaji).label}
                            </span>
                            {penggajian.karyawan.no_hp && (
                                <p className="text-sm text-gray-500 mt-1">{penggajian.karyawan.no_hp}</p>
                            )}
                        </div>
                    </div>

                    {/* Absensi Summary */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium text-gray-500 uppercase">Rekap Kehadiran</h3>
                            {penggajian.status === 'pending' && (
                                <button
                                    onClick={() => setShowKoreksiModal(true)}
                                    className="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200"
                                >
                                    Koreksi Absensi
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="bg-green-50 p-4 rounded-lg">
                                <div className="text-center mb-2">
                                    <p className="text-2xl font-bold text-green-700">{penggajian.jumlah_hadir}</p>
                                    <p className="text-xs text-green-600">Hadir</p>
                                </div>
                                {penggajian.detail_kehadiran?.hadir?.length > 0 && (
                                    <div className="text-xs text-green-600 border-t border-green-200 pt-2 mt-2">
                                        {penggajian.detail_kehadiran.hadir.map((h, i) => (
                                            <span key={h.id} className="inline-block mr-1">{h.tanggal}{i < penggajian.detail_kehadiran.hadir.length - 1 ? ',' : ''}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="text-center mb-2">
                                    <p className="text-2xl font-bold text-blue-700">{penggajian.jumlah_izin}</p>
                                    <p className="text-xs text-blue-600">Izin</p>
                                </div>
                                {penggajian.detail_kehadiran?.izin?.length > 0 && (
                                    <div className="text-xs text-blue-600 border-t border-blue-200 pt-2 mt-2">
                                        {penggajian.detail_kehadiran.izin.map((h, i) => (
                                            <span key={h.id} className="inline-block mr-1">{h.tanggal}{i < penggajian.detail_kehadiran.izin.length - 1 ? ',' : ''}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <div className="text-center mb-2">
                                    <p className="text-2xl font-bold text-yellow-700">{penggajian.jumlah_sakit}</p>
                                    <p className="text-xs text-yellow-600">Sakit</p>
                                </div>
                                {penggajian.detail_kehadiran?.sakit?.length > 0 && (
                                    <div className="text-xs text-yellow-600 border-t border-yellow-200 pt-2 mt-2">
                                        {penggajian.detail_kehadiran.sakit.map((h, i) => (
                                            <span key={h.id} className="inline-block mr-1">{h.tanggal}{i < penggajian.detail_kehadiran.sakit.length - 1 ? ',' : ''}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg">
                                <div className="text-center mb-2">
                                    <p className="text-2xl font-bold text-red-700">{penggajian.jumlah_alpha}</p>
                                    <p className="text-xs text-red-600">Alpha</p>
                                </div>
                                {penggajian.detail_kehadiran?.alpha?.length > 0 && (
                                    <div className="text-xs text-red-600 border-t border-red-200 pt-2 mt-2">
                                        {penggajian.detail_kehadiran.alpha.map((h, i) => (
                                            <span key={h.id} className="inline-block mr-1">{h.tanggal}{i < penggajian.detail_kehadiran.alpha.length - 1 ? ',' : ''}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Rincian Gaji */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">Rincian Gaji</h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Gaji Pokok</span>
                                <span className="font-medium text-gray-900">{formatCurrency(penggajian.gaji_pokok)}</span>
                            </div>
                            {penggajian.bonus > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Bonus</span>
                                    <span className="font-medium">+{formatCurrency(penggajian.bonus)}</span>
                                </div>
                            )}
                            {penggajian.potongan > 0 && (
                                <div className="flex justify-between text-red-600">
                                    <span>Potongan Absensi</span>
                                    <span className="font-medium">-{formatCurrency(penggajian.potongan)}</span>
                                </div>
                            )}
                            {penggajian.potongan_kasbon > 0 && (
                                <div className="flex justify-between text-orange-600">
                                    <span>Potongan Kasbon</span>
                                    <span className="font-medium">-{formatCurrency(penggajian.potongan_kasbon)}</span>
                                </div>
                            )}
                            <div className="border-t border-gray-300 pt-3 flex justify-between">
                                <span className="font-bold text-gray-900">Total Diterima</span>
                                <span className="font-bold text-xl text-green-700">{formatCurrency(penggajian.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Catatan */}
                    {penggajian.catatan && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Catatan</h3>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{penggajian.catatan}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Bayar */}
            {showBayarModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Bayar Gaji</h3>
                        <p className="text-sm text-gray-600 mb-2">
                            Karyawan: <span className="font-medium">{penggajian.karyawan.nama}</span>
                        </p>
                        <p className="text-lg font-bold text-green-700 mb-4">
                            {formatCurrency(penggajian.total)}
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tanggal Bayar
                            </label>
                            <input
                                type="date"
                                value={tanggalBayar}
                                onChange={(e) => setTanggalBayar(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowBayarModal(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleBayar}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Konfirmasi Bayar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Koreksi Absensi */}
            {showKoreksiModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Koreksi Absensi</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Pilih absensi yang ingin dikoreksi untuk {penggajian.karyawan.nama}
                        </p>

                        <div className="max-h-64 overflow-y-auto mb-4">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left">Tanggal</th>
                                        <th className="px-3 py-2 text-left">Status</th>
                                        <th className="px-3 py-2 text-center">Pilih</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {allAbsensi.map((absensi) => (
                                        <tr
                                            key={absensi.id}
                                            className={`hover:bg-gray-50 ${selectedAbsensi?.id === absensi.id ? 'bg-orange-50' : ''}`}
                                        >
                                            <td className="px-3 py-2">{absensi.tanggal}</td>
                                            <td className="px-3 py-2">
                                                <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                                                    absensi.status === 'hadir' ? 'bg-green-100 text-green-700' :
                                                    absensi.status === 'izin' ? 'bg-blue-100 text-blue-700' :
                                                    absensi.status === 'sakit' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                    {absensi.status.charAt(0).toUpperCase() + absensi.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2 text-center">
                                                <input
                                                    type="radio"
                                                    name="selectedAbsensi"
                                                    checked={selectedAbsensi?.id === absensi.id}
                                                    onChange={() => {
                                                        setSelectedAbsensi(absensi);
                                                        setKoreksiStatus('');
                                                    }}
                                                    className="text-orange-600"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {selectedAbsensi && (
                            <div className="mb-4 p-3 bg-orange-50 rounded-lg">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ubah status {selectedAbsensi.tanggal} menjadi:
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {['hadir', 'izin', 'sakit', 'alpha'].filter(s => s !== selectedAbsensi.status).map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => setKoreksiStatus(status)}
                                            className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                                                koreksiStatus === status
                                                    ? status === 'hadir' ? 'bg-green-600 text-white border-green-600' :
                                                      status === 'izin' ? 'bg-blue-600 text-white border-blue-600' :
                                                      status === 'sakit' ? 'bg-yellow-600 text-white border-yellow-600' :
                                                      'bg-red-600 text-white border-red-600'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowKoreksiModal(false);
                                    setSelectedAbsensi(null);
                                    setKoreksiStatus('');
                                }}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleKoreksi}
                                disabled={!selectedAbsensi || !koreksiStatus}
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Simpan Koreksi
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 mt-4">
                            * Setelah koreksi, hapus penggajian ini dan proses ulang untuk update perhitungan gaji.
                        </p>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
