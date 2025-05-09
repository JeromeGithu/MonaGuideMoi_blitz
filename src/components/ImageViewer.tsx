import React, { useEffect, useRef } from 'react';
import { useGesture } from 'react-use-gesture';
import { Minus, Plus } from 'lucide-react';
import { useStore } from '../store';

const MIN_SCALE = 1;
const MAX_SCALE = 4;

export const ImageViewer: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { imageState, setImageState, setLoading } = useStore();

  // Appliquer une échelle initiale par défaut avant le chargement
  useEffect(() => {
    console.log('useEffect triggered with imageUrl:', imageUrl);
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      console.log('Image loaded successfully:', imageUrl);
      if (containerRef.current) {
        const container = containerRef.current.getBoundingClientRect();
        const scale = Math.min(container.width / img.width, container.height / img.height);
        console.log('Container dimensions:', container);
        console.log('Calculated initial scale:', scale);

        // Centrer l'image
        const newPosition = {
          x: (container.width - img.width * scale) / 2,
          y: (container.height - img.height * scale) / 2,
        };
        setImageState({ scale, position: newPosition });
        setLoading(false);
      }
    };
    img.onerror = () => console.error('Failed to load image:', imageUrl);
  }, [imageUrl, setLoading, setImageState]);

  const constrainPosition = (x: number, y: number) => {
    if (!containerRef.current || !imageRef.current) return { x, y };

    const container = containerRef.current.getBoundingClientRect();
    const image = imageRef.current.getBoundingClientRect();

    const minX = Math.min(0, container.width - image.width);
    const maxX = Math.max(0, container.width - image.width);
    const minY = Math.min(0, container.height - image.height);
    const maxY = Math.max(0, container.height - image.height);

    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY),
    };
  };

  const bind = useGesture(
    {
      onDrag: ({ delta: [dx, dy], first, last }) => {
        if (first) setImageState({ isDragging: true });
        if (last) setImageState({ isDragging: false });
        
        const newPosition = constrainPosition(
          imageState.position.x + dx,
          imageState.position.y + dy
        );
        
        setImageState({ position: newPosition });
      },
      onPinch: ({ offset: [scale] }) => {
        setImageState({
          scale: Math.min(Math.max(scale, MIN_SCALE), MAX_SCALE),
        });
      },
      onWheel: ({ delta: [, dy], event }) => {
        if (event.ctrlKey) {
          event.preventDefault();
          const newScale = imageState.scale - dy * 0.01;
          setImageState({
            scale: Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE),
          });
        }
      },
    },
    {
      drag: { from: () => [imageState.position.x, imageState.position.y] },
      pinch: { from: () => [imageState.scale] },
    }
  );

  const handleZoom = (delta: number) => {
    const newScale = imageState.scale + delta;
    setImageState({
      scale: Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE),
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
          className="absolute transform-gpu transition-transform duration-100"
          style={{
            transform: `translate(${imageState.position.x}px, ${
              imageState.position.y
            }px) scale(${imageState.scale || 1})`, // Par défaut scale: 1 si undefined
            transformOrigin: 'center',
            touchAction: 'none',
          }}
        />
      </div>
      
      <div className="absolute bottom-4 left-4 flex flex-col gap-2 z-10">
        <input
          type="range"
          min={MIN_SCALE}
          max={MAX_SCALE}
          step={0.1}
          value={imageState.scale || 1}
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