import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ImageViewerProps {
  src: string;
  alt?: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ src, alt = 'Image' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoading(false);
    img.onerror = () => {
      setIsLoading(false);
      setError('Failed to load image');
    };
  }, [src]);

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {isLoading && <LoadingSpinner />}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-contain ${isLoading ? 'hidden' : 'block'}`}
      />
    </div>
  );
};

export default ImageViewer;
