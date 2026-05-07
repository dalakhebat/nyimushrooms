import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';

const STATUS_BADGES = {
    diajukan: { label: 'Diajukan', className: 'bg-yellow-100 text-yellow-800', icon: 'schedule' },
    disetujui: { label: 'Disetujui', className: 'bg-blue-100 text-blue-800', icon: 'check_circle' },
    cair: { label: 'Cair', className: 'bg-emerald-100 text-secondary', icon: 'done_all' },
    ditolak: { label: 'Ditolak', className: 'bg-red-100 text-red-700', icon: 'cancel' },
};

export default function PengajuanShow({ pengajuan, authority }) {
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [catatanTolak, setCatatanTolak] = useState('');
    const [processing, setProcessing] = useState(false);

    const formatRupiah = (v) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

    const formatDate = (d) =>
        new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const formatDateTime = (d) =>
        new Date(d).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });

    const badge = STATUS_BADGES[pengajuan.status];

    const handleApprove = () => {
        setProcessing(true);
        router.post(`/pengajuan/${pengajuan.id}/approve`, {}, {
            onFinish: () => {
                setProcessing(false);
                setShowApproveModal(false);
            },
        });
    };

    const handleReject = () => {
        if (!catatanTolak) {
            alert('Alasan penolakan wajib diisi');
            return;
        }
        setProcessing(true);
        router.post(`/pengajuan/${pengajuan.id}/reject`, { catatan_tolak: catatanTolak }, {
            onFinish: () => {
                setProcessing(false);
                setShowRejectModal(false);
            },
        });
    };

    const handleCairkan = () => {
        if (!confirm(`Cairkan pengajuan ini sebesar ${formatRupiah(pengajuan.jumlah)}?\nAkan otomatis tercatat sebagai kas keluar.`)) return;
        setProcessing(true);
        router.post(`/pengajuan/${pengajuan.id}/cairkan`, {}, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdminLayout title={`Pengajuan ${pengajuan.nomor}`}>
            <Head title={`Pengajuan ${pengajuan.nomor}`} />

            <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
                <Link href="/pengajuan" className="inline-flex items-center text-sm text-on-surface-variant hover:text-on-surface">
                    <MIcon name="arrow_back" className="text-base mr-1" />
                    Kembali ke Daftar
                </Link>
                <a
                    href={`/pengajuan/${pengajuan.id}/pdf`}
                    className="inline-flex items-center px-4 py-2 bg-secondary text-white rounded-xl text-sm font-medium hover:opacity-90"
                >
                    <MIcon name="download" className="text-base mr-1" />
                    Download PDF
                </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm overflow-hidden">
                        <div className="p-6 border-b border-outline-variant/15 flex items-center justify-between flex-wrap gap-3">
                            <div>
                                <p className="text-xs text-on-tertiary-container uppercase">Nomor Pengajuan</p>
                                <p className="text-xl font-mono font-bold text-on-surface">{pengajuan.nomor}</p>
                            </div>
                            <span className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full ${badge.className}`}>
                                <MIcon name={badge.icon} className="text-base mr-1" />
                                {badge.label}
                            </span>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <p className="text-xs text-on-tertiary-container uppercase">Tanggal Pengajuan</p>
                                <p className="text-sm font-medium text-on-surface mt-1">{formatDate(pengajuan.tanggal_pengajuan)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-on-tertiary-container uppercase">Pemohon</p>
                                <p className="text-sm font-medium text-on-surface mt-1">
                                    {pengajuan.pemohon?.name || pengajuan.pemohon_nama}
                                    {!pengajuan.pemohon_id && (
                                        <span className="ml-2 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">via Form Publik</span>
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-on-tertiary-container uppercase">Kategori</p>
                                <p className="text-sm font-medium text-on-surface mt-1 capitalize">{pengajuan.kategori}</p>
                            </div>
                            <div>
                                <p className="text-xs text-on-tertiary-container uppercase">Jumlah</p>
                                <p className="text-lg font-bold text-primary mt-1">{formatRupiah(pengajuan.jumlah)}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-xs text-on-tertiary-container uppercase">Tujuan / Penerima</p>
                                <p className="text-sm font-medium text-on-surface mt-1">{pengajuan.tujuan_penerima}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-xs text-on-tertiary-container uppercase">Keterangan</p>
                                <p className="text-sm text-on-surface mt-1 whitespace-pre-wrap">{pengajuan.keterangan}</p>
                            </div>
                            {pengajuan.lampiran_path && (
                                <div className="md:col-span-2">
                                    <p className="text-xs text-on-tertiary-container uppercase">Lampiran</p>
                                    <a
                                        href={`/storage/${pengajuan.lampiran_path}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center text-sm text-secondary hover:underline mt-1"
                                    >
                                        <MIcon name="insert_drive_file" className="text-base mr-1" />
                                        Lihat Lampiran
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tanda tangan preview */}
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-6">
                        <h3 className="text-base font-headline font-bold text-on-surface mb-4">Tanda Tangan</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-xs text-on-tertiary-container uppercase mb-2">Pemohon</p>
                                <div className="bg-white border rounded-lg p-2 h-32 flex items-center justify-center">
                                    {pengajuan.ttd_pemohon ? (
                                        <img src={pengajuan.ttd_pemohon} alt="TTD Pemohon" className="max-h-full max-w-full" />
                                    ) : (
                                        <span className="text-xs text-on-tertiary-container">-</span>
                                    )}
                                </div>
                                <p className="text-xs text-center mt-2 font-medium">{pengajuan.pemohon?.name || pengajuan.pemohon_nama}</p>
                            </div>
                            <div>
                                <p className="text-xs text-on-tertiary-container uppercase mb-2">Mengetahui</p>
                                <div className="bg-white border rounded-lg p-2 h-32 flex items-center justify-center">
                                    {pengajuan.status === 'disetujui' || pengajuan.status === 'cair' ? (
                                        authority?.mengetahui?.ttd_url ? (
                                            <img src={authority.mengetahui.ttd_url} alt={`TTD ${authority.mengetahui.nama}`} className="max-h-full max-w-full" />
                                        ) : (
                                            <span className="text-xs text-on-tertiary-container italic">TTD tersimpan</span>
                                        )
                                    ) : (
                                        <span className="text-xs text-on-tertiary-container">Belum disetujui</span>
                                    )}
                                </div>
                                <p className="text-xs text-center mt-2 font-medium">{authority?.mengetahui?.nama || 'Edy Junaedi'}</p>
                                <p className="text-[10px] text-center text-on-tertiary-container">{authority?.mengetahui?.jabatan || 'Komisaris'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-on-tertiary-container uppercase mb-2">Disetujui</p>
                                <div className="bg-white border rounded-lg p-2 h-32 flex items-center justify-center">
                                    {pengajuan.status === 'disetujui' || pengajuan.status === 'cair' ? (
                                        authority?.disetujui?.ttd_url ? (
                                            <img src={authority.disetujui.ttd_url} alt={`TTD ${authority.disetujui.nama}`} className="max-h-full max-w-full" />
                                        ) : (
                                            <span className="text-xs text-on-tertiary-container italic">TTD tersimpan</span>
                                        )
                                    ) : (
                                        <span className="text-xs text-on-tertiary-container">Belum disetujui</span>
                                    )}
                                </div>
                                <p className="text-xs text-center mt-2 font-medium">{authority?.disetujui?.nama || 'Sri Retno Hadiningsih'}</p>
                                <p className="text-[10px] text-center text-on-tertiary-container">{authority?.disetujui?.jabatan || 'Direktur Utama'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Actions & Timeline */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Actions */}
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-6">
                        <h3 className="text-base font-headline font-bold text-on-surface mb-4">Aksi</h3>

                        {pengajuan.status === 'diajukan' && (
                            <div className="space-y-2">
                                <button
                                    onClick={() => setShowApproveModal(true)}
                                    className="w-full px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:opacity-90 inline-flex items-center justify-center"
                                >
                                    <MIcon name="check_circle" className="text-base mr-1" />
                                    Setujui
                                </button>
                                <button
                                    onClick={() => setShowRejectModal(true)}
                                    className="w-full px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:opacity-90 inline-flex items-center justify-center"
                                >
                                    <MIcon name="cancel" className="text-base mr-1" />
                                    Tolak
                                </button>
                            </div>
                        )}

                        {pengajuan.status === 'disetujui' && (
                            <button
                                onClick={handleCairkan}
                                disabled={processing}
                                className="w-full px-4 py-2.5 bg-secondary text-white rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center"
                            >
                                <MIcon name="payments" className="text-base mr-1" />
                                {processing ? 'Memproses...' : 'Cairkan & Catat ke Kas'}
                            </button>
                        )}

                        {pengajuan.status === 'cair' && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                                <MIcon name="check_circle" className="text-3xl text-secondary" />
                                <p className="text-sm font-medium text-secondary mt-2">Sudah Cair</p>
                                <p className="text-xs text-on-tertiary-container mt-1">{formatDateTime(pengajuan.cair_at)}</p>
                                {pengajuan.kas && (
                                    <Link
                                        href="/kas"
                                        className="inline-block mt-2 text-xs font-mono text-secondary hover:underline"
                                    >
                                        Kas: {pengajuan.kas.kode_transaksi}
                                    </Link>
                                )}
                            </div>
                        )}

                        {pengajuan.status === 'ditolak' && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <p className="text-sm font-medium text-red-700">Pengajuan Ditolak</p>
                                {pengajuan.catatan_tolak && (
                                    <p className="text-xs text-red-600 mt-1">{pengajuan.catatan_tolak}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Timeline */}
                    <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-6">
                        <h3 className="text-base font-headline font-bold text-on-surface mb-4">Timeline</h3>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                                    <MIcon name="edit" className="text-base text-yellow-700" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-on-surface">Diajukan</p>
                                    <p className="text-xs text-on-tertiary-container">
                                        {formatDateTime(pengajuan.created_at)}
                                    </p>
                                </div>
                            </div>
                            {pengajuan.disetujui_at && (
                                <div className="flex gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        pengajuan.status === 'ditolak' ? 'bg-red-100' : 'bg-blue-100'
                                    }`}>
                                        <MIcon
                                            name={pengajuan.status === 'ditolak' ? 'cancel' : 'check_circle'}
                                            className={`text-base ${pengajuan.status === 'ditolak' ? 'text-red-700' : 'text-blue-700'}`}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-on-surface">
                                            {pengajuan.status === 'ditolak' ? 'Ditolak' : 'Disetujui'} oleh {pengajuan.approver?.name}
                                        </p>
                                        <p className="text-xs text-on-tertiary-container">{formatDateTime(pengajuan.disetujui_at)}</p>
                                    </div>
                                </div>
                            )}
                            {pengajuan.cair_at && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                        <MIcon name="payments" className="text-base text-secondary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-on-surface">Dicairkan</p>
                                        <p className="text-xs text-on-tertiary-container">{formatDateTime(pengajuan.cair_at)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Approve Modal */}
            {showApproveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-on-surface mb-2">Setujui Pengajuan</h3>
                        <p className="text-sm text-on-tertiary-container mb-4">
                            {pengajuan.nomor} · {formatRupiah(pengajuan.jumlah)}
                        </p>
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                            <p className="text-sm text-emerald-900">
                                Pengajuan akan diapprove dengan tanda tangan tersimpan dari{' '}
                                <strong>{authority?.disetujui?.nama || 'Edy Junaedi'}</strong> ({authority?.disetujui?.jabatan || 'Direktur'}).
                            </p>
                            {authority?.disetujui?.ttd_url && (
                                <div className="mt-3 bg-white rounded-lg p-2 h-20 flex items-center justify-center border border-emerald-100">
                                    <img
                                        src={authority.disetujui.ttd_url}
                                        alt="TTD Direktur"
                                        className="max-h-full max-w-full"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowApproveModal(false)}
                                className="px-4 py-2 text-sm font-medium text-on-surface-variant bg-surface-container-low rounded-xl hover:bg-gray-200"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={processing}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl hover:opacity-90 disabled:opacity-50"
                            >
                                {processing ? 'Memproses...' : 'Konfirmasi Setujui'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-on-surface mb-2">Tolak Pengajuan</h3>
                        <p className="text-sm text-on-tertiary-container mb-4">{pengajuan.nomor}</p>
                        <label className="block text-sm font-medium text-on-surface-variant mb-1">Alasan Penolakan</label>
                        <textarea
                            value={catatanTolak}
                            onChange={(e) => setCatatanTolak(e.target.value)}
                            rows="3"
                            placeholder="Tulis alasan penolakan..."
                            className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                        />
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="px-4 py-2 text-sm font-medium text-on-surface-variant bg-surface-container-low rounded-xl hover:bg-gray-200"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={processing}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:opacity-90 disabled:opacity-50"
                            >
                                {processing ? 'Memproses...' : 'Konfirmasi Tolak'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
