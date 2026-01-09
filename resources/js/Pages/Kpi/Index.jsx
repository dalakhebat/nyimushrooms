import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { TrophyIcon, ChartBarIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function KpiIndex({ kpiData, summary, bulan, tahun, totalHariKerja }) {
    const [selectedBulan, setSelectedBulan] = useState(bulan);
    const [selectedTahun, setSelectedTahun] = useState(tahun);

    const handleFilter = () => {
        router.get('/kpi', { bulan: selectedBulan, tahun: selectedTahun }, { preserveState: true });
    };

    const bulanOptions = [
        { value: 1, label: 'Januari' }, { value: 2, label: 'Februari' }, { value: 3, label: 'Maret' },
        { value: 4, label: 'April' }, { value: 5, label: 'Mei' }, { value: 6, label: 'Juni' },
        { value: 7, label: 'Juli' }, { value: 8, label: 'Agustus' }, { value: 9, label: 'September' },
        { value: 10, label: 'Oktober' }, { value: 11, label: 'November' }, { value: 12, label: 'Desember' },
    ];

    const getScoreColor = (score) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 75) return 'text-blue-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBadge = (score) => {
        if (score >= 90) return { bg: 'bg-green-100', text: 'text-green-800', label: 'Excellent' };
        if (score >= 75) return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Good' };
        if (score >= 60) return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Fair' };
        return { bg: 'bg-red-100', text: 'text-red-800', label: 'Poor' };
    };

    return (
        <AdminLayout title="KPI Karyawan">
            <Head title="KPI Karyawan" />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <UserGroupIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Total Karyawan</p>
                            <p className="text-xl font-bold text-gray-800">{summary.totalKaryawan}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <ChartBarIcon className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Rata-rata KPI</p>
                            <p className={`text-xl font-bold ${getScoreColor(summary.avgSkorKpi)}`}>{summary.avgSkorKpi}%</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <ClockIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Avg. Kehadiran</p>
                            <p className="text-xl font-bold text-gray-800">{summary.avgKehadiran}%</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <TrophyIcon className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Top Performer</p>
                            <p className="text-lg font-bold text-gray-800">{summary.topPerformer?.karyawan?.nama || '-'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Ranking KPI Karyawan</h2>
                            <p className="text-sm text-gray-500">Hari kerja: {totalHariKerja} hari</p>
                        </div>
                        <div className="flex gap-3">
                            <select
                                value={selectedBulan}
                                onChange={(e) => setSelectedBulan(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            >
                                {bulanOptions.map((b) => (
                                    <option key={b.value} value={b.value}>{b.label}</option>
                                ))}
                            </select>
                            <select
                                value={selectedTahun}
                                onChange={(e) => setSelectedTahun(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            >
                                {[2024, 2025, 2026].map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                            <button onClick={handleFilter} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                Filter
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Karyawan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hadir</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Terlambat</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">% Hadir</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">% Tepat Waktu</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg. Masuk</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Skor KPI</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {kpiData.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                                        Tidak ada data KPI
                                    </td>
                                </tr>
                            ) : (
                                kpiData.map((item) => {
                                    const badge = getScoreBadge(item.skor_kpi);
                                    return (
                                        <tr key={item.karyawan.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                                    item.ranking === 1 ? 'bg-yellow-400 text-white' :
                                                    item.ranking === 2 ? 'bg-gray-300 text-gray-700' :
                                                    item.ranking === 3 ? 'bg-orange-400 text-white' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {item.ranking}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link href={`/kpi/${item.karyawan.id}?bulan=${bulan}&tahun=${tahun}`} className="text-sm font-medium text-gray-900 hover:text-green-600">
                                                    {item.karyawan.nama}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {item.total_hadir}/{item.total_hari_kerja}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                                {item.total_terlambat}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {item.persentase_hadir}%
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {item.persentase_tepat_waktu}%
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {item.avg_jam_masuk || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`text-lg font-bold ${getScoreColor(item.skor_kpi)}`}>
                                                    {item.skor_kpi}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.bg} ${badge.text}`}>
                                                    {badge.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
