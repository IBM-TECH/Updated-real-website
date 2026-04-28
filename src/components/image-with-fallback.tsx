import { useState } from "react";

function getHash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function getGradient(slug: string) {
  const hash = getHash(slug);
  const hue1 = Math.abs(hash % 360);
  const hue2 = (hue1 + 120) % 360;
  return `linear-gradient(135deg, hsl(${hue1}, 80%, 20%), hsl(${hue2}, 80%, 10%))`;
}

export function ImageWithFallback({ src, alt, slug, className }: { src?: string; alt?: string; slug: string; className?: string }) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || error) {
    return (
      <div 
        className={`relative overflow-hidden flex flex-col items-center justify-center ${className}`}
        style={{ background: getGradient(slug) }}
      >
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] mix-blend-overlay"></div>
        <div className="text-white/30 font-display font-bold text-4xl tracking-tighter mix-blend-overlay">
          NEXUS
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <img
        src={src}
        alt={alt || ""}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        loading="lazy"
      />
    </div>
  );
}
