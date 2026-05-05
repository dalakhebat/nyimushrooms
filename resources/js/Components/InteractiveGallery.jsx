import { useState, useEffect, useCallback } from 'react';
import {
    MushroomIcon, BaglogIcon, VialIcon, GreenhouseIcon,
    BasketIcon, TruckIcon, MixerIcon, SteamIcon,
} from './Icons3D';

const CATEGORIES = [
    { id: 'all', label: 'Semua', icon: null },
    { id: 'lab', label: 'Lab Bibit', icon: VialIcon },
    { id: 'produksi', label: 'Produksi Baglog', icon: BaglogIcon },
    { id: 'kumbung', label: 'Kumbung', icon: GreenhouseIcon },
    { id: 'panen', label: 'Panen', icon: BasketIcon },
    { id: 'distribusi', label: 'Distribusi', icon: TruckIcon },
];

// Gallery dataset. Foto otomatis muncul kalau file ada di public/images/gallery/<kategori>/<filename>.
// Kalau file belum ada → auto-fallback ke 3D icon (lihat onError di <img>).
// Lihat public/images/README.md untuk naming convention.
const DEFAULT_ITEMS = [
    { id: 1, category: 'lab', label: 'Isolasi Bibit F0', desc: 'Pengambilan miselium murni dari jamur indukan di clean room.', tone: 'from-emerald-400 to-teal-600', Icon: VialIcon, src: '/images/gallery/lab/01-isolasi-bibit-f0.jpg' },
    { id: 2, category: 'lab', label: 'Inokulasi PDA', desc: 'Bibit dipindah ke media PDA untuk multiplikasi awal.', tone: 'from-teal-400 to-emerald-700', Icon: VialIcon, src: '/images/gallery/lab/02-inokulasi-pda.jpg' },
    { id: 3, category: 'produksi', label: 'Pencampuran Media', desc: 'Serbuk gergaji + dedak + kapur diaduk merata.', tone: 'from-amber-300 to-emerald-600', Icon: MixerIcon, src: '/images/gallery/produksi/03-pencampuran-media.jpg' },
    { id: 4, category: 'produksi', label: 'Sterilisasi Steam', desc: 'Drum steam 8 jam untuk membunuh kontaminan.', tone: 'from-slate-400 to-emerald-700', Icon: SteamIcon, src: '/images/gallery/produksi/04-sterilisasi-steam.jpg' },
    { id: 5, category: 'produksi', label: 'Inokulasi Baglog', desc: 'Bibit ditanam di baglog yang sudah dingin.', tone: 'from-emerald-300 to-emerald-700', Icon: BaglogIcon, src: '/images/gallery/produksi/05-inokulasi-baglog.jpg' },
    { id: 6, category: 'produksi', label: 'Inkubasi 30 Hari', desc: 'Miselium tumbuh menutupi seluruh media.', tone: 'from-lime-400 to-emerald-600', Icon: BaglogIcon, src: '/images/gallery/produksi/06-inkubasi.jpg' },
    { id: 7, category: 'kumbung', label: 'Kumbung A1', desc: 'Suhu & kelembaban dipantau real-time.', tone: 'from-emerald-500 to-teal-700', Icon: GreenhouseIcon, src: '/images/gallery/kumbung/07-kumbung-a1.jpg' },
    { id: 8, category: 'kumbung', label: 'Monitoring Sensor', desc: 'IoT sensor + dashboard digital tiap kumbung.', tone: 'from-teal-500 to-emerald-800', Icon: GreenhouseIcon, src: '/images/gallery/kumbung/08-monitoring-sensor.jpg' },
    { id: 9, category: 'panen', label: 'Panen Pagi', desc: 'Jamur segar dipetik setiap pagi sebelum kemasan.', tone: 'from-emerald-400 to-emerald-700', Icon: BasketIcon, src: '/images/gallery/panen/09-panen-pagi.jpg' },
    { id: 10, category: 'panen', label: 'Sortir & Grading', desc: 'Klasifikasi jamur berdasarkan ukuran & kualitas.', tone: 'from-lime-300 to-emerald-600', Icon: MushroomIcon, src: '/images/gallery/panen/10-sortir-grading.jpg' },
    { id: 11, category: 'distribusi', label: 'Pengemasan', desc: 'Kemasan plastik food-grade dengan tracking lot.', tone: 'from-emerald-300 to-teal-700', Icon: TruckIcon, src: '/images/gallery/distribusi/11-pengemasan.jpg' },
    { id: 12, category: 'distribusi', label: 'Distribusi Harian', desc: 'Kirim ke pasar, retail, & customer hari yang sama.', tone: 'from-teal-400 to-emerald-700', Icon: TruckIcon, src: '/images/gallery/distribusi/12-distribusi.jpg' },
];

// GalleryImage: render <img> dengan onError fallback ke icon 3D kalau file gak ada.
function GalleryImage({ item, className = '' }) {
    const [errored, setErrored] = useState(false);
    const Icon = item.Icon;

    if (!item.src || errored) {
        return (
            <div className={`absolute inset-0 flex items-center justify-center p-8 ${className}`}>
                <div className="w-3/4 h-3/4">
                    <Icon className="w-full h-full drop-shadow-2xl" />
                </div>
            </div>
        );
    }

    return (
        <img
            src={item.src}
            alt={item.label}
            onError={() => setErrored(true)}
            className={`absolute inset-0 w-full h-full object-cover ${className}`}
        />
    );
}

export default function InteractiveGallery({ items = DEFAULT_ITEMS }) {
    const [activeFilter, setActiveFilter] = useState('all');
    const [lightboxIndex, setLightboxIndex] = useState(null);

    const filteredItems = activeFilter === 'all'
        ? items
        : items.filter(item => item.category === activeFilter);

    const openLightbox = (idx) => setLightboxIndex(idx);
    const closeLightbox = () => setLightboxIndex(null);

    const showPrev = useCallback(() => {
        setLightboxIndex((i) => (i === null ? null : (i - 1 + filteredItems.length) % filteredItems.length));
    }, [filteredItems.length]);

    const showNext = useCallback(() => {
        setLightboxIndex((i) => (i === null ? null : (i + 1) % filteredItems.length));
    }, [filteredItems.length]);

    // Keyboard navigation
    useEffect(() => {
        if (lightboxIndex === null) return;
        const handler = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };
        window.addEventListener('keydown', handler);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handler);
            document.body.style.overflow = '';
        };
    }, [lightboxIndex, showPrev, showNext]);

    const active = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

    return (
        <>
            {/* Filter tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
                {CATEGORIES.map((cat) => {
                    const isActive = activeFilter === cat.id;
                    const Icon = cat.icon;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setActiveFilter(cat.id)}
                            className={`group px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 inline-flex items-center gap-2 ${
                                isActive
                                    ? 'bg-white text-emerald-900 shadow-forest-lg scale-105'
                                    : 'bg-emerald-800/40 text-emerald-100 hover:bg-emerald-800/70 hover:scale-105'
                            }`}
                        >
                            {Icon && (
                                <span className={`w-7 h-7 inline-block ${isActive ? '' : 'opacity-80'}`}>
                                    <Icon className="w-7 h-7" />
                                </span>
                            )}
                            {cat.label}
                        </button>
                    );
                })}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map((item, idx) => {
                    const Icon = item.Icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => openLightbox(idx)}
                            className={`group relative aspect-square rounded-3xl bg-gradient-to-br ${item.tone} overflow-hidden cursor-pointer hover:scale-[1.04] hover:-translate-y-1 transition-all duration-500 shadow-xl text-left`}
                        >
                            {/* Pattern bg */}
                            <div
                                className="absolute inset-0 opacity-25"
                                style={{
                                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 2px)',
                                    backgroundSize: '24px 24px',
                                }}
                            />
                            <GalleryImage item={item} className="group-hover:scale-105 transition-transform duration-500" />
                            {/* Gradient overlay for label */}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                            {/* Label */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                <p className="text-[10px] uppercase tracking-widest opacity-80 mb-0.5">
                                    {CATEGORIES.find(c => c.id === item.category)?.label}
                                </p>
                                <p className="font-headline font-extrabold text-base leading-tight">{item.label}</p>
                            </div>
                            {/* Zoom hint icon */}
                            <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="7" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    <line x1="11" y1="8" x2="11" y2="14" />
                                    <line x1="8" y1="11" x2="14" y2="11" />
                                </svg>
                            </div>
                        </button>
                    );
                })}
            </div>

            {filteredItems.length === 0 && (
                <div className="text-center py-12 text-emerald-200/60 text-sm">
                    Belum ada foto di kategori ini.
                </div>
            )}

            {/* Lightbox */}
            {active && (
                <div
                    className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
                    onClick={closeLightbox}
                >
                    {/* Close button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur text-white flex items-center justify-center transition-all"
                        aria-label="Tutup"
                    >
                        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>

                    {/* Counter */}
                    <div className="absolute top-5 left-5 px-4 py-2 rounded-full bg-white/10 backdrop-blur text-white text-sm font-medium">
                        {lightboxIndex + 1} / {filteredItems.length}
                    </div>

                    {/* Prev/Next */}
                    {filteredItems.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); showPrev(); }}
                                className="absolute left-3 md:left-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur text-white flex items-center justify-center transition-all"
                                aria-label="Sebelumnya"
                            >
                                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); showNext(); }}
                                className="absolute right-3 md:right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur text-white flex items-center justify-center transition-all"
                                aria-label="Selanjutnya"
                            >
                                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </button>
                        </>
                    )}

                    {/* Content */}
                    <div
                        className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={`relative aspect-[16/10] bg-gradient-to-br ${active.tone}`}>
                            <div
                                className="absolute inset-0 opacity-20"
                                style={{
                                    backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 2.5px)',
                                    backgroundSize: '40px 40px',
                                }}
                            />
                            <GalleryImage item={active} />
                        </div>
                        <div className="p-6 md:p-8">
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                                {CATEGORIES.find(c => c.id === active.category)?.label}
                            </p>
                            <h3 className="mt-2 font-headline text-2xl md:text-3xl font-extrabold text-emerald-900">
                                {active.label}
                            </h3>
                            <p className="mt-3 text-slate-600 leading-relaxed">{active.desc}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
