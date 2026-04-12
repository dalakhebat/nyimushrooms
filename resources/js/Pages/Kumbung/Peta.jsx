import { useState, useEffect, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const STATUSES = {
    siap_panen: {
        label: 'Siap Panen',
        color: '#22c55e',
        bg: '#052e16',
        icon: '🍄',
        glow: 'rgba(34,197,94,0.5)',
        priority: 1,
    },
    panen_aktif: {
        label: 'Lagi Panen',
        color: '#84cc16',
        bg: '#1a2e05',
        icon: '🌾',
        glow: 'rgba(132,204,22,0.4)',
        priority: 2,
    },
    growing: {
        label: 'Growing',
        color: '#06b6d4',
        bg: '#083344',
        icon: '🌱',
        glow: 'rgba(6,182,212,0.4)',
        priority: 3,
    },
    baru: {
        label: 'Baru Tanam',
        color: '#3b82f6',
        bg: '#172554',
        icon: '📦',
        glow: 'rgba(59,130,246,0.4)',
        priority: 4,
    },
    kosong: {
        label: 'Kosong',
        color: '#94a3b8',
        bg: '#1e293b',
        icon: '💤',
        glow: 'rgba(148,163,184,0.2)',
        priority: 5,
    },
    lewat: {
        label: 'Lewat',
        color: '#f59e0b',
        bg: '#451a03',
        icon: '⚠️',
        glow: 'rgba(245,158,11,0.4)',
        priority: 6,
    },
    nonaktif: {
        label: 'Nonaktif',
        color: '#ef4444',
        bg: '#450a0a',
        icon: '🚫',
        glow: 'rgba(239,68,68,0.3)',
        priority: 7,
    },
};

// Auto-distribute kumbung in organic grid (deterministic jitter from index)
function calcPosition(index, total) {
    const cols = Math.max(2, Math.ceil(Math.sqrt(total * 1.7)));
    const rows = Math.max(1, Math.ceil(total / cols));
    const col = index % cols;
    const row = Math.floor(index / cols);

    const marginX = 8;
    const marginY = 14;
    const usableW = 100 - marginX * 2;
    const usableH = 100 - marginY * 2;

    const baseX = cols > 1 ? marginX + (col / (cols - 1)) * usableW : 50;
    const baseY = rows > 1 ? marginY + (row / (rows - 1)) * usableH : 50;

    const jitterX = Math.sin(index * 7.3) * 2.2;
    const jitterY = Math.cos(index * 5.7) * 2.0;

    return { x: baseX + jitterX, y: baseY + jitterY };
}

const TerrainSVG = () => (
    <svg
        width="100%"
        height="100%"
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, opacity: 0.18 }}
    >
        <defs>
            <pattern id="kgrid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#a3e635" strokeWidth="0.5" opacity="0.3" />
            </pattern>
        </defs>
        <rect width="1000" height="600" fill="url(#kgrid)" />
        {/* Terrain patches */}
        <ellipse cx="150" cy="120" rx="120" ry="80" fill="#3f6212" opacity="0.3" />
        <ellipse cx="800" cy="500" rx="150" ry="90" fill="#3f6212" opacity="0.25" />
        <ellipse cx="500" cy="300" rx="200" ry="100" fill="#365314" opacity="0.2" />
        <ellipse cx="850" cy="180" rx="100" ry="70" fill="#3f6212" opacity="0.2" />
        {/* Paths */}
        <path d="M 180 120 Q 350 200 500 120" stroke="#854d0e" strokeWidth="8" fill="none" opacity="0.3" strokeDasharray="12 6" />
        <path d="M 500 120 Q 650 180 780 150" stroke="#854d0e" strokeWidth="8" fill="none" opacity="0.3" strokeDasharray="12 6" />
        <path d="M 300 350 Q 400 400 620 340" stroke="#854d0e" strokeWidth="8" fill="none" opacity="0.3" strokeDasharray="12 6" />
        <path d="M 150 500 Q 300 480 500 480" stroke="#854d0e" strokeWidth="8" fill="none" opacity="0.3" strokeDasharray="12 6" />
        {/* Trees */}
        {[
            { x: 80, y: 250 },
            { x: 920, y: 100 },
            { x: 900, y: 350 },
            { x: 60, y: 450 },
            { x: 450, y: 550 },
            { x: 700, y: 250 },
            { x: 200, y: 320 },
            { x: 600, y: 80 },
            { x: 380, y: 180 },
        ].map((t, i) => (
            <g key={i} opacity="0.5">
                <circle cx={t.x} cy={t.y} r="15" fill="#166534" />
                <circle cx={t.x - 8} cy={t.y + 5} r="12" fill="#14532d" />
                <circle cx={t.x + 8} cy={t.y + 5} r="12" fill="#14532d" />
                <rect x={t.x - 2} y={t.y + 10} width="4" height="12" fill="#854d0e" />
            </g>
        ))}
    </svg>
);

const KumbungBuilding = ({ kumbung, position, isSelected, onClick }) => {
    const status = STATUSES[kumbung.status] || STATUSES.kosong;
    const [hover, setHover] = useState(false);
    const scale = hover ? 1.12 : 1;
    const isPulse = kumbung.status === 'siap_panen';

    return (
        <div
            onClick={() => onClick(kumbung.id)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                position: 'absolute',
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: `translate(-50%, -50%) scale(${scale})`,
                cursor: 'pointer',
                transition: 'transform 0.2s ease, filter 0.3s ease',
                zIndex: isSelected ? 20 : hover ? 15 : 10,
                filter: isSelected || isPulse ? `drop-shadow(0 0 16px ${status.glow})` : 'none',
            }}
        >
            {/* Status label */}
            <div
                style={{
                    position: 'absolute',
                    top: '-26px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: status.bg,
                    border: `1.5px solid ${status.color}`,
                    borderRadius: '4px',
                    padding: '1px 7px',
                    fontSize: '9px',
                    fontWeight: 700,
                    color: status.color,
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.4px',
                    textTransform: 'uppercase',
                }}
            >
                {status.icon} {status.label}
            </div>

            {/* Building SVG — case-aware, decoration berubah per status */}
            <svg width="76" height="76" viewBox="0 0 80 80">
                {/* Shadow */}
                <ellipse cx="40" cy="73" rx="32" ry="5" fill="rgba(0,0,0,0.45)" />

                {/* === Decoration di luar building (background layer) === */}

                {/* Lewat: warning triangle di atas */}
                {kumbung.status === 'lewat' && (
                    <g>
                        <polygon
                            points="40,2 48,15 32,15"
                            fill="#f59e0b"
                            stroke="#0c0a09"
                            strokeWidth="0.6"
                        />
                        <text
                            x="40"
                            y="14"
                            fontSize="10"
                            fill="#0c0a09"
                            textAnchor="middle"
                            fontWeight="900"
                            fontFamily="sans-serif"
                        >
                            !
                        </text>
                    </g>
                )}

                {/* Kosong: huruf "z" sleep di atas */}
                {kumbung.status === 'kosong' && (
                    <text
                        x="40"
                        y="14"
                        fontSize="11"
                        fill="#94a3b8"
                        textAnchor="middle"
                        fontWeight="900"
                        opacity="0.65"
                        fontFamily="monospace"
                    >
                        z
                    </text>
                )}

                {/* Baru: stack baglog boxes biru di luar */}
                {kumbung.status === 'baru' && (
                    <g>
                        <rect x="2" y="56" width="8" height="8" fill="#3b82f6" stroke="#172554" strokeWidth="0.7" rx="1" />
                        <rect x="2" y="48" width="8" height="8" fill="#3b82f6" stroke="#172554" strokeWidth="0.7" rx="1" />
                        <rect x="70" y="56" width="8" height="8" fill="#3b82f6" stroke="#172554" strokeWidth="0.7" rx="1" />
                        <line x1="6" y1="48" x2="6" y2="64" stroke="#fbbf24" strokeWidth="0.4" />
                    </g>
                )}

                {/* Lagi Panen: keranjang penuh jamur + figure pekerja */}
                {kumbung.status === 'panen_aktif' && (
                    <g>
                        <path
                            d="M 2 60 L 12 60 L 11 70 L 3 70 Z"
                            fill="#854d0e"
                            stroke="#0c0a09"
                            strokeWidth="0.6"
                        />
                        <line x1="3" y1="63" x2="11" y2="63" stroke="#451a03" strokeWidth="0.4" />
                        <line x1="3" y1="66" x2="11" y2="66" stroke="#451a03" strokeWidth="0.4" />
                        <ellipse cx="5" cy="58" rx="2" ry="1.5" fill="#84cc16" />
                        <ellipse cx="9" cy="58" rx="2" ry="1.5" fill="#a3e635" />
                        <ellipse cx="7" cy="56" rx="2" ry="1.5" fill="#84cc16" />
                        {/* Worker silhouette */}
                        <circle cx="72" cy="58" r="2" fill="#fafaf9" />
                        <rect x="70" y="60" width="4" height="8" rx="1" fill="#fafaf9" />
                    </g>
                )}

                {/* === BUILDING === */}

                <rect
                    x="12"
                    y="28"
                    width="56"
                    height="42"
                    rx="3"
                    fill={kumbung.status === 'nonaktif' ? '#1c1917' : '#292524'}
                    stroke={status.color}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    strokeDasharray={kumbung.status === 'nonaktif' ? '3 2' : '0'}
                    opacity={kumbung.status === 'nonaktif' ? 0.6 : 1}
                />

                {/* Roof — jagged kalau nonaktif (kayak rusak) */}
                <polygon
                    points={
                        kumbung.status === 'nonaktif'
                            ? '8,30 22,18 26,22 32,16 40,12 50,22 56,18 72,30'
                            : '8,30 40,10 72,30'
                    }
                    fill={kumbung.status === 'nonaktif' ? '#1c1917' : '#44403c'}
                    stroke={status.color}
                    strokeWidth={isSelected ? 2 : 1.2}
                    opacity={kumbung.status === 'nonaktif' ? 0.55 : 1}
                />

                {/* Door — varies per status */}
                {kumbung.status === 'nonaktif' ? (
                    <g>
                        <rect x="32" y="44" width="16" height="26" rx="2" fill="#0c0a09" stroke={status.color} strokeWidth="1" opacity="0.7" />
                        {/* X mark over door */}
                        <line x1="32" y1="44" x2="48" y2="70" stroke={status.color} strokeWidth="2" opacity="0.85" strokeLinecap="round" />
                        <line x1="48" y1="44" x2="32" y2="70" stroke={status.color} strokeWidth="2" opacity="0.85" strokeLinecap="round" />
                    </g>
                ) : kumbung.status === 'kosong' ? (
                    <rect x="32" y="44" width="16" height="26" rx="2" fill="#0c0a09" stroke={status.color} strokeWidth="1" opacity="0.5" />
                ) : (
                    <rect x="32" y="44" width="16" height="26" rx="2" fill={status.bg} stroke={status.color} strokeWidth="1" />
                )}

                {/* Windows — opacity tergantung "ada cahaya" atau gak */}
                {(() => {
                    const winOp =
                        kumbung.status === 'nonaktif'
                            ? 0
                            : kumbung.status === 'kosong'
                            ? 0.08
                            : kumbung.status === 'siap_panen'
                            ? 0.55
                            : 0.4;
                    return (
                        <>
                            <rect x="18" y="36" width="10" height="9" rx="1" fill={status.color} opacity={winOp} />
                            <rect x="52" y="36" width="10" height="9" rx="1" fill={status.color} opacity={winOp} />
                        </>
                    );
                })()}

                {/* Boarded windows kalau nonaktif */}
                {kumbung.status === 'nonaktif' && (
                    <g opacity="0.7">
                        <line x1="17" y1="40" x2="29" y2="40" stroke="#854d0e" strokeWidth="1.5" />
                        <line x1="51" y1="40" x2="63" y2="40" stroke="#854d0e" strokeWidth="1.5" />
                    </g>
                )}

                {/* === Decoration di building (foreground layer) === */}

                {/* Growing: 3 sprout hijau di base */}
                {kumbung.status === 'growing' && (
                    <g>
                        <line x1="22" y1="68" x2="22" y2="63" stroke="#22c55e" strokeWidth="0.9" strokeLinecap="round" />
                        <circle cx="22" cy="62" r="1.5" fill="#22c55e" />
                        <line x1="40" y1="68" x2="40" y2="62" stroke="#22c55e" strokeWidth="0.9" strokeLinecap="round" />
                        <circle cx="40" cy="61" r="1.7" fill="#22c55e" />
                        <line x1="58" y1="68" x2="58" y2="63" stroke="#22c55e" strokeWidth="0.9" strokeLinecap="round" />
                        <circle cx="58" cy="62" r="1.5" fill="#22c55e" />
                    </g>
                )}

                {/* Siap Panen: 3 jamur di atas atap */}
                {kumbung.status === 'siap_panen' && (
                    <g>
                        <ellipse cx="25" cy="22" rx="3.5" ry="2" fill="#22c55e" />
                        <rect x="24" y="22" width="2" height="3" fill="#fafaf9" />
                        <ellipse cx="55" cy="22" rx="3.5" ry="2" fill="#22c55e" />
                        <rect x="54" y="22" width="2" height="3" fill="#fafaf9" />
                        <ellipse cx="40" cy="19" rx="4" ry="2.5" fill="#16a34a" />
                        <rect x="39" y="19" width="2" height="4" fill="#fafaf9" />
                    </g>
                )}

                {/* Status light di puncak atap */}
                {kumbung.status !== 'nonaktif' && (
                    <circle cx="40" cy="18" r="3" fill={status.color}>
                        <animate
                            attributeName="opacity"
                            values="1;0.3;1"
                            dur={isPulse ? '0.8s' : kumbung.status === 'kosong' ? '4s' : '2s'}
                            repeatCount="indefinite"
                        />
                    </circle>
                )}

                {/* Nonaktif: red X mark di atas building */}
                {kumbung.status === 'nonaktif' && (
                    <g>
                        <line x1="34" y1="6" x2="46" y2="18" stroke="#ef4444" strokeWidth="2.8" strokeLinecap="round" />
                        <line x1="46" y1="6" x2="34" y2="18" stroke="#ef4444" strokeWidth="2.8" strokeLinecap="round" />
                    </g>
                )}
            </svg>

            {/* Nomor */}
            <div
                style={{
                    textAlign: 'center',
                    fontSize: '10px',
                    fontWeight: 800,
                    color: '#e7e5e4',
                    marginTop: '2px',
                    textShadow: '0 2px 4px rgba(0,0,0,0.85)',
                    letterSpacing: '0.3px',
                }}
            >
                {kumbung.nomor}
            </div>
        </div>
    );
};

const DetailPanel = ({ kumbung, onClose }) => {
    if (!kumbung) return null;
    const status = STATUSES[kumbung.status] || STATUSES.kosong;

    const stats = [
        {
            label: 'Baglog Aktif',
            value: (kumbung.baglog_aktif ?? 0).toLocaleString('id-ID'),
            suffix: 'pcs',
        },
        {
            label: 'Kapasitas',
            value: (kumbung.kapasitas_baglog ?? 0).toLocaleString('id-ID'),
            suffix: 'pcs',
        },
        {
            label: 'Terisi',
            value: `${kumbung.usage_percent ?? 0}`,
            suffix: '%',
        },
        kumbung.umur_baglog !== null && kumbung.umur_baglog !== undefined
            ? { label: 'Umur Baglog', value: `${kumbung.umur_baglog}`, suffix: 'hari' }
            : null,
        kumbung.days_until_harvest !== null && kumbung.days_until_harvest !== undefined
            ? {
                  label: 'Estimasi Panen',
                  value:
                      kumbung.days_until_harvest >= 0
                          ? `${kumbung.days_until_harvest}`
                          : `${Math.abs(kumbung.days_until_harvest)}`,
                  suffix: kumbung.days_until_harvest >= 0 ? 'h lagi' : 'h lewat',
              }
            : null,
        kumbung.last_panen_kg
            ? {
                  label: 'Panen Terakhir',
                  value: Number(kumbung.last_panen_kg).toLocaleString('id-ID'),
                  suffix: 'kg',
              }
            : null,
    ].filter(Boolean);

    return (
        <div
            style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '280px',
                background: 'linear-gradient(135deg, #1c1917 0%, #0c0a09 100%)',
                border: `2px solid ${status.color}`,
                borderRadius: '12px',
                padding: '20px',
                zIndex: 30,
                boxShadow: `0 0 40px ${status.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
                animation: 'slideInPanel 0.3s ease',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '14px',
                }}
            >
                <div>
                    <div
                        style={{
                            fontSize: '10px',
                            color: '#78716c',
                            textTransform: 'uppercase',
                            letterSpacing: '1.5px',
                        }}
                    >
                        {kumbung.nomor}
                    </div>
                    <div
                        style={{
                            fontSize: '15px',
                            fontWeight: 900,
                            color: '#fafaf9',
                            letterSpacing: '-0.3px',
                            marginTop: '2px',
                        }}
                    >
                        {kumbung.nama}
                    </div>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#78716c',
                        cursor: 'pointer',
                        fontSize: '22px',
                        padding: '0 4px',
                        marginTop: '-4px',
                        lineHeight: 1,
                    }}
                >
                    ×
                </button>
            </div>

            <div
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: status.bg,
                    border: `1px solid ${status.color}`,
                    borderRadius: '6px',
                    padding: '4px 12px',
                    marginBottom: '14px',
                }}
            >
                <span>{status.icon}</span>
                <span style={{ color: status.color, fontWeight: 700, fontSize: '12px' }}>{status.label}</span>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    marginBottom: '16px',
                }}
            >
                {stats.map((item, i) => (
                    <div
                        key={i}
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '8px',
                            padding: '10px',
                            border: '1px solid rgba(255,255,255,0.06)',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '9px',
                                color: '#78716c',
                                textTransform: 'uppercase',
                                letterSpacing: '0.8px',
                                marginBottom: '4px',
                            }}
                        >
                            {item.label}
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#fafaf9' }}>
                            {item.value}
                            <span style={{ fontSize: '10px', color: '#a8a29e', marginLeft: '3px' }}>{item.suffix}</span>
                        </div>
                    </div>
                ))}
            </div>

            {(() => {
                const isNonaktif = kumbung.status_kumbung === 'nonaktif';
                const isEmpty = (kumbung.baglog_aktif ?? 0) <= 0;
                const canPanen = !isNonaktif && !isEmpty;
                const blockReason = isNonaktif
                    ? 'Kumbung nonaktif — gak bisa input panen'
                    : isEmpty
                    ? 'Belum ada baglog aktif di kumbung ini'
                    : '';

                return (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                            <Link
                                href={`/kumbung/${kumbung.id}`}
                                style={{
                                    textDecoration: 'none',
                                    background: status.bg,
                                    border: `1.5px solid ${status.color}`,
                                    borderRadius: '6px',
                                    padding: '8px 10px',
                                    color: status.color,
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    textAlign: 'center',
                                    letterSpacing: '0.5px',
                                }}
                            >
                                DETAIL
                            </Link>
                            {canPanen ? (
                                <Link
                                    href={`/panen/create?kumbung_id=${kumbung.id}`}
                                    style={{
                                        textDecoration: 'none',
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1.5px solid rgba(255,255,255,0.08)',
                                        borderRadius: '6px',
                                        padding: '8px 10px',
                                        color: '#a8a29e',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        textAlign: 'center',
                                        letterSpacing: '0.5px',
                                    }}
                                >
                                    + PANEN
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    disabled
                                    title={blockReason}
                                    style={{
                                        background: 'rgba(255,255,255,0.02)',
                                        border: '1.5px dashed rgba(255,255,255,0.08)',
                                        borderRadius: '6px',
                                        padding: '8px 10px',
                                        color: '#52525b',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        textAlign: 'center',
                                        letterSpacing: '0.5px',
                                        cursor: 'not-allowed',
                                        fontFamily: 'inherit',
                                    }}
                                >
                                    + PANEN
                                </button>
                            )}
                        </div>
                        {!canPanen && (
                            <div
                                style={{
                                    marginTop: '8px',
                                    fontSize: '10px',
                                    color: '#a8a29e',
                                    textAlign: 'center',
                                    fontStyle: 'italic',
                                }}
                            >
                                {blockReason}
                            </div>
                        )}
                    </>
                );
            })()}
        </div>
    );
};

export default function PetaKumbung({ kumbungs, stats }) {
    const [selectedId, setSelectedId] = useState(null);
    const [time, setTime] = useState(new Date());
    const [filter, setFilter] = useState(null);

    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const filtered = useMemo(() => {
        if (!filter) return kumbungs;
        return kumbungs.filter((k) => k.status === filter);
    }, [kumbungs, filter]);

    const positionedKumbungs = useMemo(() => {
        return filtered.map((k, i) => ({
            ...k,
            position: calcPosition(i, filtered.length),
        }));
    }, [filtered]);

    const selected = kumbungs.find((k) => k.id === selectedId) || null;

    const summary = Object.entries(STATUSES).map(([key, s]) => ({
        ...s,
        key,
        count: stats[key] ?? 0,
    }));

    const totalBaglog = stats.total_baglog_aktif ?? 0;

    return (
        <AdminLayout title="Peta Kumbung">
            <Head title="Peta Kumbung — Command Center" />

            {/* Escape AdminLayout padding for full-bleed dark canvas */}
            <div className="-m-6 lg:-m-8">
                <style>{`
                    @keyframes slideInPanel {
                        from { opacity: 0; transform: translateY(-50%) translateX(20px); }
                        to { opacity: 1; transform: translateY(-50%) translateX(0); }
                    }
                `}</style>

                <div
                    style={{
                        width: '100%',
                        minHeight: 'calc(100vh - 4rem)',
                        background: '#0c0a09',
                        fontFamily: "'Courier New', 'JetBrains Mono', monospace",
                        color: '#fafaf9',
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    {/* HEADER — brand + stats chips + clock */}
                    <div
                        style={{
                            background: 'linear-gradient(180deg, #1c1917 0%, #0c0a09 100%)',
                            borderBottom: '1px solid rgba(163,230,53,0.15)',
                            padding: '12px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '12px',
                            position: 'relative',
                            zIndex: 25,
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ fontSize: '28px', lineHeight: 1 }}>🍄</div>
                            <div>
                                <div
                                    style={{
                                        fontSize: '16px',
                                        fontWeight: 900,
                                        letterSpacing: '-0.5px',
                                        color: '#a3e635',
                                    }}
                                >
                                    NYIMUSHROOM
                                </div>
                                <div
                                    style={{
                                        fontSize: '9px',
                                        color: '#78716c',
                                        letterSpacing: '2px',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    Kumbung Command Center
                                </div>
                            </div>
                        </div>

                        {/* Stats chips — clickable filter */}
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                            {summary.map((s) => (
                                <button
                                    key={s.key}
                                    onClick={() => setFilter(filter === s.key ? null : s.key)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        background: s.count > 0 ? s.bg : 'transparent',
                                        border: `1px solid ${
                                            filter === s.key
                                                ? '#fafaf9'
                                                : s.count > 0
                                                ? s.color
                                                : 'rgba(255,255,255,0.08)'
                                        }`,
                                        borderRadius: '6px',
                                        padding: '4px 9px',
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                    }}
                                >
                                    <span style={{ fontSize: '12px' }}>{s.icon}</span>
                                    <span style={{ fontSize: '15px', fontWeight: 900, color: s.color }}>
                                        {s.count}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: '9px',
                                            color: '#78716c',
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        {s.label}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Clock */}
                        <div style={{ textAlign: 'right', minWidth: '130px' }}>
                            <div
                                style={{
                                    fontSize: '14px',
                                    fontWeight: 700,
                                    color: '#a3e635',
                                    fontVariantNumeric: 'tabular-nums',
                                }}
                            >
                                {time.toLocaleTimeString('id-ID')}
                            </div>
                            <div style={{ fontSize: '9px', color: '#78716c' }}>
                                {time.toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </div>
                        </div>
                    </div>

                    {/* MAP AREA */}
                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: 'calc(100vh - 4rem - 70px)',
                            minHeight: '520px',
                            background: 'radial-gradient(ellipse at center, #1a1712 0%, #0c0a09 70%)',
                            overflow: 'hidden',
                        }}
                    >
                        <TerrainSVG />

                        {/* Fog of war vignette */}
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background:
                                    'radial-gradient(ellipse at center, transparent 40%, rgba(12,10,9,0.85) 100%)',
                                pointerEvents: 'none',
                                zIndex: 5,
                            }}
                        />

                        {/* Grid overlay */}
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundImage:
                                    'linear-gradient(rgba(163,230,53,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(163,230,53,0.04) 1px, transparent 1px)',
                                backgroundSize: '60px 60px',
                                pointerEvents: 'none',
                            }}
                        />

                        {/* Buildings or empty state */}
                        {positionedKumbungs.length === 0 ? (
                            <div
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#78716c',
                                    fontSize: '14px',
                                    zIndex: 10,
                                    letterSpacing: '1px',
                                    textTransform: 'uppercase',
                                }}
                            >
                                {kumbungs.length === 0
                                    ? 'Belum ada kumbung — tambahkan dulu di menu Kumbung'
                                    : 'Tidak ada kumbung dengan status ini'}
                            </div>
                        ) : (
                            positionedKumbungs.map((k) => (
                                <KumbungBuilding
                                    key={k.id}
                                    kumbung={k}
                                    position={k.position}
                                    isSelected={selectedId === k.id}
                                    onClick={setSelectedId}
                                />
                            ))
                        )}

                        {/* Detail panel slide-in */}
                        <DetailPanel kumbung={selected} onClose={() => setSelectedId(null)} />

                        {/* Legend bottom-left */}
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '16px',
                                left: '16px',
                                background: 'rgba(28,25,23,0.9)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '10px',
                                padding: '12px 16px',
                                zIndex: 25,
                                backdropFilter: 'blur(8px)',
                                maxWidth: 'calc(100vw - 320px)',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '9px',
                                    color: '#78716c',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1.5px',
                                    marginBottom: '8px',
                                }}
                            >
                                Status Legend
                            </div>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                {Object.entries(STATUSES).map(([key, s]) => (
                                    <div
                                        key={key}
                                        style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                                    >
                                        <div
                                            style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                background: s.color,
                                                boxShadow: `0 0 6px ${s.glow}`,
                                            }}
                                        />
                                        <span style={{ fontSize: '10px', color: '#a8a29e' }}>{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Total baglog counter bottom-right */}
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '16px',
                                right: '16px',
                                background: 'rgba(28,25,23,0.9)',
                                border: '1px solid rgba(163,230,53,0.15)',
                                borderRadius: '10px',
                                padding: '12px 20px',
                                zIndex: 25,
                                textAlign: 'right',
                                backdropFilter: 'blur(8px)',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '9px',
                                    color: '#78716c',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1.5px',
                                }}
                            >
                                Total Baglog Aktif
                            </div>
                            <div
                                style={{
                                    fontSize: '24px',
                                    fontWeight: 900,
                                    color: '#a3e635',
                                    fontVariantNumeric: 'tabular-nums',
                                }}
                            >
                                {totalBaglog.toLocaleString('id-ID')}
                                <span style={{ fontSize: '11px', color: '#78716c', marginLeft: '4px' }}>
                                    pcs
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
