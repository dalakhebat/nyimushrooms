import { useEffect, useState, useMemo } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatRupiah } from '@/Utils/format';
import {
    Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
    Banknote, PieChart as PieIcon, Activity, RefreshCw, Calendar,
    Sparkles, Building2, Wheat, Wrench, Hammer, Truck, MapPin, PiggyBank,
    Landmark, CalendarClock, Receipt, Percent,
} from 'lucide-react';
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, PieChart, Pie, Cell, Legend,
    BarChart, Bar,
} from 'recharts';
import SafeChartContainer from '@/Components/SafeChartContainer';

// Monsy-inspired soft pastel palette
const PALETTE = {
    income: '#86C166',      // sage green
    incomeLight: '#E8F2DD',
    expense: '#E87E6E',     // coral
    expenseLight: '#FCE6E2',
    savings: '#A89AC9',     // lavender
    savingsLight: '#EFEBF5',
    warning: '#E8B86E',     // mustard
    warningLight: '#FBF0DD',
    info: '#7BA8D9',        // soft blue
    infoLight: '#E5EEF7',
    surface: '#FAFAF7',     // off-white
    card: '#FFFFFF',
    text: '#1F1D1B',
    muted: '#8B8680',
    border: '#EDEAE3',
};

const CATEGORY_COLORS = {
    operasional: '#7BA8D9',
    gaji: '#A89AC9',
    pembelian: '#E8B86E',
    penjualan: '#86C166',
    kasbon: '#E87E6E',
    pinjaman: '#6BBFB0',
    lainnya: '#B8B0A4',
};

const CATEGORY_ICONS = {
    operasional: Wrench,
    gaji: Banknote,
    pembelian: Truck,
    penjualan: TrendingUp,
    kasbon: PiggyBank,
    pinjaman: Building2,
    lainnya: Sparkles,
};

const ALOKASI_ICONS = {
    'Pembangunan Kumbung': Building2,
    'Pembangunan Inkubasi': Hammer,
    'Pembelian Bahan Baku': Wheat,
    'Renovasi Kumbung': Wrench,
    'Pembelian Mesin': Truck,
    'Pembelian Lahan': MapPin,
    'Dana Cadangan': PiggyBank,
};

const BULAN_ID = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

function formatRupiahCompact(num) {
    const n = Number(num) || 0;
    const abs = Math.abs(n);
    if (abs >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(2).replace(/\.?0+$/, '')} M`;
    if (abs >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1).replace(/\.?0+$/, '')} jt`;
    if (abs >= 1_000) return `Rp ${(n / 1_000).toFixed(0)} rb`;
    return formatRupiah(n);
}

function DeltaChip({ value }) {
    const v = Number(value) || 0;
    const positive = v >= 0;
    const Icon = positive ? ArrowUpRight : ArrowDownRight;
    return (
        <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                positive ? 'bg-[#E8F2DD] text-[#5C8A3E]' : 'bg-[#FCE6E2] text-[#B85040]'
            }`}
        >
            <Icon className="w-3 h-3" />
            {positive ? '+' : ''}{v}%
        </span>
    );
}

function StatCard({ icon: Icon, label, value, delta, accent, subtitle }) {
    return (
        <div className="bg-white rounded-3xl p-5 border border-[#EDEAE3] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-4">
                <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: accent.bg, color: accent.fg }}
                >
                    <Icon className="w-5 h-5" />
                </div>
                {delta !== undefined && <DeltaChip value={delta} />}
            </div>
            <p className="text-[13px] text-[#8B8680] font-medium">{label}</p>
            <p className="text-2xl font-bold text-[#1F1D1B] mt-1 tracking-tight">
                {value}
            </p>
            {subtitle && <p className="text-[11px] text-[#8B8680] mt-1">{subtitle}</p>}
        </div>
    );
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white rounded-2xl px-3 py-2 shadow-lg border border-[#EDEAE3]">
            <p className="text-[11px] font-semibold text-[#1F1D1B] mb-1">{label}</p>
            {payload.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px]">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-[#8B8680] capitalize">{p.name}:</span>
                    <span className="font-semibold text-[#1F1D1B]">{formatRupiahCompact(p.value)}</span>
                </div>
            ))}
        </div>
    );
}

export default function DashboardEksekutif({
    filters,
    tahunOptions,
    summary,
    pinjaman,
    cashFlowHarian,
    perKategoriKeluar,
    perKategoriMasuk,
    transaksiTerbaru,
    serverTime,
}) {
    const [now, setNow] = useState(new Date());
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const tick = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(tick);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setRefreshing(true);
            router.reload({
                only: [
                    'summary', 'cashFlowHarian', 'perKategoriKeluar',
                    'perKategoriMasuk', 'transaksiTerbaru', 'pinjaman', 'serverTime',
                ],
                onFinish: () => setRefreshing(false),
            });
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleFilterChange = (key, val) => {
        router.get('/dashboard-eksekutif', { ...filters, [key]: val }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleManualRefresh = () => {
        setRefreshing(true);
        router.reload({ onFinish: () => setRefreshing(false) });
    };

    const pieDataKeluar = useMemo(() =>
        perKategoriKeluar.map((item) => ({
            name: item.kategori,
            value: item.total,
            color: CATEGORY_COLORS[item.kategori] || CATEGORY_COLORS.lainnya,
        })), [perKategoriKeluar]);

    const totalKeluarPie = useMemo(
        () => perKategoriKeluar.reduce((s, c) => s + Number(c.total), 0),
        [perKategoriKeluar]
    );

    const pinjamanProgress = pinjaman.limit > 0
        ? Math.min((pinjaman.totalTerpakai / pinjaman.limit) * 100, 100)
        : 0;

    return (
        <AdminLayout title="Dashboard Eksekutif">
            <Head title="Dashboard Eksekutif" />

            <div className="min-h-screen -m-6 lg:-m-8 p-6 lg:p-8" style={{ backgroundColor: PALETTE.surface }}>
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-[#EDEAE3] text-[11px] font-semibold text-[#5C8A3E]">
                                <span className="relative flex w-2 h-2">
                                    <span className="absolute inline-flex w-full h-full rounded-full bg-[#86C166] opacity-75 animate-ping" />
                                    <span className="relative inline-flex w-2 h-2 rounded-full bg-[#86C166]" />
                                </span>
                                LIVE
                            </span>
                            <span className="text-[11px] text-[#8B8680]">
                                {now.toLocaleTimeString('id-ID')}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-[#1F1D1B] tracking-tight">
                            Dashboard Eksekutif
                        </h1>
                        <p className="text-[13px] text-[#8B8680] mt-1">
                            Realtime overview untuk Direksi & Komisaris
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="bg-white rounded-2xl border border-[#EDEAE3] flex items-center gap-1 p-1">
                            <Calendar className="w-4 h-4 text-[#8B8680] ml-2" />
                            <select
                                value={filters.bulan}
                                onChange={(e) => handleFilterChange('bulan', e.target.value)}
                                className="bg-transparent border-0 text-[13px] font-medium text-[#1F1D1B] focus:ring-0 cursor-pointer pr-1"
                            >
                                {BULAN_ID.map((b, i) => (
                                    <option key={i} value={i + 1}>{b}</option>
                                ))}
                            </select>
                            <select
                                value={filters.tahun}
                                onChange={(e) => handleFilterChange('tahun', e.target.value)}
                                className="bg-transparent border-0 text-[13px] font-medium text-[#1F1D1B] focus:ring-0 cursor-pointer pr-2"
                            >
                                {tahunOptions.map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleManualRefresh}
                            className="bg-white p-2.5 rounded-2xl border border-[#EDEAE3] hover:bg-[#FAFAF7] transition-colors"
                            title="Refresh"
                        >
                            <RefreshCw className={`w-4 h-4 text-[#8B8680] ${refreshing ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Hero + KPI Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
                    {/* Hero saldo */}
                    <div className="lg:col-span-5 rounded-3xl p-7 border border-[#EDEAE3] relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #1F1D1B 0%, #2A2825 100%)' }}>
                        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
                            style={{ background: 'radial-gradient(circle, #86C166 0%, transparent 70%)' }} />
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                                    <Wallet className="w-5 h-5 text-[#86C166]" />
                                </div>
                                <span className="text-[12px] text-white/60 font-medium uppercase tracking-wider">
                                    Saldo Kas Total
                                </span>
                            </div>
                            <p className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-2">
                                {formatRupiah(summary.saldoTotal)}
                            </p>
                            <div className="flex items-center gap-3 mt-4">
                                <div className="flex-1 bg-white/5 rounded-2xl p-3">
                                    <p className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Net Bulan Ini</p>
                                    <div className="flex items-center gap-2">
                                        <p className={`text-base font-bold ${summary.netBulanIni >= 0 ? 'text-[#86C166]' : 'text-[#E87E6E]'}`}>
                                            {summary.netBulanIni >= 0 ? '+' : ''}{formatRupiahCompact(summary.netBulanIni)}
                                        </p>
                                        <DeltaChip value={summary.deltaNet} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stat cards */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <StatCard
                            icon={TrendingUp}
                            label="Uang Masuk"
                            value={formatRupiahCompact(summary.masukBulanIni)}
                            delta={summary.deltaMasuk}
                            accent={{ bg: PALETTE.incomeLight, fg: PALETTE.income }}
                            subtitle={`${BULAN_ID[filters.bulan - 1]} ${filters.tahun}`}
                        />
                        <StatCard
                            icon={TrendingDown}
                            label="Uang Keluar"
                            value={formatRupiahCompact(summary.keluarBulanIni)}
                            delta={summary.deltaKeluar}
                            accent={{ bg: PALETTE.expenseLight, fg: PALETTE.expense }}
                            subtitle={`${BULAN_ID[filters.bulan - 1]} ${filters.tahun}`}
                        />
                        <StatCard
                            icon={Activity}
                            label="Net Profit"
                            value={formatRupiahCompact(summary.netBulanIni)}
                            delta={summary.deltaNet}
                            accent={{ bg: PALETTE.savingsLight, fg: PALETTE.savings }}
                            subtitle="Masuk - Keluar"
                        />
                        <div className="sm:col-span-3 bg-white rounded-3xl p-5 border border-[#EDEAE3] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-2xl bg-[#FBF0DD] flex items-center justify-center">
                                        <Landmark className="w-5 h-5 text-[#C8923E]" />
                                    </div>
                                    <div>
                                        <p className="text-[13px] text-[#8B8680] font-medium">
                                            Pinjaman Investasi {pinjaman.bank ? `· ${pinjaman.bank}` : ''}
                                        </p>
                                        <p className="text-xl font-bold text-[#1F1D1B]">{formatRupiah(pinjaman.limit)}</p>
                                    </div>
                                </div>
                                <span className="text-[11px] bg-[#E8F2DD] text-[#5C8A3E] px-2 py-1 rounded-full font-semibold">
                                    Cair {pinjaman.tanggalCair ? new Date(pinjaman.tanggalCair).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                </span>
                            </div>
                            <div className="mt-2">
                                <div className="flex justify-between text-[11px] text-[#8B8680] mb-1.5">
                                    <span>Terpakai: <strong className="text-[#B85040]">{formatRupiahCompact(pinjaman.totalTerpakai)}</strong> ({pinjaman.persentaseTerpakai}%)</span>
                                    <span>Sisa: <strong className="text-[#5C8A3E]">{formatRupiahCompact(pinjaman.sisaPinjaman)}</strong></span>
                                </div>
                                <div className="h-2.5 bg-[#F5F2EB] rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${pinjamanProgress}%`,
                                            background: 'linear-gradient(90deg, #E87E6E 0%, #E8B86E 100%)',
                                        }}
                                    />
                                </div>
                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[#8B8680] mt-1.5">
                                    <span className="flex items-center gap-1"><CalendarClock className="w-3 h-3" /> Tenor {pinjaman.tenor} bulan</span>
                                    <span className="flex items-center gap-1"><Percent className="w-3 h-3" /> {pinjaman.bunga}% / tahun · {pinjaman.tipeBunga}</span>
                                    {pinjaman.mulaiCicilan && (
                                        <span className="flex items-center gap-1">
                                            <CalendarClock className="w-3 h-3" />
                                            Cicilan mulai {new Date(pinjaman.mulaiCicilan).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Schedule Angsuran Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
                    <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-[#EDEAE3] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base font-bold text-[#1F1D1B]">Cicilan Berikutnya</h3>
                            <CalendarClock className="w-4 h-4 text-[#8B8680]" />
                        </div>
                        {pinjaman.cicilanBerikutnya ? (
                            <>
                                <div className="flex items-baseline gap-2 mb-1">
                                    <p className="text-[11px] text-[#8B8680] uppercase tracking-wider">
                                        Periode {pinjaman.cicilanBerikutnya.periode} dari {pinjaman.tenor}
                                    </p>
                                    <span className="text-[11px] font-semibold text-[#5C8A3E] bg-[#E8F2DD] px-2 py-0.5 rounded-full">
                                        {pinjaman.cicilanBerikutnya.label}
                                    </span>
                                </div>
                                <p className="text-3xl font-bold text-[#1F1D1B] tracking-tight">
                                    {formatRupiah(pinjaman.cicilanBerikutnya.total)}
                                </p>
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    <div className="bg-[#FAFAF7] rounded-2xl p-3">
                                        <p className="text-[10px] text-[#8B8680] uppercase tracking-wider">Pokok</p>
                                        <p className="text-sm font-bold text-[#5C8A3E]">{formatRupiahCompact(pinjaman.cicilanBerikutnya.pokok)}</p>
                                    </div>
                                    <div className="bg-[#FAFAF7] rounded-2xl p-3">
                                        <p className="text-[10px] text-[#8B8680] uppercase tracking-wider">Bunga</p>
                                        <p className="text-sm font-bold text-[#B85040]">{formatRupiahCompact(pinjaman.cicilanBerikutnya.bunga)}</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-[13px] text-[#8B8680]">Pinjaman lunas 🎉</p>
                        )}
                        <div className="mt-4 pt-4 border-t border-[#EDEAE3]">
                            <div className="flex justify-between text-[12px] mb-1.5">
                                <span className="text-[#8B8680]">Progress periode</span>
                                <span className="font-semibold text-[#1F1D1B]">
                                    {pinjaman.periodeBerjalan} / {pinjaman.tenor}
                                </span>
                            </div>
                            <div className="h-2 bg-[#F5F2EB] rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full"
                                    style={{
                                        width: `${(pinjaman.periodeBerjalan / pinjaman.tenor) * 100}%`,
                                        background: 'linear-gradient(90deg, #86C166 0%, #6BBFB0 100%)',
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-[#EDEAE3] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base font-bold text-[#1F1D1B]">Sisa Hutang Pokok</h3>
                            <Receipt className="w-4 h-4 text-[#8B8680]" />
                        </div>
                        <p className="text-3xl font-bold text-[#1F1D1B] tracking-tight">
                            {formatRupiah(pinjaman.sisaHutangPokok)}
                        </p>
                        <p className="text-[11px] text-[#8B8680] mt-1">
                            dari {formatRupiahCompact(pinjaman.limit)} pokok awal
                        </p>
                        <div className="mt-4">
                            <div className="h-2 bg-[#F5F2EB] rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${100 - (pinjaman.sisaHutangPokok / pinjaman.limit) * 100}%`,
                                        background: 'linear-gradient(90deg, #6BBFB0 0%, #86C166 100%)',
                                    }}
                                />
                            </div>
                            <p className="text-[10px] text-[#8B8680] mt-1.5">
                                {(((pinjaman.limit - pinjaman.sisaHutangPokok) / pinjaman.limit) * 100).toFixed(1)}% pokok terbayar
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            <div className="bg-[#FAFAF7] rounded-2xl p-3">
                                <p className="text-[10px] text-[#8B8680] uppercase tracking-wider">Total Bunga</p>
                                <p className="text-sm font-bold text-[#1F1D1B]">{formatRupiahCompact(pinjaman.totalBunga)}</p>
                            </div>
                            <div className="bg-[#FAFAF7] rounded-2xl p-3">
                                <p className="text-[10px] text-[#8B8680] uppercase tracking-wider">Total Bayar</p>
                                <p className="text-sm font-bold text-[#1F1D1B]">{formatRupiahCompact(pinjaman.totalAngsuran)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-[#EDEAE3] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base font-bold text-[#1F1D1B]">Komposisi Cicilan</h3>
                            <span className="text-[10px] text-[#8B8680]">5 tahun</span>
                        </div>
                        <div className="h-44">
                            {pinjaman.schedule?.length > 0 && (
                            <SafeChartContainer debounce={50}>
                                <AreaChart data={pinjaman.schedule} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="gradPokok" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#86C166" stopOpacity={0.5} />
                                            <stop offset="100%" stopColor="#86C166" stopOpacity={0.05} />
                                        </linearGradient>
                                        <linearGradient id="gradBunga" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#E87E6E" stopOpacity={0.5} />
                                            <stop offset="100%" stopColor="#E87E6E" stopOpacity={0.05} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE6" vertical={false} />
                                    <XAxis dataKey="periode" tick={{ fontSize: 9, fill: '#8B8680' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 9, fill: '#8B8680' }} axisLine={false} tickLine={false}
                                        tickFormatter={(v) => formatRupiahCompact(v).replace('Rp ', '')} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="pokok" stackId="1" stroke="#86C166" strokeWidth={1.5} fill="url(#gradPokok)" name="Pokok" />
                                    <Area type="monotone" dataKey="bunga" stackId="1" stroke="#E87E6E" strokeWidth={1.5} fill="url(#gradBunga)" name="Bunga" />
                                </AreaChart>
                            </SafeChartContainer>
                            )}
                        </div>
                        <div className="flex items-center justify-between text-[11px] mt-2">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#86C166]" /> Pokok flat
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#E87E6E]" /> Bunga menurun
                            </span>
                        </div>
                    </div>
                </div>

                {/* Cash flow chart + Pie */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
                    <div className="lg:col-span-8 bg-white rounded-3xl p-5 border border-[#EDEAE3] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-bold text-[#1F1D1B]">Cash Flow Harian</h3>
                                <p className="text-[12px] text-[#8B8680]">{BULAN_ID[filters.bulan - 1]} {filters.tahun}</p>
                            </div>
                            <div className="flex items-center gap-3 text-[11px]">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-[#86C166]" /> Masuk
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-[#E87E6E]" /> Keluar
                                </span>
                            </div>
                        </div>
                        <div className="h-72">
                            {cashFlowHarian?.length > 0 && (
                            <SafeChartContainer debounce={50}>
                                <AreaChart data={cashFlowHarian} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#86C166" stopOpacity={0.4} />
                                            <stop offset="100%" stopColor="#86C166" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorKeluar" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#E87E6E" stopOpacity={0.4} />
                                            <stop offset="100%" stopColor="#E87E6E" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE6" vertical={false} />
                                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#8B8680' }} axisLine={false} tickLine={false} />
                                    <YAxis
                                        tick={{ fontSize: 10, fill: '#8B8680' }}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(v) => formatRupiahCompact(v).replace('Rp ', '')}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="masuk" stroke="#86C166" strokeWidth={2} fill="url(#colorMasuk)" name="Masuk" />
                                    <Area type="monotone" dataKey="keluar" stroke="#E87E6E" strokeWidth={2} fill="url(#colorKeluar)" name="Keluar" />
                                </AreaChart>
                            </SafeChartContainer>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-[#EDEAE3] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-bold text-[#1F1D1B]">Pengeluaran</h3>
                                <p className="text-[12px] text-[#8B8680]">per Kategori</p>
                            </div>
                            <PieIcon className="w-4 h-4 text-[#8B8680]" />
                        </div>
                        {pieDataKeluar.length === 0 ? (
                            <div className="h-56 flex items-center justify-center text-[12px] text-[#8B8680]">
                                Belum ada pengeluaran
                            </div>
                        ) : (
                            <>
                                <div className="h-44 relative">
                                    <SafeChartContainer debounce={50}>
                                        <PieChart>
                                            <Pie
                                                data={pieDataKeluar}
                                                cx="50%" cy="50%"
                                                innerRadius={50} outerRadius={75}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {pieDataKeluar.map((e, i) => (
                                                    <Cell key={i} fill={e.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </SafeChartContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <p className="text-[10px] text-[#8B8680] uppercase tracking-wider">Total</p>
                                        <p className="text-base font-bold text-[#1F1D1B]">{formatRupiahCompact(totalKeluarPie)}</p>
                                    </div>
                                </div>
                                <div className="mt-3 space-y-2">
                                    {pieDataKeluar.slice(0, 5).map((e) => {
                                        const pct = totalKeluarPie > 0 ? (e.value / totalKeluarPie) * 100 : 0;
                                        return (
                                            <div key={e.name} className="flex items-center justify-between text-[12px]">
                                                <span className="flex items-center gap-2 capitalize">
                                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: e.color }} />
                                                    <span className="text-[#1F1D1B] font-medium">{e.name}</span>
                                                </span>
                                                <span className="text-[#8B8680]">{pct.toFixed(0)}%</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Alokasi Pinjaman + Recent Transactions */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-[#EDEAE3] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-bold text-[#1F1D1B]">Penggunaan Pinjaman</h3>
                                <p className="text-[12px] text-[#8B8680]">
                                    Tracking aktual sejak {pinjaman.tanggalCair ? new Date(pinjaman.tanggalCair).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                </p>
                            </div>
                            <Link
                                href="/kas/create"
                                className="text-[11px] text-[#7BA8D9] font-semibold hover:underline"
                            >
                                + Catat →
                            </Link>
                        </div>

                        {/* Total bar */}
                        <div className="bg-gradient-to-br from-[#1F1D1B] to-[#2A2825] rounded-2xl p-4 mb-4 text-white">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] uppercase tracking-wider text-white/60">Sudah Terpakai</span>
                                <span className="text-[11px] font-semibold bg-white/10 px-2 py-0.5 rounded-full">
                                    {pinjaman.persentaseTerpakai}%
                                </span>
                            </div>
                            <p className="text-2xl font-bold">{formatRupiah(pinjaman.totalTerpakai)}</p>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mt-3">
                                <div
                                    className="h-full rounded-full"
                                    style={{
                                        width: `${pinjamanProgress}%`,
                                        background: 'linear-gradient(90deg, #E87E6E 0%, #E8B86E 100%)',
                                    }}
                                />
                            </div>
                            <p className="text-[11px] text-white/60 mt-2">
                                Sisa <span className="text-[#86C166] font-semibold">{formatRupiahCompact(pinjaman.sisaPinjaman)}</span> dari {formatRupiahCompact(pinjaman.limit)}
                            </p>
                        </div>

                        {/* Per kategori actual */}
                        <div className="space-y-3">
                            {pinjaman.penggunaanPerKategori.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-[13px] text-[#8B8680]">Belum ada pengeluaran sejak pinjaman cair</p>
                                </div>
                            ) : (
                                pinjaman.penggunaanPerKategori.map((p) => {
                                    const Icon = CATEGORY_ICONS[p.kategori] || Sparkles;
                                    const color = CATEGORY_COLORS[p.kategori] || CATEGORY_COLORS.lainnya;
                                    const pct = pinjaman.limit > 0 ? (p.total / pinjaman.limit) * 100 : 0;
                                    return (
                                        <div key={p.kategori}>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="flex items-center gap-2 text-[12px] text-[#1F1D1B] font-medium capitalize">
                                                    <span
                                                        className="w-5 h-5 rounded-lg flex items-center justify-center"
                                                        style={{ backgroundColor: `${color}20`, color }}
                                                    >
                                                        <Icon className="w-3 h-3" />
                                                    </span>
                                                    {p.kategori}
                                                    <span className="text-[10px] text-[#8B8680] font-normal">
                                                        ({p.jumlah_transaksi}×)
                                                    </span>
                                                </span>
                                                <span className="text-[12px] text-[#8B8680] font-semibold">
                                                    {formatRupiahCompact(p.total)}
                                                </span>
                                            </div>
                                            <div className="h-2 bg-[#F5F2EB] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${pct}%`,
                                                        backgroundColor: color,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-[#EDEAE3] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-bold text-[#1F1D1B]">Transaksi Terbaru</h3>
                                <p className="text-[12px] text-[#8B8680]">10 transaksi terakhir</p>
                            </div>
                            <Link
                                href="/kas"
                                className="text-[11px] text-[#7BA8D9] font-semibold hover:underline"
                            >
                                Lihat semua →
                            </Link>
                        </div>
                        <div className="space-y-2">
                            {transaksiTerbaru.length === 0 ? (
                                <div className="text-center py-8 text-[13px] text-[#8B8680]">
                                    Belum ada transaksi
                                </div>
                            ) : (
                                transaksiTerbaru.map((tx) => {
                                    const Icon = CATEGORY_ICONS[tx.kategori] || Sparkles;
                                    const color = CATEGORY_COLORS[tx.kategori] || CATEGORY_COLORS.lainnya;
                                    const isMasuk = tx.tipe === 'masuk';
                                    return (
                                        <div
                                            key={tx.id}
                                            className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-[#FAFAF7] transition-colors"
                                        >
                                            <div
                                                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                                                style={{ backgroundColor: `${color}20`, color }}
                                            >
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[13px] font-semibold text-[#1F1D1B] truncate">
                                                    {tx.keterangan}
                                                </p>
                                                <p className="text-[11px] text-[#8B8680] capitalize">
                                                    {tx.kategori} · {new Date(tx.tanggal).toLocaleDateString('id-ID', {
                                                        day: 'numeric', month: 'short', year: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                            <p className={`text-[13px] font-bold whitespace-nowrap ${
                                                isMasuk ? 'text-[#5C8A3E]' : 'text-[#B85040]'
                                            }`}>
                                                {isMasuk ? '+' : '-'}{formatRupiahCompact(tx.jumlah)}
                                            </p>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabel Schedule Angsuran Lengkap */}
                <div className="bg-white rounded-3xl p-5 border border-[#EDEAE3] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] mt-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-base font-bold text-[#1F1D1B]">Schedule Angsuran {pinjaman.bank || 'BNI'}</h3>
                            <p className="text-[12px] text-[#8B8680]">
                                {pinjaman.tenor} bulan · {pinjaman.bunga}% / tahun · {pinjaman.tipeBunga}
                            </p>
                        </div>
                    </div>
                    <div className="overflow-x-auto -mx-5 px-5">
                        <table className="w-full text-[12px]">
                            <thead>
                                <tr className="text-left text-[#8B8680] border-b border-[#EDEAE3]">
                                    <th className="pb-2 pr-3 font-medium">#</th>
                                    <th className="pb-2 pr-3 font-medium">Periode</th>
                                    <th className="pb-2 pr-3 font-medium text-right">Pokok</th>
                                    <th className="pb-2 pr-3 font-medium text-right">Bunga</th>
                                    <th className="pb-2 pr-3 font-medium text-right">Total Angsuran</th>
                                    <th className="pb-2 font-medium text-right">Sisa Pokok</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F5F2EB]">
                                {pinjaman.schedule.map((row) => {
                                    const isCurrent = pinjaman.cicilanBerikutnya?.periode === row.periode;
                                    return (
                                        <tr
                                            key={row.periode}
                                            className={`${isCurrent ? 'bg-[#E8F2DD]/40' : 'hover:bg-[#FAFAF7]'} transition-colors`}
                                        >
                                            <td className="py-2.5 pr-3 text-[#8B8680]">{row.periode}</td>
                                            <td className="py-2.5 pr-3 font-medium text-[#1F1D1B]">
                                                {row.label}
                                                {isCurrent && (
                                                    <span className="ml-2 text-[10px] bg-[#86C166] text-white px-1.5 py-0.5 rounded-full font-semibold">
                                                        Berikutnya
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-2.5 pr-3 text-right text-[#5C8A3E] font-medium">
                                                {formatRupiahCompact(row.pokok)}
                                            </td>
                                            <td className="py-2.5 pr-3 text-right text-[#B85040] font-medium">
                                                {formatRupiahCompact(row.bunga)}
                                            </td>
                                            <td className="py-2.5 pr-3 text-right font-bold text-[#1F1D1B]">
                                                {formatRupiahCompact(row.total)}
                                            </td>
                                            <td className="py-2.5 text-right text-[#8B8680]">
                                                {formatRupiahCompact(row.sisa_pokok)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 border-[#1F1D1B]/10 font-bold">
                                    <td colSpan="2" className="pt-3 text-[#1F1D1B]">Total {pinjaman.tenor} bulan</td>
                                    <td className="pt-3 text-right text-[#5C8A3E]">{formatRupiahCompact(pinjaman.totalPokok)}</td>
                                    <td className="pt-3 text-right text-[#B85040]">{formatRupiahCompact(pinjaman.totalBunga)}</td>
                                    <td className="pt-3 text-right text-[#1F1D1B]">{formatRupiahCompact(pinjaman.totalAngsuran)}</td>
                                    <td className="pt-3 text-right text-[#8B8680]">—</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
