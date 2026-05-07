import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import MIcon from '@/Components/MIcon';

const STATUS_META = {
    diajukan: {
        label: 'Menunggu Persetujuan',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: 'schedule',
        message: 'Pengajuan kamu sudah masuk sistem & sedang menunggu konfirmasi dari Bu Retno / Bos.',
    },
    disetujui: {
        label: 'Disetujui',
        className: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: 'check_circle',
        message: 'Pengajuan kamu sudah disetujui. Tinggal menunggu pencairan dari kas.',
    },
    cair: {
        label: 'Sudah Cair',
        className: 'bg-emerald-100 text-secondary border-emerald-300',
        icon: 'done_all',
        message: 'Dana sudah dicairkan & ditransfer ke rekening tujuan.',
    },
    ditolak: {
        label: 'Ditolak',
        className: 'bg-red-100 text-red-700 border-red-300',
        icon: 'cancel',
        message: 'Pengajuan kamu ditolak. Cek catatan penolakan di bawah.',
    },
};

export default function PublicPengajuanLacak({ pengajuan }) {
    const formatRupiah = (v) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

    const formatDate = (d) =>
        new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const formatDateTime = (d) =>
        new Date(d).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });

    const status = STATUS_META[pengajuan.status] ?? STATUS_META.diajukan;

    return (
        <PublicLayout title="Lacak Pengajuan" subtitle="Status terkini pengajuan kamu">
            <Head title={`Lacak ${pengajuan.nomor}`} />

            <div className="p-6 md:p-8 space-y-6">
                {/* Status Card */}
                <div className={`rounded-2xl border-2 p-5 ${status.className}`}>
                    <div className="flex items-center gap-3 mb-2">
                        <MIcon name={status.icon} className="text-3xl" />
                        <div>
                            <p className="text-xs uppercase tracking-wider opacity-80">Status</p>
                            <p className="text-lg font-bold">{status.label}</p>
                        </div>
                    </div>
                    <p className="text-sm">{status.message}</p>
                </div>

                {/* Nomor */}
                <div className="bg-emerald-50 border-2 border-secondary rounded-2xl p-5 text-center">
                    <p className="text-xs text-on-tertiary-container uppercase tracking-wider mb-2">Nomor Pengajuan</p>
                    <p className="text-2xl md:text-3xl font-mono font-bold text-secondary tracking-wider">
                        {pengajuan.nomor}
                    </p>
                </div>

                {/* Detail */}
                <div className="bg-surface-container-low rounded-xl p-5 space-y-3">
                    <h3 className="text-sm font-bold text-on-surface mb-3">Detail Pengajuan</h3>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                        <span className="text-on-tertiary-container">Pemohon</span>
                        <span className="col-span-2 font-medium text-on-surface">{pengajuan.pemohon_nama || pengajuan.pemohon?.name}</span>

                        <span className="text-on-tertiary-container">Tanggal</span>
                        <span className="col-span-2 font-medium text-on-surface">{formatDate(pengajuan.tanggal_pengajuan)}</span>

                        <span className="text-on-tertiary-container">Kategori</span>
                        <span className="col-span-2 font-medium text-on-surface capitalize">{pengajuan.kategori}</span>

                        <span className="text-on-tertiary-container">Penerima</span>
                        <span className="col-span-2 font-medium text-on-surface">{pengajuan.tujuan_penerima}</span>

                        <span className="text-on-tertiary-container">Jumlah</span>
                        <span className="col-span-2 font-bold text-primary text-lg">{formatRupiah(pengajuan.jumlah)}</span>

                        <span className="text-on-tertiary-container">Keterangan</span>
                        <span className="col-span-2 font-medium text-on-surface whitespace-pre-wrap">{pengajuan.keterangan}</span>
                    </div>
                </div>

                {/* Catatan Tolak */}
                {pengajuan.status === 'ditolak' && pengajuan.catatan_tolak && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-sm font-bold text-red-700 mb-1 flex items-center">
                            <MIcon name="error" className="text-base mr-1" />
                            Catatan Penolakan
                        </p>
                        <p className="text-sm text-red-700 whitespace-pre-wrap">{pengajuan.catatan_tolak}</p>
                    </div>
                )}

                {/* Timeline */}
                <div className="bg-surface-container-low rounded-xl p-5">
                    <h3 className="text-sm font-bold text-on-surface mb-4">Riwayat Status</h3>
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                                <MIcon name="edit" className="text-base text-yellow-700" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-on-surface">Pengajuan Dibuat</p>
                                <p className="text-xs text-on-tertiary-container">{formatDateTime(pengajuan.created_at)}</p>
                            </div>
                        </div>
                        {pengajuan.disetujui_at && (
                            <div className="flex gap-3">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    pengajuan.status === 'ditolak' ? 'bg-red-100' : 'bg-blue-100'
                                }`}>
                                    <MIcon
                                        name={pengajuan.status === 'ditolak' ? 'cancel' : 'check_circle'}
                                        className={`text-base ${pengajuan.status === 'ditolak' ? 'text-red-700' : 'text-blue-700'}`}
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-on-surface">
                                        {pengajuan.status === 'ditolak' ? 'Ditolak' : 'Disetujui'}
                                        {pengajuan.approver?.name && <> oleh {pengajuan.approver.name}</>}
                                    </p>
                                    <p className="text-xs text-on-tertiary-container">{formatDateTime(pengajuan.disetujui_at)}</p>
                                </div>
                            </div>
                        )}
                        {pengajuan.cair_at && (
                            <div className="flex gap-3">
                                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                    <MIcon name="payments" className="text-base text-secondary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-on-surface">Dana Dicairkan</p>
                                    <p className="text-xs text-on-tertiary-container">{formatDateTime(pengajuan.cair_at)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <a
                        href={`/ajukan/${pengajuan.nomor}/pdf`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full inline-flex items-center justify-center px-6 py-4 bg-primary text-white rounded-xl text-base font-bold hover:opacity-90 shadow-md"
                    >
                        <MIcon name="print" className="text-xl mr-2" />
                        Download PDF Pengajuan
                    </a>

                    <Link
                        href="/ajukan"
                        className="w-full inline-flex items-center justify-center px-6 py-3 bg-surface-container-low text-on-surface rounded-xl text-sm font-medium hover:bg-gray-200"
                    >
                        <MIcon name="arrow_back" className="text-base mr-1" />
                        Kembali ke Form
                    </Link>
                </div>
            </div>
        </PublicLayout>
    );
}
