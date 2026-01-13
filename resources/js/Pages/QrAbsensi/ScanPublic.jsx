import { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Icon } from '@iconify/react';

export default function ScanPublic() {
    const [scanType, setScanType] = useState('masuk');
    const [currentTime, setCurrentTime] = useState(new Date());
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        pin: '',
        kode_qr: '',
        tipe: 'masuk',
    });

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/absensi-publik', {
            onSuccess: () => {
                reset('pin', 'kode_qr');
            },
        });
    };

    const handlePinChange = (value) => {
        // Only allow numbers and max 6 digits
        const numericValue = value.replace(/\D/g, '').slice(0, 6);
        setData('pin', numericValue);
    };

    return (
        <>
            <Head title="Absensi Karyawan" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
                            <Icon icon="solar:qr-code-bold" className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">Absensi Karyawan</h1>
                        <p className="text-gray-600">Defila Solusi Bersama Indonesia</p>
                    </div>

                    {/* Success Message */}
                    {flash?.success && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-300 rounded-xl flex items-start">
                            <Icon icon="solar:check-circle-bold" className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                            <p className="text-green-800 font-medium">{flash.success}</p>
                        </div>
                    )}

                    {/* Error Messages */}
                    {(errors.pin || errors.kode_qr) && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-xl flex items-start">
                            <Icon icon="solar:close-circle-bold" className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                            <p className="text-red-800 font-medium">{errors.pin || errors.kode_qr}</p>
                        </div>
                    )}

                    {/* Main Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        {/* Current Time */}
                        <div className="text-center mb-6 p-3 bg-gray-50 rounded-xl">
                            <p className="text-sm text-gray-500">Waktu Sekarang</p>
                            <p className="text-3xl font-bold text-gray-800 font-mono">
                                {currentTime.toLocaleTimeString('id-ID')}
                            </p>
                            <p className="text-sm text-gray-500">
                                {currentTime.toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>

                        {/* Scan Type Toggle */}
                        <div className="flex rounded-xl border-2 border-gray-200 p-1 mb-6">
                            <button
                                type="button"
                                onClick={() => { setScanType('masuk'); setData('tipe', 'masuk'); }}
                                className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                                    scanType === 'masuk'
                                        ? 'bg-green-600 text-white shadow-lg'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Icon icon="solar:login-3-bold" className="w-5 h-5 mr-2" />
                                MASUK
                            </button>
                            <button
                                type="button"
                                onClick={() => { setScanType('keluar'); setData('tipe', 'keluar'); }}
                                className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                                    scanType === 'keluar'
                                        ? 'bg-red-600 text-white shadow-lg'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Icon icon="solar:logout-3-bold" className="w-5 h-5 mr-2" />
                                KELUAR
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* PIN Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    PIN Karyawan (6 digit)
                                </label>
                                <input
                                    type="password"
                                    inputMode="numeric"
                                    value={data.pin}
                                    onChange={(e) => handlePinChange(e.target.value)}
                                    placeholder="******"
                                    maxLength={6}
                                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center text-2xl font-bold tracking-widest"
                                    autoComplete="off"
                                />
                                <p className="mt-1 text-xs text-gray-500 text-center">
                                    Masukkan 6 digit PIN yang diberikan admin
                                </p>
                            </div>

                            {/* QR Code Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Kode QR
                                </label>
                                <input
                                    type="text"
                                    value={data.kode_qr}
                                    onChange={(e) => setData('kode_qr', e.target.value.toUpperCase())}
                                    placeholder="Masukkan kode dari layar kantor"
                                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center text-lg font-mono uppercase"
                                    autoComplete="off"
                                />
                                <p className="mt-1 text-xs text-gray-500 text-center">
                                    Lihat kode di layar/TV kantor
                                </p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing || data.pin.length !== 6 || !data.kode_qr}
                                className={`w-full py-4 text-white font-bold text-lg rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                    scanType === 'masuk'
                                        ? 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                                        : 'bg-red-600 hover:bg-red-700 active:bg-red-800'
                                }`}
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Memproses...
                                    </span>
                                ) : (
                                    `ABSEN ${scanType.toUpperCase()}`
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Hubungi admin jika lupa PIN
                    </p>
                </div>
            </div>
        </>
    );
}
