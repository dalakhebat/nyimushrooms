import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeftIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function ProduksiBaglogShow({ produksi }) {
    const handleUpdateTahap = (tahap) => {
        router.patch(`/produksi-baglog/${produksi.id}/tahap`, { tahap });
    };

    const getTahapBadge = (tahap) => {
        const badges = {
            mixing: 'bg-blue-100 text-blue-800',
            sterilisasi: 'bg-yellow-100 text-yellow-800',
            inokulasi: 'bg-purple-100 text-purple-800',
            inkubasi: 'bg-orange-100 text-orange-800',
            selesai: 'bg-emerald-100 text-primary',
        };
        return badges[tahap] || 'bg-surface-container-low text-on-surface';
    };

    const tahapOrder = ['mixing', 'sterilisasi', 'inokulasi', 'inkubasi', 'selesai'];
    const currentIndex = tahapOrder.indexOf(produksi.tahap);

    const formatDateTime = (datetime) => {
        if (!datetime) return '-';
        return new Date(datetime).toLocaleString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <AdminLayout title="Detail Produksi">
            <Head title="Detail Produksi" />

            <div className="max-w-3xl">
                <div className="mb-6">
                    <Link href="/produksi-baglog" className="inline-flex items-center text-sm text-on-surface-variant hover:text-on-surface">
                        <ArrowLeftIcon className="w-4 h-4 mr-1" />
                        Kembali
                    </Link>
                </div>

                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-headline font-bold text-on-surface">{produksi.kode_produksi}</h2>
                            <p className="text-sm text-on-tertiary-container">
                                {new Date(produksi.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${getTahapBadge(produksi.tahap)}`}>
                            {produksi.tahap}
                        </span>
                    </div>

                    {/* Progress */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            {tahapOrder.map((tahap, index) => (
                                <div key={tahap} className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        index <= currentIndex ? 'bg-secondary text-white' : 'bg-gray-200 text-on-tertiary-container'
                                    }`}>
                                        {index < currentIndex ? (
                                            <CheckCircleIcon className="w-5 h-5" />
                                        ) : (
                                            <span className="text-sm">{index + 1}</span>
                                        )}
                                    </div>
                                    <span className="text-xs mt-1 capitalize">{tahap}</span>
                                </div>
                            ))}
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                            <div
                                className="h-2 bg-secondary rounded-full transition-all"
                                style={{ width: `${((currentIndex + 1) / tahapOrder.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <p className="text-sm text-on-tertiary-container">Jumlah Baglog</p>
                            <p className="font-bold">{produksi.jumlah_baglog} baglog</p>
                        </div>
                        <div>
                            <p className="text-sm text-on-tertiary-container">Operator</p>
                            <p className="font-bold">{produksi.karyawan?.nama || '-'}</p>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="border-t pt-4">
                        <h3 className="text-sm font-medium text-on-surface-variant mb-3">Timeline Produksi</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-on-tertiary-container">Mixing</span>
                                <span>{formatDateTime(produksi.waktu_mixing)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-on-tertiary-container">Sterilisasi Mulai</span>
                                <span>{formatDateTime(produksi.waktu_sterilisasi_mulai)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-on-tertiary-container">Sterilisasi Selesai</span>
                                <span>{formatDateTime(produksi.waktu_sterilisasi_selesai)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-on-tertiary-container">Inokulasi</span>
                                <span>{formatDateTime(produksi.waktu_inokulasi)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action */}
                    {produksi.tahap !== 'selesai' && (
                        <div className="mt-6 pt-4 border-t">
                            <button
                                onClick={() => handleUpdateTahap(tahapOrder[currentIndex + 1])}
                                className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary"
                            >
                                <ArrowPathIcon className="w-5 h-5 mr-2" />
                                Lanjut ke Tahap: {tahapOrder[currentIndex + 1]}
                            </button>
                        </div>
                    )}
                </div>

                {/* Bahan Baku */}
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-6">
                    <h3 className="text-sm font-medium text-on-surface-variant mb-3">Bahan Baku yang Digunakan</h3>
                    <table className="w-full">
                        <thead className="bg-surface-container-low">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-on-tertiary-container uppercase">Bahan Baku</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-on-tertiary-container uppercase">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {produksi.bahan_bakus?.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-4 py-3 text-sm text-on-surface-variant">{item.bahan_baku?.nama}</td>
                                    <td className="px-4 py-3 text-sm text-on-surface-variant text-right">
                                        {item.jumlah_digunakan} {item.bahan_baku?.satuan}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {produksi.catatan && (
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-6 mt-6">
                        <h3 className="text-sm font-medium text-on-surface-variant mb-2">Catatan</h3>
                        <p className="text-on-surface-variant">{produksi.catatan}</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
