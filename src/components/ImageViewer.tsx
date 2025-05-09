import React, { useEffect, useRef } from 'react';
import { useGesture } from 'react-use-gesture';
import { Minus, Plus } from 'lucide-react';
import { useStore } from '../store';

const MAX_SCALE = 4;

export const ImageViewer: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const { imageState, setImageState, setLoading } = useStore();

    useEffect(() => {
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            if (!containerRef.current) return;

            const container = containerRef.current.getBoundingClientRect();
            const imgWidth = img.naturalWidth;
            const imgHeight = img.naturalHeight;

            // Calculer l'échelle initiale pour adapter l'image au conteneur
            const scaleX = container.width / imgWidth;
            const scaleY = container.height / imgHeight;
            const initialScale = Math.min(scaleX, scaleY);

            // Centrer l'image en alignant son centre avec celui du conteneur
            const initialPosition = {
                x: container.width / 2 - imgWidth / 2,
                y: container.height / 2 - imgHeight / 2,
            };

            setImageState({
                scale: initialScale,
                minScale: initialScale,
                position: initialPosition,
            });
            setLoading(false);
        };
    }, [imageUrl, setLoading, setImageState]);

    const constrainPosition = (x: number, y: number) => {
        if (!containerRef.current || !imageRef.current) return { x, y };

        const container = containerRef.current.getBoundingClientRect();
        const { scale } = imageState;
        const iw = imageRef.current.naturalWidth;
        const ih = imageRef.current.naturalHeight;
        const cw = container.width;
        const ch = container.height;

        // Calculer les dimensions de l'image après mise à l'échelle
        const scaledWidth = iw * scale;
        const scaledHeight = ih * scale;

        // Limites pour que les bords de l'image ne dépassent pas ceux du conteneur
        const xMin = cw - scaledWidth; // Bord droit de l'image au bord gauche du conteneur
        const xMax = 0; // Bord gauche de l'image au bord gauche du conteneur
        const yMin = ch - scaledHeight; // Bord bas de l'image au bord haut du conteneur
        const yMax = 0; // Bord haut de l'image au bord haut du conteneur

        return {
            x: Math.min(Math.max(x, xMin), xMax),
            y: Math.min(Math.max(y, yMin), yMax),
        };
    };

    const bind = useGesture(
        {
            onDrag: ({ movement: [mx, my], first, last }) => {
                if (first) setImageState({ isDragging: true });
                if (last) setImageState({ isDragging: false });

                const newPosition = constrainPosition(
                    imageState.position.x + mx,
                    imageState.position.y + my
                );
                setImageState({
                    position: newPosition,
                });
            },
            onPinch: ({ offset: [scale] }) => {
                setImageState({
                    scale: Math.min(Math.max(scale, imageState.minScale), MAX_SCALE),
                });
            },
            onWheel: ({ delta: [, dy], event }) => {
                if (event.ctrlKey) {
                    event.preventDefault();
                    const newScale = imageState.scale - dy * 0.01;
                    setImageState({
                        scale: Math.min(Math.max(newScale, imageState.minScale), MAX_SCALE),
                    });
                }
            },
        },
        {
            drag: {
                from: () => [imageState.position.x, imageState.position.y],
            },
            pinch: {
                from: () => [imageState.scale],
            },
        }
    );

    const handleZoom = (delta: number) => {
        const newScale = imageState.scale + delta;
        setImageState({
            scale: Math.min(Math.max(newScale, imageState.minScale), MAX_SCALE),
        });
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <div
                ref={containerRef}
                className="relative overflow-hidden w-full h-full"
                {...bind()}
            >
                <img
                    ref={imageRef}
                    src={imageUrl}
                    alt="Paint guide"
                    style={{
                        maxWidth: 'none',
                        height: 'auto',
                        position: 'absolute',
                        left: '0',
                        top: '0',
                        transform: `translate(${imageState.position.x}px, ${imageState.position.y}px) scale(${imageState.scale})`,
                        transformOrigin: 'center',
                        touchAction: 'none',
                    }}
                    className="transform-gpu transition-transform duration-100"
                />
            </div>
            <div className="absolute bottom-4 left-4 flex flex-col gap-2 z-10">
                <input
                    type="range"
                    min={imageState.minScale}
                    max={MAX_SCALE}
                    step={0.1}
                    value={imageState.scale}
                    onChange={(e) => setImageState({ scale: parseFloat(e.target.value) })}
                    className="w-32 h-2 bg-white rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex gap-2">
                    <button
                        onClick={() => handleZoom(0.1)}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                    >
                        <Plus className="w-6 h-6 text-gray-700" />
                    </button>
                    <button
                        onClick={() => handleZoom(-0.1)}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                    >
                        <Minus className="w-6 h-6 text-gray-700" />
                    </button>
                </div>
            </div>
        </div>
    );
};