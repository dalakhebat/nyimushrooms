import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Icon } from '@iconify/react';

export default function KaryawanEdit({ karyawan }) {
    const { data, setData, put, processing, errors } = useForm({
        nama: karyawan.nama || '',
        no_hp: karyawan.no_hp || '',
        pin: karyawan.pin || '',
        alamat: karyawan.alamat || '',
        bagian: karyawan.bagian || '',
        tanggal_masuk: karyawan.tanggal_masuk || '',
        tipe_gaji: karyawan.tipe_gaji || 'mingguan',
        nominal_gaji: karyawan.nominal_gaji || '',
        status: karyawan.status || 'aktif',
    });

    const generateRandomPin = () => {
        const pin = Math.floor(100000 + Math.random() * 900000).toString();
        setData('pin', pin);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put('/karyawan/' + karyawan.id);
    };

    return (
        <AdminLayout title="Edit Karyawan">
            <Head title="Edit Karyawan" />

            <div className="max-w-2xl">
                <div className="mb-6">
                    <Link
                        href="/karyawan"
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                        <Icon icon="solar:arrow-left-bold" className="w-4 h-4 mr-1" />
                        Kembali
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">
                        Edit Data Karyawan
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nama Lengkap <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                placeholder="Nama lengkap karyawan"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                            {errors.nama && (
                                <p className="mt-1 text-sm text-red-600">{errors.nama}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                No. HP
                            </label>
                            <input
                                type="text"
                                value={data.no_hp}
                                onChange={(e) => setData('no_hp', e.target.value)}
                                placeholder="Contoh: 08123456789"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                            {errors.no_hp && (
                                <p className="mt-1 text-sm text-red-600">{errors.no_hp}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                PIN Absensi (6 digit)
                            </label>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={data.pin}
                                    onChange={(e) => setData('pin', e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="Contoh: 123456"
                                    maxLength={6}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono tracking-widest"
                                />
                                <button
                                    type="button"
                                    onClick={generateRandomPin}
                                    className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
                                >
                                    Generate
                                </button>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">PIN digunakan untuk absensi QR Code</p>
                            {errors.pin && (
                                <p className="mt-1 text-sm text-red-600">{errors.pin}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Alamat
                            </label>
                            <textarea
                                value={data.alamat}
                                onChange={(e) => setData('alamat', e.target.value)}
                                placeholder="Alamat lengkap"
                                rows="2"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                            {errors.alamat && (
                                <p className="mt-1 text-sm text-red-600">{errors.alamat}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bagian
                            </label>
                            <select
                                value={data.bagian}
                                onChange={(e) => setData('bagian', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">Pilih Bagian</option>
                                <option value="KANTOR">Kantor</option>
                                <option value="UMUM">Umum</option>
                                <option value="PANEN">Panen</option>
                                <option value="BIBIT">Bibit</option>
                                <option value="PENGAYAKAN">Pengayakan</option>
                                <option value="PENGADUKAN">Pengadukan</option>
                                <option value="PENGANTONGAN">Pengantongan</option>
                                <option value="AUTOCLOVE">Autoclove</option>
                                <option value="STEAMER">Steamer</option>
                                <option value="INOKULASI">Inokulasi</option>
                                <option value="INKUBASI 2">Inkubasi 2</option>
                            </select>
                            {errors.bagian && (
                                <p className="mt-1 text-sm text-red-600">{errors.bagian}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tanggal Masuk
                            </label>
                            <input
                                type="date"
                                value={data.tanggal_masuk}
                                onChange={(e) => setData('tanggal_masuk', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                            {errors.tanggal_masuk && (
                                <p className="mt-1 text-sm text-red-600">{errors.tanggal_masuk}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipe Gaji <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.tipe_gaji}
                                    onChange={(e) => setData('tipe_gaji', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="mingguan">Mingguan</option>
                                    <option value="bulanan">Bulanan</option>
                                    <option value="borongan">Borongan</option>
                                </select>
                                {errors.tipe_gaji && (
                                    <p className="mt-1 text-sm text-red-600">{errors.tipe_gaji}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nominal Gaji <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        Rp
                                    </span>
                                    <input
                                        type="number"
                                        value={data.nominal_gaji}
                                        onChange={(e) => setData('nominal_gaji', e.target.value)}
                                        placeholder="0"
                                        min="0"
                                        className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                                {errors.nominal_gaji && (
                                    <p className="mt-1 text-sm text-red-600">{errors.nominal_gaji}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="aktif">Aktif</option>
                                <option value="nonaktif">Nonaktif</option>
                            </select>
                            {errors.status && (
                                <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-4">
                            <Link
                                href="/karyawan"
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Update'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
