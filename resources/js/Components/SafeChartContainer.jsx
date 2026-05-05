import { useEffect, useRef, useState } from 'react';
import { ResponsiveContainer } from 'recharts';

/**
 * Wraps Recharts ResponsiveContainer to avoid the noisy
 * "width(-1) and height(-1)" warning that fires during Inertia page
 * transitions when the parent container is rendered before layout is
 * complete. Uses ResizeObserver to delay chart render until the parent
 * has actually been measured with positive dimensions.
 */
export default function SafeChartContainer({ children, ...props }) {
    const wrapperRef = useRef(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!wrapperRef.current) return;
        const observer = new ResizeObserver((entries) => {
            const { width, height } = entries[0].contentRect;
            if (width > 0 && height > 0) {
                setReady(true);
            }
        });
        observer.observe(wrapperRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={wrapperRef} style={{ width: '100%', height: '100%' }}>
            {ready && (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} {...props}>
                    {children}
                </ResponsiveContainer>
            )}
        </div>
    );
}
