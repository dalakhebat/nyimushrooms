import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Icon } from '@iconify/react';

export default function BahanBakuMovements({ bahanBaku, movements }) {
    const getTipeIcon = (tipe) => {
        switch (tipe) {
            case 'masuk':
                return <Icon icon="solar:arrow-up-bold" className="w-4 h-4 text-green-600" />;
            case 'keluar':
                return <Icon icon="solar:arrow-down-bold" className="w-4 h-4 text-red-600" />;
            default:
                return <Icon icon="solar:tuning-2-bold" className="w-4 h-4 text-blue-600" />;
        }
    };

    const getTipeBadge = (tipe) => {
        const badges = {
            masuk: 'bg-green-100 text-green-800',
            keluar: 'bg-red-100 text-red-800',
            adjustment: 'bg-blue-100 text-blue-800',
        };
        return badges[tipe] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AdminLayout title="Riwayat Stok">
            <Head title="Riwayat Stok" />

            <div className="max-w-4xl">
                <div className="mb-6">
                    <Link
                        href="/bahan-baku"
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                        <Icon icon="solar:arrow-left-bold" className="w-4 h-4 mr-1" />
                        Kembali
                    </Link>
                </div>

                {/* Info Bahan Baku */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Riwayat Stok: {bahanBaku.nama}
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Kode</p>
                            <p className="font-medium">{bahanBaku.kode}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Stok Saat Ini</p>
                            <p className="font-medium">{bahanBaku.stok} {bahanBaku.satuan}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Stok Minimum</p>
                            <p className="font-medium">{bahanBaku.stok_minimum} {bahanBaku.satuan}</p>
                        </div>
                    </div>
                </div>

                {/* Movements Table */}
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipe</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stok</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {movements.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            Belum ada riwayat pergerakan stok
                                        </td>
                                    </tr>
                                ) : (
                                    movements.data.map((movement) => (
                                        <tr key={movement.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
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
                                                <span className={movement.tipe === 'masuk' ? 'text-green-600' : movement.tipe === 'keluar' ? 'text-red-600' : 'text-blue-600'}>
                                                    {movement.tipe === 'masuk' ? '+' : movement.tipe === 'keluar' ? '-' : ''}{movement.jumlah}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {movement.stok_sebelum} → {movement.stok_sesudah}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
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
                        <div className="px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-500">
                                    Showing {movements.from} to {movements.to} of {movements.total} results
                                </p>
                                <div className="flex space-x-1">
                                    {movements.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-1 text-sm rounded ${
                                                link.active
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
