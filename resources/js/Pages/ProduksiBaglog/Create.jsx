import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';
import FormAlert from '@/Components/FormAlert';
import InputError from '@/Components/InputError';
import EmptyOption from '@/Components/EmptyOption';

export default function ProduksiBaglogCreate({ nextKode, karyawans, bahanBakus }) {
    const { data, setData, post, processing, errors } = useForm({
        tanggal: new Date().toISOString().split('T')[0],
        jumlah_baglog: '',
        karyawan_id: '',
        catatan: '',
        bahan_bakus: [{ bahan_baku_id: '', jumlah: '' }],
    });

    const addBahanBaku = () => {
        setData('bahan_bakus', [...data.bahan_bakus, { bahan_baku_id: '', jumlah: '' }]);
    };

    const removeBahanBaku = (index) => {
        const newBahanBakus = data.bahan_bakus.filter((_, i) => i !== index);
        setData('bahan_bakus', newBahanBakus);
    };

    const updateBahanBaku = (index, field, value) => {
        const newBahanBakus = [...data.bahan_bakus];
        newBahanBakus[index][field] = value;
        setData('bahan_bakus', newBahanBakus);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/produksi-baglog');
    };

    const getBahanBakuInfo = (id) => {
        return bahanBakus.find(b => b.id == id);
    };

    // Helper: check if a field has error (supports nested like bahan_bakus.0.bahan_baku_id)
    const hasError = (field) => {
        return Object.keys(errors).some(key => key === field || key.startsWith(field));
    };

    const inputClass = (field) =>
        `w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-secondary transition-colors ${
            hasError(field) ? 'border-red-400 bg-red-50/50' : 'border-outline-variant/30'
        }`;

    return (
        <AdminLayout title="Produksi Baru">
            <Head title="Produksi Baglog Baru" />

            <div className="max-w-3xl">
                <div className="mb-6">
                    <Link href="/produksi-baglog" className="inline-flex items-center text-sm text-on-surface-variant hover:text-on-surface">
                        <MIcon name="arrow_back" className="text-base mr-1" />
                        Kembali
                    </Link>
                </div>

                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-6">
                    <h2 className="text-lg font-headline font-bold text-on-surface mb-6">Produksi Baglog Baru</h2>

                    <FormAlert errors={errors} />

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">Kode Produksi</label>
                                <input
                                    type="text"
                                    value={nextKode}
                                    readOnly
                                    className="w-full px-4 py-2 border border-outline-variant/15 rounded-xl bg-surface-container-low text-on-surface-variant cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                    Tanggal <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={data.tanggal}
                                    onChange={(e) => setData('tanggal', e.target.value)}
                                    className={inputClass('tanggal')}
                                />
                                <InputError message={errors.tanggal} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                    Jumlah Baglog <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.jumlah_baglog}
                                    onChange={(e) => setData('jumlah_baglog', e.target.value)}
                                    min="1"
                                    placeholder="Contoh: 100"
                                    className={inputClass('jumlah_baglog')}
                                />
                                <InputError message={errors.jumlah_baglog} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">Operator</label>
                                {karyawans.length === 0 ? (
                                    <EmptyOption label="Karyawan" href="/karyawan/create" />
                                ) : (
                                    <select
                                        value={data.karyawan_id}
                                        onChange={(e) => setData('karyawan_id', e.target.value)}
                                        className={inputClass('karyawan_id')}
                                    >
                                        <option value="">Pilih Karyawan</option>
                                        {karyawans.map((k) => (
                                            <option key={k.id} value={k.id}>{k.nama}</option>
                                        ))}
                                    </select>
                                )}
                                <InputError message={errors.karyawan_id} />
                            </div>
                        </div>

                        {/* Bahan Baku */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-medium text-on-surface-variant">
                                    Bahan Baku yang Digunakan <span className="text-red-500">*</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={addBahanBaku}
                                    className="inline-flex items-center px-3 py-1 text-sm text-secondary hover:bg-blue-50 rounded-xl"
                                >
                                    <MIcon name="add" className="text-base mr-1" />
                                    Tambah
                                </button>
                            </div>

                            {bahanBakus.length === 0 ? (
                                <EmptyOption label="Bahan Baku" href="/bahan-baku/create" />
                            ) : (
                            <div className="space-y-3">
                                {data.bahan_bakus.map((item, index) => (
                                    <div key={index}>
                                        <div className="flex gap-3 items-start">
                                            <div className="flex-1">
                                                <select
                                                    value={item.bahan_baku_id}
                                                    onChange={(e) => updateBahanBaku(index, 'bahan_baku_id', e.target.value)}
                                                    className={inputClass(`bahan_bakus.${index}.bahan_baku_id`)}
                                                >
                                                    <option value="">Pilih Bahan Baku</option>
                                                    {bahanBakus.map((bb) => (
                                                        <option key={bb.id} value={bb.id}>
                                                            {bb.nama} (Stok: {bb.stok} {bb.satuan})
                                                        </option>
                                                    ))}
                                                </select>
                                                <InputError message={errors[`bahan_bakus.${index}.bahan_baku_id`]} />
                                            </div>
                                            <div className="w-32">
                                                <div className="flex">
                                                    <input
                                                        type="number"
                                                        value={item.jumlah}
                                                        onChange={(e) => updateBahanBaku(index, 'jumlah', e.target.value)}
                                                        min="1"
                                                        placeholder="Jumlah"
                                                        className={`w-full px-3 py-2 border rounded-l-lg focus:ring-2 focus:ring-secondary ${
                                                            hasError(`bahan_bakus.${index}.jumlah`) ? 'border-red-400 bg-red-50/50' : 'border-outline-variant/30'
                                                        }`}
                                                    />
                                                    <span className="px-2 py-2 bg-surface-container-low border border-l-0 border-outline-variant/30 rounded-r-lg text-on-surface-variant text-sm">
                                                        {getBahanBakuInfo(item.bahan_baku_id)?.satuan || '-'}
                                                    </span>
                                                </div>
                                                <InputError message={errors[`bahan_bakus.${index}.jumlah`]} />
                                            </div>
                                            {data.bahan_bakus.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeBahanBaku(index)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                                                >
                                                    <MIcon name="delete" className="text-xl" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            )}
                            <InputError message={errors.bahan_bakus} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-on-surface-variant mb-1">Catatan</label>
                            <textarea
                                value={data.catatan}
                                onChange={(e) => setData('catatan', e.target.value)}
                                rows="3"
                                className={inputClass('catatan')}
                            />
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-4">
                            <Link href="/produksi-baglog" className="px-4 py-2 text-sm font-medium text-on-surface-variant bg-surface-container-low rounded-xl hover:bg-surface-container-high">
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 text-sm font-bold text-white primary-gradient rounded-xl shadow-clinical-sm hover:opacity-90 disabled:opacity-50 transition-all active:scale-[0.98]"
                            >
                                {processing ? 'Menyimpan...' : 'Mulai Produksi'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
