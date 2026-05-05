import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import MIcon from '@/Components/MIcon';

export default function PublicPengajuanSukses({ pengajuan }) {
    const formatRupiah = (v) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

    const formatDate = (d) =>
        new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <PublicLayout>
            <Head title="Pengajuan Berhasil" />

            <div className="p-6 md:p-8">
                {/* Success Icon */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-4">
                        <MIcon name="check_circle" className="text-5xl text-secondary" />
                    </div>
                    <h2 className="text-2xl font-bold text-on-surface font-headline">Pengajuan Berhasil Dikirim!</h2>
                    <p className="text-sm text-on-tertiary-container mt-2">
                        Terima kasih, pengajuan Anda sudah masuk ke sistem.
                    </p>
                </div>

                {/* Nomor Pengajuan */}
                <div className="bg-emerald-50 border-2 border-secondary rounded-2xl p-5 text-center mb-6">
                    <p className="text-xs text-on-tertiary-container uppercase tracking-wider mb-2">Nomor Pengajuan Anda</p>
                    <p className="text-2xl md:text-3xl font-mono font-bold text-secondary tracking-wider">
                        {pengajuan.nomor}
                    </p>
                    <p className="text-xs text-on-tertiary-container mt-2">Simpan nomor ini sebagai referensi</p>
                </div>

                {/* Detail Ringkas */}
                <div className="bg-surface-container-low rounded-xl p-4 space-y-3 mb-6">
                    <h3 className="text-sm font-bold text-on-surface mb-3">Detail Pengajuan:</h3>
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
                    </div>
                </div>

                {/* Steps berikutnya */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <h3 className="text-sm font-bold text-blue-900 mb-2 flex items-center">
                        <MIcon name="info" className="text-base mr-1" />
                        Apa selanjutnya?
                    </h3>
                    <ol className="text-sm text-blue-900 space-y-2 list-decimal pl-5">
                        <li>Klik <strong>Download PDF</strong> di bawah, lalu share PDF-nya ke Grup WA</li>
                        <li>Tunggu konfirmasi dari Bu Retno (di grup) & Bos</li>
                        <li>Kalau sudah disetujui, dana akan ditransfer ke rekening tujuan</li>
                    </ol>
                </div>

                {/* Action Buttons */}
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
                        <MIcon name="add" className="text-base mr-1" />
                        Buat Pengajuan Baru
                    </Link>
                </div>
            </div>
        </PublicLayout>
    );
}
