import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';
import FormAlert from '@/Components/FormAlert';
import SignaturePad from '@/Components/SignaturePad';

export default function PengajuanCreate({ kategoris, pemohonName }) {
    const { data, setData, post, processing, errors } = useForm({
        tanggal_pengajuan: new Date().toISOString().split('T')[0],
        kategori: '',
        jumlah: '',
        tujuan_penerima: '',
        keterangan: '',
        ttd_pemohon: '',
        lampiran: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.ttd_pemohon) {
            alert('Tanda tangan pemohon wajib diisi');
            return;
        }
        post('/pengajuan', { forceFormData: true });
    };

    return (
        <AdminLayout title="Pengajuan Pengeluaran Baru">
            <Head title="Pengajuan Baru" />

            <div className="max-w-3xl">
                <div className="mb-6">
                    <Link href="/pengajuan" className="inline-flex items-center text-sm text-on-surface-variant hover:text-on-surface">
                        <MIcon name="arrow_back" className="text-base mr-1" />
                        Kembali ke Daftar Pengajuan
                    </Link>
                </div>

                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-6">
                    <div className="mb-6 pb-4 border-b border-outline-variant/15">
                        <h2 className="text-lg font-headline font-bold text-on-surface">Form Pengajuan Pengeluaran</h2>
                        <p className="text-sm text-on-tertiary-container mt-1">Pengeluaran dari rekening BNI Giro</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <FormAlert errors={errors} />

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-900">
                            <span className="font-medium">Pemohon:</span> {pemohonName}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">Tanggal Pengajuan</label>
                                <input
                                    type="date"
                                    value={data.tanggal_pengajuan}
                                    onChange={(e) => setData('tanggal_pengajuan', e.target.value)}
                                    className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">Kategori</label>
                                <select
                                    value={data.kategori}
                                    onChange={(e) => setData('kategori', e.target.value)}
                                    className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                                >
                                    <option value="">Pilih Kategori</option>
                                    {kategoris.map((k) => (
                                        <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-on-surface-variant mb-1">Jumlah (Rp)</label>
                            <input
                                type="number"
                                value={data.jumlah}
                                onChange={(e) => setData('jumlah', e.target.value)}
                                min="1"
                                placeholder="0"
                                className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                            />
                            {data.jumlah > 0 && (
                                <p className="mt-1 text-sm text-on-tertiary-container">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(data.jumlah)}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-on-surface-variant mb-1">Tujuan / Penerima</label>
                            <input
                                type="text"
                                value={data.tujuan_penerima}
                                onChange={(e) => setData('tujuan_penerima', e.target.value)}
                                placeholder="Nama supplier / penerima dana / vendor"
                                className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-on-surface-variant mb-1">Keterangan / Rincian</label>
                            <textarea
                                value={data.keterangan}
                                onChange={(e) => setData('keterangan', e.target.value)}
                                rows="4"
                                placeholder="Detail pengeluaran, rincian item, atau alasan..."
                                className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-on-surface-variant mb-1">Lampiran Kuitansi (opsional)</label>
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => setData('lampiran', e.target.files[0])}
                                className="w-full text-sm text-on-surface-variant file:mr-3 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-primary file:text-white hover:file:opacity-90"
                            />
                            <p className="mt-1 text-xs text-on-tertiary-container">Max 5MB · JPG, PNG, atau PDF</p>
                        </div>

                        <div className="pt-3 border-t border-outline-variant/15">
                            <SignaturePad
                                label="Tanda Tangan Pemohon *"
                                value={data.ttd_pemohon}
                                onChange={(v) => setData('ttd_pemohon', v)}
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4">
                            <Link
                                href="/pengajuan"
                                className="px-4 py-2 text-sm font-medium text-on-surface-variant bg-surface-container-low rounded-xl hover:bg-gray-200"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl hover:opacity-90 disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Ajukan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
