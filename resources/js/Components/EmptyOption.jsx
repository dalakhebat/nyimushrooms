import { Link } from '@inertiajs/react';
import MIcon from '@/Components/MIcon';

/**
 * Shows a "no data" message with a link to create new data.
 * Use when a select/dropdown has no options available.
 *
 * Usage:
 *   {items.length === 0 && <EmptyOption label="Bahan Baku" href="/bahan-baku/create" />}
 */
export default function EmptyOption({ label, href }) {
    return (
        <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200/50 rounded-xl text-sm">
            <div className="flex items-center gap-2 text-amber-700">
                <MIcon name="info" className="text-base" />
                <span>Belum ada data <strong>{label}</strong></span>
            </div>
            <Link
                href={href}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white primary-gradient rounded-lg hover:opacity-90 transition-all active:scale-95"
            >
                <MIcon name="add" className="text-sm" />
                Tambah {label}
            </Link>
        </div>
    );
}
