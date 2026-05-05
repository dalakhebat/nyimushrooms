import MIcon from '@/Components/MIcon';

export default function PublicLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40">
            <div className="max-w-2xl mx-auto px-4 py-6 md:py-10">
                {/* Branding header */}
                <header className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl primary-gradient text-white shadow-lg mb-3">
                        <MIcon name="biotech" className="text-3xl" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-primary font-headline tracking-tight">
                        Defila Solusi Bersama Indonesia
                    </h1>
                    <p className="text-sm text-on-tertiary-container mt-1">
                        Mushroom Factory · Sistem Pengajuan Online
                    </p>
                </header>

                {/* Title card */}
                {title && (
                    <div className="bg-primary text-white rounded-t-2xl px-6 py-5 shadow-lg">
                        <h2 className="text-lg md:text-xl font-bold font-headline">{title}</h2>
                        {subtitle && <p className="text-sm opacity-90 mt-1">{subtitle}</p>}
                    </div>
                )}

                {/* Content */}
                <main className={title ? 'bg-white rounded-b-2xl shadow-lg' : 'bg-white rounded-2xl shadow-lg'}>
                    {children}
                </main>

                {/* Footer */}
                <footer className="text-center mt-8 text-xs text-on-tertiary-container">
                    <p>© {new Date().getFullYear()} Defila Solusi Bersama Indonesia</p>
                    <p className="mt-1">Bantuan teknis: hubungi admin</p>
                </footer>
            </div>
        </div>
    );
}
