import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PlusIcon, PencilSquareIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon, WalletIcon } from '@heroicons/react/24/outline';

export default function KasIndex({ transactions, saldoTotal, saldoBulanIni, kategoris, filters }) {
    const [deleting, setDeleting] = useState(null);

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus transaksi ini?')) {
            setDeleting(id);
            router.delete(`/kas/${id}`, { onFinish: () => setDeleting(null) });
        }
    };

    const formatRupiah = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };

    return (
        <AdminLayout title="Kas / Keuangan">
            <Head title="Kas / Keuangan" />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <WalletIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Saldo Total</p>
                            <p className={`text-xl font-bold ${saldoTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatRupiah(saldoTotal)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <ArrowUpIcon className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Masuk Bulan Ini</p>
                            <p className="text-xl font-bold text-green-600">{formatRupiah(saldoBulanIni.masuk)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-red-100 rounded-lg">
                            <ArrowDownIcon className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Keluar Bulan Ini</p>
                            <p className="text-xl font-bold text-red-600">{formatRupiah(saldoBulanIni.keluar)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <WalletIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Saldo Bulan Ini</p>
                            <p className={`text-xl font-bold ${saldoBulanIni.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatRupiah(saldoBulanIni.saldo)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">Transaksi Kas</h2>
                        <div className="flex gap-3">
                            <Link href="/kas/report" className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                                Laporan
                            </Link>
                            <Link
                                href="/kas/create"
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                            >
                                <PlusIcon className="w-5 h-5 mr-1" />
                                Tambah
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipe</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {transactions.data.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                        Belum ada transaksi
                                    </td>
                                </tr>
                            ) : (
                                transactions.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                                            {item.kode_transaksi}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                                            {item.keterangan}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 capitalize">
                                                {item.kategori}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                                item.tipe === 'masuk' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {item.tipe === 'masuk' ? <ArrowUpIcon className="w-3 h-3 mr-1" /> : <ArrowDownIcon className="w-3 h-3 mr-1" />}
                                                {item.tipe === 'masuk' ? 'Masuk' : 'Keluar'}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                                            item.tipe === 'masuk' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {item.tipe === 'masuk' ? '+' : '-'}{formatRupiah(item.jumlah)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link href={`/kas/${item.id}/edit`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                                    <PencilSquareIcon className="w-5 h-5" />
                                                </Link>
                                                <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id} className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50">
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
