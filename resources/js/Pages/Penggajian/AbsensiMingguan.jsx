import { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    ArrowLeftIcon,
    CheckIcon,
    MagnifyingGlassIcon,
    DocumentArrowDownIcon,
    TableCellsIcon,
} from '@heroicons/react/24/outline';

export default function AbsensiMingguan({ karyawans, days, bulan, minggu, weeks, periode }) {
    const [attendance, setAttendance] = useState(() => {
        // Initialize from karyawans data
        const initial = {};
        karyawans.forEach(k => {
            initial[k.id] = { ...k.attendance };
        });
        return initial;
    });

    const [search, setSearch] = useState('');
    const [filterBagian, setFilterBagian] = useState('');
    const [saving, setSaving] = useState(false);

    // Get unique bagian for filter
    const bagianList = useMemo(() => {
        const unique = [...new Set(karyawans.map(k => k.bagian).filter(Boolean))];
        return unique.sort();
    }, [karyawans]);

    // Filter karyawans
    const filteredKaryawans = useMemo(() => {
        return karyawans.filter(k => {
            const matchSearch = k.nama.toLowerCase().includes(search.toLowerCase());
            const matchBagian = !filterBagian || k.bagian === filterBagian;
            return matchSearch && matchBagian;
        });
    }, [karyawans, search, filterBagian]);

    const statusCycle = ['hadir', 'izin', 'sakit', 'alpha'];

    const toggleStatus = (karyawanId, date) => {
        setAttendance(prev => {
            const current = prev[karyawanId][date];
            const currentIndex = statusCycle.indexOf(current);
            const nextIndex = (currentIndex + 1) % statusCycle.length;
            const nextStatus = statusCycle[nextIndex];

            return {
                ...prev,
                [karyawanId]: {
                    ...prev[karyawanId],
                    [date]: nextStatus,
                },
            };
        });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'hadir':
                return 'bg-green-500 text-white';
            case 'izin':
                return 'bg-blue-500 text-white';
            case 'sakit':
                return 'bg-yellow-500 text-white';
            case 'alpha':
                return 'bg-red-500 text-white';
            default:
                return 'bg-gray-200 text-gray-600';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'hadir': return 'H';
            case 'izin': return 'I';
            case 'sakit': return 'S';
            case 'alpha': return 'A';
            default: return '?';
        }
    };

    const handleSave = () => {
        setSaving(true);

        const data = Object.entries(attendance).map(([karyawanId, data]) => ({
            karyawan_id: parseInt(karyawanId),
            data: data,
        }));

        router.post('/absensi/mingguan', { attendance: data }, {
            preserveState: true,
            onFinish: () => setSaving(false),
        });
    };

    const handleBulanChange = (e) => {
        router.get('/absensi/mingguan', { bulan: e.target.value, minggu: 1 });
    };

    const handleMingguChange = (e) => {
        router.get('/absensi/mingguan', { bulan, minggu: e.target.value });
    };

    // Set all for a specific day
    const setAllForDay = (date, status) => {
        setAttendance(prev => {
            const updated = { ...prev };
            filteredKaryawans.forEach(k => {
                if (updated[k.id]) {
                    updated[k.id] = { ...updated[k.id], [date]: status };
                }
            });
            return updated;
        });
    };

    // Get month options - from current month down to January 2023
    const getMonthOptions = () => {
        const options = [];
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();

        for (let year = currentYear; year >= 2023; year--) {
            const endMonth = year === currentYear ? currentMonth : 11;

            for (let month = endMonth; month >= 0; month--) {
                const date = new Date(year, month, 1);
                const y = date.getFullYear();
                const m = String(date.getMonth() + 1).padStart(2, '0');
                const value = `${y}-${m}`;
                const label = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
                options.push({ value, label });
            }
        }
        return options;
    };

    // Count summary
    const summary = useMemo(() => {
        let hadir = 0, izin = 0, sakit = 0, alpha = 0;
        Object.values(attendance).forEach(data => {
            Object.values(data).forEach(status => {
                if (status === 'hadir') hadir++;
                else if (status === 'izin') izin++;
                else if (status === 'sakit') sakit++;
                else if (status === 'alpha') alpha++;
            });
        });
        return { hadir, izin, sakit, alpha };
    }, [attendance]);

    return (
        <AdminLayout title="Input Absensi Mingguan">
            <Head title="Input Absensi Mingguan" />

            <div className="mb-6">
                <Link
                    href="/penggajian"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeftIcon className="w-4 h-4 mr-1" />
                    Kembali ke Penggajian
                </Link>
            </div>

            {/* Period Selector */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <select
                            value={bulan}
                            onChange={handleBulanChange}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                            {getMonthOptions().map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <select
                            value={minggu}
                            onChange={handleMingguChange}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                            {weeks.map(w => (
                                <option key={w.week} value={w.week}>{w.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-green-50 px-4 py-2 rounded-lg">
                            <p className="text-sm text-green-700 font-medium">
                                Periode: {periode.start} - {periode.end}
                            </p>
                        </div>
                        <a
                            href={`/absensi/mingguan/export/pdf?bulan=${bulan}&minggu=${minggu}`}
                            className="inline-flex items-center px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
                        >
                            <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
                            PDF
                        </a>
                        <a
                            href={`/absensi/mingguan/export/excel?bulan=${bulan}&minggu=${minggu}`}
                            className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                        >
                            <TableCellsIcon className="w-4 h-4 mr-1" />
                            Excel
                        </a>
                    </div>
                </div>
            </div>

            {/* Filter & Search */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama..."
                                className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-48"
                            />
                        </div>
                        <select
                            value={filterBagian}
                            onChange={(e) => setFilterBagian(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                            <option value="">Semua Bagian</option>
                            {bagianList.map(b => (
                                <option key={b} value={b}>{b}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="inline-flex items-center gap-1">
                            <span className="w-4 h-4 rounded bg-green-500"></span> H: {summary.hadir}
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <span className="w-4 h-4 rounded bg-blue-500"></span> I: {summary.izin}
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <span className="w-4 h-4 rounded bg-yellow-500"></span> S: {summary.sakit}
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <span className="w-4 h-4 rounded bg-red-500"></span> A: {summary.alpha}
                        </span>
                    </div>
                </div>
            </div>

            {/* Grid Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50 z-10 min-w-[180px]">
                                    Karyawan
                                </th>
                                {days.map(day => (
                                    <th key={day.date} className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase w-14">
                                        <div>{day.day}</div>
                                        <div className="text-lg font-bold text-gray-700">{day.dayNum}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredKaryawans.length === 0 ? (
                                <tr>
                                    <td colSpan={days.length + 1} className="px-4 py-12 text-center text-gray-500">
                                        Tidak ada karyawan ditemukan
                                    </td>
                                </tr>
                            ) : (
                                filteredKaryawans.map((karyawan, index) => (
                                    <tr key={karyawan.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-4 py-2 sticky left-0 bg-inherit z-10">
                                            <div className="text-sm font-medium text-gray-900">{karyawan.nama}</div>
                                            <div className="text-xs text-gray-500">{karyawan.bagian}</div>
                                        </td>
                                        {days.map(day => (
                                            <td key={day.date} className="px-2 py-2 text-center">
                                                <button
                                                    onClick={() => toggleStatus(karyawan.id, day.date)}
                                                    className={`w-10 h-10 rounded-lg font-bold text-sm transition-colors ${getStatusStyle(attendance[karyawan.id]?.[day.date] || 'hadir')}`}
                                                >
                                                    {getStatusLabel(attendance[karyawan.id]?.[day.date] || 'hadir')}
                                                </button>
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Save Button */}
            <div className="bg-white rounded-xl shadow-sm p-4 sticky bottom-4">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">{filteredKaryawans.length}</span> karyawan ditampilkan
                        {search || filterBagian ? ` (dari ${karyawans.length} total)` : ''}
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                    >
                        <CheckIcon className="w-5 h-5 mr-2" />
                        {saving ? 'Menyimpan...' : 'Simpan Absensi'}
                    </button>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-4 text-center text-sm text-gray-500">
                Klik kotak untuk mengubah status: H (Hadir) → I (Izin) → S (Sakit) → A (Alpha) → H
            </div>
        </AdminLayout>
    );
}
