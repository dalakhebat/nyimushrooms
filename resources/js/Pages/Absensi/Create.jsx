import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';
import FormAlert from '@/Components/FormAlert';
import EmptyOption from '@/Components/EmptyOption';

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
        { value: 'hadir', label: 'Hadir', class: 'bg-secondary hover:bg-primary', textClass: 'text-white' },
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
                    className="inline-flex items-center text-sm text-on-surface-variant hover:text-on-surface"
                >
                    <MIcon name="arrow_back" className="text-base mr-1" />
                    Kembali
                </Link>
            </div>

            <form onSubmit={handleSubmit}>
                    <FormAlert errors={errors} />

                {/* Date Selector */}
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-6 mb-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <label className="block text-sm font-medium text-on-surface-variant mb-1">
                                Tanggal Absensi
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                max={today}
                                className="px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-green-500"
                            />
                            <p className="mt-1 text-sm text-on-tertiary-container">{formatTanggal(selectedDate)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-on-surface-variant mb-2">Set Semua:</p>
                            <div className="flex space-x-3">
                                {statusOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setAllStatus(opt.value)}
                                        className={`px-4 py-2 text-sm font-medium rounded-xl ${opt.class} ${opt.textClass}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attendance List */}
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm">
                    <div className="p-6 border-b border-outline-variant/15">
                        <h2 className="text-lg font-headline font-bold text-on-surface">
                            Daftar Karyawan ({karyawans.length} orang)
                        </h2>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {karyawans.length === 0 ? (
                            <div className="px-6 py-12 text-center text-on-tertiary-container">
                                Tidak ada karyawan aktif
                            </div>
                        ) : (
                            karyawans.map((karyawan, index) => (
                                <div key={karyawan.id} className="p-5 hover:bg-surface-container-low">
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                                <MIcon name="person" className="text-2xl text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-on-surface">{karyawan.nama}</p>
                                                <p className="text-sm text-on-tertiary-container">{karyawan.no_hp || '-'}</p>
                                            </div>
                                            {karyawan.absensi_status && (
                                                <span className="inline-flex items-center px-3 py-1 text-xs bg-emerald-100 text-secondary rounded-full">
                                                    <MIcon name="check_circle" className="text-base mr-1" />
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
                                                        className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                                                            absensiData[index].status === opt.value
                                                                ? opt.class + ' ' + opt.textClass
                                                                : 'bg-surface-container-low text-on-surface-variant hover:bg-gray-200'
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
                                                className="w-40 sm:w-52 px-4 py-2 text-sm border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-green-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {karyawans.length > 0 && (
                        <div className="p-6 border-t border-outline-variant/15 bg-surface-container-low">
                            <div className="flex items-center justify-end space-x-3">
                                <Link
                                    href="/absensi"
                                    className="px-4 py-2 text-sm font-medium text-on-surface-variant bg-surface-container-lowest border border-outline-variant/30 rounded-xl hover:bg-surface-container-low transition-colors"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary transition-colors disabled:opacity-50"
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
