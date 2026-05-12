import { useState } from "react";

interface ConfiguratorControlsProps {
  onWindowTypeChange: (type: string) => void;
  onFrameColorChange: (color: string) => void;
  onOpenClose: (isOpen: boolean) => void;
  onMeshToggle: (hasMesh: boolean) => void;
  activeWindow: string;
  frameColor: string;
}

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
];

const frameColors = [
  { c: "#0D0D0D", n: "Matte Black" },
  { c: "#F5F5F5", n: "White" },
  { c: "#5b3a25", n: "Walnut" },
  { c: "#3a3d40", n: "Anthracite" },
  { c: "#D7C5A3", n: "Champagne" },
];

export function ConfiguratorControls({
  onWindowTypeChange,
  onFrameColorChange,
  onOpenClose,
  onMeshToggle,
  activeWindow,
  frameColor,
}: ConfiguratorControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasMesh, setHasMesh] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    onOpenClose(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    onOpenClose(false);
  };

  const handleMeshToggle = () => {
    setHasMesh(!hasMesh);
    onMeshToggle(!hasMesh);
  };

  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.3em] text-gold">Interactive Configurator</div>

      <h2 className="mt-6 font-display text-4xl md:text-5xl leading-tight">
        Design your<br />system, in real time.
      </h2>

      <p className="mt-8 max-w-xl text-foreground/70 leading-relaxed">
        Slide, fold, tilt and turn. Switch frame finishes, glass types and
        lighting modes. Experience your future installation as a living,
        cinematic preview.
      </p>

      {/* Window Type Selection */}
      <div className="mt-10">
        <div className="text-xs uppercase tracking-[0.3em] text-foreground/60 mb-4">Window Type</div>
        <div className="flex gap-3">
          {windowTypes.map((w) => (
            <button
              key={w.id}
              onClick={() => {
                onWindowTypeChange(w.id);
                setIsOpen(false);
                setHasMesh(false);
              }}
              className={`rounded-lg px-4 py-3 text-center transition-all duration-300 flex-1 ${
                activeWindow === w.id
                  ? "glass-strong bg-gold/20 ring-2 ring-gold text-gold"
                  : "glass hover:glass-strong hover:ring-1 hover:ring-gold/50 text-foreground/70 hover:text-foreground"
              }`}
            >
              <div className="text-lg mb-1">{w.icon}</div>
              <div className="text-xs font-medium">{w.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Open/Close Controls - Only for Sliding */}
      {activeWindow === "sliding" && (
        <div className="mt-8">
          <div className="text-xs uppercase tracking-[0.3em] text-foreground/60 mb-4">Panel Control</div>
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className={`flex-1 rounded-lg px-4 py-3 text-xs uppercase tracking-wider transition-all ${
                !isOpen
                  ? "bg-gold/30 text-gold ring-1 ring-gold"
                  : "glass text-foreground/60 hover:text-foreground hover:glass-strong"
              }`}
            >
              Close
            </button>
            <button
              onClick={handleOpen}
              className={`flex-1 rounded-lg px-4 py-3 text-xs uppercase tracking-wider transition-all ${
                isOpen
                  ? "bg-gold/30 text-gold ring-1 ring-gold"
                  : "glass text-foreground/60 hover:text-foreground hover:glass-strong"
              }`}
            >
              Open
            </button>
          </div>
        </div>
      )}

      {/* Mesh Toggle - Only for Sliding */}
      {activeWindow === "sliding" && (
        <div className="mt-8">
          <div className="text-xs uppercase tracking-[0.3em] text-foreground/60 mb-4">Options</div>
          <button
            onClick={handleMeshToggle}
            className={`w-full rounded-lg px-4 py-3 text-xs uppercase tracking-wider transition-all ${
              hasMesh
                ? "bg-gold/20 text-gold ring-2 ring-gold"
                : "glass text-foreground/60 hover:text-foreground hover:glass-strong"
            }`}
          >
            <span className="text-gold mr-2">◆</span>
            {hasMesh ? "Remove Mesh" : "Add Mesh Screen"}
          </button>
        </div>
      )}

      {/* Frame Color Selection */}
      <div className="mt-10">
        <div className="text-xs uppercase tracking-[0.3em] text-foreground/60 mb-4">Frame Finish</div>
        <div className="grid grid-cols-5 gap-2">
          {frameColors.map((color) => (
            <button
              key={color.n}
              onClick={() => onFrameColorChange(color.c)}
              className={`group/color relative h-12 w-full rounded-lg ring-2 transition-all hover:scale-105 ${
                frameColor === color.c ? "ring-gold" : "ring-white/10 hover:ring-gold/50"
              }`}
              style={{ background: color.c }}
              title={color.n}
            >
              <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] uppercase tracking-wider opacity-0 group-hover/color:opacity-100 transition-opacity text-foreground/70">
                {color.n}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Info Display */}
      <div className="mt-10 glass rounded-xl px-4 py-4 border border-white/10">
        <div className="text-[11px] uppercase tracking-[0.3em] text-gold mb-3">Current Selection</div>
        <div className="space-y-2 text-xs text-foreground/70">
          <div className="flex justify-between">
            <span>Window Type:</span>
            <span className="text-gold font-medium">{windowTypes.find((w) => w.id === activeWindow)?.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Frame Finish:</span>
            <span className="text-gold font-medium">{frameColors.find((c) => c.c === frameColor)?.n}</span>
          </div>
          {activeWindow === "sliding" && (
            <>
              <div className="flex justify-between">
                <span>Panel Status:</span>
                <span className="text-gold font-medium">{isOpen ? "Open" : "Closed"}</span>
              </div>
              <div className="flex justify-between">
                <span>Mesh Screen:</span>
                <span className="text-gold font-medium">{hasMesh ? "Enabled" : "Disabled"}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mt-8 space-y-3 text-sm">
        <div className="glass rounded-xl px-4 py-3 flex items-start gap-3">
          <span className="text-gold text-lg flex-shrink-0 mt-0.5">→</span>
          <span className="text-foreground/70">Drag to slide panels smoothly</span>
        </div>
        <div className="glass rounded-xl px-4 py-3 flex items-start gap-3">
          <span className="text-gold text-lg flex-shrink-0 mt-0.5">⤴</span>
          <span className="text-foreground/70">Rotate casement windows outward</span>
        </div>
        <div className="glass rounded-xl px-4 py-3 flex items-start gap-3">
          <span className="text-gold text-lg flex-shrink-0 mt-0.5">◈</span>
          <span className="text-foreground/70">Add protective mesh screening</span>
        </div>
      </div>
    </div>
  );
}
