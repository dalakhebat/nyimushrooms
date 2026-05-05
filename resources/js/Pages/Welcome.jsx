import { Head, Link } from '@inertiajs/react';
import MIcon from '@/Components/MIcon';

const PRODUCTS = [
    {
        title: 'Jamur Tiram Putih',
        subtitle: 'Fresh Harvest',
        desc: 'Dipanen pagi hari dari kumbung kami, dikemas higienis untuk pasar tradisional, retail, dan kuliner.',
        weight: '200gr / 500gr / 1kg',
        accent: 'from-emerald-400 to-emerald-600',
        icon: 'eco',
    },
    {
        title: 'Baglog Siap Tumbuh',
        subtitle: 'F2 Premium',
        desc: 'Media tanam steril dengan bibit berkualitas, siap inkubasi untuk reseller & petani jamur.',
        weight: '1.2kg / baglog',
        accent: 'from-teal-400 to-emerald-600',
        icon: 'layers',
    },
    {
        title: 'Bibit Jamur F0/F1',
        subtitle: 'Lab Grade',
        desc: 'Bibit murni hasil isolasi laboratorium kami, untuk produsen baglog skala industri.',
        weight: 'PDA / Botol',
        accent: 'from-lime-400 to-emerald-500',
        icon: 'science',
    },
];

const PROCESS = [
    { step: '01', title: 'Pencampuran Media', desc: 'Serbuk gergaji, dedak, kapur, dan gypsum dicampur dengan rasio presisi.', icon: 'inventory_2' },
    { step: '02', title: 'Sterilisasi', desc: 'Media disterilkan via steam selama 8 jam untuk membunuh kontaminan.', icon: 'science' },
    { step: '03', title: 'Inokulasi Bibit', desc: 'Bibit murni di-inokulasi di clean room untuk memastikan zero contamination.', icon: 'biotech' },
    { step: '04', title: 'Inkubasi', desc: '30–40 hari miselium tumbuh sampai baglog ready dipindah ke kumbung.', icon: 'schedule' },
    { step: '05', title: 'Panen Harian', desc: 'Suhu & kelembaban kumbung dijaga ketat — panen dilakukan setiap pagi.', icon: 'eco' },
    { step: '06', title: 'Distribusi Fresh', desc: 'Dikirim hari yang sama ke pasar, retail, dan customer langganan.', icon: 'storefront' },
];

const VALUES = [
    { title: 'Higienis', desc: 'Standar kebersihan tinggi di setiap tahap produksi.', icon: 'verified' },
    { title: 'Konsisten', desc: 'Kapasitas produksi stabil dengan tracking digital.', icon: 'trending_up' },
    { title: 'Lokal', desc: '100% bahan baku & tenaga kerja Indonesia.', icon: 'house' },
    { title: 'Sustainable', desc: 'Limbah baglog diolah jadi pupuk organik.', icon: 'eco' },
];

// Big mushroom 3D-ish illustration
function Mushroom3D({ className = '' }) {
    return (
        <svg viewBox="0 0 200 220" className={className} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="cap" cx="35%" cy="30%" r="80%">
                    <stop offset="0%" stopColor="#86efac" />
                    <stop offset="50%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#15803d" />
                </radialGradient>
                <linearGradient id="stem" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fef3c7" />
                    <stop offset="50%" stopColor="#fefce8" />
                    <stop offset="100%" stopColor="#fde68a" />
                </linearGradient>
                <radialGradient id="capShine" cx="35%" cy="25%" r="40%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                </radialGradient>
                <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
                    <feOffset dx="0" dy="6" result="offsetblur" />
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3" />
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Ground shadow */}
            <ellipse cx="100" cy="205" rx="60" ry="8" fill="rgba(0,0,0,0.18)" />

            {/* Stem */}
            <path
                d="M 78 110 L 122 110 L 118 195 Q 118 205 108 205 L 92 205 Q 82 205 82 195 Z"
                fill="url(#stem)"
                filter="url(#softShadow)"
            />
            {/* Stem highlight */}
            <path d="M 86 115 L 90 115 L 88 200 L 86 200 Z" fill="white" opacity="0.5" />

            {/* Cap */}
            <path
                d="M 22 110 Q 22 30 100 30 Q 178 30 178 110 Q 178 120 165 124 L 35 124 Q 22 120 22 110 Z"
                fill="url(#cap)"
                filter="url(#softShadow)"
            />

            {/* Cap shine */}
            <path
                d="M 22 110 Q 22 30 100 30 Q 178 30 178 110 Q 178 120 165 124 L 35 124 Q 22 120 22 110 Z"
                fill="url(#capShine)"
            />

            {/* Spots */}
            <ellipse cx="55" cy="55" rx="8" ry="5" fill="white" opacity="0.55" />
            <ellipse cx="78" cy="42" rx="6" ry="4" fill="white" opacity="0.55" />
            <ellipse cx="120" cy="48" rx="7" ry="5" fill="white" opacity="0.55" />
            <circle cx="148" cy="65" r="5" fill="white" opacity="0.55" />
            <circle cx="92" cy="80" r="4" fill="white" opacity="0.45" />
            <circle cx="135" cy="95" r="3.5" fill="white" opacity="0.45" />

            {/* Gills hint at bottom of cap */}
            <path d="M 35 124 L 165 124" stroke="#15803d" strokeWidth="1.5" opacity="0.4" />
            {[40, 55, 70, 85, 100, 115, 130, 145, 160].map((x, i) => (
                <line
                    key={i}
                    x1={x}
                    y1="124"
                    x2={x}
                    y2="135"
                    stroke="#166534"
                    strokeWidth="1"
                    opacity="0.35"
                />
            ))}
        </svg>
    );
}

// Small floating spore decoration
function Spore({ className = '', size = 20 }) {
    return (
        <svg viewBox="0 0 40 40" className={className} width={size} height={size}>
            <defs>
                <radialGradient id={`spore-${size}`} cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#bbf7d0" />
                    <stop offset="100%" stopColor="#16a34a" stopOpacity="0.4" />
                </radialGradient>
            </defs>
            <circle cx="20" cy="20" r="14" fill={`url(#spore-${size})`} opacity="0.7" />
        </svg>
    );
}

export default function Welcome() {
    return (
        <>
            <Head title="Defila Solusi Bersama Indonesia — Jamur Segar dari Hati Indonesia" />

            <div className="min-h-screen bg-gradient-to-b from-emerald-50/60 via-white to-emerald-50/40 text-slate-800 overflow-x-hidden">
                {/* === Top nav === */}
                <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-emerald-100/60">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl green-gradient flex items-center justify-center text-white shadow-forest">
                                <MIcon name="eco" className="text-xl" />
                            </div>
                            <div>
                                <p className="font-extrabold text-emerald-800 text-sm font-headline tracking-tight leading-tight">
                                    Defila Solusi
                                </p>
                                <p className="text-[10px] text-emerald-600/70 leading-tight">Bersama Indonesia</p>
                            </div>
                        </div>

                        <nav className="hidden md:flex items-center gap-7 text-sm text-slate-600 font-medium">
                            <a href="#tentang" className="hover:text-emerald-700 transition-colors">Tentang</a>
                            <a href="#produk" className="hover:text-emerald-700 transition-colors">Produk</a>
                            <a href="#proses" className="hover:text-emerald-700 transition-colors">Proses</a>
                            <a href="#kontak" className="hover:text-emerald-700 transition-colors">Kontak</a>
                        </nav>

                        <div className="flex items-center gap-2">
                            <Link
                                href="/ajukan"
                                className="hidden sm:inline-flex px-4 py-2 text-sm text-emerald-700 font-medium hover:text-emerald-900 transition-colors items-center"
                            >
                                <MIcon name="receipt_long" className="text-base mr-1" />
                                Ajukan
                            </Link>
                            <Link
                                href="#kontak"
                                className="px-4 py-2 green-gradient text-white rounded-xl text-sm font-bold shadow-forest hover:shadow-forest-lg hover:-translate-y-0.5 transition-all"
                            >
                                Hubungi Kami
                            </Link>
                        </div>
                    </div>
                </header>

                {/* === HERO === */}
                <section className="relative pt-12 md:pt-20 pb-20 md:pb-32 overflow-hidden">
                    {/* Decorative blobs */}
                    <div aria-hidden className="absolute inset-0 -z-10">
                        <div className="absolute top-10 -left-20 w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl" style={{ animation: 'pulseGlow 8s ease-in-out infinite' }} />
                        <div className="absolute -top-20 right-0 w-[28rem] h-[28rem] bg-lime-200/40 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-1/3 w-[22rem] h-[22rem] bg-teal-200/30 rounded-full blur-3xl" />
                    </div>

                    {/* Perspective grid floor */}
                    <div aria-hidden className="absolute bottom-0 left-0 right-0 h-[60%] grid-floor opacity-40 -z-10" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
                        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                            {/* Left text */}
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 shadow-sm mb-6">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    Mushroom Factory · Indonesia
                                </div>

                                <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
                                    <span className="text-emerald-900">Tumbuh Sehat,</span>
                                    <br />
                                    <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                                        Tumbuh Bersama
                                    </span>
                                    <br />
                                    <span className="text-emerald-900">Defila.</span>
                                </h1>

                                <p className="mt-6 text-lg text-slate-600 max-w-xl leading-relaxed">
                                    Pabrik jamur tiram modern di Indonesia. Kami menghasilkan jamur segar, baglog premium, dan bibit lab grade dengan standar produksi yang terukur dan tercatat tiap hari.
                                </p>

                                <div className="mt-9 flex flex-wrap gap-3">
                                    <a
                                        href="#produk"
                                        className="px-7 py-3.5 green-gradient text-white rounded-2xl font-bold shadow-forest-lg hover:-translate-y-1 hover:shadow-forest-lg transition-all inline-flex items-center text-sm"
                                    >
                                        <MIcon name="storefront" className="text-lg mr-2" />
                                        Lihat Produk Kami
                                    </a>
                                    <a
                                        href="#tentang"
                                        className="px-7 py-3.5 bg-white text-emerald-800 border-2 border-emerald-200 rounded-2xl font-bold hover:border-emerald-400 hover:-translate-y-1 transition-all inline-flex items-center text-sm"
                                    >
                                        Cerita Defila
                                        <MIcon name="arrow_forward" className="text-lg ml-2" />
                                    </a>
                                </div>

                                {/* Trust strip */}
                                <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
                                    {[
                                        { v: '12K+', l: 'Baglog/bulan' },
                                        { v: '7+', l: 'Kumbung aktif' },
                                        { v: '100%', l: 'Tracking digital' },
                                    ].map((s) => (
                                        <div key={s.l}>
                                            <p className="text-2xl md:text-3xl font-extrabold text-emerald-700 font-headline">{s.v}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{s.l}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right 3D hero */}
                            <div className="relative scene-3d">
                                {/* Floating spores */}
                                <Spore className="absolute top-10 left-0 float-slow" size={28} />
                                <Spore className="absolute top-32 right-8 float-slower" size={20} />
                                <Spore className="absolute bottom-20 left-10 float-fast" size={36} />
                                <Spore className="absolute bottom-32 right-0 float-slow" size={24} />

                                {/* Big mushroom card */}
                                <div className="relative layer-3d" style={{ transform: 'perspective(1200px) rotateY(-12deg) rotateX(6deg)' }}>
                                    <div className="absolute inset-0 green-gradient rounded-[2.5rem] blur-2xl opacity-40 translate-y-6 scale-95" />
                                    <div className="relative bg-gradient-to-br from-white via-emerald-50 to-emerald-100 rounded-[2.5rem] p-8 md:p-12 shadow-forest-lg border border-white">
                                        <div className="float-slow">
                                            <Mushroom3D className="w-full max-w-sm mx-auto" />
                                        </div>

                                        {/* Floating mini cards */}
                                        <div
                                            className="absolute -left-6 top-12 bg-white rounded-2xl shadow-forest p-3 px-4 flex items-center gap-2 border border-emerald-100 float-slower"
                                            style={{ transform: 'translateZ(60px)' }}
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                                                <MIcon name="check_circle" className="text-base" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-500">Hari ini</p>
                                                <p className="text-xs font-bold text-emerald-800">142 kg panen</p>
                                            </div>
                                        </div>

                                        <div
                                            className="absolute -right-4 bottom-16 bg-white rounded-2xl shadow-forest p-3 px-4 flex items-center gap-2 border border-emerald-100 float-fast"
                                            style={{ transform: 'translateZ(80px)' }}
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-700">
                                                <MIcon name="thermostat" className="text-base" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-500">Kumbung A1</p>
                                                <p className="text-xs font-bold text-emerald-800">26°C · 85%</p>
                                            </div>
                                        </div>

                                        <div
                                            className="absolute -left-2 bottom-6 bg-white rounded-2xl shadow-forest p-3 px-4 flex items-center gap-2 border border-emerald-100 float-slow"
                                            style={{ transform: 'translateZ(40px)' }}
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-lime-100 flex items-center justify-center text-lime-700">
                                                <MIcon name="science" className="text-base" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-500">Inkubasi</p>
                                                <p className="text-xs font-bold text-emerald-800">2,340 baglog</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* === ABOUT === */}
                <section id="tentang" className="py-20 md:py-28 bg-gradient-to-b from-white to-emerald-50/40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                            {/* 3D illustration card */}
                            <div className="scene-3d">
                                <div
                                    className="relative tilt-card"
                                    style={{ transformOrigin: 'center' }}
                                >
                                    <div className="absolute -inset-4 green-gradient rounded-[3rem] blur-2xl opacity-30" />

                                    <div className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-forest-lg border-4 border-white">
                                        {/* Layered stack effect */}
                                        <div className="absolute inset-0 green-gradient" />

                                        {/* Pattern overlay */}
                                        <div className="absolute inset-0 opacity-20" style={{
                                            backgroundImage: 'radial-gradient(circle at 20% 30%, white 2px, transparent 3px), radial-gradient(circle at 70% 60%, white 1px, transparent 2px), radial-gradient(circle at 40% 80%, white 2px, transparent 3px)',
                                            backgroundSize: '60px 60px, 40px 40px, 80px 80px',
                                        }} />

                                        {/* Center content */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                                            <div className="float-slow">
                                                <Mushroom3D className="w-44 h-44 drop-shadow-2xl" />
                                            </div>
                                            <p className="mt-6 text-3xl font-extrabold font-headline tracking-tight">Defila</p>
                                            <p className="text-sm opacity-90 mt-1">Solusi Bersama Indonesia</p>
                                            <div className="mt-6 px-4 py-2 bg-white/15 backdrop-blur rounded-full text-xs font-medium border border-white/20">
                                                est. 2025 · Mushroom Factory
                                            </div>
                                        </div>

                                        {/* Floating depth circles */}
                                        <div className="absolute top-6 right-6 w-20 h-20 bg-white/10 rounded-full backdrop-blur" />
                                        <div className="absolute bottom-10 left-8 w-12 h-12 bg-white/15 rounded-full backdrop-blur" />
                                    </div>

                                    {/* Floating side card */}
                                    <div className="absolute -right-4 -bottom-4 bg-white rounded-2xl shadow-forest-lg p-5 border border-emerald-100 max-w-[200px]"
                                        style={{ transform: 'translateZ(40px)' }}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <MIcon name="verified" className="text-emerald-600 text-lg" />
                                            <p className="text-xs font-bold text-emerald-800">Halal & Higienis</p>
                                        </div>
                                        <p className="text-[11px] text-slate-500 leading-relaxed">
                                            Setiap baglog tercatat — dari media sampai panen.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Text */}
                            <div>
                                <span className="inline-block text-xs font-bold text-emerald-600 uppercase tracking-[0.2em] bg-emerald-100 px-3 py-1 rounded-full">
                                    Tentang Kami
                                </span>
                                <h2 className="mt-4 font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold text-emerald-900 leading-tight">
                                    Jamur tiram terbaik, lahir dari proses yang konsisten.
                                </h2>
                                <p className="mt-5 text-slate-600 leading-relaxed">
                                    <strong className="text-emerald-800">Defila Solusi Bersama Indonesia</strong> adalah pabrik jamur tiram modern yang berdiri di hati Indonesia. Kami percaya jamur yang sehat datang dari proses yang sehat — dari pemilihan media tanam, sterilisasi, sampai panen harian, semuanya tercatat dan terukur.
                                </p>
                                <p className="mt-3 text-slate-600 leading-relaxed">
                                    Kami melayani pasar tradisional, retail modern, restoran, sampai reseller baglog dan bibit. Visi kami sederhana: jadi mitra terpercaya bagi siapapun yang ingin sukses di dunia jamur — petani pemula, pedagang, atau pelaku F&B.
                                </p>

                                <div className="mt-8 grid grid-cols-2 gap-4">
                                    {VALUES.map((v) => (
                                        <div
                                            key={v.title}
                                            className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm hover:shadow-forest hover:-translate-y-1 transition-all"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-2">
                                                <MIcon name={v.icon} className="text-lg" />
                                            </div>
                                            <p className="font-bold text-sm text-emerald-900">{v.title}</p>
                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{v.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* === PRODUK === */}
                <section id="produk" className="py-20 md:py-28 relative">
                    <div aria-hidden className="absolute inset-0 -z-10">
                        <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl" />
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="text-center max-w-2xl mx-auto mb-14">
                            <span className="inline-block text-xs font-bold text-emerald-600 uppercase tracking-[0.2em] bg-emerald-100 px-3 py-1 rounded-full">
                                Produk
                            </span>
                            <h2 className="mt-4 font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold text-emerald-900 leading-tight">
                                Tiga produk utama, satu standar.
                            </h2>
                            <p className="mt-4 text-slate-600 leading-relaxed">
                                Dari jamur segar siap masak sampai bibit untuk produsen — semuanya keluar dari fasilitas yang sama.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 scene-3d">
                            {PRODUCTS.map((p, i) => (
                                <div
                                    key={p.title}
                                    className={`group relative tilt-card${i % 2 === 1 ? '-r' : ''}`}
                                >
                                    {/* Glow background */}
                                    <div className={`absolute -inset-2 bg-gradient-to-br ${p.accent} rounded-3xl blur-xl opacity-25 group-hover:opacity-50 transition-opacity duration-500`} />

                                    <div className="relative bg-white rounded-3xl overflow-hidden shadow-forest border border-emerald-100/60">
                                        {/* Top accent area with icon */}
                                        <div className={`relative h-44 bg-gradient-to-br ${p.accent} overflow-hidden`}>
                                            <div className="absolute inset-0 opacity-20" style={{
                                                backgroundImage: 'radial-gradient(circle at 30% 20%, white 1.5px, transparent 2.5px)',
                                                backgroundSize: '40px 40px',
                                            }} />
                                            <div className="absolute -bottom-6 -right-4 w-32 h-32 bg-white/15 rounded-full" />
                                            <div className="absolute top-6 right-6 px-2.5 py-1 bg-white/25 backdrop-blur text-white text-[10px] font-bold rounded-full border border-white/30">
                                                {p.subtitle}
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-3xl flex items-center justify-center text-white shadow-lg float-slow">
                                                    <MIcon name={p.icon} className="text-5xl" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <h3 className="font-headline font-extrabold text-xl text-emerald-900">{p.title}</h3>
                                            <p className="text-sm text-slate-600 mt-2 leading-relaxed">{p.desc}</p>

                                            <div className="mt-5 flex items-center justify-between pt-4 border-t border-emerald-50">
                                                <span className="text-xs font-bold text-emerald-700">{p.weight}</span>
                                                <a href="#kontak" className="text-xs font-bold text-emerald-600 hover:text-emerald-800 inline-flex items-center group/link">
                                                    Tanya stok
                                                    <MIcon name="arrow_forward" className="text-sm ml-1 group-hover/link:translate-x-1 transition-transform" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* === PROCESS === */}
                <section id="proses" className="py-20 md:py-28 bg-gradient-to-b from-emerald-50/40 via-white to-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="text-center max-w-2xl mx-auto mb-14">
                            <span className="inline-block text-xs font-bold text-emerald-600 uppercase tracking-[0.2em] bg-emerald-100 px-3 py-1 rounded-full">
                                Proses Budidaya
                            </span>
                            <h2 className="mt-4 font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold text-emerald-900 leading-tight">
                                Dari serbuk gergaji sampai meja makan.
                            </h2>
                            <p className="mt-4 text-slate-600 leading-relaxed">
                                Enam tahap presisi — semuanya dijaga, dicatat, dan diukur tiap hari.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {PROCESS.map((p, i) => (
                                <div
                                    key={p.step}
                                    className="group relative bg-white rounded-3xl p-6 border border-emerald-100/60 hover:border-emerald-300 shadow-sm hover:shadow-forest hover:-translate-y-2 transition-all duration-500"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-14 h-14 rounded-2xl green-gradient flex items-center justify-center text-white shadow-forest group-hover:scale-110 transition-transform">
                                            <MIcon name={p.icon} className="text-2xl" />
                                        </div>
                                        <span className="text-4xl font-extrabold font-headline text-emerald-100 group-hover:text-emerald-200 transition-colors">
                                            {p.step}
                                        </span>
                                    </div>

                                    <h3 className="font-headline font-extrabold text-lg text-emerald-900">{p.title}</h3>
                                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">{p.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* === GALLERY (placeholder cards) === */}
                <section className="py-20 md:py-28 bg-emerald-900 text-white relative overflow-hidden">
                    <div aria-hidden className="absolute inset-0 -z-0">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
                        <div className="text-center max-w-2xl mx-auto mb-12">
                            <span className="inline-block text-xs font-bold text-emerald-300 uppercase tracking-[0.2em] bg-emerald-800 px-3 py-1 rounded-full">
                                Fasilitas
                            </span>
                            <h2 className="mt-4 font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
                                Galeri produksi & kumbung kami.
                            </h2>
                            <p className="mt-4 text-emerald-200/80 leading-relaxed text-sm">
                                Foto fasilitas akan segera kami update. Sementara, ini gambaran modul-modul utama kami.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Lab Bibit', icon: 'biotech', tone: 'from-emerald-400 to-emerald-600' },
                                { label: 'Sterilisasi', icon: 'science', tone: 'from-teal-400 to-emerald-600' },
                                { label: 'Inokulasi', icon: 'inventory_2', tone: 'from-lime-400 to-emerald-500' },
                                { label: 'Inkubasi', icon: 'layers', tone: 'from-emerald-300 to-teal-600' },
                                { label: 'Kumbung', icon: 'house', tone: 'from-emerald-500 to-emerald-700' },
                                { label: 'Panen Pagi', icon: 'eco', tone: 'from-lime-300 to-emerald-500' },
                                { label: 'Pengemasan', icon: 'inventory_2', tone: 'from-teal-300 to-emerald-600' },
                                { label: 'Distribusi', icon: 'storefront', tone: 'from-emerald-400 to-teal-600' },
                            ].map((g) => (
                                <div
                                    key={g.label}
                                    className={`group aspect-square rounded-2xl bg-gradient-to-br ${g.tone} relative overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-500 shadow-xl`}
                                >
                                    <div className="absolute inset-0 opacity-25" style={{
                                        backgroundImage: 'radial-gradient(circle, white 1px, transparent 2px)',
                                        backgroundSize: '20px 20px',
                                    }} />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                        <MIcon name={g.icon} className="text-4xl mb-2 group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-bold">{g.label}</span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-emerald-900/60 to-transparent" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* === CTA / KONTAK === */}
                <section id="kontak" className="py-20 md:py-28 relative overflow-hidden">
                    <div aria-hidden className="absolute inset-0 -z-10">
                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-emerald-200/40 rounded-full blur-3xl" />
                    </div>

                    <div className="max-w-5xl mx-auto px-4 sm:px-6">
                        <div className="relative scene-3d">
                            <div className="absolute -inset-4 green-gradient rounded-[3rem] blur-2xl opacity-30" />

                            <div className="relative bg-white rounded-[2.5rem] p-8 md:p-14 shadow-forest-lg border border-emerald-100 overflow-hidden">
                                <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-100 rounded-full" />
                                <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-lime-100 rounded-full" />

                                <div className="relative grid md:grid-cols-2 gap-10 items-center">
                                    <div>
                                        <span className="inline-block text-xs font-bold text-emerald-600 uppercase tracking-[0.2em] bg-emerald-100 px-3 py-1 rounded-full">
                                            Hubungi Kami
                                        </span>
                                        <h2 className="mt-4 font-headline text-3xl md:text-4xl font-extrabold text-emerald-900 leading-tight">
                                            Mau order, jadi reseller, atau sekedar tanya-tanya?
                                        </h2>
                                        <p className="mt-4 text-slate-600 leading-relaxed">
                                            Tim kami siap bantu — dari konsultasi budidaya, kerjasama supply, sampai kunjungan ke fasilitas.
                                        </p>

                                        <div className="mt-6 space-y-3">
                                            <a href="mailto:admin@defilasolusi.com" className="flex items-center gap-3 text-sm text-slate-700 hover:text-emerald-700 group">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                                    <MIcon name="mail" className="text-base" />
                                                </div>
                                                <div>
                                                    <p className="text-[11px] text-slate-500">Email</p>
                                                    <p className="font-bold">admin@defilasolusi.com</p>
                                                </div>
                                            </a>
                                            <div className="flex items-center gap-3 text-sm text-slate-700">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                                                    <MIcon name="link" className="text-base" />
                                                </div>
                                                <div>
                                                    <p className="text-[11px] text-slate-500">Website</p>
                                                    <p className="font-bold">defilasolusi.com</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div
                                            className="relative bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-8 border-2 border-white shadow-forest"
                                            style={{ transform: 'perspective(1000px) rotateY(-6deg)' }}
                                        >
                                            <div className="float-slow">
                                                <Mushroom3D className="w-full max-w-[200px] mx-auto" />
                                            </div>
                                            <p className="text-center mt-4 font-headline font-extrabold text-emerald-900">Defila</p>
                                            <p className="text-center text-xs text-emerald-700">Tumbuh Bersama Kami</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* === FOOTER === */}
                <footer className="bg-emerald-950 text-emerald-100/80 py-12 relative overflow-hidden">
                    <div aria-hidden className="absolute inset-0">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-700/10 rounded-full blur-3xl" />
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
                        <div className="grid md:grid-cols-4 gap-8">
                            <div className="md:col-span-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl green-gradient flex items-center justify-center text-white shadow-forest">
                                        <MIcon name="eco" className="text-2xl" />
                                    </div>
                                    <div>
                                        <p className="font-extrabold text-white text-base font-headline">Defila Solusi</p>
                                        <p className="text-[11px] text-emerald-300">Bersama Indonesia</p>
                                    </div>
                                </div>
                                <p className="mt-5 text-sm leading-relaxed max-w-md">
                                    Pabrik jamur tiram modern Indonesia. Memproduksi jamur fresh, baglog premium, dan bibit lab grade dengan standar tracking digital harian.
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-white uppercase tracking-widest mb-4">Navigasi</p>
                                <ul className="space-y-2.5 text-sm">
                                    <li><a href="#tentang" className="hover:text-white transition-colors">Tentang Defila</a></li>
                                    <li><a href="#produk" className="hover:text-white transition-colors">Produk</a></li>
                                    <li><a href="#proses" className="hover:text-white transition-colors">Proses Budidaya</a></li>
                                    <li><a href="#kontak" className="hover:text-white transition-colors">Hubungi Kami</a></li>
                                </ul>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-white uppercase tracking-widest mb-4">Layanan Internal</p>
                                <ul className="space-y-2.5 text-sm">
                                    <li><Link href="/ajukan" className="hover:text-white transition-colors">Form Pengajuan</Link></li>
                                    <li><Link href="/absensi-publik" className="hover:text-white transition-colors">Absensi QR</Link></li>
                                    <li><Link href="/management" className="hover:text-white transition-colors">Sistem Management</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-10 pt-6 border-t border-emerald-800/60 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-emerald-300/80">
                            <p>© {new Date().getFullYear()} Defila Solusi Bersama Indonesia. All rights reserved.</p>
                            <p>Tumbuh sehat, tumbuh bersama.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
