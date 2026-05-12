import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import productLiftslide from "@/assets/product-liftslide.jpg";
import productCasement from "@/assets/product-casement.jpg";
import productBifold from "@/assets/product-bifold.jpg";
import { Reveal } from "@/components/site/Reveal";
import { ConfiguratorShowcase } from "@/components/site/ConfiguratorShowcase";

export const Route = createFileRoute("/configurator")({
  head: () => ({
    meta: [
      { title: "Configurator — MIM Enterprises | Design Your uPVC System" },
      { name: "description", content: "Interactive cinematic configurator: choose system, frame finish, glass type, day or night. Preview your luxury uPVC system in real time." },
    ],
  }),
  component: ConfiguratorPage,
});

const systems = [
  { id: "sliding", name: "Lift & Slide", img: productLiftslide },
  { id: "casement", name: "Casement", img: productCasement },
  { id: "bifold", name: "Bi-Fold", img: productBifold },
] as const;

const frames = [
  { id: "matte", name: "Matte Black", color: "#0D0D0D" },
  { id: "white", name: "Pure White", color: "#F5F5F5" },
  { id: "walnut", name: "Walnut", color: "#5b3a25" },
  { id: "anth", name: "Anthracite", color: "#3a3d40" },
  { id: "champ", name: "Champagne Gold", color: "#D7C5A3" },
];

const glasses = ["Clear", "Frosted", "Tinted", "Reflective", "Double Glazed"];

function ConfiguratorPage() {
  const [system, setSystem] = useState<(typeof systems)[number]["id"]>("sliding");
  const [frame, setFrame] = useState(frames[0].id);
  const [glass, setGlass] = useState("Double Glazed");
  const [mode, setMode] = useState<"day" | "night">("day");
  const [openness, setOpenness] = useState(40);
  const [weather, setWeather] = useState<"sun" | "rain" | "fog">("sun");
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [hasMesh, setHasMesh] = useState(false);

  const active = useMemo(() => systems.find((s) => s.id === system)!, [system]);
  const frameColor = useMemo(() => frames.find((f) => f.id === frame)!.color, [frame]);

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="text-[11px] uppercase tracking-[0.3em] text-gold">Live Configurator</div>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-3 font-display text-5xl md:text-7xl leading-[0.95] max-w-3xl">
            Compose your <span className="text-gradient-gold italic">system.</span>
          </h1>
        </Reveal>

        <div className="mt-12 grid lg:grid-cols-[1.4fr_1fr] gap-8">
          {/* Preview stage with ConfiguratorShowcase */}
          <div className="relative rounded-3xl overflow-hidden glass-strong shadow-luxe aspect-[4/3] lg:aspect-auto lg:min-h-[640px] p-8 flex flex-col">
            {/* HUD top */}
            <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
              <div className="glass rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.3em]">
                {systems.find((s) => s.id === system)!.name} · {frames.find((f) => f.id === frame)!.name}
              </div>
              <div className="flex items-center gap-1 glass rounded-full px-1 py-1 text-xs">
                {(["day", "night"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-3 py-1 rounded-full transition-all ${mode === m ? "bg-foreground text-background" : "text-foreground/60"}`}
                  >
                    {m === "day" ? "Day" : "Night"}
                  </button>
                ))}
              </div>
            </div>

            {/* Animated Window Model */}
            <div className="flex-1 flex items-center justify-center">
              <ConfiguratorShowcase
                activeWindow={system}
                frameColor={frameColor}
                isSliderOpen={isSliderOpen && system === "sliding"}
                hasMesh={hasMesh && system === "sliding"}
                onWindowTypeChange={(type) => setSystem(type as typeof system)}
                onFrameColorChange={(color) => {
                  const frameObj = frames.find((f) => f.color === color);
                  if (frameObj) setFrame(frameObj.id);
                }}
                onOpenClose={setIsSliderOpen}
                onMeshToggle={setHasMesh}
              />
            </div>

            {/* HUD bottom — openness */}
            <div className="absolute bottom-5 left-5 right-5 glass-strong rounded-2xl p-5 z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold">Opening</div>
                <div className="text-xs">{openness}%</div>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={openness}
                onChange={(e) => setOpenness(Number(e.target.value))}
                className="w-full accent-[oklch(0.82_0.06_80)]"
                aria-label="Opening percentage"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {(["sun", "rain", "fog"] as const).map((w) => (
                  <button
                    key={w}
                    onClick={() => setWeather(w)}
                    className={`text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full transition-all ${weather === w ? "bg-gold text-ink" : "glass text-foreground/70"}`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <Panel title="01 · System">
              <div className="grid grid-cols-3 gap-2">
                {systems.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSystem(s.id)}
                    className={`rounded-xl p-3 text-left transition-all ${system === s.id ? "bg-foreground text-background" : "glass hover:bg-white/5"}`}
                  >
                    <div className="text-[10px] uppercase tracking-wider opacity-70">Type</div>
                    <div className="mt-1 text-sm font-medium">{s.name}</div>
                  </button>
                ))}
              </div>
            </Panel>

            <Panel title="02 · Frame Finish">
              <div className="flex flex-wrap gap-3">
                {frames.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFrame(f.id)}
                    className={`group relative h-12 w-12 rounded-full ring-1 ring-white/15 transition-all hover:scale-110 ${frame === f.id ? "ring-gold ring-2 scale-110" : ""}`}
                    style={{ background: f.color }}
                    aria-label={f.name}
                  >
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">{f.name}</span>
                  </button>
                ))}
              </div>
            </Panel>

            <Panel title="03 · Glass">
              <div className="flex flex-wrap gap-2">
                {glasses.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGlass(g)}
                    className={`rounded-full px-4 py-2 text-xs transition-all ${glass === g ? "bg-gold text-ink" : "glass hover:bg-white/5"}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </Panel>

            <Panel title="Summary">
              <div className="space-y-2 text-sm">
                <Row label="System" value={systems.find((s) => s.id === system)!.name} />
                <Row label="Finish" value={frames.find((f) => f.id === frame)!.name} />
                <Row label="Glass" value={glass} />
                <Row label="Mode" value={mode === "day" ? "Day" : "Night"} />
                <Row label="Weather" value={weather} />
                {system === "sliding" && (
                  <>
                    <Row label="Panel" value={isSliderOpen ? "Open" : "Closed"} />
                    <Row label="Mesh" value={hasMesh ? "Enabled" : "Disabled"} />
                  </>
                )}
              </div>
              <button className="mt-5 w-full rounded-full bg-gradient-to-br from-gold to-[#a89572] text-ink px-5 py-3 text-sm font-medium btn-luxe glow-sweep">
                Send Configuration →
              </button>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="text-[10px] uppercase tracking-[0.3em] text-gold mb-4">{title}</div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-white/5 py-1.5">
      <span className="text-foreground/60">{label}</span>
      <span className="capitalize">{value}</span>
    </div>
  );
}
