import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Icon } from '@iconify/react';

export default function QrAbsensiScan({ karyawans }) {
    const [scanType, setScanType] = useState('masuk');
    const { data, setData, post, processing, errors, reset } = useForm({
        kode_qr: '',
        karyawan_id: '',
        tipe: 'masuk',
        lokasi: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/qr-absensi/scan', {
            onSuccess: () => reset('kode_qr'),
        });
    };

    return (
        <AdminLayout title="Scan Absensi">
            <Head title="Scan Absensi" />

            <div className="max-w-xl mx-auto">
                <div className="mb-6">
                    <Link href="/qr-absensi" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
                        <Icon icon="solar:arrow-left-bold" className="w-4 h-4 mr-1" />
                        Kembali
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-center mb-6">
                        <Icon icon="solar:qr-code-bold" className="w-12 h-12 text-green-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">Scan Absensi</h2>

                    {/* Scan Type Toggle */}
                    <div className="flex rounded-lg border border-gray-200 p-1 mb-6">
                        <button
                            type="button"
                            onClick={() => { setScanType('masuk'); setData('tipe', 'masuk'); }}
                            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                scanType === 'masuk' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <Icon icon="solar:login-3-bold" className="w-5 h-5 mr-2" />
                            Masuk
                        </button>
                        <button
                            type="button"
                            onClick={() => { setScanType('keluar'); setData('tipe', 'keluar'); }}
                            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                scanType === 'keluar' ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <Icon icon="solar:logout-3-bold" className="w-5 h-5 mr-2" />
                            Keluar
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Karyawan <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.karyawan_id}
                                onChange={(e) => setData('karyawan_id', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-lg"
                            >
                                <option value="">Pilih Karyawan</option>
                                {karyawans.map((k) => (
                                    <option key={k.id} value={k.id}>{k.nama}</option>
                                ))}
                            </select>
                            {errors.karyawan_id && <p className="mt-1 text-sm text-red-600">{errors.karyawan_id}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kode QR <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.kode_qr}
                                onChange={(e) => setData('kode_qr', e.target.value.toUpperCase())}
                                placeholder="Masukkan atau scan kode QR"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-lg font-mono"
                                autoFocus
                            />
                            {errors.kode_qr && <p className="mt-1 text-sm text-red-600">{errors.kode_qr}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi (Opsional)</label>
                            <input
                                type="text"
                                value={data.lokasi}
                                onChange={(e) => setData('lokasi', e.target.value)}
                                placeholder="Contoh: Gerbang Utama"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full py-3 text-white font-medium rounded-lg transition-colors disabled:opacity-50 ${
                                scanType === 'masuk' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                            }`}
                        >
                            {processing ? 'Memproses...' : `Scan ${scanType === 'masuk' ? 'Masuk' : 'Keluar'}`}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-4">
                        Jam saat ini: {new Date().toLocaleTimeString('id-ID')}
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
