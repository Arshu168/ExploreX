import React, { useState, useEffect } from 'react';
import { getRealPlaceImageSync, resolveRealPlaceImage } from '../utils/realImageService';

interface RealPlaceImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  placeName: string;
  region?: string;
  originalUrl?: string;
  showBadge?: boolean;
}

export const RealPlaceImage: React.FC<RealPlaceImageProps> = ({
  placeName,
  region = '',
  originalUrl = '',
  showBadge = false,
  className = '',
  alt = '',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(() => {
    // 1. If original URL is already a verified wikimedia image, use it
    if (originalUrl && originalUrl.includes('wikimedia.org')) {
      return originalUrl;
    }
    // 2. Synchronous check for curated real photo
    return getRealPlaceImageSync(placeName, region, originalUrl);
  });

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // If current image is not verified wikimedia, attempt live Wikipedia API resolution
    if (!imgSrc || !imgSrc.includes('wikimedia.org')) {
      resolveRealPlaceImage(placeName, region).then((resolved) => {
        if (isMounted && resolved && resolved !== imgSrc) {
          setImgSrc(resolved);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [placeName, region]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      const fallback = getRealPlaceImageSync(placeName, region, '');
      setImgSrc(fallback);
    }
  };

  return (
    <div className="relative w-full h-full">
      <img
        src={imgSrc}
        alt={alt || placeName}
        onError={handleError}
        loading="lazy"
        className={className}
        {...props}
      />
      {showBadge && (
        <span className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur text-white text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs border border-white/10 pointer-events-none">
          <svg className="w-2.5 h-2.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Real Photo
        </span>
      )}
    </div>
  );
};
