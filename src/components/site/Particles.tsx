import { useMemo } from "react";

export function Particles({ count = 24 }: { count?: number }) {
  // Reduce particle count on mobile for better performance
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const particleCount = isMobile ? Math.floor(count * 0.3) : count;

  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 2.5 + 0.5,
        delay: Math.random() * 12,
        duration: 14 + Math.random() * 16,
        opacity: 0.15 + Math.random() * 0.4,
      })),
    [particleCount],
  );

  // Skip rendering particles on mobile for better performance
  if (isMobile) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-0 rounded-full bg-gold/60 animate-drift"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: p.opacity,
            boxShadow: "0 0 6px oklch(0.82 0.08 80 / 0.6)",
          }}
        />
      ))}
    </div>
  );
}
