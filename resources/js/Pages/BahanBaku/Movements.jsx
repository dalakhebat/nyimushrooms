import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';

export default function BahanBakuMovements({ bahanBaku, movements }) {
    const getTipeIcon = (tipe) => {
        switch (tipe) {
            case 'masuk':
                return <MIcon name="trending_up" className="text-base text-secondary" />;
            case 'keluar':
                return <MIcon name="trending_down" className="text-base text-red-600" />;
            default:
                return <MIcon name="tune" className="text-base text-blue-600" />;
        }
    };

    const getTipeBadge = (tipe) => {
        const badges = {
            masuk: 'bg-emerald-100 text-primary',
            keluar: 'bg-red-100 text-red-800',
            adjustment: 'bg-blue-100 text-blue-800',
        };
        return badges[tipe] || 'bg-surface-container-low text-on-surface';
    };

    return (
        <AdminLayout title="Riwayat Stok">
            <Head title="Riwayat Stok" />

            <div className="max-w-4xl">
                <div className="mb-6">
                    <Link
                        href="/bahan-baku"
                        className="inline-flex items-center text-sm text-on-surface-variant hover:text-on-surface"
                    >
                        <MIcon name="arrow_back" className="text-base mr-1" />
                        Kembali
                    </Link>
                </div>

                {/* Info Bahan Baku */}
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-6 mb-6">
                    <h2 className="text-lg font-bold text-on-surface mb-4">
                        Riwayat Stok: {bahanBaku.nama}
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-on-tertiary-container">Kode</p>
                            <p className="font-medium">{bahanBaku.kode}</p>
                        </div>
                        <div>
                            <p className="text-sm text-on-tertiary-container">Stok Saat Ini</p>
                            <p className="font-medium">{bahanBaku.stok} {bahanBaku.satuan}</p>
                        </div>
                        <div>
                            <p className="text-sm text-on-tertiary-container">Stok Minimum</p>
                            <p className="font-medium">{bahanBaku.stok_minimum} {bahanBaku.satuan}</p>
                        </div>
                    </div>
                </div>

                {/* Movements Table */}
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-surface-container-low">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Tanggal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Tipe</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Jumlah</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Stok</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {movements.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-on-tertiary-container">
                                            Belum ada riwayat pergerakan stok
                                        </td>
                                    </tr>
                                ) : (
                                    movements.data.map((movement) => (
                                        <tr key={movement.id} className="hover:bg-surface-container-low">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                                                {new Date(movement.tanggal).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getTipeBadge(movement.tipe)}`}>
                                                    {getTipeIcon(movement.tipe)}
                                                    <span className="ml-1 capitalize">{movement.tipe}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={movement.tipe === 'masuk' ? 'text-secondary' : movement.tipe === 'keluar' ? 'text-red-600' : 'text-blue-600'}>
                                                    {movement.tipe === 'masuk' ? '+' : movement.tipe === 'keluar' ? '-' : ''}{movement.jumlah}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                                                {movement.stok_sebelum} → {movement.stok_sesudah}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-on-surface-variant">
                                                {movement.keterangan}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {movements.links && movements.links.length > 3 && (
                        <div className="px-6 py-4 border-t border-outline-variant/15">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-on-tertiary-container">
                                    Showing {movements.from} to {movements.to} of {movements.total} results
                                </p>
                                <div className="flex space-x-1">
                                    {movements.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-1 text-sm rounded ${
                                                link.active
                                                    ? 'bg-primary text-white'
                                                    : 'bg-surface-container-low text-on-surface-variant hover:bg-gray-200'
                                            } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
