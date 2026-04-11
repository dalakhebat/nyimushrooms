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
        if (score >= 90) return 'text-secondary';
        if (score >= 75) return 'text-blue-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBadge = (score) => {
        if (score >= 90) return { bg: 'bg-emerald-100', text: 'text-primary', label: 'Excellent' };
        if (score >= 75) return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Good' };
        if (score >= 60) return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Fair' };
        return { bg: 'bg-red-100', text: 'text-red-800', label: 'Poor' };
    };

    return (
        <AdminLayout title="KPI Karyawan">
            <Head title="KPI Karyawan" />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <UserGroupIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-on-tertiary-container">Total Karyawan</p>
                            <p className="text-xl font-bold text-on-surface">{summary.totalKaryawan}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-emerald-100 rounded-xl">
                            <ChartBarIcon className="w-6 h-6 text-secondary" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-on-tertiary-container">Rata-rata KPI</p>
                            <p className={`text-xl font-bold ${getScoreColor(summary.avgSkorKpi)}`}>{summary.avgSkorKpi}%</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-xl">
                            <ClockIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-on-tertiary-container">Avg. Kehadiran</p>
                            <p className="text-xl font-bold text-on-surface">{summary.avgKehadiran}%</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-xl">
                            <TrophyIcon className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-on-tertiary-container">Top Performer</p>
                            <p className="text-lg font-headline font-bold text-on-surface">{summary.topPerformer?.karyawan?.nama || '-'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm">
                <div className="p-6 border-b border-outline-variant/15">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-headline font-bold text-on-surface">Ranking KPI Karyawan</h2>
                            <p className="text-sm text-on-tertiary-container">Hari kerja: {totalHariKerja} hari</p>
                        </div>
                        <div className="flex gap-3">
                            <select
                                value={selectedBulan}
                                onChange={(e) => setSelectedBulan(e.target.value)}
                                className="px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                            >
                                {bulanOptions.map((b) => (
                                    <option key={b.value} value={b.value}>{b.label}</option>
                                ))}
                            </select>
                            <select
                                value={selectedTahun}
                                onChange={(e) => setSelectedTahun(e.target.value)}
                                className="px-4 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
                            >
                                {[2024, 2025, 2026].map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                            <button onClick={handleFilter} className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary">
                                Filter
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-surface-container-low">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Rank</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Karyawan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Hadir</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Terlambat</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">% Hadir</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">% Tepat Waktu</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Avg. Masuk</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Skor KPI</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Grade</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {kpiData.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="px-6 py-12 text-center text-on-tertiary-container">
                                        Tidak ada data KPI
                                    </td>
                                </tr>
                            ) : (
                                kpiData.map((item) => {
                                    const badge = getScoreBadge(item.skor_kpi);
                                    return (
                                        <tr key={item.karyawan.id} className="hover:bg-surface-container-low">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                                    item.ranking === 1 ? 'bg-yellow-400 text-white' :
                                                    item.ranking === 2 ? 'bg-gray-300 text-on-surface-variant' :
                                                    item.ranking === 3 ? 'bg-orange-400 text-white' : 'bg-surface-container-low text-on-surface-variant'
                                                }`}>
                                                    {item.ranking}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link href={`/kpi/${item.karyawan.id}?bulan=${bulan}&tahun=${tahun}`} className="text-sm font-medium text-on-surface hover:text-secondary">
                                                    {item.karyawan.nama}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                                                {item.total_hadir}/{item.total_hari_kerja}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                                {item.total_terlambat}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                                                {item.persentase_hadir}%
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                                                {item.persentase_tepat_waktu}%
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
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
