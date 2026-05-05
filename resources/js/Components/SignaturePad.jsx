import { useEffect, useRef, useState } from 'react';
import MIcon from '@/Components/MIcon';

export default function SignaturePad({ value, onChange, label = 'Tanda Tangan', height = 180 }) {
    const canvasRef = useRef(null);
    const drawing = useRef(false);
    const lastPoint = useRef(null);
    const [isEmpty, setIsEmpty] = useState(!value);

    const getCtx = () => canvasRef.current?.getContext('2d');

    const setupCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ratio = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * ratio;
        canvas.height = rect.height * ratio;
        const ctx = canvas.getContext('2d');
        ctx.scale(ratio, ratio);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#1F1D1B';
        ctx.lineWidth = 2;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, rect.width, rect.height);

        if (value) {
            const img = new Image();
            img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
            img.src = value;
            setIsEmpty(false);
        } else {
            setIsEmpty(true);
        }
    };

    useEffect(() => {
        setupCanvas();
        const handleResize = () => setupCanvas();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getPoint = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const start = (e) => {
        e.preventDefault();
        drawing.current = true;
        lastPoint.current = getPoint(e);
        setIsEmpty(false);
    };

    const move = (e) => {
        if (!drawing.current) return;
        e.preventDefault();
        const ctx = getCtx();
        const p = getPoint(e);
        ctx.beginPath();
        ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        lastPoint.current = p;
    };

    const end = () => {
        if (!drawing.current) return;
        drawing.current = false;
        const dataUrl = canvasRef.current.toDataURL('image/png');
        onChange?.(dataUrl);
    };

    const clear = () => {
        const canvas = canvasRef.current;
        const ctx = getCtx();
        const rect = canvas.getBoundingClientRect();
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, rect.width, rect.height);
        setIsEmpty(true);
        onChange?.('');
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-on-surface-variant">{label}</label>
                <button
                    type="button"
                    onClick={clear}
                    className="inline-flex items-center text-xs text-red-600 hover:text-red-700"
                >
                    <MIcon name="restart_alt" className="text-sm mr-1" />
                    Hapus
                </button>
            </div>
            <div className="relative rounded-xl border-2 border-dashed border-outline-variant/40 bg-white">
                <canvas
                    ref={canvasRef}
                    style={{ width: '100%', height: `${height}px`, touchAction: 'none', cursor: 'crosshair' }}
                    onMouseDown={start}
                    onMouseMove={move}
                    onMouseUp={end}
                    onMouseLeave={end}
                    onTouchStart={start}
                    onTouchMove={move}
                    onTouchEnd={end}
                />
                {isEmpty && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center text-on-tertiary-container">
                            <MIcon name="draw" className="text-3xl opacity-40" />
                            <p className="text-xs mt-1 opacity-60">Gambar tanda tangan di area ini</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
