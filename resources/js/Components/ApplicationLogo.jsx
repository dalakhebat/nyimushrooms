export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            <defs>
                <linearGradient id="defila-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0058bc" />
                    <stop offset="100%" stopColor="#000f3f" />
                </linearGradient>
            </defs>
            {/* Mushroom cap */}
            <path
                d="M 18 52 Q 18 18, 50 18 Q 82 18, 82 52 Q 82 56, 78 58 L 22 58 Q 18 56, 18 52 Z"
                fill="url(#defila-logo-gradient)"
            />
            {/* Stem */}
            <path
                d="M 38 58 L 62 58 L 60 80 Q 60 86, 54 86 L 46 86 Q 40 86, 40 80 Z"
                fill="url(#defila-logo-gradient)"
                opacity="0.92"
            />
            {/* Cap highlights */}
            <ellipse cx="38" cy="32" rx="6" ry="4" fill="white" opacity="0.35" />
            <circle cx="56" cy="28" r="3" fill="white" opacity="0.35" />
            <circle cx="66" cy="40" r="3.5" fill="white" opacity="0.35" />
            <circle cx="30" cy="44" r="2.5" fill="white" opacity="0.35" />
        </svg>
    );
}
