// Custom 3D-illustrated SVG icons untuk Defila landing.
// Vibe: layered, gradient, shadow — bukan flat material icon.

const baseDefs = (id) => (
    <defs>
        <radialGradient id={`${id}-shine`} cx="30%" cy="25%" r="60%">
            <stop offset="0%" stopColor="white" stopOpacity="0.55" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="4" result="b" />
            <feComponentTransfer><feFuncA type="linear" slope="0.32" /></feComponentTransfer>
            <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
    </defs>
);

export function MushroomIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 200 200" className={className}>
            <defs>
                <radialGradient id="mush-cap" cx="35%" cy="28%" r="80%">
                    <stop offset="0%" stopColor="#86efac" />
                    <stop offset="55%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#15803d" />
                </radialGradient>
                <linearGradient id="mush-stem" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fef3c7" />
                    <stop offset="50%" stopColor="#fefce8" />
                    <stop offset="100%" stopColor="#fcd34d" />
                </linearGradient>
                {baseDefs('mush')}
            </defs>
            <ellipse cx="100" cy="185" rx="55" ry="6" fill="rgba(0,0,0,0.18)" />
            <path d="M 78 105 L 122 105 L 118 175 Q 118 184 108 184 L 92 184 Q 82 184 82 175 Z" fill="url(#mush-stem)" filter="url(#mush-shadow)" />
            <path d="M 86 110 L 90 110 L 88 178 L 86 178 Z" fill="white" opacity="0.5" />
            <path d="M 22 105 Q 22 28 100 28 Q 178 28 178 105 Q 178 116 165 120 L 35 120 Q 22 116 22 105 Z" fill="url(#mush-cap)" filter="url(#mush-shadow)" />
            <path d="M 22 105 Q 22 28 100 28 Q 178 28 178 105 Q 178 116 165 120 L 35 120 Q 22 116 22 105 Z" fill="url(#mush-shine)" />
            <ellipse cx="55" cy="52" rx="9" ry="5" fill="white" opacity="0.55" />
            <ellipse cx="80" cy="40" rx="6" ry="4" fill="white" opacity="0.55" />
            <circle cx="125" cy="48" r="6" fill="white" opacity="0.55" />
            <circle cx="148" cy="62" r="5" fill="white" opacity="0.55" />
            <circle cx="92" cy="78" r="4" fill="white" opacity="0.45" />
            <path d="M 35 120 L 165 120" stroke="#15803d" strokeWidth="1.5" opacity="0.4" />
        </svg>
    );
}

export function BaglogIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 200 200" className={className}>
            <defs>
                <linearGradient id="bag-body" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fef3c7" />
                    <stop offset="50%" stopColor="#fde68a" />
                    <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <radialGradient id="bag-mycelium" cx="50%" cy="50%" r="60%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="white" stopOpacity="0.3" />
                </radialGradient>
                {baseDefs('bag')}
            </defs>
            <ellipse cx="100" cy="188" rx="48" ry="5" fill="rgba(0,0,0,0.18)" />
            {/* Bag body */}
            <path d="M 55 60 L 145 60 L 152 175 Q 152 185 142 185 L 58 185 Q 48 185 48 175 Z"
                fill="url(#bag-body)" filter="url(#bag-shadow)" />
            {/* Tied top */}
            <ellipse cx="100" cy="60" rx="48" ry="6" fill="#a16207" />
            <path d="M 70 30 Q 100 18 130 30 L 145 60 L 55 60 Z" fill="#fde68a" />
            <ellipse cx="100" cy="32" rx="32" ry="6" fill="#92400e" />
            {/* Rope */}
            <path d="M 75 32 Q 100 20 125 32" stroke="#78350f" strokeWidth="3" fill="none" />
            {/* Mycelium pattern */}
            <circle cx="80" cy="100" r="14" fill="url(#bag-mycelium)" opacity="0.85" />
            <circle cx="125" cy="120" r="12" fill="url(#bag-mycelium)" opacity="0.8" />
            <circle cx="95" cy="140" r="11" fill="url(#bag-mycelium)" opacity="0.85" />
            <circle cx="115" cy="160" r="9" fill="url(#bag-mycelium)" opacity="0.75" />
            <circle cx="70" cy="155" r="7" fill="url(#bag-mycelium)" opacity="0.7" />
            {/* Highlight */}
            <path d="M 60 70 L 65 175 L 70 175 L 65 70 Z" fill="white" opacity="0.45" />
        </svg>
    );
}

export function VialIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 200 200" className={className}>
            <defs>
                <linearGradient id="vial-glass" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.7" />
                    <stop offset="50%" stopColor="#d1fae5" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="vial-liquid" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#047857" />
                </linearGradient>
                <linearGradient id="vial-cap" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0f766e" />
                    <stop offset="50%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#0f766e" />
                </linearGradient>
                {baseDefs('vial')}
            </defs>
            <ellipse cx="100" cy="186" rx="36" ry="5" fill="rgba(0,0,0,0.18)" />
            {/* Cap */}
            <rect x="76" y="22" width="48" height="22" rx="4" fill="url(#vial-cap)" filter="url(#vial-shadow)" />
            <rect x="76" y="22" width="48" height="6" rx="3" fill="#0d9488" />
            {/* Glass body */}
            <path d="M 72 44 L 72 170 Q 72 184 100 184 Q 128 184 128 170 L 128 44 Z"
                fill="url(#vial-glass)" stroke="#10b981" strokeWidth="2" filter="url(#vial-shadow)" />
            {/* Liquid */}
            <path d="M 76 110 L 76 168 Q 76 180 100 180 Q 124 180 124 168 L 124 110 Q 100 100 76 110 Z"
                fill="url(#vial-liquid)" />
            <ellipse cx="100" cy="110" rx="24" ry="4" fill="#34d399" opacity="0.7" />
            {/* Bubbles */}
            <circle cx="92" cy="140" r="3" fill="white" opacity="0.7" />
            <circle cx="108" cy="160" r="2.5" fill="white" opacity="0.7" />
            <circle cx="100" cy="150" r="2" fill="white" opacity="0.6" />
            <circle cx="86" cy="170" r="2" fill="white" opacity="0.5" />
            {/* Highlight */}
            <rect x="80" y="50" width="3" height="120" rx="2" fill="white" opacity="0.45" />
            {/* Label */}
            <rect x="78" y="70" width="44" height="22" rx="2" fill="white" opacity="0.85" />
            <text x="100" y="84" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold" fontSize="11" fill="#047857">F1</text>
        </svg>
    );
}

export function LeafIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 200 200" className={className}>
            <defs>
                <linearGradient id="leaf-body" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#bbf7d0" />
                    <stop offset="50%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#047857" />
                </linearGradient>
                {baseDefs('leaf')}
            </defs>
            <ellipse cx="100" cy="180" rx="50" ry="6" fill="rgba(0,0,0,0.15)" />
            <path d="M 100 30 Q 50 60 50 130 Q 50 170 100 170 Q 150 170 150 130 Q 150 60 100 30 Z"
                fill="url(#leaf-body)" filter="url(#leaf-shadow)" />
            {/* Vein */}
            <path d="M 100 30 L 100 170" stroke="#065f46" strokeWidth="2.5" />
            <path d="M 100 60 Q 75 75 70 110" stroke="#065f46" strokeWidth="1.5" fill="none" opacity="0.7" />
            <path d="M 100 80 Q 80 95 78 130" stroke="#065f46" strokeWidth="1.5" fill="none" opacity="0.7" />
            <path d="M 100 60 Q 125 75 130 110" stroke="#065f46" strokeWidth="1.5" fill="none" opacity="0.7" />
            <path d="M 100 80 Q 120 95 122 130" stroke="#065f46" strokeWidth="1.5" fill="none" opacity="0.7" />
            <path d="M 100 110 Q 80 125 78 150" stroke="#065f46" strokeWidth="1.5" fill="none" opacity="0.7" />
            <path d="M 100 110 Q 120 125 122 150" stroke="#065f46" strokeWidth="1.5" fill="none" opacity="0.7" />
            {/* Highlight */}
            <path d="M 90 50 Q 75 70 70 100" stroke="white" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.4" />
        </svg>
    );
}

export function ShieldIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 200 200" className={className}>
            <defs>
                <linearGradient id="shield-body" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6ee7b7" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#065f46" />
                </linearGradient>
                {baseDefs('shield')}
            </defs>
            <ellipse cx="100" cy="180" rx="42" ry="5" fill="rgba(0,0,0,0.18)" />
            <path d="M 100 25 L 50 45 L 50 105 Q 50 145 100 175 Q 150 145 150 105 L 150 45 Z"
                fill="url(#shield-body)" filter="url(#shield-shadow)" />
            <path d="M 100 25 L 50 45 L 50 105 Q 50 145 100 175 Q 150 145 150 105 L 150 45 Z"
                fill="url(#shield-shine)" />
            {/* Check */}
            <path d="M 70 100 L 90 120 L 130 78" stroke="white" strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {/* Inner shadow */}
            <path d="M 100 30 L 56 48 L 56 105 Q 56 142 100 168 Q 144 142 144 105 L 144 48 Z"
                fill="none" stroke="white" strokeWidth="1.5" opacity="0.35" />
        </svg>
    );
}

export function ChartIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 200 200" className={className}>
            <defs>
                <linearGradient id="chart-bar1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#bbf7d0" />
                    <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="chart-bar2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#86efac" />
                    <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="chart-bar3" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#047857" />
                </linearGradient>
                {baseDefs('chart')}
            </defs>
            <ellipse cx="100" cy="178" rx="60" ry="5" fill="rgba(0,0,0,0.18)" />
            {/* Floor */}
            <line x1="40" y1="170" x2="170" y2="170" stroke="#a7f3d0" strokeWidth="3" strokeLinecap="round" />
            {/* Bars */}
            <rect x="50" y="115" width="28" height="55" rx="4" fill="url(#chart-bar1)" filter="url(#chart-shadow)" />
            <rect x="86" y="80" width="28" height="90" rx="4" fill="url(#chart-bar2)" filter="url(#chart-shadow)" />
            <rect x="122" y="40" width="28" height="130" rx="4" fill="url(#chart-bar3)" filter="url(#chart-shadow)" />
            {/* Highlights on bars */}
            <rect x="52" y="118" width="3" height="48" fill="white" opacity="0.5" />
            <rect x="88" y="83" width="3" height="83" fill="white" opacity="0.5" />
            <rect x="124" y="43" width="3" height="123" fill="white" opacity="0.5" />
            {/* Trend arrow */}
            <path d="M 50 110 L 90 75 L 130 35" stroke="#047857" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="50" cy="110" r="5" fill="#047857" />
            <circle cx="90" cy="75" r="5" fill="#047857" />
            <path d="M 130 35 L 145 25 L 130 22" stroke="#047857" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 145 25 L 142 40" stroke="#047857" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
    );
}

export function CompassIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 200 200" className={className}>
            <defs>
                <radialGradient id="compass-body" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#d1fae5" />
                    <stop offset="60%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#064e3b" />
                </radialGradient>
                {baseDefs('compass')}
            </defs>
            <ellipse cx="100" cy="180" rx="55" ry="6" fill="rgba(0,0,0,0.18)" />
            <circle cx="100" cy="100" r="72" fill="url(#compass-body)" filter="url(#compass-shadow)" />
            <circle cx="100" cy="100" r="62" fill="white" />
            <circle cx="100" cy="100" r="62" fill="url(#compass-shine)" />
            {/* Marks */}
            <text x="100" y="55" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold" fontSize="12" fill="#065f46">N</text>
            <text x="100" y="155" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold" fontSize="10" fill="#065f46">S</text>
            <text x="55" y="105" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold" fontSize="10" fill="#065f46">W</text>
            <text x="145" y="105" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold" fontSize="10" fill="#065f46">E</text>
            {/* Needle */}
            <path d="M 100 100 L 90 100 L 100 50 L 110 100 Z" fill="#dc2626" />
            <path d="M 100 100 L 90 100 L 100 150 L 110 100 Z" fill="#94a3b8" />
            <circle cx="100" cy="100" r="6" fill="#1e293b" />
            <circle cx="100" cy="100" r="3" fill="#fbbf24" />
        </svg>
    );
}

export function MixerIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 200 200" className={className}>
            <defs>
                <linearGradient id="mix-bowl" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#cbd5e1" />
                    <stop offset="100%" stopColor="#475569" />
                </linearGradient>
                <linearGradient id="mix-content" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fde68a" />
                    <stop offset="100%" stopColor="#92400e" />
                </linearGradient>
                {baseDefs('mix')}
            </defs>
            <ellipse cx="100" cy="186" rx="60" ry="5" fill="rgba(0,0,0,0.18)" />
            {/* Bowl outer */}
            <path d="M 35 95 L 165 95 L 150 175 Q 148 184 138 184 L 62 184 Q 52 184 50 175 Z"
                fill="url(#mix-bowl)" filter="url(#mix-shadow)" />
            {/* Bowl rim */}
            <ellipse cx="100" cy="95" rx="65" ry="10" fill="#94a3b8" />
            <ellipse cx="100" cy="92" rx="65" ry="10" fill="#cbd5e1" />
            {/* Content (media) */}
            <ellipse cx="100" cy="98" rx="58" ry="8" fill="url(#mix-content)" />
            <ellipse cx="100" cy="96" rx="58" ry="8" fill="#a16207" />
            {/* Sprinkles */}
            <circle cx="80" cy="92" r="3" fill="#fef3c7" />
            <circle cx="120" cy="94" r="2.5" fill="#fef3c7" />
            <circle cx="100" cy="98" r="2" fill="#d6d3d1" />
            <circle cx="65" cy="100" r="2" fill="#fef3c7" />
            {/* Whisk */}
            <line x1="120" y1="20" x2="120" y2="90" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
            <ellipse cx="120" cy="80" rx="14" ry="8" fill="none" stroke="#475569" strokeWidth="2.5" />
            <ellipse cx="120" cy="80" rx="10" ry="8" fill="none" stroke="#475569" strokeWidth="2.5" />
            <ellipse cx="120" cy="80" rx="6" ry="8" fill="none" stroke="#475569" strokeWidth="2.5" />
            <line x1="120" y1="72" x2="120" y2="88" stroke="#475569" strokeWidth="2.5" />
        </svg>
    );
}

export function SteamIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 200 200" className={className}>
            <defs>
                <linearGradient id="pot-body" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
                {baseDefs('pot')}
            </defs>
            <ellipse cx="100" cy="186" rx="60" ry="5" fill="rgba(0,0,0,0.18)" />
            {/* Steam */}
            <path d="M 70 60 Q 65 40 75 30 Q 85 22 80 10" stroke="#cbd5e1" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.85" />
            <path d="M 100 50 Q 95 30 105 20 Q 115 12 110 0" stroke="#cbd5e1" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.9" />
            <path d="M 130 60 Q 125 40 135 30 Q 145 22 140 10" stroke="#cbd5e1" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.85" />
            {/* Pot lid */}
            <ellipse cx="100" cy="80" rx="62" ry="8" fill="#475569" filter="url(#pot-shadow)" />
            <rect x="92" y="68" width="16" height="10" rx="3" fill="#1e293b" />
            {/* Pot body */}
            <path d="M 38 80 L 162 80 L 152 175 Q 150 184 140 184 L 60 184 Q 50 184 48 175 Z"
                fill="url(#pot-body)" filter="url(#pot-shadow)" />
            {/* Handles */}
            <ellipse cx="32" cy="115" rx="8" ry="14" fill="none" stroke="#1e293b" strokeWidth="5" />
            <ellipse cx="168" cy="115" rx="8" ry="14" fill="none" stroke="#1e293b" strokeWidth="5" />
            {/* Highlight */}
            <rect x="58" y="90" width="4" height="80" rx="2" fill="white" opacity="0.4" />
            {/* Logo */}
            <circle cx="100" cy="135" r="18" fill="#10b981" />
            <text x="100" y="142" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold" fontSize="16" fill="white">D</text>
        </svg>
    );
}

export function ClockIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 200 200" className={className}>
            <defs>
                <radialGradient id="clock-body" cx="35%" cy="30%" r="75%">
                    <stop offset="0%" stopColor="#fef3c7" />
                    <stop offset="60%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#92400e" />
                </radialGradient>
                {baseDefs('clock')}
            </defs>
            <ellipse cx="100" cy="180" rx="55" ry="6" fill="rgba(0,0,0,0.18)" />
            <circle cx="100" cy="100" r="72" fill="url(#clock-body)" filter="url(#clock-shadow)" />
            <circle cx="100" cy="100" r="62" fill="white" />
            <circle cx="100" cy="100" r="62" fill="url(#clock-shine)" />
            {/* Hour markers */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
                const r1 = i % 3 === 0 ? 50 : 55;
                const r2 = 60;
                const rad = (deg - 90) * (Math.PI / 180);
                return (
                    <line
                        key={deg}
                        x1={100 + r1 * Math.cos(rad)}
                        y1={100 + r1 * Math.sin(rad)}
                        x2={100 + r2 * Math.cos(rad)}
                        y2={100 + r2 * Math.sin(rad)}
                        stroke="#92400e"
                        strokeWidth={i % 3 === 0 ? 3 : 1.5}
                        strokeLinecap="round"
                    />
                );
            })}
            {/* Hands */}
            <line x1="100" y1="100" x2="100" y2="60" stroke="#92400e" strokeWidth="5" strokeLinecap="round" />
            <line x1="100" y1="100" x2="135" y2="105" stroke="#92400e" strokeWidth="4" strokeLinecap="round" />
            <line x1="100" y1="100" x2="115" y2="135" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
            <circle cx="100" cy="100" r="7" fill="#92400e" />
            <circle cx="100" cy="100" r="3" fill="#fef3c7" />
        </svg>
    );
}

export function BasketIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 200 200" className={className}>
            <defs>
                <linearGradient id="basket-body" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fcd34d" />
                    <stop offset="100%" stopColor="#92400e" />
                </linearGradient>
                {baseDefs('basket')}
            </defs>
            <ellipse cx="100" cy="186" rx="60" ry="5" fill="rgba(0,0,0,0.18)" />
            {/* Mushrooms peeking */}
            <ellipse cx="75" cy="75" rx="20" ry="14" fill="#16a34a" />
            <ellipse cx="100" cy="68" rx="22" ry="15" fill="#15803d" />
            <ellipse cx="125" cy="75" rx="18" ry="13" fill="#22c55e" />
            <circle cx="70" cy="72" r="3" fill="white" opacity="0.6" />
            <circle cx="105" cy="65" r="3" fill="white" opacity="0.6" />
            <circle cx="120" cy="72" r="2.5" fill="white" opacity="0.6" />
            {/* Handle */}
            <path d="M 40 85 Q 100 30 160 85" stroke="#78350f" strokeWidth="6" fill="none" strokeLinecap="round" />
            {/* Basket body */}
            <path d="M 35 85 L 165 85 L 155 175 Q 153 184 143 184 L 57 184 Q 47 184 45 175 Z"
                fill="url(#basket-body)" filter="url(#basket-shadow)" />
            {/* Weave pattern - horizontal */}
            <line x1="38" y1="105" x2="162" y2="105" stroke="#78350f" strokeWidth="2" opacity="0.6" />
            <line x1="40" y1="125" x2="160" y2="125" stroke="#78350f" strokeWidth="2" opacity="0.6" />
            <line x1="42" y1="145" x2="158" y2="145" stroke="#78350f" strokeWidth="2" opacity="0.6" />
            <line x1="44" y1="165" x2="156" y2="165" stroke="#78350f" strokeWidth="2" opacity="0.6" />
            {/* Weave pattern - vertical */}
            {[60, 80, 100, 120, 140].map((x) => (
                <line key={x} x1={x} y1="90" x2={x + (x - 100) * 0.05} y2="180"
                    stroke="#78350f" strokeWidth="1.5" opacity="0.5" />
            ))}
            <ellipse cx="100" cy="85" rx="65" ry="8" fill="#a16207" />
        </svg>
    );
}

export function TruckIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 220 200" className={className}>
            <defs>
                <linearGradient id="truck-cargo" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#047857" />
                </linearGradient>
                <linearGradient id="truck-cab" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#86efac" />
                    <stop offset="100%" stopColor="#15803d" />
                </linearGradient>
                {baseDefs('truck')}
            </defs>
            <ellipse cx="110" cy="178" rx="90" ry="6" fill="rgba(0,0,0,0.18)" />
            {/* Cargo */}
            <rect x="20" y="70" width="120" height="80" rx="5" fill="url(#truck-cargo)" filter="url(#truck-shadow)" />
            {/* Cab */}
            <path d="M 140 90 L 175 90 L 200 115 L 200 150 L 140 150 Z" fill="url(#truck-cab)" filter="url(#truck-shadow)" />
            {/* Window */}
            <path d="M 150 95 L 173 95 L 190 115 L 150 115 Z" fill="#bfdbfe" />
            <path d="M 150 95 L 173 95 L 190 115 L 150 115 Z" fill="white" opacity="0.4" />
            {/* Logo on cargo */}
            <circle cx="80" cy="110" r="22" fill="white" opacity="0.95" />
            <text x="80" y="118" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold" fontSize="20" fill="#047857">D</text>
            {/* Wheels */}
            <circle cx="55" cy="155" r="18" fill="#1e293b" />
            <circle cx="55" cy="155" r="9" fill="#475569" />
            <circle cx="55" cy="155" r="4" fill="#94a3b8" />
            <circle cx="170" cy="155" r="18" fill="#1e293b" />
            <circle cx="170" cy="155" r="9" fill="#475569" />
            <circle cx="170" cy="155" r="4" fill="#94a3b8" />
            {/* Highlight */}
            <rect x="25" y="75" width="3" height="70" fill="white" opacity="0.45" />
        </svg>
    );
}

export function GreenhouseIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 200 200" className={className}>
            <defs>
                <linearGradient id="house-roof" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#16a34a" />
                    <stop offset="50%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#15803d" />
                </linearGradient>
                <linearGradient id="house-wall" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fef3c7" />
                    <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
                {baseDefs('house')}
            </defs>
            <ellipse cx="100" cy="186" rx="65" ry="6" fill="rgba(0,0,0,0.18)" />
            {/* Roof */}
            <path d="M 30 90 L 100 30 L 170 90 L 160 100 L 100 50 L 40 100 Z"
                fill="url(#house-roof)" filter="url(#house-shadow)" />
            {/* Walls */}
            <rect x="45" y="95" width="110" height="85" fill="url(#house-wall)" filter="url(#house-shadow)" />
            {/* Bamboo lines */}
            {[55, 70, 85, 100, 115, 130, 145].map((x) => (
                <line key={x} x1={x} y1="95" x2={x} y2="180" stroke="#a16207" strokeWidth="1.5" opacity="0.5" />
            ))}
            {/* Door */}
            <rect x="85" y="130" width="30" height="50" rx="3" fill="#78350f" />
            <circle cx="108" cy="156" r="2" fill="#fbbf24" />
            {/* Window with mushroom */}
            <rect x="55" y="110" width="20" height="20" rx="2" fill="#dbeafe" />
            <path d="M 60 124 Q 60 117 65 117 Q 70 117 70 124 L 65 127 Z" fill="#16a34a" />
            <rect x="125" y="110" width="20" height="20" rx="2" fill="#dbeafe" />
            <path d="M 130 124 Q 130 117 135 117 Q 140 117 140 124 L 135 127 Z" fill="#16a34a" />
            {/* Roof line accent */}
            <path d="M 30 90 L 100 30 L 170 90" stroke="#15803d" strokeWidth="2" fill="none" />
        </svg>
    );
}
