import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { Icon } from '@iconify/react';

export default function Transolindo({ investasis, kumbungs = [], returnBulanans, panens, summary, chartData, rekapBulanan = [], faseLabels = {}, faseColors = {}, kasTransaksis = [], kasSummary = {}, pendingReimburseList = [], kategoriOptions = {}, paymentAlerts = [] }) {
    const [activeTab, setActiveTab] = useState('status');
    const [showInvestasiForm, setShowInvestasiForm] = useState(false);
    const [showReturnForm, setShowReturnForm] = useState(false);
    const [showPanenForm, setShowPanenForm] = useState(false);
    const [showKasForm, setShowKasForm] = useState(false);
    const [editingInvestasi, setEditingInvestasi] = useState(null);
    const [editingReturn, setEditingReturn] = useState(null);
    const [editingPanen, setEditingPanen] = useState(null);
    const [editingFase, setEditingFase] = useState(null);
    const [editingKas, setEditingKas] = useState(null);

    // Fase form
    const faseForm = useForm({
        fase: 'persiapan',
        minggu_fase: 1,
        tanggal_mulai_fase: '',
        siklus_ke: 1,
    });

    // Forms
    const investasiForm = useForm({
        nama: '',
        tipe: 'kumbung',
        modal: 0,
        return_bulanan: 0,
        tanggal_mulai: '',
        status: 'active',
        keterangan: '',
    });

    const returnForm = useForm({
        bulan: new Date().toISOString().slice(0, 7),
        jamur_kering: 10000000,
        share_transolindo: 5000000,
        share_defila: 5000000,
        kumbung: 0,
        diterima: false,
        tanggal_terima: '',
        keterangan: '',
    });

    const panenForm = useForm({
        investasi_transolindo_id: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        minggu_bulan: '',
        volume_kg: 0,
        pendapatan_kotor: 0,
        keterangan: '',
    });

    const kasForm = useForm({
        tanggal: new Date().toISOString().slice(0, 10),
        tipe: 'masuk',
        jumlah: 0,
        keterangan: '',
        kategori: '',
        return_bulanan_id: '',
        reimburse_ref_id: '',
        status: 'settled',
    });

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(number || 0);
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat('id-ID').format(number || 0);
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatBulan = (bulan) => {
        if (!bulan) return '-';
        const date = new Date(bulan + '-01');
        return date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
    };

    // Generate smooth curve path from points using Catmull-Rom spline
    const generateSmoothPath = (points, tension = 0.3) => {
        if (points.length < 2) return '';
        if (points.length === 2) {
            return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
        }

        let path = `M ${points[0].x} ${points[0].y}`;

        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i === 0 ? i : i - 1];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[i + 2 >= points.length ? i + 1 : i + 2];

            const cp1x = p1.x + (p2.x - p0.x) * tension;
            const cp1y = p1.y + (p2.y - p0.y) * tension;
            const cp2x = p2.x - (p3.x - p1.x) * tension;
            const cp2y = p2.y - (p3.y - p1.y) * tension;

            path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
        }

        return path;
    };

    // Generate area path for filled chart
    const generateAreaPath = (points, baseY, tension = 0.3) => {
        if (points.length < 2) return '';
        const linePath = generateSmoothPath(points, tension);
        return `${linePath} L ${points[points.length - 1].x} ${baseY} L ${points[0].x} ${baseY} Z`;
    };

    const tabs = [
        { id: 'status', name: 'Status Kumbung', icon: 'solar:home-2-bold' },
        { id: 'kas', name: 'Kas/Saldo', icon: 'solar:wallet-2-bold' },
        { id: 'investasi', name: 'Investasi', icon: 'solar:wallet-money-bold' },
        { id: 'return', name: 'Return Bulanan', icon: 'solar:chart-2-bold' },
        { id: 'panen', name: 'Hasil Panen', icon: 'solar:leaf-bold' },
        { id: 'rekap', name: 'Rekap Kumbung', icon: 'solar:document-bold' },
        { id: 'charts', name: 'Monthly Charts', icon: 'solar:chart-square-bold' },
        { id: 'planning', name: 'Target & Planning', icon: 'solar:target-bold' },
        { id: 'simulator', name: 'Simulator', icon: 'solar:calculator-bold' },
    ];

    // Fase handlers
    const handleEditFase = (kumbung) => {
        setEditingFase(kumbung);
        faseForm.setData({
            fase: kumbung.fase || 'persiapan',
            minggu_fase: kumbung.minggu_fase || 1,
            tanggal_mulai_fase: kumbung.tanggal_mulai_fase || '',
            siklus_ke: kumbung.siklus_ke || 1,
        });
    };

    const handleSubmitFase = (e) => {
        e.preventDefault();
        faseForm.patch(route('transolindo.investasi.update-fase', editingFase.id), {
            onSuccess: () => {
                setEditingFase(null);
                faseForm.reset();
            },
        });
    };

    const getFaseColor = (fase) => {
        const colors = {
            persiapan: 'bg-blue-100 text-blue-700 border-blue-300',
            inkubasi: 'bg-amber-100 text-amber-700 border-amber-300',
            panen: 'bg-green-100 text-green-700 border-green-300',
            istirahat: 'bg-gray-100 text-gray-700 border-gray-300',
        };
        return colors[fase] || colors.persiapan;
    };

    const getFaseIcon = (fase) => {
        const icons = {
            persiapan: 'solar:box-bold',
            inkubasi: 'solar:hourglass-bold',
            panen: 'solar:leaf-bold',
            istirahat: 'solar:moon-bold',
        };
        return icons[fase] || icons.persiapan;
    };

    // Investasi handlers
    const handleSubmitInvestasi = (e) => {
        e.preventDefault();
        if (editingInvestasi) {
            investasiForm.put(route('transolindo.investasi.update', editingInvestasi.id), {
                onSuccess: () => {
                    setShowInvestasiForm(false);
                    setEditingInvestasi(null);
                    investasiForm.reset();
                },
            });
        } else {
            investasiForm.post(route('transolindo.investasi.store'), {
                onSuccess: () => {
                    setShowInvestasiForm(false);
                    investasiForm.reset();
                },
            });
        }
    };

    const handleEditInvestasi = (item) => {
        setEditingInvestasi(item);
        investasiForm.setData({
            nama: item.nama,
            tipe: item.tipe,
            modal: item.modal,
            return_bulanan: item.return_bulanan,
            tanggal_mulai: item.tanggal_mulai || '',
            status: item.status,
            keterangan: item.keterangan || '',
        });
        setShowInvestasiForm(true);
    };

    const handleDeleteInvestasi = (id) => {
        if (confirm('Yakin ingin menghapus investasi ini?')) {
            router.delete(route('transolindo.investasi.destroy', id));
        }
    };

    // Return handlers
    const handleSubmitReturn = (e) => {
        e.preventDefault();
        if (editingReturn) {
            returnForm.put(route('transolindo.return.update', editingReturn.id), {
                onSuccess: () => {
                    setShowReturnForm(false);
                    setEditingReturn(null);
                    returnForm.reset();
                },
            });
        } else {
            returnForm.post(route('transolindo.return.store'), {
                onSuccess: () => {
                    setShowReturnForm(false);
                    returnForm.reset();
                },
            });
        }
    };

    const handleToggleReturn = (id) => {
        router.patch(route('transolindo.return.toggle', id));
    };

    const handleEditReturn = (item) => {
        setEditingReturn(item);
        returnForm.setData({
            bulan: item.bulan,
            jamur_kering: parseFloat(item.jamur_kering) || 0,
            share_transolindo: parseFloat(item.share_transolindo) || 0,
            share_defila: parseFloat(item.share_defila) || 0,
            kumbung: parseFloat(item.kumbung) || 0,
            diterima: item.diterima,
            tanggal_terima: item.tanggal_terima || '',
            keterangan: item.keterangan || '',
        });
        setShowReturnForm(true);
    };

    const handleDeleteReturn = (id) => {
        if (confirm('Yakin ingin menghapus return ini?')) {
            router.delete(route('transolindo.return.destroy', id));
        }
    };

    // Panen handlers
    const handleSubmitPanen = (e) => {
        e.preventDefault();
        if (editingPanen) {
            panenForm.put(route('transolindo.panen.update', editingPanen.id), {
                onSuccess: () => {
                    setShowPanenForm(false);
                    setEditingPanen(null);
                    panenForm.reset();
                },
            });
        } else {
            panenForm.post(route('transolindo.panen.store'), {
                onSuccess: () => {
                    setShowPanenForm(false);
                    panenForm.reset();
                },
            });
        }
    };

    const handleDeletePanen = (id) => {
        if (confirm('Yakin ingin menghapus data panen ini?')) {
            router.delete(route('transolindo.panen.destroy', id));
        }
    };

    // Kas handlers
    const handleSubmitKas = (e) => {
        e.preventDefault();
        if (editingKas) {
            kasForm.put(route('transolindo.kas.update', editingKas.id), {
                onSuccess: () => {
                    setShowKasForm(false);
                    setEditingKas(null);
                    kasForm.reset();
                },
            });
        } else {
            kasForm.post(route('transolindo.kas.store'), {
                onSuccess: () => {
                    setShowKasForm(false);
                    kasForm.reset();
                },
            });
        }
    };

    const handleEditKas = (kas) => {
        setEditingKas(kas);
        kasForm.setData({
            tanggal: kas.tanggal ? kas.tanggal.split('T')[0] : '',
            tipe: kas.tipe,
            jumlah: kas.jumlah,
            keterangan: kas.keterangan,
            kategori: kas.kategori || '',
            return_bulanan_id: kas.return_bulanan_id || '',
            reimburse_ref_id: kas.reimburse_ref_id || '',
            status: kas.status,
        });
        setShowKasForm(true);
    };

    const handleDeleteKas = (id) => {
        if (confirm('Yakin ingin menghapus transaksi ini?')) {
            router.delete(route('transolindo.kas.destroy', id));
        }
    };

    const handleReimburseKas = (kas) => {
        if (confirm(`Reimburse "${kas.keterangan}" sebesar ${formatRupiah(kas.jumlah)}?`)) {
            router.post(route('transolindo.kas.reimburse', kas.id));
        }
    };

    const getTipeColor = (tipe) => {
        switch (tipe) {
            case 'masuk': return 'bg-green-100 text-green-700';
            case 'keluar': return 'bg-red-100 text-red-700';
            case 'reimburse': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getTipeIcon = (tipe) => {
        switch (tipe) {
            case 'masuk': return 'solar:arrow-down-bold';
            case 'keluar': return 'solar:arrow-up-bold';
            case 'reimburse': return 'solar:refresh-bold';
            default: return 'solar:question-circle-bold';
        }
    };

    // Simulator state
    const [simTarget, setSimTarget] = useState(144000000);
    const [simInvestment, setSimInvestment] = useState(summary.totalModal || 1541000000);
    const [simROI, setSimROI] = useState(summary.averageROI || 9.34);

    const simAnnualReturn = simInvestment * (simROI / 100);
    const simMonthlyReturn = simAnnualReturn / 12;
    const simDifference = simAnnualReturn - simTarget;

    return (
        <AdminLayout title="Transolindo Dashboard">
            <Head title="Transolindo Dashboard" />

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-6 text-white">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                                <Icon icon="solar:diamond-bold" className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">TRANSOLIDO</h1>
                                <p className="text-indigo-200">Strategic Partner - Mentari Bumi Abadi</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-indigo-200">Total Investasi</p>
                            <p className="text-2xl font-bold">{formatRupiah(summary.totalModal)}</p>
                        </div>
                    </div>
                </div>

                {/* Payment Alerts */}
                {paymentAlerts && paymentAlerts.length > 0 && (
                    <div className="space-y-3">
                        {paymentAlerts.map((alert, index) => {
                            const getAlertStyle = () => {
                                if (alert.type === 'overdue') {
                                    return 'bg-red-50 border-red-200 text-red-800';
                                } else if (alert.type === 'due_today') {
                                    return 'bg-orange-50 border-orange-200 text-orange-800';
                                } else {
                                    return 'bg-yellow-50 border-yellow-200 text-yellow-800';
                                }
                            };

                            const getAlertIcon = () => {
                                if (alert.type === 'overdue') {
                                    return 'solar:danger-triangle-bold';
                                } else if (alert.type === 'due_today') {
                                    return 'solar:alarm-bold';
                                } else {
                                    return 'solar:bell-bold';
                                }
                            };

                            const getIconColor = () => {
                                if (alert.type === 'overdue') {
                                    return 'text-red-500';
                                } else if (alert.type === 'due_today') {
                                    return 'text-orange-500';
                                } else {
                                    return 'text-yellow-500';
                                }
                            };

                            return (
                                <div
                                    key={index}
                                    className={`flex items-start gap-4 p-4 rounded-xl border ${getAlertStyle()}`}
                                >
                                    <div className={`flex-shrink-0 mt-0.5 ${getIconColor()}`}>
                                        <Icon icon={getAlertIcon()} className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="font-semibold">{alert.title}</h4>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                alert.category === 'jamur_kering'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'bg-green-100 text-green-700'
                                            }`}>
                                                {alert.category === 'jamur_kering' ? 'Jamur Kering' : 'Kumbung'}
                                            </span>
                                            {alert.days_overdue !== undefined && alert.days_overdue > 0 && (
                                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                    {alert.days_overdue} hari terlambat
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-1 text-sm opacity-90">{alert.message}</p>
                                        {alert.amount && (
                                            <p className="mt-1 text-sm font-medium">
                                                Estimasi: {formatRupiah(alert.amount)}
                                            </p>
                                        )}
                                    </div>
                                    {alert.type === 'overdue' && alert.return_id && (
                                        <button
                                            onClick={() => {
                                                router.patch(route('transolindo.return.toggle', alert.return_id));
                                            }}
                                            className="flex-shrink-0 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            Tandai Diterima
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Modal</p>
                                <p className="text-xl font-bold text-indigo-600">{formatRupiah(summary.totalModal)}</p>
                            </div>
                            <div className="p-3 bg-indigo-100 rounded-lg">
                                <Icon icon="solar:wallet-money-bold" className="w-6 h-6 text-indigo-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Return Diterima</p>
                                <p className="text-xl font-bold text-green-600">{formatRupiah(summary.totalDiterima)}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Icon icon="solar:hand-money-bold" className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Saldo Kas</p>
                                <p className={`text-xl font-bold ${kasSummary.saldo >= 0 ? 'text-purple-600' : 'text-red-600'}`}>{formatRupiah(kasSummary.saldo)}</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Icon icon="solar:wallet-2-bold" className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Profit Kumbung</p>
                                <p className="text-xl font-bold text-amber-600">{formatRupiah(summary.totalKumbung)}</p>
                            </div>
                            <div className="p-3 bg-amber-100 rounded-lg">
                                <Icon icon="solar:home-bold" className="w-6 h-6 text-amber-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">ROI Rata-rata</p>
                                <p className="text-xl font-bold text-blue-600">{parseFloat(summary.averageROI || 0).toFixed(2)}%</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Icon icon="solar:graph-up-bold" className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="flex border-b overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                                    activeTab === tab.id
                                        ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <Icon icon={tab.icon} className="w-5 h-5 mr-2" />
                                {tab.name}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {/* Tab: Status Kumbung */}
                        {activeTab === 'status' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-lg font-semibold">Status Kumbung Real-time</h2>
                                        <p className="text-sm text-gray-500">Tracking fase dan progres setiap kumbung</p>
                                    </div>
                                </div>

                                {/* Kumbung Status Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {kumbungs.length > 0 ? kumbungs.map((kumbung) => (
                                        <div key={kumbung.id} className={`bg-white rounded-xl shadow-sm border-2 ${getFaseColor(kumbung.fase)} overflow-hidden`}>
                                            <div className="p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <h3 className="font-bold text-lg text-gray-800">{kumbung.nama}</h3>
                                                        <p className="text-sm text-gray-500">Siklus ke-{kumbung.siklus_ke || 1}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleEditFase(kumbung)}
                                                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                                                    >
                                                        <Icon icon="solar:pen-bold" className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                {/* Fase Badge */}
                                                <div className={`inline-flex items-center px-4 py-2 rounded-full ${getFaseColor(kumbung.fase)} mb-4`}>
                                                    <Icon icon={getFaseIcon(kumbung.fase)} className="w-5 h-5 mr-2" />
                                                    <span className="font-semibold">{faseLabels[kumbung.fase] || 'Persiapan Baglog'}</span>
                                                </div>

                                                {/* Progress Info */}
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600">Minggu ke:</span>
                                                        <span className="font-bold text-xl">{kumbung.minggu_fase || 1}</span>
                                                    </div>
                                                    {kumbung.tanggal_mulai_fase && (
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-600">Mulai fase:</span>
                                                            <span className="font-medium">{formatDate(kumbung.tanggal_mulai_fase)}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600">Modal:</span>
                                                        <span className="font-medium text-indigo-600">{formatRupiah(kumbung.modal)}</span>
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                {kumbung.fase === 'panen' && (
                                                    <div className="mt-4">
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="text-gray-500">Progress Panen</span>
                                                            <span className="text-green-600 font-medium">Aktif</span>
                                                        </div>
                                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div className="h-full bg-green-500 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="col-span-2 text-center py-12 text-gray-500">
                                            <Icon icon="solar:home-2-bold" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                            <p className="text-lg">Belum ada data kumbung</p>
                                            <p className="text-sm">Tambahkan investasi tipe "Kumbung" terlebih dahulu</p>
                                        </div>
                                    )}
                                </div>

                                {/* Edit Fase Modal */}
                                {editingFase && (
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <h3 className="font-medium mb-4">Update Status: {editingFase.nama}</h3>
                                        <form onSubmit={handleSubmitFase} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fase *</label>
                                                    <select
                                                        value={faseForm.data.fase}
                                                        onChange={(e) => faseForm.setData('fase', e.target.value)}
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                    >
                                                        <option value="persiapan">Persiapan Baglog</option>
                                                        <option value="inkubasi">Inkubasi</option>
                                                        <option value="panen">Panen Aktif</option>
                                                        <option value="istirahat">Istirahat</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Minggu ke-</label>
                                                    <input
                                                        type="number"
                                                        value={faseForm.data.minggu_fase}
                                                        onChange={(e) => faseForm.setData('minggu_fase', parseInt(e.target.value) || 1)}
                                                        min="1"
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai Fase</label>
                                                    <input
                                                        type="date"
                                                        value={faseForm.data.tanggal_mulai_fase}
                                                        onChange={(e) => faseForm.setData('tanggal_mulai_fase', e.target.value)}
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Siklus ke-</label>
                                                    <input
                                                        type="number"
                                                        value={faseForm.data.siklus_ke}
                                                        onChange={(e) => faseForm.setData('siklus_ke', parseInt(e.target.value) || 1)}
                                                        min="1"
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    type="submit"
                                                    disabled={faseForm.processing}
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                                >
                                                    Simpan
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingFase(null)}
                                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                                >
                                                    Batal
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Fase Legend */}
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h3 className="font-medium mb-4">Keterangan Fase</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <Icon icon="solar:box-bold" className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Persiapan</p>
                                                <p className="text-xs text-gray-500">Isi baglog baru</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                                <Icon icon="solar:hourglass-bold" className="w-5 h-5 text-amber-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Inkubasi</p>
                                                <p className="text-xs text-gray-500">Tunggu miselium</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                <Icon icon="solar:leaf-bold" className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Panen Aktif</p>
                                                <p className="text-xs text-gray-500">Sedang panen</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <Icon icon="solar:moon-bold" className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Istirahat</p>
                                                <p className="text-xs text-gray-500">Persiapan siklus baru</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab: Kas/Saldo */}
                        {activeTab === 'kas' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-lg font-semibold">Kas Transolindo</h2>
                                        <p className="text-sm text-gray-500">Tracking saldo dan arus kas dari investasi</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setEditingKas(null);
                                            kasForm.reset();
                                            kasForm.setData('tanggal', new Date().toISOString().slice(0, 10));
                                            setShowKasForm(true);
                                        }}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                                    >
                                        <Icon icon="solar:add-circle-bold" className="w-5 h-5 mr-2" />
                                        Tambah Transaksi
                                    </button>
                                </div>

                                {/* Summary Cards */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
                                        <div className="flex items-center justify-between mb-2">
                                            <Icon icon="solar:wallet-2-bold" className="w-8 h-8 opacity-80" />
                                            <span className="text-xs bg-white/20 px-2 py-1 rounded">Saldo</span>
                                        </div>
                                        <p className="text-2xl font-bold">{formatRupiah(kasSummary.saldo || 0)}</p>
                                        <p className="text-xs text-green-100 mt-1">Saldo saat ini</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                                        <div className="flex items-center justify-between mb-2">
                                            <Icon icon="solar:arrow-down-bold" className="w-8 h-8 opacity-80" />
                                            <span className="text-xs bg-white/20 px-2 py-1 rounded">Masuk</span>
                                        </div>
                                        <p className="text-2xl font-bold">{formatRupiah(kasSummary.totalMasuk || 0)}</p>
                                        <p className="text-xs text-blue-100 mt-1">Total uang masuk</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white">
                                        <div className="flex items-center justify-between mb-2">
                                            <Icon icon="solar:arrow-up-bold" className="w-8 h-8 opacity-80" />
                                            <span className="text-xs bg-white/20 px-2 py-1 rounded">Keluar</span>
                                        </div>
                                        <p className="text-2xl font-bold">{formatRupiah(kasSummary.totalKeluar || 0)}</p>
                                        <p className="text-xs text-red-100 mt-1">Total uang keluar</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-4 text-white">
                                        <div className="flex items-center justify-between mb-2">
                                            <Icon icon="solar:danger-triangle-bold" className="w-8 h-8 opacity-80" />
                                            <span className="text-xs bg-white/20 px-2 py-1 rounded">Pending</span>
                                        </div>
                                        <p className="text-2xl font-bold">{formatRupiah(kasSummary.pendingReimburse || 0)}</p>
                                        <p className="text-xs text-amber-100 mt-1">Belum di-reimburse</p>
                                    </div>
                                </div>

                                {/* Pending Reimburse Alert */}
                                {pendingReimburseList.length > 0 && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Icon icon="solar:danger-triangle-bold" className="w-5 h-5 text-amber-600" />
                                            <h3 className="font-semibold text-amber-800">Perlu Di-reimburse ({pendingReimburseList.length})</h3>
                                        </div>
                                        <div className="space-y-2">
                                            {pendingReimburseList.map((item) => (
                                                <div key={item.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-amber-200">
                                                    <div>
                                                        <p className="font-medium text-gray-800">{item.keterangan}</p>
                                                        <p className="text-sm text-gray-500">{formatDate(item.tanggal)} - {kategoriOptions[item.kategori] || item.kategori || '-'}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-bold text-red-600">{formatRupiah(item.jumlah)}</span>
                                                        <button
                                                            onClick={() => handleReimburseKas(item)}
                                                            className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center"
                                                        >
                                                            <Icon icon="solar:check-circle-bold" className="w-4 h-4 mr-1" />
                                                            Reimburse
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Kas Form */}
                                {showKasForm && (
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <h3 className="font-medium mb-4">{editingKas ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}</h3>
                                        <form onSubmit={handleSubmitKas} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                                                    <input
                                                        type="date"
                                                        value={kasForm.data.tanggal}
                                                        onChange={(e) => kasForm.setData('tanggal', e.target.value)}
                                                        className="w-full rounded-lg border-gray-300"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
                                                    <select
                                                        value={kasForm.data.tipe}
                                                        onChange={(e) => kasForm.setData('tipe', e.target.value)}
                                                        className="w-full rounded-lg border-gray-300"
                                                        required
                                                    >
                                                        <option value="masuk">Masuk</option>
                                                        <option value="keluar">Keluar</option>
                                                        <option value="reimburse">Reimburse</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                                                    <input
                                                        type="number"
                                                        value={kasForm.data.jumlah}
                                                        onChange={(e) => kasForm.setData('jumlah', e.target.value)}
                                                        className="w-full rounded-lg border-gray-300"
                                                        required
                                                        min="0"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                                    <select
                                                        value={kasForm.data.kategori}
                                                        onChange={(e) => kasForm.setData('kategori', e.target.value)}
                                                        className="w-full rounded-lg border-gray-300"
                                                    >
                                                        <option value="">Pilih Kategori</option>
                                                        {Object.entries(kategoriOptions).map(([key, label]) => (
                                                            <option key={key} value={key}>{label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                                                <input
                                                    type="text"
                                                    value={kasForm.data.keterangan}
                                                    onChange={(e) => kasForm.setData('keterangan', e.target.value)}
                                                    className="w-full rounded-lg border-gray-300"
                                                    placeholder="Contoh: Return Jamur Kering Maret 2025"
                                                    required
                                                />
                                            </div>
                                            {kasForm.data.tipe === 'keluar' && (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        id="needReimburse"
                                                        checked={kasForm.data.status === 'pending_reimburse'}
                                                        onChange={(e) => kasForm.setData('status', e.target.checked ? 'pending_reimburse' : 'settled')}
                                                        className="rounded border-gray-300 text-indigo-600"
                                                    />
                                                    <label htmlFor="needReimburse" className="text-sm text-gray-600">Perlu di-reimburse nanti</label>
                                                </div>
                                            )}
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowKasForm(false);
                                                        setEditingKas(null);
                                                        kasForm.reset();
                                                    }}
                                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                                >
                                                    Batal
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={kasForm.processing}
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                                >
                                                    {kasForm.processing ? 'Menyimpan...' : 'Simpan'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Kas Table */}
                                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipe</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Debit</th>
                                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Kredit</th>
                                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Saldo</th>
                                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {kasTransaksis.length > 0 ? (
                                                    kasTransaksis.map((kas, idx) => (
                                                        <tr key={kas.id} className={`hover:bg-gray-50 ${kas.status === 'pending_reimburse' ? 'bg-amber-50' : ''}`}>
                                                            <td className="px-4 py-3 text-gray-600">{formatDate(kas.tanggal)}</td>
                                                            <td className="px-4 py-3">
                                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTipeColor(kas.tipe)}`}>
                                                                    <Icon icon={getTipeIcon(kas.tipe)} className="w-3 h-3 mr-1" />
                                                                    {kas.tipe.charAt(0).toUpperCase() + kas.tipe.slice(1)}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 font-medium text-gray-800">{kas.keterangan}</td>
                                                            <td className="px-4 py-3 text-sm text-gray-500">{kategoriOptions[kas.kategori] || kas.kategori || '-'}</td>
                                                            <td className="px-4 py-3 text-right">
                                                                {(kas.tipe === 'masuk' || kas.tipe === 'reimburse') ? (
                                                                    <span className="font-medium text-green-600">+ {formatRupiah(kas.jumlah)}</span>
                                                                ) : '-'}
                                                            </td>
                                                            <td className="px-4 py-3 text-right">
                                                                {kas.tipe === 'keluar' ? (
                                                                    <span className="font-medium text-red-600">- {formatRupiah(kas.jumlah)}</span>
                                                                ) : '-'}
                                                            </td>
                                                            <td className="px-4 py-3 text-right font-bold text-gray-800">{formatRupiah(kas.saldo)}</td>
                                                            <td className="px-4 py-3 text-center">
                                                                {kas.status === 'pending_reimburse' ? (
                                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                                                        <Icon icon="solar:clock-circle-bold" className="w-3 h-3 mr-1" />
                                                                        Pending
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                                        <Icon icon="solar:check-circle-bold" className="w-3 h-3 mr-1" />
                                                                        Settled
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3 text-center">
                                                                <div className="flex items-center justify-center gap-1">
                                                                    {kas.status === 'pending_reimburse' && (
                                                                        <button
                                                                            onClick={() => handleReimburseKas(kas)}
                                                                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                                            title="Reimburse"
                                                                        >
                                                                            <Icon icon="solar:check-circle-bold" className="w-5 h-5" />
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        onClick={() => handleEditKas(kas)}
                                                                        className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                                                                        title="Edit"
                                                                    >
                                                                        <Icon icon="solar:pen-bold" className="w-5 h-5" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteKas(kas.id)}
                                                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                                        title="Hapus"
                                                                    >
                                                                        <Icon icon="solar:trash-bin-trash-bold" className="w-5 h-5" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                                                            <Icon icon="solar:wallet-2-bold" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                                            <p>Belum ada transaksi kas</p>
                                                            <p className="text-sm">Klik "Tambah Transaksi" untuk memulai</p>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab: Investasi */}
                        {activeTab === 'investasi' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold">Portfolio Investasi</h2>
                                    <button
                                        onClick={() => {
                                            setEditingInvestasi(null);
                                            investasiForm.reset();
                                            setShowInvestasiForm(true);
                                        }}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                                    >
                                        <Icon icon="solar:add-circle-bold" className="w-5 h-5 mr-2" />
                                        Tambah Investasi
                                    </button>
                                </div>

                                {/* Investasi Form */}
                                {showInvestasiForm && (
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <h3 className="font-medium mb-4">{editingInvestasi ? 'Edit Investasi' : 'Tambah Investasi Baru'}</h3>
                                        <form onSubmit={handleSubmitInvestasi} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Investasi *</label>
                                                    <input
                                                        type="text"
                                                        value={investasiForm.data.nama}
                                                        onChange={(e) => investasiForm.setData('nama', e.target.value)}
                                                        placeholder="e.g., Kumbung Transol 1"
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipe *</label>
                                                    <select
                                                        value={investasiForm.data.tipe}
                                                        onChange={(e) => investasiForm.setData('tipe', e.target.value)}
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                    >
                                                        <option value="jamur_kering">Jamur Kering</option>
                                                        <option value="kumbung">Kumbung</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Modal *</label>
                                                    <input
                                                        type="number"
                                                        value={investasiForm.data.modal}
                                                        onChange={(e) => investasiForm.setData('modal', parseFloat(e.target.value) || 0)}
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Return Bulanan *</label>
                                                    <input
                                                        type="number"
                                                        value={investasiForm.data.return_bulanan}
                                                        onChange={(e) => investasiForm.setData('return_bulanan', parseFloat(e.target.value) || 0)}
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                                                    <input
                                                        type="date"
                                                        value={investasiForm.data.tanggal_mulai}
                                                        onChange={(e) => investasiForm.setData('tanggal_mulai', e.target.value)}
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                                    <select
                                                        value={investasiForm.data.status}
                                                        onChange={(e) => investasiForm.setData('status', e.target.value)}
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                    >
                                                        <option value="active">Active</option>
                                                        <option value="inactive">Inactive</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowInvestasiForm(false);
                                                        setEditingInvestasi(null);
                                                    }}
                                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                                >
                                                    Batal
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={investasiForm.processing}
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                                >
                                                    {investasiForm.processing ? 'Menyimpan...' : 'Simpan'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Investasi Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipe</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Modal</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Return/Bulan</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">ROI</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mulai</th>
                                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {investasis.length > 0 ? (
                                                investasis.map((item) => (
                                                    <tr key={item.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 font-medium text-gray-900">{item.nama}</td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                                item.tipe === 'jamur_kering' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                                                            }`}>
                                                                {item.tipe === 'jamur_kering' ? 'Jamur Kering' : 'Kumbung'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-indigo-600 font-medium">{formatRupiah(item.modal)}</td>
                                                        <td className="px-4 py-3 text-right text-green-600 font-medium">{formatRupiah(item.return_bulanan)}</td>
                                                        <td className="px-4 py-3 text-right text-amber-600 font-medium">{parseFloat(item.roi_tahunan || 0).toFixed(2)}%</td>
                                                        <td className="px-4 py-3 text-gray-600">{formatDate(item.tanggal_mulai)}</td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                                item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                            }`}>
                                                                {item.status === 'active' ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <div className="flex justify-center space-x-2">
                                                                <button onClick={() => handleEditInvestasi(item)} className="text-blue-600 hover:text-blue-800">
                                                                    <Icon icon="solar:pen-bold" className="w-5 h-5" />
                                                                </button>
                                                                <button onClick={() => handleDeleteInvestasi(item.id)} className="text-red-600 hover:text-red-800">
                                                                    <Icon icon="solar:trash-bin-trash-bold" className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                                                        <Icon icon="solar:wallet-bold" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                                        <p>Belum ada data investasi</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                        {investasis.length > 0 && (
                                            <tfoot className="bg-indigo-50">
                                                <tr className="font-bold">
                                                    <td className="px-4 py-3">TOTAL</td>
                                                    <td className="px-4 py-3"></td>
                                                    <td className="px-4 py-3 text-right text-indigo-600">{formatRupiah(summary.totalModal)}</td>
                                                    <td className="px-4 py-3 text-right text-green-600">{formatRupiah(summary.totalReturnBulanan)}</td>
                                                    <td className="px-4 py-3 text-right text-amber-600">{parseFloat(summary.averageROI || 0).toFixed(2)}%</td>
                                                    <td colSpan="3"></td>
                                                </tr>
                                            </tfoot>
                                        )}
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Tab: Return Bulanan */}
                        {activeTab === 'return' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold">Return Bulanan</h2>
                                    <button
                                        onClick={() => {
                                            setEditingReturn(null);
                                            returnForm.reset();
                                            setShowReturnForm(true);
                                        }}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                                    >
                                        <Icon icon="solar:add-circle-bold" className="w-5 h-5 mr-2" />
                                        Tambah Return
                                    </button>
                                </div>

                                {/* Return Form */}
                                {showReturnForm && (
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <h3 className="font-medium mb-4">{editingReturn ? 'Edit Return' : 'Tambah Return Baru'}</h3>
                                        <form onSubmit={handleSubmitReturn} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bulan *</label>
                                                    <input
                                                        type="month"
                                                        value={returnForm.data.bulan}
                                                        onChange={(e) => returnForm.setData('bulan', e.target.value)}
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Jamur Kering *</label>
                                                    <input
                                                        type="number"
                                                        value={returnForm.data.jamur_kering}
                                                        onChange={(e) => returnForm.setData('jamur_kering', parseFloat(e.target.value) || 0)}
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Share Transolindo *</label>
                                                    <input
                                                        type="number"
                                                        value={returnForm.data.share_transolindo}
                                                        onChange={(e) => returnForm.setData('share_transolindo', parseFloat(e.target.value) || 0)}
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Share Defila *</label>
                                                    <input
                                                        type="number"
                                                        value={returnForm.data.share_defila}
                                                        onChange={(e) => returnForm.setData('share_defila', parseFloat(e.target.value) || 0)}
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kumbung *</label>
                                                    <input
                                                        type="number"
                                                        value={returnForm.data.kumbung}
                                                        onChange={(e) => returnForm.setData('kumbung', parseFloat(e.target.value) || 0)}
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                                                    <input
                                                        type="text"
                                                        value={formatRupiah(returnForm.data.share_transolindo + returnForm.data.kumbung)}
                                                        readOnly
                                                        className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                                                    />
                                                </div>
                                                <div className="flex items-end">
                                                    <label className="flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={returnForm.data.diterima}
                                                            onChange={(e) => returnForm.setData('diterima', e.target.checked)}
                                                            className="mr-2 rounded"
                                                        />
                                                        <span className="text-sm">Sudah Diterima</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowReturnForm(false);
                                                        setEditingReturn(null);
                                                    }}
                                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                                >
                                                    Batal
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={returnForm.processing}
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                                >
                                                    {returnForm.processing ? 'Menyimpan...' : 'Simpan'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Return Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bulan</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Jamur Kering</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Share Transolindo</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Share Defila</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Kumbung</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {returnBulanans.length > 0 ? (
                                                returnBulanans.map((item) => (
                                                    <tr key={item.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 font-medium">{formatBulan(item.bulan)}</td>
                                                        <td className="px-4 py-3 text-right text-amber-600">{formatRupiah(item.jamur_kering)}</td>
                                                        <td className="px-4 py-3 text-right text-purple-600">{formatRupiah(item.share_transolindo)}</td>
                                                        <td className="px-4 py-3 text-right text-gray-600">{formatRupiah(item.share_defila)}</td>
                                                        <td className="px-4 py-3 text-right text-green-600">{formatRupiah(item.kumbung)}</td>
                                                        <td className="px-4 py-3 text-right font-bold text-indigo-600">{formatRupiah(item.total)}</td>
                                                        <td className="px-4 py-3 text-center">
                                                            <button
                                                                onClick={() => handleToggleReturn(item.id)}
                                                                className={`px-2 py-1 text-xs rounded-full ${
                                                                    item.diterima ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                                                }`}
                                                            >
                                                                {item.diterima ? 'Diterima' : 'Pending'}
                                                            </button>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <div className="flex justify-center space-x-2">
                                                                <button onClick={() => handleEditReturn(item)} className="text-blue-600 hover:text-blue-800">
                                                                    <Icon icon="solar:pen-bold" className="w-5 h-5" />
                                                                </button>
                                                                <button onClick={() => handleDeleteReturn(item.id)} className="text-red-600 hover:text-red-800">
                                                                    <Icon icon="solar:trash-bin-trash-bold" className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                                                        <Icon icon="solar:chart-2-bold" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                                        <p>Belum ada data return bulanan</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Tab: Hasil Panen */}
                        {activeTab === 'panen' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-lg font-semibold">Hasil Panen Kumbung</h2>
                                        <p className="text-sm text-gray-500">Total: {formatNumber(summary.totalVolumePanen)} kg dari {summary.jumlahMingguPanen} minggu</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setEditingPanen(null);
                                            panenForm.reset();
                                            setShowPanenForm(true);
                                        }}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                                    >
                                        <Icon icon="solar:add-circle-bold" className="w-5 h-5 mr-2" />
                                        Tambah Panen
                                    </button>
                                </div>

                                {/* GRAND SUMMARY - Per Kumbung */}
                                {kumbungs.length > 0 && panens.length > 0 && (() => {
                                    // Calculate per kumbung stats
                                    const kumbungStats = kumbungs.map(k => {
                                        const kPanens = panens.filter(p => p.investasi_transolindo_id === k.id);
                                        const totalVolume = kPanens.reduce((sum, p) => sum + parseFloat(p.volume_kg || 0), 0);
                                        const totalPendapatan = kPanens.reduce((sum, p) => sum + parseFloat(p.pendapatan_kotor || 0), 0);
                                        const totalProfit = kPanens.reduce((sum, p) => sum + parseFloat(p.profit || 0), 0);
                                        const totalTabunganBaglog = kPanens.reduce((sum, p) => sum + parseFloat(p.tabungan_baglog || 0), 0);
                                        const avgHarga = totalVolume > 0 ? totalPendapatan / totalVolume : 0;
                                        const weeks = kPanens.length;

                                        // Hardcoded baglog payment for T1 (24 Dec 2025) - 88jt
                                        // TODO: Make this dynamic from database
                                        const baglogPaid = k.nama.includes('1') ? 88000000 : 0;
                                        const netProfit = totalProfit - (baglogPaid > 0 && totalTabunganBaglog >= baglogPaid ? 0 : 0);

                                        return {
                                            id: k.id,
                                            nama: k.nama,
                                            fase: k.fase,
                                            siklus: k.siklus_ke || 1,
                                            weeks,
                                            totalVolume,
                                            avgHarga,
                                            totalPendapatan,
                                            totalTabunganBaglog,
                                            baglogPaid,
                                            totalProfit,
                                            panens: kPanens
                                        };
                                    });

                                    const grandTotalVolume = kumbungStats.reduce((sum, k) => sum + k.totalVolume, 0);
                                    const grandTotalPendapatan = kumbungStats.reduce((sum, k) => sum + k.totalPendapatan, 0);
                                    const grandTotalTabungan = kumbungStats.reduce((sum, k) => sum + k.totalTabunganBaglog, 0);
                                    const grandTotalBaglogPaid = kumbungStats.reduce((sum, k) => sum + k.baglogPaid, 0);
                                    const grandTotalProfit = kumbungStats.reduce((sum, k) => sum + k.totalProfit, 0);

                                    return (
                                        <>
                                            {/* Summary Table per Kumbung */}
                                            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                                                <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
                                                    <h3 className="text-lg font-bold text-white flex items-center">
                                                        <Icon icon="solar:chart-2-bold" className="w-6 h-6 mr-2" />
                                                        GRAND SUMMARY PANEN
                                                    </h3>
                                                </div>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kumbung</th>
                                                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Fase</th>
                                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Minggu</th>
                                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Volume (kg)</th>
                                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg Harga</th>
                                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Pendapatan</th>
                                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase bg-red-50">Bayar Baglog</th>
                                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase bg-green-50">Profit Bersih</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-200">
                                                            {kumbungStats.map((k, idx) => {
                                                                const profitBersih = k.totalPendapatan - k.baglogPaid;
                                                                return (
                                                                    <tr key={k.id} className={`hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                                                        <td className="px-4 py-3">
                                                                            <div className="font-medium text-gray-900">{k.nama}</div>
                                                                            <div className="text-xs text-gray-500">Siklus {k.siklus}</div>
                                                                        </td>
                                                                        <td className="px-4 py-3 text-center">
                                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFaseColor(k.fase)}`}>
                                                                                {faseLabels[k.fase] || 'Persiapan'}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-4 py-3 text-right font-medium text-gray-700">{k.weeks}</td>
                                                                        <td className="px-4 py-3 text-right font-bold text-blue-600">{formatNumber(k.totalVolume)}</td>
                                                                        <td className="px-4 py-3 text-right text-gray-600">{formatRupiah(k.avgHarga)}</td>
                                                                        <td className="px-4 py-3 text-right font-bold text-green-600">{formatRupiah(k.totalPendapatan)}</td>
                                                                        <td className="px-4 py-3 text-right bg-red-50">
                                                                            {k.baglogPaid > 0 ? (
                                                                                <span className="font-medium text-red-600">- {formatRupiah(k.baglogPaid)}</span>
                                                                            ) : (
                                                                                <span className="text-gray-400 text-xs">Belum bayar</span>
                                                                            )}
                                                                        </td>
                                                                        <td className="px-4 py-3 text-right bg-green-50">
                                                                            {k.baglogPaid > 0 ? (
                                                                                <span className="font-bold text-green-600">{formatRupiah(profitBersih)}</span>
                                                                            ) : (
                                                                                <span className="text-yellow-600 text-xs">Pending</span>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                        <tfoot>
                                                            <tr className="bg-indigo-50 font-bold">
                                                                <td className="px-4 py-3 text-indigo-700" colSpan="2">GRAND TOTAL</td>
                                                                <td className="px-4 py-3 text-right text-indigo-700">{kumbungStats.reduce((sum, k) => sum + k.weeks, 0)}</td>
                                                                <td className="px-4 py-3 text-right text-blue-700">{formatNumber(grandTotalVolume)}</td>
                                                                <td className="px-4 py-3 text-right text-gray-600">{formatRupiah(grandTotalVolume > 0 ? grandTotalPendapatan / grandTotalVolume : 0)}</td>
                                                                <td className="px-4 py-3 text-right text-green-700">{formatRupiah(grandTotalPendapatan)}</td>
                                                                <td className="px-4 py-3 text-right text-red-600 bg-red-50">- {formatRupiah(grandTotalBaglogPaid)}</td>
                                                                <td className="px-4 py-3 text-right text-green-700 bg-green-50">{formatRupiah(kumbungStats.filter(k => k.baglogPaid > 0).reduce((sum, k) => sum + (k.totalPendapatan - k.baglogPaid), 0))}</td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                            </div>

                                            {/* Profit Calculation - Simple: Pendapatan - Baglog = Profit */}
                                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                                                <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center">
                                                    <Icon icon="solar:calculator-bold" className="w-6 h-6 mr-2" />
                                                    KALKULASI PROFIT BERSIH
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {kumbungStats.map((k) => {
                                                        const profitBersih = k.totalPendapatan - k.baglogPaid;
                                                        const isLunas = k.baglogPaid > 0;
                                                        return (
                                                            <div key={k.id} className={`bg-white rounded-lg p-4 shadow-sm ${!isLunas ? 'border-2 border-dashed border-yellow-300' : ''}`}>
                                                                <div className="flex justify-between items-center mb-3">
                                                                    <h4 className="font-bold text-gray-800">{k.nama}</h4>
                                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${isLunas ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                                        {isLunas ? 'Baglog LUNAS' : 'Masih Berjalan'}
                                                                    </span>
                                                                </div>
                                                                <div className="space-y-2 text-sm">
                                                                    <div className="flex justify-between">
                                                                        <span className="text-gray-600">Total Pendapatan:</span>
                                                                        <span className="font-medium text-green-600">{formatRupiah(k.totalPendapatan)}</span>
                                                                    </div>
                                                                    {isLunas ? (
                                                                        <>
                                                                            <div className="flex justify-between text-red-600">
                                                                                <span>Bayar Baglog:</span>
                                                                                <span>- {formatRupiah(k.baglogPaid)}</span>
                                                                            </div>
                                                                            <div className="flex justify-between border-t-2 border-green-300 pt-3 mt-3">
                                                                                <span className="font-bold text-gray-800">PROFIT BERSIH:</span>
                                                                                <span className="font-bold text-xl text-green-600">{formatRupiah(profitBersih)}</span>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <div className="flex justify-between border-t-2 border-yellow-300 pt-3 mt-3 bg-yellow-50 -mx-4 px-4 py-2 -mb-4 rounded-b-lg">
                                                                            <span className="font-medium text-yellow-700">Saldo Sementara:</span>
                                                                            <span className="font-bold text-lg text-yellow-600">{formatRupiah(k.totalPendapatan)}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Grand Total Profit - Only count LUNAS */}
                                                {(() => {
                                                    const lunasStats = kumbungStats.filter(k => k.baglogPaid > 0);
                                                    const pendingStats = kumbungStats.filter(k => k.baglogPaid === 0);
                                                    const totalProfitLunas = lunasStats.reduce((sum, k) => sum + (k.totalPendapatan - k.baglogPaid), 0);
                                                    const totalSaldoPending = pendingStats.reduce((sum, k) => sum + k.totalPendapatan, 0);

                                                    return (
                                                        <div className="mt-6 pt-4 border-t border-amber-200">
                                                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    {/* Profit dari yang sudah LUNAS */}
                                                                    <div className="bg-green-100 rounded-lg p-4 text-center">
                                                                        <p className="text-xs text-green-700 mb-1">PROFIT BERSIH (Baglog Lunas)</p>
                                                                        <p className="text-2xl font-bold text-green-600">{formatRupiah(totalProfitLunas)}</p>
                                                                        <p className="text-xs text-green-600 mt-1">dari {lunasStats.length} kumbung</p>
                                                                    </div>
                                                                    {/* Saldo yang masih pending */}
                                                                    <div className="bg-yellow-50 rounded-lg p-4 text-center border border-dashed border-yellow-300">
                                                                        <p className="text-xs text-yellow-700 mb-1">Saldo Sementara (Masih Berjalan)</p>
                                                                        <p className="text-2xl font-bold text-yellow-600">{formatRupiah(totalSaldoPending)}</p>
                                                                        <p className="text-xs text-yellow-600 mt-1">dari {pendingStats.length} kumbung</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </>
                                    );
                                })()}

                                {/* Panen Form */}
                                {showPanenForm && (
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <h3 className="font-medium mb-4">{editingPanen ? 'Edit Panen' : 'Tambah Data Panen'}</h3>
                                        <form onSubmit={handleSubmitPanen} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kumbung</label>
                                                    <select
                                                        value={panenForm.data.investasi_transolindo_id}
                                                        onChange={(e) => panenForm.setData('investasi_transolindo_id', e.target.value)}
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                    >
                                                        <option value="">-- Pilih Kumbung --</option>
                                                        {investasis.filter(i => i.tipe === 'kumbung').map((inv) => (
                                                            <option key={inv.id} value={inv.id}>{inv.nama}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai *</label>
                                                    <input
                                                        type="date"
                                                        value={panenForm.data.tanggal_mulai}
                                                        onChange={(e) => panenForm.setData('tanggal_mulai', e.target.value)}
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai *</label>
                                                    <input
                                                        type="date"
                                                        value={panenForm.data.tanggal_selesai}
                                                        onChange={(e) => panenForm.setData('tanggal_selesai', e.target.value)}
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Minggu/Bulan *</label>
                                                    <input
                                                        type="text"
                                                        value={panenForm.data.minggu_bulan}
                                                        onChange={(e) => panenForm.setData('minggu_bulan', e.target.value)}
                                                        placeholder="e.g., Minggu ke 1 / Bulan ke 1"
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Volume (kg) *</label>
                                                    <input
                                                        type="number"
                                                        value={panenForm.data.volume_kg}
                                                        onChange={(e) => panenForm.setData('volume_kg', parseFloat(e.target.value) || 0)}
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pendapatan Kotor *</label>
                                                    <input
                                                        type="number"
                                                        value={panenForm.data.pendapatan_kotor}
                                                        onChange={(e) => panenForm.setData('pendapatan_kotor', parseFloat(e.target.value) || 0)}
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <p className="text-sm text-blue-600">Kalkulasi Otomatis:</p>
                                                <p className="text-sm">Tabungan Baglog (80%): <strong>{formatRupiah(panenForm.data.pendapatan_kotor * 0.8)}</strong></p>
                                                <p className="text-sm">Profit (20%): <strong>{formatRupiah(panenForm.data.pendapatan_kotor * 0.2)}</strong></p>
                                            </div>
                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowPanenForm(false);
                                                        setEditingPanen(null);
                                                    }}
                                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                                >
                                                    Batal
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={panenForm.processing}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                                >
                                                    {panenForm.processing ? 'Menyimpan...' : 'Simpan'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Panen Table - Grouped by Kumbung */}
                                {kumbungs.map((kumbung) => {
                                    const kumbungPanens = panens.filter(p => p.investasi_transolindo_id === kumbung.id);
                                    if (kumbungPanens.length === 0) return null;

                                    const totalVolume = kumbungPanens.reduce((sum, p) => sum + parseFloat(p.volume_kg || 0), 0);
                                    const totalPendapatan = kumbungPanens.reduce((sum, p) => sum + parseFloat(p.pendapatan_kotor || 0), 0);
                                    const totalTabungan = kumbungPanens.reduce((sum, p) => sum + parseFloat(p.tabungan_baglog || 0), 0);
                                    const totalProfit = kumbungPanens.reduce((sum, p) => sum + parseFloat(p.profit || 0), 0);

                                    return (
                                        <div key={kumbung.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                                            <div className={`px-4 py-3 flex justify-between items-center ${kumbung.nama.includes('1') ? 'bg-blue-600' : 'bg-green-600'}`}>
                                                <h4 className="font-bold text-white flex items-center">
                                                    <Icon icon="solar:home-2-bold" className="w-5 h-5 mr-2" />
                                                    {kumbung.nama} - Siklus {kumbung.siklus_ke || 1}
                                                </h4>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${kumbung.fase === 'panen' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {faseLabels[kumbung.fase] || 'Persiapan'}
                                                </span>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Minggu</th>
                                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Periode</th>
                                                            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Volume</th>
                                                            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Harga/kg</th>
                                                            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Pendapatan</th>
                                                            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Baglog (80%)</th>
                                                            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Profit (20%)</th>
                                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ket</th>
                                                            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                        {kumbungPanens.map((item, idx) => {
                                                            const hargaPerKg = parseFloat(item.volume_kg) > 0 ? parseFloat(item.pendapatan_kotor) / parseFloat(item.volume_kg) : 0;
                                                            return (
                                                                <tr key={item.id} className={`hover:bg-gray-50 ${idx % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                                                                    <td className="px-3 py-2 font-medium text-gray-800">{item.minggu_bulan}</td>
                                                                    <td className="px-3 py-2 text-gray-600 text-xs">{formatDate(item.tanggal_mulai)} - {formatDate(item.tanggal_selesai)}</td>
                                                                    <td className="px-3 py-2 text-right font-bold text-blue-600">{formatNumber(item.volume_kg)}</td>
                                                                    <td className="px-3 py-2 text-right text-gray-600">{formatRupiah(hargaPerKg)}</td>
                                                                    <td className="px-3 py-2 text-right font-medium text-green-600">{formatRupiah(item.pendapatan_kotor)}</td>
                                                                    <td className="px-3 py-2 text-right text-purple-600">{formatRupiah(item.tabungan_baglog)}</td>
                                                                    <td className="px-3 py-2 text-right font-medium text-amber-600">{formatRupiah(item.profit)}</td>
                                                                    <td className="px-3 py-2 text-xs text-gray-500">{item.keterangan || '-'}</td>
                                                                    <td className="px-3 py-2 text-center">
                                                                        <button onClick={() => handleDeletePanen(item.id)} className="text-red-500 hover:text-red-700">
                                                                            <Icon icon="solar:trash-bin-trash-bold" className="w-4 h-4" />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                    <tfoot className={`${kumbung.nama.includes('1') ? 'bg-blue-50' : 'bg-green-50'} font-bold`}>
                                                        <tr>
                                                            <td className="px-3 py-2 text-gray-700">TOTAL ({kumbungPanens.length} minggu)</td>
                                                            <td className="px-3 py-2"></td>
                                                            <td className="px-3 py-2 text-right text-blue-700">{formatNumber(totalVolume)} kg</td>
                                                            <td className="px-3 py-2 text-right text-gray-600">{formatRupiah(totalVolume > 0 ? totalPendapatan / totalVolume : 0)}</td>
                                                            <td className="px-3 py-2 text-right text-green-700">{formatRupiah(totalPendapatan)}</td>
                                                            <td className="px-3 py-2 text-right text-purple-700">{formatRupiah(totalTabungan)}</td>
                                                            <td className="px-3 py-2 text-right text-amber-700">{formatRupiah(totalProfit)}</td>
                                                            <td className="px-3 py-2" colSpan="2"></td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                    );
                                })}

                                {panens.length === 0 && (
                                    <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
                                        <Icon icon="solar:leaf-bold" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                        <p className="text-lg">Belum ada data panen</p>
                                        <p className="text-sm">Klik "Tambah Panen" untuk menambah data</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab: Rekap Kumbung */}
                        {activeTab === 'rekap' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold">Rekap Bulanan per Kumbung</h2>
                                    <p className="text-sm text-gray-500">Perbandingan kontribusi setiap kumbung per bulan</p>
                                </div>

                                {/* Rekap Table */}
                                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bulan</th>
                                                    {kumbungs.map((k) => (
                                                        <th key={k.id} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase" colSpan="2">
                                                            {k.nama.replace('Kumbung Transol ', 'K')}
                                                        </th>
                                                    ))}
                                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase bg-indigo-50">Total</th>
                                                </tr>
                                                <tr className="bg-gray-100">
                                                    <th className="px-4 py-2 text-left text-xs text-gray-400"></th>
                                                    {kumbungs.map((k) => (
                                                        <>
                                                            <th key={`${k.id}-vol`} className="px-2 py-2 text-center text-xs text-gray-400">Volume</th>
                                                            <th key={`${k.id}-pend`} className="px-2 py-2 text-center text-xs text-gray-400">Pendapatan</th>
                                                        </>
                                                    ))}
                                                    <th className="px-4 py-2 text-right text-xs text-gray-400 bg-indigo-50">Pendapatan</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {rekapBulanan.length > 0 ? (
                                                    rekapBulanan.map((item, idx) => (
                                                        <tr key={idx} className="hover:bg-gray-50">
                                                            <td className="px-4 py-3 font-medium text-gray-800">{item.bulan_label}</td>
                                                            {item.kumbungs.map((kumb, kIdx) => (
                                                                <>
                                                                    <td key={`${idx}-${kIdx}-vol`} className="px-2 py-3 text-center">
                                                                        {kumb.volume > 0 ? (
                                                                            <span className="text-blue-600 font-medium">{formatNumber(kumb.volume)} kg</span>
                                                                        ) : (
                                                                            <span className="text-gray-300">-</span>
                                                                        )}
                                                                    </td>
                                                                    <td key={`${idx}-${kIdx}-pend`} className="px-2 py-3 text-center">
                                                                        {kumb.pendapatan > 0 ? (
                                                                            <span className="text-green-600 font-medium">{formatRupiah(kumb.pendapatan)}</span>
                                                                        ) : (
                                                                            <span className="text-gray-300">-</span>
                                                                        )}
                                                                    </td>
                                                                </>
                                                            ))}
                                                            <td className="px-4 py-3 text-right font-bold text-indigo-600 bg-indigo-50">{formatRupiah(item.total_pendapatan)}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={3 + (kumbungs.length * 2)} className="px-4 py-8 text-center text-gray-500">
                                                            <Icon icon="solar:document-bold" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                                            <p>Belum ada data rekap</p>
                                                        </td>
                                                    </tr>
                                                )}
                                                {/* Total Row */}
                                                {rekapBulanan.length > 0 && (
                                                    <tr className="bg-gray-100 font-bold">
                                                        <td className="px-4 py-3">TOTAL</td>
                                                        {kumbungs.map((k, kIdx) => {
                                                            const totalVol = rekapBulanan.reduce((sum, r) => sum + (r.kumbungs[kIdx]?.volume || 0), 0);
                                                            const totalPend = rekapBulanan.reduce((sum, r) => sum + (r.kumbungs[kIdx]?.pendapatan || 0), 0);
                                                            return (
                                                                <>
                                                                    <td key={`tot-${k.id}-vol`} className="px-2 py-3 text-center text-blue-700">{formatNumber(totalVol)} kg</td>
                                                                    <td key={`tot-${k.id}-pend`} className="px-2 py-3 text-center text-green-700">{formatRupiah(totalPend)}</td>
                                                                </>
                                                            );
                                                        })}
                                                        <td className="px-4 py-3 text-right text-indigo-700 bg-indigo-100">
                                                            {formatRupiah(rekapBulanan.reduce((sum, r) => sum + r.total_pendapatan, 0))}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Visual Comparison */}
                                {rekapBulanan.length > 0 && kumbungs.length > 0 && (
                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <h3 className="font-medium mb-4 text-gray-700">Perbandingan Volume Panen per Bulan</h3>
                                        <div className="space-y-3">
                                            {rekapBulanan.map((item, idx) => {
                                                const maxVol = Math.max(...rekapBulanan.flatMap(r => r.kumbungs.map(k => k.volume)));
                                                return (
                                                    <div key={idx} className="flex items-center gap-4">
                                                        <div className="w-20 text-sm text-gray-600 font-medium">{item.bulan_label}</div>
                                                        <div className="flex-1 flex h-8 rounded-lg overflow-hidden bg-gray-200 gap-0.5">
                                                            {item.kumbungs.map((kumb, kIdx) => {
                                                                const width = maxVol > 0 ? (kumb.volume / maxVol) * 100 : 0;
                                                                const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500'];
                                                                return (
                                                                    <div
                                                                        key={kIdx}
                                                                        className={`${colors[kIdx % colors.length]} flex items-center justify-center text-white text-xs`}
                                                                        style={{ width: `${width}%` }}
                                                                        title={`${kumb.nama}: ${formatNumber(kumb.volume)} kg`}
                                                                    >
                                                                        {width > 10 && `${formatNumber(kumb.volume)}`}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                        <div className="w-20 text-right text-sm font-bold text-gray-700">
                                                            {formatNumber(item.total_volume)} kg
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t">
                                            {kumbungs.map((k, idx) => {
                                                const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500'];
                                                return (
                                                    <div key={k.id} className="flex items-center gap-2">
                                                        <div className={`w-4 h-4 ${colors[idx % colors.length]} rounded`}></div>
                                                        <span className="text-sm text-gray-600">{k.nama.replace('Kumbung Transol ', 'Kumbung ')}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab: Monthly Charts */}
                        {activeTab === 'charts' && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold">Monthly Returns Chart</h2>

                                {/* Smooth Line Chart Visual */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="font-medium mb-4 text-gray-700">Return Bulanan (Share Transolindo + Kumbung)</h3>
                                    {chartData.length > 0 ? (
                                        <div className="relative">
                                            {/* SVG Smooth Line Chart */}
                                            <div className="overflow-x-auto">
                                                {(() => {
                                                    const maxValue = Math.max(...chartData.map(d => d.total || 0));
                                                    const chartWidth = Math.max(chartData.length * 80, 600);

                                                    // Generate points for each line
                                                    const totalPoints = chartData.map((item, idx) => ({
                                                        x: 80 + idx * 70,
                                                        y: maxValue > 0 ? 250 - ((item.total || 0) / maxValue) * 200 : 250
                                                    }));
                                                    const jamurPoints = chartData.map((item, idx) => ({
                                                        x: 80 + idx * 70,
                                                        y: maxValue > 0 ? 250 - ((item.jamur || 0) / maxValue) * 200 : 250
                                                    }));
                                                    const kumbungPoints = chartData.map((item, idx) => ({
                                                        x: 80 + idx * 70,
                                                        y: maxValue > 0 ? 250 - ((item.kumbung || 0) / maxValue) * 200 : 250
                                                    }));

                                                    return (
                                                        <svg viewBox={`0 0 ${chartWidth} 300`} className="w-full min-w-[600px] h-[300px]">
                                                            {/* Gradient definitions */}
                                                            <defs>
                                                                <linearGradient id="totalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                                                                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
                                                                </linearGradient>
                                                                <linearGradient id="jamurGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                                                                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
                                                                </linearGradient>
                                                            </defs>

                                                            {/* Grid lines */}
                                                            {[0, 1, 2, 3, 4].map((i) => (
                                                                <line
                                                                    key={i}
                                                                    x1="60"
                                                                    y1={50 + i * 50}
                                                                    x2={chartWidth - 20}
                                                                    y2={50 + i * 50}
                                                                    stroke="#e5e7eb"
                                                                    strokeWidth="1"
                                                                />
                                                            ))}

                                                            {/* Y-axis labels */}
                                                            {[0, 1, 2, 3, 4].map((i) => (
                                                                <text
                                                                    key={i}
                                                                    x="55"
                                                                    y={255 - i * 50}
                                                                    textAnchor="end"
                                                                    className="text-xs fill-gray-500"
                                                                    fontSize="10"
                                                                >
                                                                    {formatRupiah((maxValue / 4) * i).replace('Rp', '')}
                                                                </text>
                                                            ))}

                                                            {/* Total Area Fill */}
                                                            <path
                                                                d={generateAreaPath(totalPoints, 250)}
                                                                fill="url(#totalGradient)"
                                                            />

                                                            {/* Total Smooth Line (purple) */}
                                                            <path
                                                                d={generateSmoothPath(totalPoints)}
                                                                fill="none"
                                                                stroke="#8b5cf6"
                                                                strokeWidth="3"
                                                                strokeLinecap="round"
                                                            />

                                                            {/* Share Transolindo Smooth Line (indigo) */}
                                                            <path
                                                                d={generateSmoothPath(jamurPoints)}
                                                                fill="none"
                                                                stroke="#6366f1"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeDasharray="8,4"
                                                            />

                                                            {/* Kumbung Smooth Line (green) */}
                                                            <path
                                                                d={generateSmoothPath(kumbungPoints)}
                                                                fill="none"
                                                                stroke="#22c55e"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeDasharray="8,4"
                                                            />

                                                            {/* Data points & labels */}
                                                            {chartData.map((item, idx) => {
                                                                const x = 80 + idx * 70;
                                                                const yTotal = maxValue > 0 ? 250 - ((item.total || 0) / maxValue) * 200 : 250;
                                                                const yJamur = maxValue > 0 ? 250 - ((item.jamur || 0) / maxValue) * 200 : 250;
                                                                const yKumbung = maxValue > 0 ? 250 - ((item.kumbung || 0) / maxValue) * 200 : 250;
                                                                return (
                                                                    <g key={idx} className="cursor-pointer">
                                                                        {/* Hover area */}
                                                                        <rect x={x - 25} y="40" width="50" height="220" fill="transparent" />
                                                                        {/* Total point with glow */}
                                                                        <circle cx={x} cy={yTotal} r="8" fill="#8b5cf6" fillOpacity="0.2" />
                                                                        <circle cx={x} cy={yTotal} r="5" fill="#8b5cf6" stroke="white" strokeWidth="2" />
                                                                        {/* Jamur point */}
                                                                        <circle cx={x} cy={yJamur} r="4" fill="#6366f1" stroke="white" strokeWidth="1.5" />
                                                                        {/* Kumbung point */}
                                                                        <circle cx={x} cy={yKumbung} r="4" fill="#22c55e" stroke="white" strokeWidth="1.5" />
                                                                        {/* X-axis label */}
                                                                        <text
                                                                            x={x}
                                                                            y="280"
                                                                            textAnchor="middle"
                                                                            className="text-xs fill-gray-600"
                                                                            fontSize="10"
                                                                        >
                                                                            {item.bulan}
                                                                        </text>
                                                                        {/* Tooltip */}
                                                                        <title>{`${item.bulan}\nTotal: ${formatRupiah(item.total)}\nJamur: ${formatRupiah(item.jamur)}\nKumbung: ${formatRupiah(item.kumbung)}`}</title>
                                                                    </g>
                                                                );
                                                            })}
                                                        </svg>
                                                    );
                                                })()}
                                            </div>

                                            {/* Legend */}
                                            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-0.5 bg-purple-500 rounded"></div>
                                                    <span className="text-sm text-gray-600">Total</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <svg width="24" height="2"><line x1="0" y1="1" x2="24" y2="1" stroke="#6366f1" strokeWidth="2" strokeDasharray="4,2" /></svg>
                                                    <span className="text-sm text-gray-600">Share Transolindo</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <svg width="24" height="2"><line x1="0" y1="1" x2="24" y2="1" stroke="#22c55e" strokeWidth="2" strokeDasharray="4,2" /></svg>
                                                    <span className="text-sm text-gray-600">Kumbung</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <Icon icon="solar:chart-square-bold" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                            <p>Belum ada data return bulanan</p>
                                        </div>
                                    )}
                                </div>

                                {/* Volume Panen Smooth Line Chart */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="font-medium mb-4 text-gray-700">Volume Panen per Minggu (kg)</h3>
                                    {panens.length > 0 ? (
                                        <div className="relative">
                                            <div className="overflow-x-auto">
                                                {(() => {
                                                    const maxVolume = Math.max(...panens.map(p => parseFloat(p.volume_kg) || 0));
                                                    const maxPendapatan = Math.max(...panens.map(p => parseFloat(p.pendapatan_kotor) || 0));
                                                    const chartWidth = Math.max(panens.length * 70 + 100, 600);

                                                    // Generate points for volume line
                                                    const volumePoints = panens.map((item, idx) => ({
                                                        x: 70 + idx * 60,
                                                        y: maxVolume > 0 ? 220 - ((parseFloat(item.volume_kg) || 0) / maxVolume) * 170 : 220
                                                    }));

                                                    // Generate points for pendapatan line
                                                    const pendapatanPoints = panens.map((item, idx) => ({
                                                        x: 70 + idx * 60,
                                                        y: maxPendapatan > 0 ? 220 - ((parseFloat(item.pendapatan_kotor) || 0) / maxPendapatan) * 170 : 220
                                                    }));

                                                    return (
                                                        <svg viewBox={`0 0 ${chartWidth} 280`} className="w-full min-w-[600px] h-[280px]">
                                                            {/* Gradient definitions */}
                                                            <defs>
                                                                <linearGradient id="volumeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                                                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                                                                </linearGradient>
                                                                <linearGradient id="pendapatanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                                                                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0.05" />
                                                                </linearGradient>
                                                            </defs>

                                                            {/* Grid lines */}
                                                            {[0, 1, 2, 3, 4].map((i) => (
                                                                <line
                                                                    key={i}
                                                                    x1="50"
                                                                    y1={50 + i * 42.5}
                                                                    x2={chartWidth - 20}
                                                                    y2={50 + i * 42.5}
                                                                    stroke="#e5e7eb"
                                                                    strokeWidth="1"
                                                                />
                                                            ))}

                                                            {/* Y-axis labels (Volume) */}
                                                            {[0, 1, 2, 3, 4].map((i) => (
                                                                <text
                                                                    key={i}
                                                                    x="45"
                                                                    y={225 - i * 42.5}
                                                                    textAnchor="end"
                                                                    className="text-xs fill-blue-500"
                                                                    fontSize="9"
                                                                >
                                                                    {formatNumber((maxVolume / 4) * i)}
                                                                </text>
                                                            ))}

                                                            {/* Volume Area Fill */}
                                                            <path
                                                                d={generateAreaPath(volumePoints, 220)}
                                                                fill="url(#volumeGradient)"
                                                            />

                                                            {/* Volume Smooth Line (blue) */}
                                                            <path
                                                                d={generateSmoothPath(volumePoints)}
                                                                fill="none"
                                                                stroke="#3b82f6"
                                                                strokeWidth="3"
                                                                strokeLinecap="round"
                                                            />

                                                            {/* Pendapatan Smooth Line (green) */}
                                                            <path
                                                                d={generateSmoothPath(pendapatanPoints)}
                                                                fill="none"
                                                                stroke="#22c55e"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeDasharray="6,3"
                                                            />

                                                            {/* Data points & labels */}
                                                            {panens.map((item, idx) => {
                                                                const x = 70 + idx * 60;
                                                                const yVolume = maxVolume > 0 ? 220 - ((parseFloat(item.volume_kg) || 0) / maxVolume) * 170 : 220;
                                                                const yPendapatan = maxPendapatan > 0 ? 220 - ((parseFloat(item.pendapatan_kotor) || 0) / maxPendapatan) * 170 : 220;
                                                                return (
                                                                    <g key={idx} className="cursor-pointer">
                                                                        {/* Volume point with glow */}
                                                                        <circle cx={x} cy={yVolume} r="7" fill="#3b82f6" fillOpacity="0.2" />
                                                                        <circle cx={x} cy={yVolume} r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
                                                                        {/* Pendapatan point */}
                                                                        <circle cx={x} cy={yPendapatan} r="3" fill="#22c55e" stroke="white" strokeWidth="1.5" />
                                                                        {/* X-axis label */}
                                                                        <text
                                                                            x={x}
                                                                            y="245"
                                                                            textAnchor="middle"
                                                                            className="text-xs fill-gray-500"
                                                                            fontSize="8"
                                                                            transform={`rotate(-30, ${x}, 245)`}
                                                                        >
                                                                            {item.minggu_bulan?.substring(0, 10) || `W${idx + 1}`}
                                                                        </text>
                                                                        {/* Tooltip */}
                                                                        <title>{`${item.minggu_bulan}\nVolume: ${formatNumber(item.volume_kg)} kg\nPendapatan: ${formatRupiah(item.pendapatan_kotor)}`}</title>
                                                                    </g>
                                                                );
                                                            })}
                                                        </svg>
                                                    );
                                                })()}
                                            </div>

                                            {/* Legend */}
                                            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-0.5 bg-blue-500 rounded"></div>
                                                    <span className="text-sm text-gray-600">Volume (kg)</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <svg width="24" height="2"><line x1="0" y1="1" x2="24" y2="1" stroke="#22c55e" strokeWidth="2" strokeDasharray="4,2" /></svg>
                                                    <span className="text-sm text-gray-600">Pendapatan</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <Icon icon="solar:leaf-bold" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                            <p>Belum ada data panen</p>
                                        </div>
                                    )}
                                </div>

                                {/* Summary Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-6 text-white">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Icon icon="solar:wallet-money-bold" className="w-8 h-8 opacity-80" />
                                            <span className="text-purple-200 text-sm">Total Return Diterima</span>
                                        </div>
                                        <p className="text-2xl font-bold">{formatRupiah(summary.totalDiterima)}</p>
                                        <p className="text-purple-200 text-sm mt-1">{returnBulanans.filter(r => r.diterima).length} bulan</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-6 text-white">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Icon icon="solar:leaf-bold" className="w-8 h-8 opacity-80" />
                                            <span className="text-green-200 text-sm">Total Panen</span>
                                        </div>
                                        <p className="text-2xl font-bold">{formatNumber(summary.totalVolumePanen)} kg</p>
                                        <p className="text-green-200 text-sm mt-1">{formatRupiah(summary.totalPendapatanPanen)}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl p-6 text-white">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Icon icon="solar:graph-up-bold" className="w-8 h-8 opacity-80" />
                                            <span className="text-amber-200 text-sm">Total Profit Kumbung</span>
                                        </div>
                                        <p className="text-2xl font-bold">{formatRupiah(summary.totalKumbung)}</p>
                                        <p className="text-amber-200 text-sm mt-1">20% dari pendapatan panen</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab: Planning & Target */}
                        {activeTab === 'planning' && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold">Target & Progress</h2>

                                {/* Target Progress Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Volume Target */}
                                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-medium text-gray-700">Volume Target</h3>
                                            <Icon icon="solar:scale-bold" className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div className="mb-3">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-500">Progress</span>
                                                <span className="font-bold text-blue-600">
                                                    {((summary.totalPendapatanPanen / 100000000) * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
                                                    style={{ width: `${Math.min((summary.totalPendapatanPanen / 100000000) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">{formatRupiah(summary.totalPendapatanPanen)}</span>
                                            <span className="text-gray-400">/ {formatRupiah(100000000)}</span>
                                        </div>
                                    </div>

                                    {/* Savings Target (80%) */}
                                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-medium text-gray-700">Tabungan Baglog (80%)</h3>
                                            <Icon icon="solar:safe-2-bold" className="w-6 h-6 text-purple-500" />
                                        </div>
                                        <div className="mb-3">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-500">Progress</span>
                                                <span className="font-bold text-purple-600">
                                                    {(((summary.totalPendapatanPanen * 0.8) / 80000000) * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-500"
                                                    style={{ width: `${Math.min(((summary.totalPendapatanPanen * 0.8) / 80000000) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">{formatRupiah(summary.totalPendapatanPanen * 0.8)}</span>
                                            <span className="text-gray-400">/ {formatRupiah(80000000)}</span>
                                        </div>
                                    </div>

                                    {/* Profit Target (20%) */}
                                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-medium text-gray-700">Profit (20%)</h3>
                                            <Icon icon="solar:money-bag-bold" className="w-6 h-6 text-amber-500" />
                                        </div>
                                        <div className="mb-3">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-500">Progress</span>
                                                <span className="font-bold text-amber-600">
                                                    {((summary.totalKumbung / 20000000) * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500"
                                                    style={{ width: `${Math.min((summary.totalKumbung / 20000000) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">{formatRupiah(summary.totalKumbung)}</span>
                                            <span className="text-gray-400">/ {formatRupiah(20000000)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Investment Overview */}
                                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
                                    <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                                        <Icon icon="solar:chart-bold" className="w-5 h-5 mr-2 text-indigo-600" />
                                        Investment Overview
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-white rounded-lg p-4">
                                            <p className="text-xs text-gray-500 mb-1">Total Investasi</p>
                                            <p className="text-lg font-bold text-indigo-600">{formatRupiah(summary.totalModal)}</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-4">
                                            <p className="text-xs text-gray-500 mb-1">Return Bulanan Expected</p>
                                            <p className="text-lg font-bold text-green-600">{formatRupiah(summary.totalReturnBulanan)}</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-4">
                                            <p className="text-xs text-gray-500 mb-1">Return Tahunan Expected</p>
                                            <p className="text-lg font-bold text-purple-600">{formatRupiah(summary.totalReturnBulanan * 12)}</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-4">
                                            <p className="text-xs text-gray-500 mb-1">ROI Rata-rata</p>
                                            <p className="text-lg font-bold text-amber-600">{parseFloat(summary.averageROI || 0).toFixed(2)}%</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Milestone Timeline */}
                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                    <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                                        <Icon icon="solar:flag-bold" className="w-5 h-5 mr-2 text-green-600" />
                                        Milestone Timeline
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                <Icon icon="solar:check-circle-bold" className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800">Investasi Jamur Kering</p>
                                                <p className="text-sm text-gray-500">28 Des 2024 - Active</p>
                                            </div>
                                            <span className="text-green-600 text-sm font-medium">Completed</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                <Icon icon="solar:check-circle-bold" className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800">Kumbung Transol 1 - Start Panen</p>
                                                <p className="text-sm text-gray-500">Sep 2025 - Active</p>
                                            </div>
                                            <span className="text-green-600 text-sm font-medium">Completed</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Icon icon="solar:hourglass-bold" className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800">Kumbung Transol 2 - Starting</p>
                                                <p className="text-sm text-gray-500">Nov 2025</p>
                                            </div>
                                            <span className="text-blue-600 text-sm font-medium">In Progress</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                <Icon icon="solar:target-bold" className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800">Target Rp 100 Juta Panen</p>
                                                <p className="text-sm text-gray-500">Est. Q1 2026</p>
                                            </div>
                                            <span className="text-gray-500 text-sm font-medium">{((summary.totalPendapatanPanen / 100000000) * 100).toFixed(0)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab: Simulator */}
                        {activeTab === 'simulator' && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold">Annual Investment Simulator</h2>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Input Panel */}
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <h3 className="font-medium mb-4 flex items-center">
                                            <Icon icon="solar:settings-bold" className="w-5 h-5 mr-2 text-indigo-600" />
                                            Pengaturan Simulasi
                                        </h3>
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Target Tahunan</label>
                                                <input
                                                    type="number"
                                                    value={simTarget}
                                                    onChange={(e) => setSimTarget(parseFloat(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border rounded-lg"
                                                />
                                                <p className="text-sm text-gray-500 mt-1">{formatRupiah(simTarget)}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Investasi: <span className="text-indigo-600">{formatRupiah(simInvestment)}</span>
                                                </label>
                                                <input
                                                    type="range"
                                                    min="100000000"
                                                    max="5000000000"
                                                    step="10000000"
                                                    value={simInvestment}
                                                    onChange={(e) => setSimInvestment(parseFloat(e.target.value))}
                                                    className="w-full"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    ROI: <span className="text-green-600">{simROI.toFixed(2)}%</span>
                                                </label>
                                                <input
                                                    type="range"
                                                    min="5"
                                                    max="15"
                                                    step="0.1"
                                                    value={simROI}
                                                    onChange={(e) => setSimROI(parseFloat(e.target.value))}
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Results Panel */}
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <h3 className="font-medium mb-4 flex items-center">
                                            <Icon icon="solar:chart-bold" className="w-5 h-5 mr-2 text-green-600" />
                                            Hasil Simulasi
                                        </h3>
                                        <div className={`p-4 rounded-lg mb-4 ${simDifference >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                                            <p className="text-sm font-medium mb-1">
                                                {simDifference >= 0 ? 'Target Tercapai!' : 'Target Tidak Tercapai'}
                                            </p>
                                            <p className={`text-2xl font-bold ${simDifference >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                                {formatRupiah(simAnnualReturn)}
                                            </p>
                                            <p className="text-sm">
                                                {simDifference >= 0 ? 'Lebih' : 'Kurang'} {formatRupiah(Math.abs(simDifference))}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white p-4 rounded-lg">
                                                <p className="text-sm text-gray-500">Return Bulanan</p>
                                                <p className="text-xl font-bold text-indigo-600">{formatRupiah(simMonthlyReturn)}</p>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg">
                                                <p className="text-sm text-gray-500">Return Tahunan</p>
                                                <p className="text-xl font-bold text-green-600">{formatRupiah(simAnnualReturn)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Yearly Projection */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="font-medium mb-4">Proyeksi 3 Tahun</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[2025, 2026, 2027].map((year, idx) => {
                                            const growth = 1 + (idx * 0.05);
                                            const yearReturn = simAnnualReturn * growth;
                                            return (
                                                <div key={year} className="bg-white p-6 rounded-lg border-2 border-indigo-100 hover:border-indigo-300 transition">
                                                    <p className="text-lg font-bold text-gray-600 mb-2">{year}</p>
                                                    <p className="text-2xl font-bold text-indigo-600">{formatRupiah(yearReturn)}</p>
                                                    <p className="text-sm text-green-600 mt-1">+{idx * 5}% growth</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
