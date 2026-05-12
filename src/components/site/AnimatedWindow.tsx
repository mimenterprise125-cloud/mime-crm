/**
 * Optimized cinematic animated window/door system - reduced effects for performance
 */
export function AnimatedWindow() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="relative aspect-[4/3] w-full max-w-2xl mx-auto">
      {/* Outer frame with 3D perspective */}
      <div className="absolute inset-0 rounded-[2px] border-[14px] border-[#0a0a0a] shadow-lg" style={{ boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.06), 0 20px 40px -10px oklch(0 0 0 / 0.5)" }}>
        {/* Track background - simplified */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] via-[#0e0e0e] to-[#1a1a1a]">
          {/* Sun glow - simplified, only on desktop */}
          {!isMobile && (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,oklch(0.82_0.10_80/0.35),transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,oklch(0.7_0.12_55/0.15),transparent_70%)]" />
            </>
          )}

          {/* Distant landscape silhouette - removed blur for performance */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0a0a0a] via-[#101010]/80 to-transparent" />
          <svg viewBox="0 0 400 100" className="absolute inset-x-0 bottom-[28%] w-full h-16 opacity-50" preserveAspectRatio="none">
            <path d="M0,80 L40,60 L80,72 L130,40 L180,55 L240,30 L300,52 L360,38 L400,50 L400,100 L0,100 Z" fill="#080808" />
          </svg>

          {/* Panel container - simplified */}
          <div className="absolute inset-2 flex overflow-hidden">
            {/* Left panel */}
            <div className="relative flex-1 border-2 border-[#1a1a1a]/60 bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-white/[0.04]">
              {!isMobile && <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/8 to-transparent" />}
              <div className="absolute left-3 top-3 right-3 h-px bg-white/15" />
              <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white/5 to-transparent" />
              {/* Handle */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 h-12 w-2 rounded-full bg-gradient-to-b from-gold via-[#a89a70] to-[#8a7a55]" />
            </div>

            {/* Right panel - Sliding */}
            <div className="relative flex-1 overflow-hidden border-2 border-[#1a1a1a]/60">
              <div className="absolute inset-0 animate-slide-panel-full">
                <div className="h-full w-full bg-gradient-to-br from-white/[0.12] via-white/[0.05] to-white/[0.08] relative border-r-2 border-[#0a0a0a]/40">
                  {!isMobile && <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/12 to-transparent" />}
                  <div className="absolute left-3 top-3 right-3 h-px bg-white/25" />
                  {/* Handle */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 h-12 w-2 rounded-full bg-gradient-to-b from-gold via-[#a89a70] to-[#8a7a55]" />
                  <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-gold/40 via-gold/20 to-transparent" />
                </div>
              </div>
            </div>
          </div>

          {/* Light spill - removed heavy blur */}
          {!isMobile && <div className="absolute -bottom-6 inset-x-8 h-8 bg-gold/20" />}

          {/* Rain droplets - only on desktop, reduced count */}
          {!isMobile && (
            <div className="absolute inset-0 pointer-events-none opacity-30">
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-white/60 animate-drift"
                  style={{
                    left: `${(i * 15 + 5) % 95}%`,
                    bottom: `${(i * 20) % 80}%`,
                    animationDelay: `${i * 0.8}s`,
                    animationDuration: `${12 + (i % 5)}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floor reflection - removed on mobile, reduced blur */}
      {!isMobile && <div className="absolute -bottom-24 inset-x-4 h-24 opacity-20 scale-y-[-1] bg-gradient-to-b from-gold/30 via-transparent to-transparent" />}
    </div>
  );
}
