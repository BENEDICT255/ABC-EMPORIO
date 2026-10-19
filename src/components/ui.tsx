import type { ResponsiveImage } from '../config/brand';
import { fallbackSrc, srcSet } from '../config/brand';

interface PictureProps {
  img: ResponsiveImage;
  sizes: string;
  className?: string;
  eager?: boolean;
}

/** Responsive WebP picture with JPEG fallback and intrinsic dimensions (prevents layout shift). */
export function Picture({ img, sizes, className, eager = false }: PictureProps) {
  return (
    <picture className={className}>
      <source type="image/webp" srcSet={srcSet(img, 'webp')} sizes={sizes} />
      <img
        src={fallbackSrc(img)}
        srcSet={srcSet(img, 'jpg')}
        sizes={sizes}
        width={img.width}
        height={img.height}
        alt={img.alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    </picture>
  );
}

/** Thin arrow used on the official site's buttons. */
export function Arrow() {
  return (
    <svg viewBox="0 0 19 11" aria-hidden="true" focusable="false">
      <path d="M13.6 0.6 18.2 5.5 13.6 10.4M0 5.5h18" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
