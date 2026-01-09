import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Icon } from '@iconify/react';

export default function PengaturanGajiIndex({ pengaturan }) {
    const [formData, setFormData] = useState(() => {
        // Flatten all pengaturan into array
        const allItems = [];
        Object.entries(pengaturan).forEach(([tipeGaji, items]) => {
            items.forEach(item => {
                allItems.push({
                    id: item.id,
                    tipe_gaji: item.tipe_gaji,
                    status_absensi: item.status_absensi,
                    persentase_potongan: parseFloat(item.persentase_potongan),
                    keterangan: item.keterangan || '',
                });
            });
        });
        return allItems;
    });

    const handleChange = (id, field, value) => {
        setFormData(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/pengaturan-gaji', {
            pengaturan: formData.map(item => ({
                id: item.id,
                persentase_potongan: item.persentase_potongan,
                keterangan: item.keterangan,
            })),
        });
    };

    const getTipeGajiLabel = (tipe) => {
        const labels = {
            bulanan: 'Bulanan',
            mingguan: 'Mingguan',
            borongan: 'Borongan',
        };
        return labels[tipe] || tipe;
    };

    const getTipeGajiBadge = (tipe) => {
        const badges = {
            bulanan: 'bg-purple-100 text-purple-700',
            mingguan: 'bg-blue-100 text-blue-700',
            borongan: 'bg-orange-100 text-orange-700',
        };
        return badges[tipe] || 'bg-gray-100 text-gray-700';
    };

    const getStatusLabel = (status) => {
        const labels = {
            hadir: 'Hadir',
            izin: 'Izin',
            sakit: 'Sakit',
            alpha: 'Alpha',
        };
        return labels[status] || status;
    };

    const getStatusColor = (status) => {
        const colors = {
            hadir: 'bg-green-100 text-green-700',
            izin: 'bg-blue-100 text-blue-700',
            sakit: 'bg-yellow-100 text-yellow-700',
            alpha: 'bg-red-100 text-red-700',
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    const groupedData = formData.reduce((acc, item) => {
        if (!acc[item.tipe_gaji]) {
            acc[item.tipe_gaji] = [];
        }
        acc[item.tipe_gaji].push(item);
        return acc;
    }, {});

    return (
        <AdminLayout title="Pengaturan Gaji">
            <Head title="Pengaturan Gaji" />

            <div className="mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                        <Icon icon="solar:info-circle-bold" className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div className="text-sm text-blue-700">
                            <p className="font-medium mb-1">Cara Kerja Potongan Gaji:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li><strong>Bulanan:</strong> Potongan = (Gaji / 30 hari) x Persentase x Jumlah Hari</li>
                                <li><strong>Mingguan:</strong> Potongan = (Gaji / 7 hari) x Persentase x Jumlah Hari</li>
                                <li><strong>Borongan:</strong> Tidak ada potongan (gaji dihitung per kehadiran)</li>
                            </ul>
                            <p className="mt-2">Contoh: Jika Alpha = 100%, maka 1 hari alpha = potong 1 hari gaji penuh.</p>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    {Object.entries(groupedData).map(([tipeGaji, items]) => (
                        <div key={tipeGaji} className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <div className="flex items-center">
                                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getTipeGajiBadge(tipeGaji)}`}>
                                        {getTipeGajiLabel(tipeGaji)}
                                    </span>
                                    <span className="ml-3 text-sm text-gray-500">
                                        {tipeGaji === 'bulanan' && 'Gaji tetap per bulan, potongan per hari = gaji/30'}
                                        {tipeGaji === 'mingguan' && 'Gaji tetap per minggu, potongan per hari = gaji/7'}
                                        {tipeGaji === 'borongan' && 'Gaji dihitung per hari kerja (tidak ada potongan)'}
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status Absensi</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-40">Potongan (%)</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {items.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status_absensi)}`}>
                                                        {getStatusLabel(item.status_absensi)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            step="0.01"
                                                            value={item.persentase_potongan}
                                                            onChange={(e) => handleChange(item.id, 'persentase_potongan', parseFloat(e.target.value) || 0)}
                                                            disabled={tipeGaji === 'borongan'}
                                                            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:text-gray-500"
                                                        />
                                                        <span className="ml-2 text-gray-500">%</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="text"
                                                        value={item.keterangan}
                                                        onChange={(e) => handleChange(item.id, 'keterangan', e.target.value)}
                                                        placeholder="Tambah keterangan..."
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
                    >
                        <Icon icon="solar:check-circle-bold" className="w-5 h-5 mr-2" />
                        Simpan Pengaturan
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
