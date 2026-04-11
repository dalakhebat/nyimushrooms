import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MIcon from '@/Components/MIcon';

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
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <MIcon name="account_balance_wallet" className="text-2xl text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-on-tertiary-container">Saldo Total</p>
                            <p className={`text-xl font-bold ${saldoTotal >= 0 ? 'text-secondary' : 'text-red-600'}`}>
                                {formatRupiah(saldoTotal)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-emerald-100 rounded-xl">
                            <MIcon name="trending_up" className="text-2xl text-secondary" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-on-tertiary-container">Masuk Bulan Ini</p>
                            <p className="text-xl font-bold text-secondary">{formatRupiah(saldoBulanIni.masuk)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-red-100 rounded-xl">
                            <MIcon name="trending_down" className="text-2xl text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-on-tertiary-container">Keluar Bulan Ini</p>
                            <p className="text-xl font-bold text-red-600">{formatRupiah(saldoBulanIni.keluar)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm p-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-xl">
                            <MIcon name="account_balance_wallet" className="text-2xl text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-on-tertiary-container">Saldo Bulan Ini</p>
                            <p className={`text-xl font-bold ${saldoBulanIni.saldo >= 0 ? 'text-secondary' : 'text-red-600'}`}>
                                {formatRupiah(saldoBulanIni.saldo)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-clinical-sm">
                <div className="p-6 border-b border-outline-variant/15">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-headline font-bold text-on-surface">Transaksi Kas</h2>
                        <div className="flex gap-3">
                            <Link href="/kas/report" className="px-4 py-2 text-on-surface-variant bg-surface-container-low rounded-xl hover:bg-gray-200">
                                Laporan
                            </Link>
                            <Link
                                href="/kas/create"
                                className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary"
                            >
                                <MIcon name="add_circle" className="text-xl mr-1" />
                                Tambah
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-surface-container-low">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Kode</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Keterangan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Kategori</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-tertiary-container uppercase">Tipe</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-on-tertiary-container uppercase">Jumlah</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-on-tertiary-container uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {transactions.data.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-on-tertiary-container">
                                        Belum ada transaksi
                                    </td>
                                </tr>
                            ) : (
                                transactions.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-surface-container-low">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                                            {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-on-tertiary-container">
                                            {item.kode_transaksi}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-on-surface-variant max-w-xs truncate">
                                            {item.keterangan}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-surface-container-low text-on-surface capitalize">
                                                {item.kategori}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                                item.tipe === 'masuk' ? 'bg-emerald-100 text-primary' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {item.tipe === 'masuk' ? <MIcon name="trending_up" className="text-base mr-1" /> : <MIcon name="trending_down" className="text-base mr-1" />}
                                                {item.tipe === 'masuk' ? 'Masuk' : 'Keluar'}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                                            item.tipe === 'masuk' ? 'text-secondary' : 'text-red-600'
                                        }`}>
                                            {item.tipe === 'masuk' ? '+' : '-'}{formatRupiah(item.jumlah)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link href={`/kas/${item.id}/edit`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl">
                                                    <MIcon name="edit" className="text-xl" />
                                                </Link>
                                                <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id} className="p-2 text-red-600 hover:bg-red-50 rounded-xl disabled:opacity-50">
                                                    <MIcon name="delete" className="text-xl" />
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
