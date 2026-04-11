import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { BellIcon, CheckIcon, TrashIcon, ExclamationTriangleIcon, InformationCircleIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function NotifikasiIndex({ notifikasis, summary, kategoris, filters }) {
    const handleMarkAsRead = (id) => {
        router.patch(`/notifikasi/${id}/read`);
    };

    const handleMarkAllAsRead = () => {
        router.post('/notifikasi/read-all');
    };

    const handleDelete = (id) => {
        router.delete(`/notifikasi/${id}`);
    };

    const handleDeleteAll = () => {
        if (confirm('Hapus semua notifikasi?')) {
            router.delete('/notifikasi/delete-all');
        }
    };

    const getTipeIcon = (tipe) => {
        switch (tipe) {
            case 'warning': return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
            case 'danger': return <XCircleIcon className="w-5 h-5 text-red-500" />;
            case 'success': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
            default: return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
        }
    };

    const getTipeBg = (tipe) => {
        switch (tipe) {
            case 'warning': return 'bg-yellow-50 border-yellow-200';
            case 'danger': return 'bg-red-50 border-red-200';
            case 'success': return 'bg-emerald-50 border-green-200';
            default: return 'bg-blue-50 border-blue-200';
        }
    };

    return (
        <AdminLayout title="Notifikasi">
            <Head title="Notifikasi" />

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                    <p className="text-sm text-on-tertiary-container">Total</p>
                    <p className="text-2xl font-bold text-on-surface">{summary.total}</p>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                    <p className="text-sm text-on-tertiary-container">Belum Dibaca</p>
                    <p className="text-2xl font-bold text-red-600">{summary.unread}</p>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                    <p className="text-sm text-on-tertiary-container">Stok</p>
                    <p className="text-2xl font-bold text-yellow-600">{summary.stok}</p>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                    <p className="text-sm text-on-tertiary-container">Panen</p>
                    <p className="text-2xl font-bold text-secondary">{summary.panen}</p>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                    <p className="text-sm text-on-tertiary-container">Gaji</p>
                    <p className="text-2xl font-bold text-blue-600">{summary.gaji}</p>
                </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm">
                <div className="p-6 border-b border-outline-variant/15">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-on-surface flex items-center">
                            <BellIcon className="w-5 h-5 mr-2" />
                            Notifikasi
                        </h2>
                        <div className="flex gap-2">
                            {summary.unread > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="px-3 py-1.5 text-sm text-secondary hover:bg-emerald-50 rounded-xl"
                                >
                                    <CheckIcon className="w-4 h-4 inline mr-1" />
                                    Tandai Semua Dibaca
                                </button>
                            )}
                            {summary.total > 0 && (
                                <button
                                    onClick={handleDeleteAll}
                                    className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-xl"
                                >
                                    <TrashIcon className="w-4 h-4 inline mr-1" />
                                    Hapus Semua
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {notifikasis.data.length === 0 ? (
                        <div className="px-6 py-12 text-center text-on-tertiary-container">
                            <BellIcon className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                            <p>Tidak ada notifikasi</p>
                        </div>
                    ) : (
                        notifikasis.data.map((notif) => (
                            <div
                                key={notif.id}
                                className={`p-4 flex items-start gap-4 ${!notif.is_read ? getTipeBg(notif.tipe) : 'bg-surface-container-lowest'} border-l-4 ${
                                    notif.tipe === 'warning' ? 'border-l-yellow-500' :
                                    notif.tipe === 'danger' ? 'border-l-red-500' :
                                    notif.tipe === 'success' ? 'border-l-green-500' : 'border-l-blue-500'
                                }`}
                            >
                                <div className="flex-shrink-0 mt-1">
                                    {getTipeIcon(notif.tipe)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className={`text-sm font-medium ${!notif.is_read ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                                                {notif.judul}
                                            </p>
                                            <p className="text-sm text-on-tertiary-container mt-1">{notif.pesan}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-surface-container-low text-on-surface-variant capitalize">
                                                    {notif.kategori}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    {new Date(notif.created_at).toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {!notif.is_read && (
                                                <button
                                                    onClick={() => handleMarkAsRead(notif.id)}
                                                    className="p-1 text-slate-400 hover:text-secondary hover:bg-emerald-50 rounded"
                                                    title="Tandai sudah dibaca"
                                                >
                                                    <CheckIcon className="w-4 h-4" />
                                                </button>
                                            )}
                                            {notif.link && (
                                                <Link
                                                    href={notif.link}
                                                    className="px-2 py-1 text-xs text-secondary hover:bg-emerald-50 rounded"
                                                >
                                                    Lihat
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => handleDelete(notif.id)}
                                                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {notifikasis.links && notifikasis.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-outline-variant/15">
                        <div className="flex space-x-1">
                            {notifikasis.links.map((link, index) => (
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
