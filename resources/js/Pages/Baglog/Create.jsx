import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';
import FormAlert from '@/Components/FormAlert';
import EmptyOption from '@/Components/EmptyOption';

export default function BaglogCreate({ kumbungs }) {
    const { data, setData, post, processing, errors } = useForm({
        kode_batch: '',
        sumber: 'stok_awal',
        supplier_nama: '',
        harga_satuan: '',
        jumlah: '',
        tanggal_produksi: new Date().toISOString().slice(0, 10),
        kumbung_id: '',
        tanggal_tanam: '',
        status: 'produksi',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/baglog');
    };

    const formatRupiah = (num) => {
        const n = parseFloat(num) || 0;
        return new Intl.NumberFormat('id-ID').format(n);
    };

    const totalBiaya = (parseInt(data.jumlah) || 0) * (parseFloat(data.harga_satuan) || 0);

    // Generate suggested batch code
    const generateBatchCode = () => {
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        setData('kode_batch', `BL${year}${month}${day}-${random}`);
    };

    return (
        <AdminLayout title="Tambah Baglog">
            <Head title="Tambah Baglog" />

            <div className="mb-6">
                <Link
                    href="/baglog"
                    className="inline-flex items-center text-sm text-on-surface-variant hover:text-on-surface"
                >
                    <MIcon name="arrow_back" className="text-base mr-1" />
                    Kembali ke Daftar Baglog
                </Link>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm max-w-2xl">
                <div className="p-6 border-b border-outline-variant/15">
                    <h2 className="text-lg font-headline font-bold text-on-surface">Tambah Baglog (Non-Produksi)</h2>
                    <p className="text-sm text-on-surface-variant">
                        Catat stok awal atau pembelian baglog jadi. Untuk produksi dari bahan baku, gunakan menu{' '}
                        <Link href="/produksi-baglog" className="text-secondary underline">Produksi Baglog</Link>.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <FormAlert errors={errors} />

                    {/* Sumber Baglog */}
                    <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-2">
                            Sumber Baglog <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {[
                                { value: 'stok_awal', label: 'Stok Awal', desc: 'Initial stock / migrasi data lama' },
                                { value: 'beli_jadi', label: 'Beli Jadi', desc: 'Beli dari supplier luar (auto kas keluar)' },
                                { value: 'produksi_sendiri', label: 'Produksi Sendiri', desc: 'Input manual tanpa lewat produksi' },
                            ].map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setData('sumber', opt.value)}
                                    className={`text-left p-3 rounded-xl border-2 transition-all ${
                                        data.sumber === opt.value
                                            ? 'border-secondary bg-emerald-50'
                                            : 'border-outline-variant/30 hover:bg-surface-container-low'
                                    }`}
                                >
                                    <div className="font-medium text-on-surface text-sm">{opt.label}</div>
                                    <div className="text-xs text-on-surface-variant mt-1">{opt.desc}</div>
                                </button>
                            ))}
                        </div>
                        {data.sumber === 'produksi_sendiri' && (
                            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 flex items-start gap-2">
                                <MIcon name="warning" className="text-base mt-0.5" />
                                <span>
                                    <strong>Peringatan:</strong> Bahan baku <strong>tidak akan otomatis dipotong</strong> dari stok.
                                    Lebih baik pakai menu Produksi Baglog kalau baglog dibuat dari bahan baku yang tercatat di sistem.
                                </span>
                            </div>
                        )}
                        {errors.sumber && <p className="mt-1 text-sm text-red-600">{errors.sumber}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-1">
                            Kode Batch <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={data.kode_batch}
                                onChange={(e) => setData('kode_batch', e.target.value)}
                                className="flex-1 px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                                placeholder="Contoh: BL241228-001"
                            />
                            <button
                                type="button"
                                onClick={generateBatchCode}
                                className="px-4 py-2 bg-surface-container-low text-on-surface-variant rounded-xl hover:bg-gray-200"
                            >
                                Generate
                            </button>
                        </div>
                        {errors.kode_batch && <p className="mt-1 text-sm text-red-600">{errors.kode_batch}</p>}
                    </div>

                    {/* Supplier & Harga (hanya untuk beli_jadi) */}
                    {data.sumber === 'beli_jadi' && (
                        <div className="space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                            <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
                                <MIcon name="storefront" className="text-base" />
                                Detail Pembelian
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                    Nama Supplier <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.supplier_nama}
                                    onChange={(e) => setData('supplier_nama', e.target.value)}
                                    className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                                    placeholder="Contoh: Kang Oman - Ciamis"
                                />
                                {errors.supplier_nama && <p className="mt-1 text-sm text-red-600">{errors.supplier_nama}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                    Harga per Baglog (Rp) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="100"
                                    value={data.harga_satuan}
                                    onChange={(e) => setData('harga_satuan', e.target.value)}
                                    className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                                    placeholder="2500"
                                />
                                {errors.harga_satuan && <p className="mt-1 text-sm text-red-600">{errors.harga_satuan}</p>}
                            </div>
                            {totalBiaya > 0 && (
                                <div className="p-3 bg-white rounded-xl border border-outline-variant/30">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-on-surface-variant">Total Biaya:</span>
                                        <span className="font-bold text-on-surface">Rp {formatRupiah(totalBiaya)}</span>
                                    </div>
                                    <p className="text-xs text-on-tertiary-container mt-1">
                                        Akan dicatat otomatis di Kas sebagai pengeluaran
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                Jumlah Baglog <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={data.jumlah}
                                onChange={(e) => setData('jumlah', e.target.value)}
                                className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                                placeholder="0"
                                min="1"
                            />
                            {errors.jumlah && <p className="mt-1 text-sm text-red-600">{errors.jumlah}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                Tanggal Produksi <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={data.tanggal_produksi}
                                onChange={(e) => setData('tanggal_produksi', e.target.value)}
                                className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                            />
                            {errors.tanggal_produksi && <p className="mt-1 text-sm text-red-600">{errors.tanggal_produksi}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-1">
                            Status Awal <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                        >
                            <option value="produksi">Produksi (belum masuk kumbung)</option>
                            <option value="masuk_kumbung">Masuk Kumbung (langsung ditanam)</option>
                        </select>
                        {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                    </div>

                    {data.status === 'masuk_kumbung' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                    Kumbung
                                </label>
                                {kumbungs.length === 0 ? (
                                    <EmptyOption label="Kumbung" href="/kumbung/create" />
                                ) : (
                                    <select
                                        value={data.kumbung_id}
                                        onChange={(e) => setData('kumbung_id', e.target.value)}
                                        className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                                    >
                                        <option value="">Pilih Kumbung</option>
                                        {kumbungs.map((k) => (
                                            <option key={k.id} value={k.id}>{k.nama}</option>
                                        ))}
                                    </select>
                                )}
                                {errors.kumbung_id && <p className="mt-1 text-sm text-red-600">{errors.kumbung_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                    Tanggal Masuk Kumbung
                                </label>
                                <input
                                    type="date"
                                    value={data.tanggal_tanam}
                                    onChange={(e) => setData('tanggal_tanam', e.target.value)}
                                    className="w-full px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                                />
                                <p className="mt-1 text-xs text-on-tertiary-container">Estimasi selesai akan dihitung otomatis (5 bulan)</p>
                                {errors.tanggal_tanam && <p className="mt-1 text-sm text-red-600">{errors.tanggal_tanam}</p>}
                            </div>
                        </>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                        <Link
                            href="/baglog"
                            className="px-4 py-2 text-on-surface-variant hover:bg-surface-container-low rounded-xl"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary disabled:bg-gray-400"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
