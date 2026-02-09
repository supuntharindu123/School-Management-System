import React, { useEffect, useState } from "react";

export default function ImageSlideshow({
  images = [],
  intervalMs = 3000,
  className = "",
  objectFit = "contain", // 'contain' | 'cover'
  effect = "fade", // 'fade' | 'zoom'
  showControls = true,
  showIndicators = true,
  unstyled = false,
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!images.length || paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [images.length, intervalMs, paused]);

  const fitClass = objectFit === "cover" ? "object-cover" : "object-contain";
  const containerBase = unstyled
    ? "relative overflow-hidden"
    : "relative overflow-hidden rounded-2xl border border-cyan-200 bg-white shadow-sm";
  return (
    <div
      className={`${containerBase} ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <div className="relative h-full">
        {images.map((img, i) => {
          const active = i === index;
          const base = `absolute inset-0 h-full w-full ${fitClass}`;
          const fade = `transition-opacity duration-700 ease-out ${active ? "opacity-100" : "opacity-0"}`;
          const zoomStyle = active
            ? { transform: "scale(1.04)", transition: "transform 4s ease" }
            : { transform: "scale(1.0)", transition: "transform 0.5s ease" };
          return (
            <img
              key={i}
              src={img.src}
              alt={img.alt || `Slide ${i + 1}`}
              className={`${base} ${fade}`}
              style={effect === "zoom" ? zoomStyle : undefined}
            />
          );
        })}
        {/* Caption overlay */}
        {images[index]?.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/90 to-white/0 p-3">
            <p className="text-xs font-medium text-neutral-800">
              {images[index].caption}
            </p>
          </div>
        )}
      </div>

      {/* Controls */}

      {/* Indicators */}
      {showIndicators && images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goto(i)}
              className={`h-2 w-2 rounded-full border transition-colors ${
                i === index
                  ? "border-cyan-600 bg-cyan-600"
                  : "border-cyan-200 bg-white hover:bg-cyan-50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
