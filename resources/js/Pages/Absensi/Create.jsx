import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Icon } from '@iconify/react';

export default function AbsensiCreate({ karyawans, tanggal, today }) {
    const [selectedDate, setSelectedDate] = useState(tanggal);
    const [processing, setProcessing] = useState(false);
    const [absensiData, setAbsensiData] = useState(
        karyawans.map((k) => ({
            karyawan_id: k.id,
            status: k.absensi_status || 'hadir',
            catatan: '',
        }))
    );

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        router.get('/absensi/create', { tanggal: newDate }, { preserveState: false });
    };

    const handleStatusChange = (index, status) => {
        const newData = [...absensiData];
        newData[index].status = status;
        setAbsensiData(newData);
    };

    const handleCatatanChange = (index, catatan) => {
        const newData = [...absensiData];
        newData[index].catatan = catatan;
        setAbsensiData(newData);
    };

    const setAllStatus = (status) => {
        setAbsensiData(absensiData.map((item) => ({ ...item, status })));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        router.post('/absensi', {
            tanggal: selectedDate,
            absensi: absensiData,
        }, {
            onFinish: () => setProcessing(false),
        });
    };

    const formatTanggal = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const statusOptions = [
        { value: 'hadir', label: 'Hadir', class: 'bg-green-500 hover:bg-green-600', textClass: 'text-white' },
        { value: 'izin', label: 'Izin', class: 'bg-blue-500 hover:bg-blue-600', textClass: 'text-white' },
        { value: 'sakit', label: 'Sakit', class: 'bg-yellow-400 hover:bg-yellow-500', textClass: 'text-yellow-900' },
        { value: 'alpha', label: 'Alpha', class: 'bg-red-500 hover:bg-red-600', textClass: 'text-white' },
    ];

    return (
        <AdminLayout title="Input Absensi">
            <Head title="Input Absensi" />

            <div className="mb-6">
                <Link
                    href="/absensi"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                    <Icon icon="solar:arrow-left-bold" className="w-4 h-4 mr-1" />
                    Kembali
                </Link>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Date Selector */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tanggal Absensi
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                max={today}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                            <p className="mt-1 text-sm text-gray-500">{formatTanggal(selectedDate)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Set Semua:</p>
                            <div className="flex space-x-3">
                                {statusOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setAllStatus(opt.value)}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg ${opt.class} ${opt.textClass}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attendance List */}
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Daftar Karyawan ({karyawans.length} orang)
                        </h2>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {karyawans.length === 0 ? (
                            <div className="px-6 py-12 text-center text-gray-500">
                                Tidak ada karyawan aktif
                            </div>
                        ) : (
                            karyawans.map((karyawan, index) => (
                                <div key={karyawan.id} className="p-5 hover:bg-gray-50">
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                                <Icon icon="solar:user-rounded-bold" className="w-6 h-6 text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{karyawan.nama}</p>
                                                <p className="text-sm text-gray-500">{karyawan.no_hp || '-'}</p>
                                            </div>
                                            {karyawan.absensi_status && (
                                                <span className="inline-flex items-center px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                                                    <Icon icon="solar:check-circle-bold" className="w-4 h-4 mr-1" />
                                                    Sudah absen
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex space-x-2">
                                                {statusOptions.map((opt) => (
                                                    <button
                                                        key={opt.value}
                                                        type="button"
                                                        onClick={() => handleStatusChange(index, opt.value)}
                                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                            absensiData[index].status === opt.value
                                                                ? opt.class + ' ' + opt.textClass
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                            <input
                                                type="text"
                                                value={absensiData[index].catatan}
                                                onChange={(e) => handleCatatanChange(index, e.target.value)}
                                                placeholder="Catatan..."
                                                className="w-40 sm:w-52 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {karyawans.length > 0 && (
                        <div className="p-6 border-t border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-end space-x-3">
                                <Link
                                    href="/absensi"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Absensi'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </form>
        </AdminLayout>
    );
}
