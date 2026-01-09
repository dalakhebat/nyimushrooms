import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Icon } from '@iconify/react';

export default function AbsensiRekap({ rekap, summary, tipe, bulan, minggu, tanggalAwal, tanggalAkhir, periode }) {
    // Helper function untuk format tanggal lokal (tanpa timezone conversion)
    const formatLocalDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatLocalMonth = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    };

    // Generate month options (12 bulan terakhir)
    const getMonthOptions = () => {
        const options = [];
        const today = new Date();
        for (let i = 0; i < 12; i++) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const value = formatLocalMonth(date); // FIX: gunakan local format, bukan toISOString
            const label = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
            options.push({ value, label });
        }
        return options;
    };

    // Generate week options untuk bulan yang dipilih
    const getWeekOptions = (selectedBulan) => {
        const options = [];
        if (!selectedBulan) return options;

        const [year, month] = selectedBulan.split('-').map(Number);
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);

        let weekNum = 1;
        let startOfWeek = new Date(firstDay);

        // Mulai dari hari Senin pertama atau tanggal 1
        while (startOfWeek <= lastDay) {
            let endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            // Jika end of week melebihi bulan, potong ke akhir bulan
            if (endOfWeek > lastDay) {
                endOfWeek = new Date(lastDay);
            }

            // FIX: gunakan local format, bukan toISOString
            const startStr = formatLocalDate(startOfWeek);
            const endStr = formatLocalDate(endOfWeek);

            const startLabel = startOfWeek.getDate();
            const endLabel = endOfWeek.getDate();
            const monthLabel = startOfWeek.toLocaleDateString('id-ID', { month: 'short' });

            options.push({
                value: weekNum,
                label: `Minggu ${weekNum} (${startLabel} - ${endLabel} ${monthLabel})`,
                tanggal_awal: startStr,
                tanggal_akhir: endStr,
            });

            weekNum++;
            startOfWeek = new Date(endOfWeek);
            startOfWeek.setDate(startOfWeek.getDate() + 1);
        }

        return options;
    };

    const currentBulan = bulan || formatLocalMonth(new Date());
    const weekOptions = getWeekOptions(currentBulan);
    const currentMinggu = minggu || 1;

    const handleTipeChange = (newTipe) => {
        if (newTipe === 'bulanan') {
            router.get('/absensi/rekap', { tipe: 'bulanan', bulan: currentBulan });
        } else {
            const week = weekOptions[0];
            if (week) {
                router.get('/absensi/rekap', {
                    tipe: 'mingguan',
                    bulan: currentBulan,
                    minggu: 1,
                    tanggal_awal: week.tanggal_awal,
                    tanggal_akhir: week.tanggal_akhir,
                });
            }
        }
    };

    const handleBulanChange = (e) => {
        const newBulan = e.target.value;
        if (tipe === 'mingguan') {
            const newWeekOptions = getWeekOptions(newBulan);
            const week = newWeekOptions[0];
            if (week) {
                router.get('/absensi/rekap', {
                    tipe: 'mingguan',
                    bulan: newBulan,
                    minggu: 1,
                    tanggal_awal: week.tanggal_awal,
                    tanggal_akhir: week.tanggal_akhir,
                });
            }
        } else {
            router.get('/absensi/rekap', { tipe: 'bulanan', bulan: newBulan });
        }
    };

    const handleMingguChange = (e) => {
        const weekNum = parseInt(e.target.value);
        const week = weekOptions.find((w) => w.value === weekNum);
        if (week) {
            router.get('/absensi/rekap', {
                tipe: 'mingguan',
                bulan: currentBulan,
                minggu: weekNum,
                tanggal_awal: week.tanggal_awal,
                tanggal_akhir: week.tanggal_akhir,
            });
        }
    };

    const handleExportExcel = () => {
        if (tipe === 'mingguan') {
            window.location.href = `/absensi/export/excel?tipe=mingguan&tanggal_awal=${tanggalAwal}&tanggal_akhir=${tanggalAkhir}`;
        } else {
            window.location.href = `/absensi/export/excel?bulan=${currentBulan}`;
        }
    };

    const handleExportPdf = () => {
        if (tipe === 'mingguan') {
            window.location.href = `/absensi/export/pdf?tipe=mingguan&tanggal_awal=${tanggalAwal}&tanggal_akhir=${tanggalAkhir}`;
        } else {
            window.location.href = `/absensi/export/pdf?bulan=${currentBulan}`;
        }
    };

    const getTipeGajiBadge = (tipeGaji) => {
        const badges = {
            bulanan: { class: 'bg-purple-100 text-purple-700', label: 'Bulanan' },
            mingguan: { class: 'bg-blue-100 text-blue-700', label: 'Mingguan' },
            borongan: { class: 'bg-orange-100 text-orange-700', label: 'Borongan' },
        };
        return badges[tipeGaji] || { class: 'bg-gray-100 text-gray-700', label: tipeGaji };
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AdminLayout title="Rekap Absensi">
            <Head title="Rekap Absensi" />

            <div className="mb-6">
                <Link
                    href="/absensi"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                    <Icon icon="solar:arrow-left-bold" className="w-4 h-4 mr-1" />
                    Kembali ke Absensi
                </Link>
            </div>

            {/* Header with Filter & Export */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex flex-col gap-4">
                    {/* Title & Periode */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Rekap Absensi</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Periode: {periode?.start} - {periode?.end}
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleExportExcel}
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Icon icon="solar:file-text-bold" className="w-5 h-5 mr-2" />
                                Export Excel
                            </button>
                            <button
                                onClick={handleExportPdf}
                                className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <Icon icon="solar:document-download-bold" className="w-5 h-5 mr-2" />
                                Export PDF
                            </button>
                        </div>
                    </div>

                    {/* Tipe Toggle & Date Filters */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4 border-t border-gray-200">
                        {/* Tipe Toggle */}
                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => handleTipeChange('bulanan')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                    tipe === 'bulanan'
                                        ? 'bg-white text-green-700 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <Icon icon="solar:calendar-bold" className="w-4 h-4 inline mr-1" />
                                Bulanan
                            </button>
                            <button
                                onClick={() => handleTipeChange('mingguan')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                    tipe === 'mingguan'
                                        ? 'bg-white text-green-700 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <Icon icon="solar:clock-circle-bold" className="w-4 h-4 inline mr-1" />
                                Mingguan
                            </button>
                        </div>

                        {/* Bulan Selector */}
                        <div className="flex items-center space-x-2">
                            <Icon icon="solar:calendar-bold" className="w-5 h-5 text-gray-400" />
                            <select
                                value={currentBulan}
                                onChange={handleBulanChange}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                {getMonthOptions().map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Minggu Selector (hanya tampil jika tipe mingguan) */}
                        {tipe === 'mingguan' && (
                            <div className="flex items-center space-x-2">
                                <Icon icon="solar:clock-circle-bold" className="w-5 h-5 text-gray-400" />
                                <select
                                    value={currentMinggu}
                                    onChange={handleMingguChange}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    {weekOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-green-500 p-3 rounded-lg flex-shrink-0">
                            <Icon icon="solar:check-circle-bold" className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Hadir</p>
                            <p className="text-2xl font-semibold text-gray-900">{summary?.totalHadir || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-blue-500 p-3 rounded-lg flex-shrink-0">
                            <Icon icon="solar:document-bold" className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Izin</p>
                            <p className="text-2xl font-semibold text-gray-900">{summary?.totalIzin || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-yellow-500 p-3 rounded-lg flex-shrink-0">
                            <Icon icon="solar:danger-triangle-bold" className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Sakit</p>
                            <p className="text-2xl font-semibold text-gray-900">{summary?.totalSakit || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center">
                        <div className="bg-red-500 p-3 rounded-lg flex-shrink-0">
                            <Icon icon="solar:close-circle-bold" className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Alpha</p>
                            <p className="text-2xl font-semibold text-gray-900">{summary?.totalAlpha || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Detail Rekap Per Karyawan</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    No
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nama Karyawan
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tipe Gaji
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nominal
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hadir
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Izin
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sakit
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Alpha
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Hari
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {(!rekap || rekap.length === 0) ? (
                                <tr>
                                    <td colSpan="9" className="px-4 py-12 text-center text-gray-500">
                                        Tidak ada data absensi untuk periode ini
                                    </td>
                                </tr>
                            ) : (
                                rekap.map((row, index) => (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {row.nama}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTipeGajiBadge(row.tipe_gaji).class}`}>
                                                {getTipeGajiBadge(row.tipe_gaji).label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                                            {formatCurrency(row.nominal_gaji || 0)}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-center">
                                            <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-medium bg-green-100 text-green-700 rounded-full">
                                                {row.hadir}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-center">
                                            <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-medium bg-blue-100 text-blue-700 rounded-full">
                                                {row.izin}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-center">
                                            <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-medium bg-yellow-100 text-yellow-700 rounded-full">
                                                {row.sakit}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-center">
                                            <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-medium bg-red-100 text-red-700 rounded-full">
                                                {row.alpha}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-semibold text-gray-900">
                                            {row.total_hari_kerja}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        {rekap && rekap.length > 0 && (
                            <tfoot className="bg-gray-50 font-semibold">
                                <tr>
                                    <td colSpan="4" className="px-4 py-4 text-sm text-gray-700">
                                        Total
                                    </td>
                                    <td className="px-4 py-4 text-center text-sm text-green-700">
                                        {summary?.totalHadir || 0}
                                    </td>
                                    <td className="px-4 py-4 text-center text-sm text-blue-700">
                                        {summary?.totalIzin || 0}
                                    </td>
                                    <td className="px-4 py-4 text-center text-sm text-yellow-700">
                                        {summary?.totalSakit || 0}
                                    </td>
                                    <td className="px-4 py-4 text-center text-sm text-red-700">
                                        {summary?.totalAlpha || 0}
                                    </td>
                                    <td className="px-4 py-4 text-center text-sm text-gray-900">
                                        {(summary?.totalHadir || 0) + (summary?.totalIzin || 0) + (summary?.totalSakit || 0) + (summary?.totalAlpha || 0)}
                                    </td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
