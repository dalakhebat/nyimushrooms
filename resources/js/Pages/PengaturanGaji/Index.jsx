import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';

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
        return badges[tipe] || 'bg-surface-container-low text-on-surface-variant';
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
            hadir: 'bg-emerald-100 text-secondary',
            izin: 'bg-blue-100 text-blue-700',
            sakit: 'bg-yellow-100 text-yellow-700',
            alpha: 'bg-red-100 text-red-700',
        };
        return colors[status] || 'bg-surface-container-low text-on-surface-variant';
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
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start">
                        <MIcon name="info" className="text-xl text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
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
                        <div key={tipeGaji} className="bg-surface-container-lowest rounded-xl shadow-clinical-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-outline-variant/15 bg-surface-container-low">
                                <div className="flex items-center">
                                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getTipeGajiBadge(tipeGaji)}`}>
                                        {getTipeGajiLabel(tipeGaji)}
                                    </span>
                                    <span className="ml-3 text-sm text-on-tertiary-container">
                                        {tipeGaji === 'bulanan' && 'Gaji tetap per bulan, potongan per hari = gaji/30'}
                                        {tipeGaji === 'mingguan' && 'Gaji tetap per minggu, potongan per hari = gaji/7'}
                                        {tipeGaji === 'borongan' && 'Gaji dihitung per hari kerja (tidak ada potongan)'}
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-surface-container-low">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Status Absensi</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase w-40">Potongan (%)</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Keterangan</th>
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
                                                            className="w-24 px-3 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary disabled:bg-surface-container-low disabled:text-on-tertiary-container"
                                                        />
                                                        <span className="ml-2 text-on-tertiary-container">%</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="text"
                                                        value={item.keterangan}
                                                        onChange={(e) => handleChange(item.id, 'keterangan', e.target.value)}
                                                        placeholder="Tambah keterangan..."
                                                        className="w-full px-3 py-2 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary"
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
                        className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary"
                    >
                        <MIcon name="check_circle" className="text-xl mr-2" />
                        Simpan Pengaturan
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
