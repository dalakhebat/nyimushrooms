import { useEffect, useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import MIcon from '@/Components/MIcon';
import SignaturePad from '@/Components/SignaturePad';

const STEPS = [
    { num: 1, title: 'Identitas', icon: 'person' },
    { num: 2, title: 'Detail Pengeluaran', icon: 'payments' },
    { num: 3, title: 'Keterangan', icon: 'description' },
    { num: 4, title: 'Tanda Tangan', icon: 'edit' },
];

const STATUS_BADGES = {
    diajukan: { label: 'Diajukan', className: 'bg-yellow-100 text-yellow-800' },
    disetujui: { label: 'Disetujui', className: 'bg-blue-100 text-blue-800' },
    cair: { label: 'Cair', className: 'bg-emerald-100 text-secondary' },
    ditolak: { label: 'Ditolak', className: 'bg-red-100 text-red-700' },
};

export default function PublicPengajuanForm({ kategoris, flash }) {
    const [mode, setMode] = useState('buat');
    const [step, setStep] = useState(1);
    const [lacakNomor, setLacakNomor] = useState('');
    const [history, setHistory] = useState([]);

    useEffect(() => {
        try {
            const raw = localStorage.getItem('defila_pengajuan_history');
            setHistory(raw ? JSON.parse(raw) : []);
        } catch (_) {
            setHistory([]);
        }
    }, []);

    const handleLacak = (e) => {
        e?.preventDefault();
        const nomor = lacakNomor.trim().toUpperCase();
        if (!nomor) {
            alert('Mohon isi nomor pengajuan');
            return;
        }
        router.visit(`/ajukan/${nomor}/lacak`);
    };

    const hapusHistori = (nomor) => {
        if (!confirm(`Hapus ${nomor} dari riwayat perangkat ini? (data di server tidak terhapus)`)) return;
        const next = history.filter((x) => x.nomor !== nomor);
        localStorage.setItem('defila_pengajuan_history', JSON.stringify(next));
        setHistory(next);
    };

    const formatRupiahShort = (v) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0);

    const formatDateShort = (d) =>
        d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';


    const { data, setData, post, processing, errors } = useForm({
        pemohon_nama: '',
        tanggal_pengajuan: new Date().toISOString().split('T')[0],
        kategori: '',
        jumlah: '',
        tujuan_penerima: '',
        keterangan: '',
        ttd_pemohon: '',
        lampiran: null,
    });

    const formatRupiah = (v) =>
        v ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v) : '';

    const validateStep = () => {
        if (step === 1) {
            if (!data.pemohon_nama.trim()) {
                alert('Mohon isi nama lengkap Anda');
                return false;
            }
            if (!data.tanggal_pengajuan) {
                alert('Mohon pilih tanggal pengajuan');
                return false;
            }
        }
        if (step === 2) {
            if (!data.kategori) {
                alert('Mohon pilih kategori pengeluaran');
                return false;
            }
            if (!data.jumlah || parseFloat(data.jumlah) < 1) {
                alert('Mohon isi jumlah pengeluaran');
                return false;
            }
            if (!data.tujuan_penerima.trim()) {
                alert('Mohon isi tujuan / penerima dana');
                return false;
            }
        }
        if (step === 3) {
            if (!data.keterangan.trim()) {
                alert('Mohon isi keterangan / rincian');
                return false;
            }
        }
        if (step === 4) {
            if (!data.ttd_pemohon) {
                alert('Mohon gambar tanda tangan Anda');
                return false;
            }
        }
        return true;
    };

    const handleNext = () => {
        if (!validateStep()) return;
        if (step < 4) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = () => {
        if (!validateStep()) return;
        post('/ajukan', { forceFormData: true });
    };

    return (
        <PublicLayout
            title={mode === 'buat' ? 'Form Pengajuan Pengeluaran' : 'Lacak Pengajuan'}
            subtitle={mode === 'buat'
                ? 'Isi form di bawah untuk pengajuan pengeluaran dari kas Defila'
                : 'Cek status pengajuan kamu pakai nomor atau riwayat di perangkat ini'}
        >
            <Head title="Pengajuan Pengeluaran" />

            {/* Mode Tabs */}
            <div className="grid grid-cols-2 border-b border-outline-variant/15">
                <button
                    type="button"
                    onClick={() => setMode('buat')}
                    className={`px-4 py-3 text-sm font-bold inline-flex items-center justify-center gap-1 transition-colors ${
                        mode === 'buat'
                            ? 'bg-white text-primary border-b-2 border-primary'
                            : 'bg-surface-container-low text-on-tertiary-container hover:text-on-surface'
                    }`}
                >
                    <MIcon name="edit_note" className="text-base" />
                    Buat Pengajuan
                </button>
                <button
                    type="button"
                    onClick={() => setMode('lacak')}
                    className={`px-4 py-3 text-sm font-bold inline-flex items-center justify-center gap-1 transition-colors ${
                        mode === 'lacak'
                            ? 'bg-white text-primary border-b-2 border-primary'
                            : 'bg-surface-container-low text-on-tertiary-container hover:text-on-surface'
                    }`}
                >
                    <MIcon name="search" className="text-base" />
                    Lacak Pengajuan
                    {history.length > 0 && (
                        <span className="ml-1 px-2 py-0.5 text-[10px] bg-primary text-white rounded-full">{history.length}</span>
                    )}
                </button>
            </div>

            {flash?.error && (
                <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-start gap-2">
                    <MIcon name="error" className="text-base flex-shrink-0" />
                    <span>{flash.error}</span>
                </div>
            )}

            {mode === 'lacak' && (
                <div className="p-6 space-y-6">
                    {/* Search by nomor */}
                    <form onSubmit={handleLacak} className="space-y-3">
                        <label className="block text-sm font-bold text-on-surface">
                            Masukkan Nomor Pengajuan
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={lacakNomor}
                                onChange={(e) => setLacakNomor(e.target.value)}
                                placeholder="Contoh: PENG-2026-0010"
                                className="flex-1 px-4 py-3 border-2 border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-base font-mono uppercase"
                            />
                            <button
                                type="submit"
                                className="px-5 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 inline-flex items-center"
                            >
                                <MIcon name="search" className="text-base mr-1" />
                                Lacak
                            </button>
                        </div>
                        <p className="text-xs text-on-tertiary-container">
                            Nomor pengajuan kamu dapat di halaman sukses setelah submit form.
                        </p>
                    </form>

                    {/* Riwayat dari device ini */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-on-surface">
                                Riwayat dari Perangkat Ini
                            </h3>
                            {history.length > 0 && (
                                <span className="text-xs text-on-tertiary-container">{history.length} pengajuan</span>
                            )}
                        </div>

                        {history.length === 0 ? (
                            <div className="bg-surface-container-low border border-dashed border-outline-variant/40 rounded-xl p-6 text-center">
                                <MIcon name="inbox" className="text-4xl text-on-tertiary-container" />
                                <p className="text-sm text-on-tertiary-container mt-2">
                                    Belum ada pengajuan yang dibuat dari perangkat ini.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setMode('buat')}
                                    className="mt-3 inline-flex items-center px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:opacity-90"
                                >
                                    <MIcon name="add" className="text-base mr-1" />
                                    Buat Pengajuan Pertama
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {history.map((h) => {
                                    const badge = STATUS_BADGES[h.status] || STATUS_BADGES.diajukan;
                                    return (
                                        <div
                                            key={h.nomor}
                                            className="bg-white border border-outline-variant/20 rounded-xl p-4 hover:border-primary/40 hover:shadow-sm transition-all"
                                        >
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-mono font-bold text-secondary">{h.nomor}</p>
                                                    <p className="text-xs text-on-tertiary-container mt-0.5">
                                                        {h.pemohon_nama} · {formatDateShort(h.tanggal_pengajuan)}
                                                    </p>
                                                </div>
                                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full whitespace-nowrap ${badge.className}`}>
                                                    {badge.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-2 mb-3">
                                                <p className="text-xs text-on-surface truncate">
                                                    <span className="text-on-tertiary-container">Untuk:</span> {h.tujuan_penerima}
                                                </p>
                                                <p className="text-sm font-bold text-primary whitespace-nowrap">
                                                    {formatRupiahShort(h.jumlah)}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => router.visit(`/ajukan/${h.nomor}/lacak`)}
                                                    className="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:opacity-90 inline-flex items-center justify-center"
                                                >
                                                    <MIcon name="visibility" className="text-sm mr-1" />
                                                    Lihat Status
                                                </button>
                                                <a
                                                    href={`/ajukan/${h.nomor}/pdf`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="px-3 py-2 bg-secondary text-white rounded-lg text-xs font-medium hover:opacity-90 inline-flex items-center justify-center"
                                                >
                                                    <MIcon name="print" className="text-sm" />
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() => hapusHistori(h.nomor)}
                                                    className="px-3 py-2 bg-surface-container-low text-on-tertiary-container rounded-lg text-xs hover:bg-red-50 hover:text-red-600 inline-flex items-center justify-center"
                                                    title="Hapus dari riwayat perangkat ini"
                                                >
                                                    <MIcon name="delete" className="text-sm" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                                <p className="text-[11px] text-on-tertiary-container text-center mt-3">
                                    Riwayat hanya tersimpan di perangkat ini. Buka di HP/laptop lain ⇒ riwayat berbeda.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {mode === 'buat' && (<>
            {/* Progress Indicator */}
            <div className="px-6 pt-6 pb-4 border-b border-outline-variant/15">
                <div className="flex items-center justify-between mb-2">
                    {STEPS.map((s, i) => (
                        <div key={s.num} className="flex-1 flex items-center">
                            <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                                    s.num < step
                                        ? 'bg-secondary text-white'
                                        : s.num === step
                                        ? 'bg-primary text-white shadow-md scale-110'
                                        : 'bg-gray-200 text-gray-400'
                                }`}
                            >
                                {s.num < step ? <MIcon name="check" className="text-base" /> : s.num}
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`flex-1 h-1 mx-1 rounded ${s.num < step ? 'bg-secondary' : 'bg-gray-200'}`} />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-between text-xs text-on-tertiary-container">
                    {STEPS.map((s) => (
                        <span
                            key={s.num}
                            className={`flex-1 text-center ${s.num === step ? 'text-primary font-bold' : ''}`}
                        >
                            {s.title}
                        </span>
                    ))}
                </div>
            </div>

            <div className="p-6">
                {/* STEP 1: Identitas */}
                {step === 1 && (
                    <div className="space-y-5">
                        <div className="text-center mb-2">
                            <h3 className="text-lg font-bold text-on-surface">Siapa yang mengajukan?</h3>
                            <p className="text-sm text-on-tertiary-container mt-1">
                                Tulis nama lengkap Anda sebagai pemohon
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-on-surface mb-2">
                                Nama Lengkap <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.pemohon_nama}
                                onChange={(e) => setData('pemohon_nama', e.target.value)}
                                placeholder="Contoh: Mba Nia"
                                className="w-full px-4 py-3 border-2 border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-base"
                                autoFocus
                            />
                            {errors.pemohon_nama && <p className="mt-1 text-sm text-red-600">{errors.pemohon_nama}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-on-surface mb-2">
                                Tanggal Pengajuan <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={data.tanggal_pengajuan}
                                onChange={(e) => setData('tanggal_pengajuan', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-base"
                            />
                            {errors.tanggal_pengajuan && <p className="mt-1 text-sm text-red-600">{errors.tanggal_pengajuan}</p>}
                        </div>
                    </div>
                )}

                {/* STEP 2: Detail Pengeluaran */}
                {step === 2 && (
                    <div className="space-y-5">
                        <div className="text-center mb-2">
                            <h3 className="text-lg font-bold text-on-surface">Detail Pengeluaran</h3>
                            <p className="text-sm text-on-tertiary-container mt-1">
                                Untuk apa & berapa besar pengeluaran ini?
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-on-surface mb-2">
                                Kategori <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {kategoris.map((k) => (
                                    <button
                                        type="button"
                                        key={k}
                                        onClick={() => setData('kategori', k)}
                                        className={`px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                                            data.kategori === k
                                                ? 'bg-primary text-white border-primary'
                                                : 'bg-white text-on-surface border-outline-variant/30 hover:border-primary/50'
                                        }`}
                                    >
                                        {k.charAt(0).toUpperCase() + k.slice(1)}
                                    </button>
                                ))}
                            </div>
                            {errors.kategori && <p className="mt-1 text-sm text-red-600">{errors.kategori}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-on-surface mb-2">
                                Jumlah Pengeluaran (Rp) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={data.jumlah}
                                onChange={(e) => setData('jumlah', e.target.value)}
                                min="1"
                                placeholder="0"
                                className="w-full px-4 py-3 border-2 border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-base"
                            />
                            {data.jumlah > 0 && (
                                <div className="mt-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                                    <p className="text-sm font-bold text-secondary">
                                        {formatRupiah(data.jumlah)}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-on-surface mb-2">
                                Untuk Siapa / Tujuan <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.tujuan_penerima}
                                onChange={(e) => setData('tujuan_penerima', e.target.value)}
                                placeholder="Contoh: Toko ABC, Pak Budi (Tukang), PLN"
                                className="w-full px-4 py-3 border-2 border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-base"
                            />
                            <p className="mt-1 text-xs text-on-tertiary-container">
                                Tulis nama orang/toko/vendor yg menerima dana
                            </p>
                        </div>
                    </div>
                )}

                {/* STEP 3: Keterangan */}
                {step === 3 && (
                    <div className="space-y-5">
                        <div className="text-center mb-2">
                            <h3 className="text-lg font-bold text-on-surface">Keterangan & Bukti</h3>
                            <p className="text-sm text-on-tertiary-container mt-1">
                                Jelaskan rincian pengeluaran biar gampang di-approve
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-on-surface mb-2">
                                Keterangan / Rincian <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={data.keterangan}
                                onChange={(e) => setData('keterangan', e.target.value)}
                                rows="5"
                                placeholder="Contoh:&#10;- Beli serbuk gergaji 500kg @ Rp 1.500 = Rp 750.000&#10;- Bayar listrik bulan April&#10;- Servis mesin pencacah"
                                className="w-full px-4 py-3 border-2 border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-base"
                            />
                            <p className="mt-1 text-xs text-on-tertiary-container">
                                Semakin detail semakin baik · Bisa pakai bullet (-) atau angka
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-on-surface mb-2">
                                Lampiran Kuitansi <span className="text-on-tertiary-container font-normal">(opsional)</span>
                            </label>
                            <div className="border-2 border-dashed border-outline-variant/40 rounded-xl p-4 text-center">
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => setData('lampiran', e.target.files[0])}
                                    className="hidden"
                                    id="lampiran-input"
                                />
                                <label htmlFor="lampiran-input" className="cursor-pointer block">
                                    <MIcon name="upload" className="text-3xl text-on-tertiary-container" />
                                    <p className="text-sm font-medium text-on-surface mt-2">
                                        {data.lampiran ? data.lampiran.name : 'Klik untuk upload foto kuitansi'}
                                    </p>
                                    <p className="text-xs text-on-tertiary-container mt-1">JPG, PNG, atau PDF · Max 5MB</p>
                                </label>
                            </div>
                            {data.lampiran && (
                                <button
                                    type="button"
                                    onClick={() => setData('lampiran', null)}
                                    className="mt-2 text-xs text-red-600 hover:underline"
                                >
                                    Hapus lampiran
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* STEP 4: TTD */}
                {step === 4 && (
                    <div className="space-y-5">
                        <div className="text-center mb-2">
                            <h3 className="text-lg font-bold text-on-surface">Tanda Tangan & Konfirmasi</h3>
                            <p className="text-sm text-on-tertiary-container mt-1">
                                Gambar tanda tangan Anda di kotak putih bawah ini
                            </p>
                        </div>

                        {/* Ringkasan */}
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2 text-sm">
                            <p className="font-bold text-secondary mb-2">Ringkasan Pengajuan:</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <span className="text-on-tertiary-container">Pemohon:</span>
                                <span className="font-medium">{data.pemohon_nama}</span>
                                <span className="text-on-tertiary-container">Tanggal:</span>
                                <span className="font-medium">{data.tanggal_pengajuan}</span>
                                <span className="text-on-tertiary-container">Kategori:</span>
                                <span className="font-medium capitalize">{data.kategori}</span>
                                <span className="text-on-tertiary-container">Penerima:</span>
                                <span className="font-medium">{data.tujuan_penerima}</span>
                                <span className="text-on-tertiary-container">Jumlah:</span>
                                <span className="font-bold text-secondary">{formatRupiah(data.jumlah)}</span>
                            </div>
                        </div>

                        <SignaturePad
                            label="Tanda Tangan Anda *"
                            value={data.ttd_pemohon}
                            onChange={(v) => setData('ttd_pemohon', v)}
                            height={180}
                        />

                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-900">
                            <p className="font-bold mb-1">Catatan:</p>
                            <p>Setelah submit, pengajuan akan masuk ke sistem dan menunggu persetujuan dari pihak management.</p>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-3 mt-8 pt-5 border-t border-outline-variant/15">
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={handleBack}
                            disabled={processing}
                            className="px-6 py-3 text-sm font-medium text-on-surface-variant bg-surface-container-low rounded-xl hover:bg-gray-200 disabled:opacity-50 inline-flex items-center"
                        >
                            <MIcon name="arrow_back" className="text-base mr-1" />
                            Kembali
                        </button>
                    )}
                    {step < 4 ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="flex-1 px-6 py-3 text-sm font-bold text-white bg-primary rounded-xl hover:opacity-90 inline-flex items-center justify-center"
                        >
                            Lanjut
                            <MIcon name="arrow_forward" className="text-base ml-1" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={processing}
                            className="flex-1 px-6 py-3 text-sm font-bold text-white bg-secondary rounded-xl hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center"
                        >
                            {processing ? (
                                <>
                                    <MIcon name="refresh" className="text-base mr-1 animate-spin" />
                                    Mengirim...
                                </>
                            ) : (
                                <>
                                    <MIcon name="send" className="text-base mr-1" />
                                    Kirim Pengajuan
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Errors */}
                {Object.keys(errors).length > 0 && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                        <p className="font-bold mb-1">Ada yang perlu diperbaiki:</p>
                        <ul className="list-disc pl-5">
                            {Object.values(errors).map((err, i) => (
                                <li key={i}>{err}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            </>)}
        </PublicLayout>
    );
}
