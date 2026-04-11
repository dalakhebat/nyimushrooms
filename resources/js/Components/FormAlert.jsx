import MIcon from '@/Components/MIcon';

/**
 * Shows a banner alert when there are validation errors.
 * Place at the top of any form — it reads errors from props.
 */
export default function FormAlert({ errors = {} }) {
    const errorList = Object.values(errors).flat();
    if (errorList.length === 0) return null;

    return (
        <div className="mb-6 p-4 bg-red-50 border border-red-200/50 rounded-xl animate-[shake_0.3s_ease-in-out]">
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MIcon name="warning" className="text-lg text-red-600" />
                </div>
                <div className="flex-1">
                    <p className="font-bold text-sm text-red-800 mb-1">
                        Terdapat {errorList.length} kesalahan pada form
                    </p>
                    <ul className="text-sm text-red-700 space-y-0.5">
                        {errorList.map((error, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                                <span className="text-red-400 mt-0.5">•</span>
                                {error}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
