import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Icon } from '@iconify/react';

export default function PenggajianCreate({ karyawans, existingIds, tipe, bulan, minggu, weeks, periode }) {
    const [selectedKaryawans, setSelectedKaryawans] = useState(
        karyawans
            .filter((k) => !existingIds.includes(k.id))
            .map((k) => ({
                ...k,
                selected: true,
                bonus: 0,
                potongan_kasbon: Math.min(k.sisa_kasbon || 0, k.gaji_pokok - k.potongan), // Default: potong sebanyak mungkin
                catatan: '',
            }))
    );

    const formatLocalMonth = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    };

    const getMonthOptions = () => {
        const options = [];
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();

        // Generate months from current month down to January 2023
        for (let year = currentYear; year >= 2023; year--) {
            const endMonth = year === currentYear ? currentMonth : 11;

            for (let month = endMonth; month >= 0; month--) {
                const date = new Date(year, month, 1);
                const value = formatLocalMonth(date);
                const label = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
                options.push({ value, label });
            }
        }
        return options;
    };

    const handleTipeChange = (newTipe) => {
        router.get('/penggajian/create', { tipe: newTipe, bulan });
    };

    const handleBulanChange = (e) => {
        const newBulan = e.target.value;
        router.get('/penggajian/create', { tipe, bulan: newBulan, minggu: 1 });
    };

    const handleMingguChange = (e) => {
        router.get('/penggajian/create', { tipe, bulan, minggu: e.target.value });
    };

    const handleSelectKaryawan = (id) => {
        setSelectedKaryawans(
            selectedKaryawans.map((k) =>
                k.id === id ? { ...k, selected: !k.selected } : k
            )
        );
    };

    const handleSelectAll = (e) => {
        setSelectedKaryawans(
            selectedKaryawans.map((k) => ({ ...k, selected: e.target.checked }))
        );
    };

    const handleBonusChange = (id, value) => {
        setSelectedKaryawans(
            selectedKaryawans.map((k) =>
                k.id === id
                    ? { ...k, bonus: parseFloat(value) || 0, total: k.gaji_pokok - k.potongan + (parseFloat(value) || 0) }
                    : k
            )
        );
    };

    const handleCatatanChange = (id, value) => {
        setSelectedKaryawans(
            selectedKaryawans.map((k) =>
                k.id === id ? { ...k, catatan: value } : k
            )
        );
    };

    const handlePotonganKasbonChange = (id, value) => {
        setSelectedKaryawans(
            selectedKaryawans.map((k) => {
                if (k.id === id) {
                    const maxKasbon = Math.min(k.sisa_kasbon || 0, k.gaji_pokok - k.potongan + k.bonus);
                    const potonganKasbon = Math.min(Math.max(0, parseFloat(value) || 0), maxKasbon);
                    return { ...k, potongan_kasbon: potonganKasbon };
                }
                return k;
            })
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const selected = selectedKaryawans.filter((k) => k.selected);
        if (selected.length === 0) {
            alert('Pilih minimal 1 karyawan');
            return;
        }

        router.post('/penggajian', {
            periode_mulai: periode.mulai,
            periode_selesai: periode.selesai,
            penggajian: selected.map((k) => ({
                karyawan_id: k.id,
                jumlah_hadir: k.jumlah_hadir,
                jumlah_izin: k.jumlah_izin,
                jumlah_sakit: k.jumlah_sakit,
                jumlah_alpha: k.jumlah_alpha,
                gaji_pokok: k.gaji_pokok,
                bonus: k.bonus,
                potongan: k.potongan,
                potongan_kasbon: k.potongan_kasbon || 0,
                total: k.gaji_pokok - k.potongan + k.bonus - (k.potongan_kasbon || 0),
                catatan: k.catatan,
            })),
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getTipeGajiBadge = (tipeGaji) => {
        const badges = {
            bulanan: { class: 'bg-purple-100 text-purple-700', label: 'Bulanan' },
            mingguan: { class: 'bg-blue-100 text-blue-700', label: 'Mingguan' },
            borongan: { class: 'bg-orange-100 text-orange-700', label: 'Borongan' },
        };
        return badges[tipeGaji] || { class: 'bg-gray-100 text-gray-700', label: tipeGaji };
    };

    const selectedCount = selectedKaryawans.filter((k) => k.selected).length;
    const totalGaji = selectedKaryawans
        .filter((k) => k.selected)
        .reduce((sum, k) => sum + k.gaji_pokok - k.potongan + k.bonus - (k.potongan_kasbon || 0), 0);

    return (
        <AdminLayout title="Proses Penggajian">
            <Head title="Proses Penggajian" />

            <div className="mb-6">
                <Link
                    href="/penggajian"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                    <Icon icon="solar:arrow-left-bold" className="w-4 h-4 mr-1" />
                    Kembali ke Penggajian
                </Link>
            </div>

            {/* Filter Periode */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Pilih Periode Gaji</h2>

                <div className="flex flex-wrap items-center gap-4">
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
                    <select
                        value={bulan}
                        onChange={handleBulanChange}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                        {getMonthOptions().map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    {/* Minggu Selector */}
                    {tipe === 'mingguan' && (
                        <select
                            value={minggu}
                            onChange={handleMingguChange}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                            {weeks.map((w) => (
                                <option key={w.week} value={w.week}>
                                    {w.label}
                                </option>
                            ))}
                        </select>
                    )}

                    <div className="bg-green-50 px-4 py-2 rounded-lg">
                        <p className="text-sm text-green-700 font-medium">
                            Periode: {periode.label}
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-xl shadow-sm mb-6">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Daftar Karyawan</h3>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={selectedKaryawans.every((k) => k.selected)}
                                    className="rounded border-gray-300 text-green-600"
                                />
                                <span className="text-sm text-gray-500">Pilih Semua</span>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-10"></th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[140px]">Karyawan</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-14">Hadir</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-14">Izin</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-14">Sakit</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-14">Alpha</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase min-w-[100px]">Gaji Pokok</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase min-w-[90px]">Potongan</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-[120px]">Bonus</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-[140px]">Pot. Kasbon</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase min-w-[110px]">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {selectedKaryawans.length === 0 ? (
                                    <tr>
                                        <td colSpan="11" className="px-4 py-12 text-center text-gray-500">
                                            {existingIds.length > 0
                                                ? 'Semua karyawan sudah diproses untuk periode ini'
                                                : 'Tidak ada karyawan yang ditemukan'}
                                        </td>
                                    </tr>
                                ) : (
                                    selectedKaryawans.map((karyawan) => {
                                        // Warning jika hadir 0 tapi gaji > 0 (data lama yang salah)
                                        const hasZeroAttendanceIssue = karyawan.jumlah_hadir === 0 &&
                                            ['mingguan', 'borongan'].includes(karyawan.tipe_gaji) &&
                                            karyawan.gaji_pokok > 0;

                                        return (
                                        <tr key={karyawan.id} className={`${karyawan.selected ? 'bg-green-50' : 'bg-gray-50 opacity-50'} ${hasZeroAttendanceIssue ? 'bg-red-50' : ''}`}>
                                            <td className="px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={karyawan.selected}
                                                    onChange={() => handleSelectKaryawan(karyawan.id)}
                                                    className="rounded border-gray-300 text-green-600"
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <p className="text-sm font-medium text-gray-900">{karyawan.nama}</p>
                                                <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getTipeGajiBadge(karyawan.tipe_gaji).class}`}>
                                                    {getTipeGajiBadge(karyawan.tipe_gaji).label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-medium bg-green-100 text-green-700 rounded-full">
                                                    {karyawan.jumlah_hadir}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-medium bg-blue-100 text-blue-700 rounded-full">
                                                    {karyawan.jumlah_izin}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-medium bg-yellow-100 text-yellow-700 rounded-full">
                                                    {karyawan.jumlah_sakit}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-medium bg-red-100 text-red-700 rounded-full">
                                                    {karyawan.jumlah_alpha}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right text-sm text-gray-700">
                                                {formatCurrency(karyawan.gaji_pokok)}
                                            </td>
                                            <td className="px-4 py-4 text-right text-sm text-red-600">
                                                -{formatCurrency(karyawan.potongan)}
                                            </td>
                                            <td className="px-2 py-4 text-center">
                                                <input
                                                    type="number"
                                                    value={karyawan.bonus}
                                                    onChange={(e) => handleBonusChange(karyawan.id, e.target.value)}
                                                    disabled={!karyawan.selected}
                                                    className="w-full max-w-[100px] px-2 py-1.5 text-right text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                                                />
                                            </td>
                                            <td className="px-2 py-4 text-center">
                                                {(karyawan.sisa_kasbon || 0) > 0 ? (
                                                    <div className="flex flex-col items-center">
                                                        <input
                                                            type="number"
                                                            value={karyawan.potongan_kasbon || 0}
                                                            onChange={(e) => handlePotonganKasbonChange(karyawan.id, e.target.value)}
                                                            disabled={!karyawan.selected}
                                                            max={karyawan.sisa_kasbon}
                                                            className="w-full max-w-[100px] px-2 py-1.5 text-right text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                                                        />
                                                        <p className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                                                            Sisa: {formatCurrency(karyawan.sisa_kasbon)}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400 text-center block">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-right text-sm font-semibold text-gray-900">
                                                {formatCurrency(karyawan.gaji_pokok - karyawan.potongan + karyawan.bonus - (karyawan.potongan_kasbon || 0))}
                                            </td>
                                        </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary & Submit */}
                {selectedKaryawans.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Dipilih: {selectedCount} karyawan</p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalGaji)}</p>
                            </div>
                            <button
                                type="submit"
                                disabled={selectedCount === 0}
                                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                <Icon icon="solar:check-circle-bold" className="w-5 h-5 mr-2" />
                                Proses Penggajian
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </AdminLayout>
    );
}
