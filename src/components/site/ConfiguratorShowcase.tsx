import { motion } from "framer-motion";
import { useState } from "react";

const windowTypes = [
  {
    id: "sliding",
    name: "Sliding",
    icon: "→",
    description: "Smooth horizontal glide",
  },
  {
    id: "casement",
    name: "Casement",
    icon: "⤴",
    description: "Outward swing",
  },
  {
    id: "fix",
    name: "Fixed",
    icon: "▭",
    description: "Non-operable pane",
  },
  {
    id: "bifold",
    name: "Bi-Fold",
    icon: "⇋",
    description: "Accordion fold",
  },
  {
    id: "mesh",
    name: "Mesh",
    icon: "◈",
    description: "Netted protection",
  },
];

const frameColors = [
  { c: "#0D0D0D", n: "Matte Black" },
  { c: "#F5F5F5", n: "White" },
  { c: "#5b3a25", n: "Walnut" },
  { c: "#3a3d40", n: "Anthracite" },
  { c: "#D7C5A3", n: "Champagne" },
];

interface ConfiguratorShowcaseProps {
  activeWindow?: string;
  frameColor?: string;
  isSliderOpen?: boolean;
  hasMesh?: boolean;
  onWindowTypeChange?: (type: string) => void;
  onFrameColorChange?: (color: string) => void;
  onOpenClose?: (isOpen: boolean) => void;
  onMeshToggle?: (hasMesh: boolean) => void;
}

export function ConfiguratorShowcase({
  activeWindow: propActiveWindow = "sliding",
  frameColor: propFrameColor = "#0D0D0D",
  isSliderOpen: propIsSliderOpen = false,
  hasMesh: propHasMesh = false,
  onWindowTypeChange,
  onFrameColorChange,
  onOpenClose,
  onMeshToggle,
}: ConfiguratorShowcaseProps) {
  const [activeWindow, setActiveWindow] = useState<string>(propActiveWindow);
  const [frameColor, setFrameColor] = useState<string>(propFrameColor);
  const [isSliderOpen, setIsSliderOpen] = useState<boolean>(propIsSliderOpen);
  const [hasMesh, setHasMesh] = useState<boolean>(propHasMesh);

  const handleWindowTypeChange = (type: string) => {
    setActiveWindow(type);
    setIsSliderOpen(false);
    setHasMesh(false);
    onWindowTypeChange?.(type);
  };

  const handleFrameColorChange = (color: string) => {
    setFrameColor(color);
    onFrameColorChange?.(color);
  };

  const handleOpenClose = (isOpen: boolean) => {
    setIsSliderOpen(isOpen);
    onOpenClose?.(isOpen);
  };

  const handleMeshToggle = (meshEnabled: boolean) => {
    setHasMesh(meshEnabled);
    onMeshToggle?.(meshEnabled);
  };

  const getWindowLabel = (windowType: string) => {
    return windowTypes.find((w) => w.id === windowType)?.name || "Window";
  };

  return (
    <div className="relative aspect-[5/6] w-full max-w-2xl mx-auto">
      {/* Open/Close buttons - positioned absolutely at top */}
      {activeWindow === "sliding" && (
        <div className="absolute top-8 right-8 flex items-center gap-2 z-10">
          <button
            onClick={() => handleOpenClose(false)}
            className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-wider transition-all ${
              !isSliderOpen
                ? "bg-gold/30 text-gold ring-1 ring-gold"
                : "glass text-foreground/60 hover:text-foreground"
            }`}
          >
            Close
          </button>
          <button
            onClick={() => handleOpenClose(true)}
            className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-wider transition-all ${
              isSliderOpen
                ? "bg-gold/30 text-gold ring-1 ring-gold"
                : "glass text-foreground/60 hover:text-foreground"
            }`}
          >
            Open
          </button>
        </div>
      )}

      {/* Main preview window */}
      <div
        className="relative rounded-3xl overflow-hidden glass-strong shadow-luxe p-8 aspect-[5/6] flex flex-col border-2"
        style={{ borderColor: frameColor, boxShadow: `inset 0 0 0 1px ${frameColor}30, 0 30px 80px -20px oklch(0 0 0 / 0.7)` }}
      >
        {/* Background track */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] via-[#0e0e0e] to-[#1a1a1a]">
          {/* Sun glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,oklch(0.82_0.10_80/0.55),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,oklch(0.7_0.12_55/0.35),transparent_60%)]" />

          {/* Distant landscape */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0a0a0a] via-[#101010]/80 to-transparent" />
          <svg viewBox="0 0 400 100" className="absolute inset-x-0 bottom-[28%] w-full h-16 opacity-70" preserveAspectRatio="none">
            <path d="M0,80 L40,60 L80,72 L130,40 L180,55 L240,30 L300,52 L360,38 L400,50 L400,100 L0,100 Z" fill="#080808" />
          </svg>

          {/* Light spill */}
          <div className="absolute -bottom-6 inset-x-8 h-12 blur-2xl bg-gold/30" />
        </div>

        {/* Sliding Door Window */}
        {activeWindow === "sliding" && (
          <div className="relative flex-1 rounded-2xl overflow-hidden flex" style={{ perspective: "1200px" }}>
            {/* Left Static Panel */}
            <div
              className="flex-1 border-2 shadow-inner relative"
              style={{
                borderColor: frameColor,
                background: `linear-gradient(135deg, ${frameColor}15 0%, ${frameColor}05 100%)`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/8 to-transparent" />
              <div className="absolute left-3 top-3 right-3 h-px" style={{ background: `${frameColor}80` }} />
              {/* Light reflection */}
              <div
                className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r to-transparent"
                style={{ backgroundImage: `linear-gradient(to right, ${frameColor}10, transparent)` }}
              />
              {/* Handle */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 h-12 w-2 rounded-full bg-gradient-to-b from-gold via-[#a89a70] to-[#8a7a55] shadow-gold-glow" />
            </div>

            {/* Right Panel Area - Sliding Panel */}
            <div className="flex-1 border-2 border-l-0 shadow-inner relative overflow-hidden" style={{ borderColor: frameColor }}>
              {/* Sliding panel that moves */}
              <motion.div
                className="absolute inset-0 flex"
                animate={{ x: isSliderOpen ? -100 : 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              >
                {/* Sliding panel content */}
                <div
                  className="w-full h-full border-r-2 shadow-inner relative"
                  style={{
                    borderColor: frameColor,
                    background: `linear-gradient(135deg, ${frameColor}20 0%, ${frameColor}08 100%)`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/12 to-transparent" />
                  <div className="absolute left-3 top-3 right-3 h-px" style={{ background: `${frameColor}80` }} />
                  {/* Handle on right panel */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 h-12 w-2 rounded-full bg-gradient-to-b from-gold via-[#a89a70] to-[#8a7a55] shadow-gold-glow" />
                </div>

                {/* Empty space when panel slides open */}
                <div
                  className="w-full h-full relative"
                  style={{
                    background: `linear-gradient(135deg, ${frameColor}08 0%, ${frameColor}02 100%)`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] via-[#0e0e0e] to-[#1a1a1a]" />
                  {/* Mesh pattern when open and mesh is enabled */}
                  {isSliderOpen && hasMesh && (
                    <svg className="absolute inset-0 w-full h-full opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <defs>
                        <pattern id="mesh" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                          <rect x="0" y="0" width="10" height="10" fill="none" stroke={frameColor} strokeWidth="0.5" opacity="0.3" />
                        </pattern>
                      </defs>
                      <rect width="100" height="100" fill="url(#mesh)" />
                    </svg>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Casement Window */}
        {activeWindow === "casement" && (
          <div className="relative flex-1 rounded-2xl overflow-hidden flex items-center justify-center" style={{ perspective: "1200px" }}>
            <motion.div
              className="w-3/4 h-4/5 rounded-lg"
              animate={{ rotateY: [0, 45, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{
                borderColor: frameColor,
                background: `linear-gradient(135deg, ${frameColor}20 0%, ${frameColor}08 100%)`,
                border: `3px solid ${frameColor}`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/12 to-transparent" />
            </motion.div>
          </div>
        )}

        {/* Fixed Window */}
        {activeWindow === "fix" && (
          <div className="relative flex-1 rounded-2xl overflow-hidden" style={{ perspective: "1200px" }}>
            <div
              className="w-full h-full rounded-lg"
              style={{
                borderColor: frameColor,
                background: `linear-gradient(135deg, ${frameColor}20 0%, ${frameColor}08 100%)`,
                border: `3px solid ${frameColor}`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/12 to-transparent" />
              <div className="absolute left-3 top-3 right-3 h-px" style={{ background: `${frameColor}80` }} />
            </div>
          </div>
        )}

        {/* Bi-Fold Window */}
        {activeWindow === "bifold" && (
          <div className="relative flex-1 rounded-2xl overflow-hidden flex gap-1 p-2">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-lg"
                animate={{ scaleX: [1, 0.8, 1] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.1 }}
                style={{
                  borderColor: frameColor,
                  background: `linear-gradient(135deg, ${frameColor}20 0%, ${frameColor}08 100%)`,
                  border: `2px solid ${frameColor}`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
              </motion.div>
            ))}
          </div>
        )}

        {/* Mesh Window */}
        {activeWindow === "mesh" && (
          <div className="relative flex-1 rounded-2xl overflow-hidden" style={{ perspective: "1200px" }}>
            <div
              className="w-full h-full rounded-lg relative"
              style={{
                borderColor: frameColor,
                background: `linear-gradient(135deg, ${frameColor}15 0%, ${frameColor}05 100%)`,
                border: `3px solid ${frameColor}`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
              {/* Mesh pattern */}
              <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <pattern id="mesh-grid" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="8" height="8" fill="none" stroke={frameColor} strokeWidth="0.4" opacity="0.4" />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#mesh-grid)" />
              </svg>
              <div className="absolute left-3 top-3 right-3 h-px" style={{ background: `${frameColor}80` }} />
            </div>
          </div>
        )}

        {/* Config info */}
        <div className="mt-6 flex items-center justify-between text-[10px] uppercase tracking-wider text-foreground/60">
          <span>Frame: {frameColors.find((c) => c.c === frameColor)?.n}</span>
          <span className="text-gold">●</span>
        </div>
      </div>
    </div>
  );
}
