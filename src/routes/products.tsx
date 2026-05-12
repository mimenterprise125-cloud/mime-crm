import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import productBifold from "@/assets/product-bifold.jpg";
import productCasement from "@/assets/product-casement.jpg";
import productLiftslide from "@/assets/product-liftslide.jpg";
import productTilt from "@/assets/product-tilt.jpg";
import productFrench from "@/assets/product-french.jpg";
import productBay from "@/assets/product-bay.jpg";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — MIM Enterprises | Prominance uPVC Systems" },
      { name: "description", content: "Explore the full Prominance collection: sliding, casement, tilt & turn, bi-fold, lift & slide, French, bay windows and villa doors." },
      { property: "og:title", content: "Prominance Collection — MIM Enterprises" },
    ],
  }),
  component: ProductsPage,
});

const categories = [
  {
    group: "Windows",
    items: [
      { name: "Sliding Windows", img: productLiftslide, desc: "Multi-track horizontal glide for panoramic views." },
      { name: "Casement Windows", img: productCasement, desc: "Outward-swing systems with multi-point locks." },
      { name: "Tilt & Turn Windows", img: productTilt, desc: "Dual-mode European hardware for adaptive ventilation." },
      { name: "Fixed Windows", img: productBay, desc: "Frameless picture views, sealed and silent." },
      { name: "French Windows", img: productFrench, desc: "Centre-meeting sashes with classic proportions." },
      { name: "Bay Windows", img: productBay, desc: "Sculptural bays for cinematic interior moments." },
      { name: "Combination Windows", img: productCasement, desc: "Mixed-function configurations, fully bespoke." },
    ],
  },
  {
    group: "Doors",
    items: [
      { name: "Sliding Doors", img: productLiftslide, desc: "Floor-to-ceiling glide with rail-engineered ease." },
      { name: "Casement Doors", img: productFrench, desc: "Hinged grand entrances with weighted security." },
      { name: "Bi-Fold Doors", img: productBifold, desc: "Accordion folding for full wall openings." },
      { name: "Fold & Slide", img: productBifold, desc: "Hybrid folding-sliding systems for villas." },
      { name: "Lift & Slide", img: productLiftslide, desc: "Heavy panels lifted on rail for effortless motion." },
      { name: "Villa Doors", img: productFrench, desc: "Statement entry systems for grand residences." },
    ],
  },
  {
    group: "Glass & Mesh",
    items: [
      { name: "Toughened Glass", img: productBay, desc: "Tempered safety-grade glazing." },
      { name: "Double Glazed Units", img: productLiftslide, desc: "Argon-filled DGU for thermal & acoustic gains." },
      { name: "Mesh Systems", img: productCasement, desc: "Fly & insect mesh integrated within frames." },
    ],
  },
];

function ProductsPage() {
  return (
    <div className="pt-40 pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="text-[11px] uppercase tracking-[0.3em] text-gold">The Collection</div>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-3 font-display text-5xl md:text-7xl leading-[0.95] max-w-4xl">
            Every system, <span className="text-gradient-gold italic">curated.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-2xl text-foreground/70 leading-relaxed">
            From floor-to-ceiling lift & slide walls to delicate tilt & turn
            casements — every Prominance system is engineered for the way
            modern interiors live, breathe and welcome the outside in.
          </p>
        </Reveal>

        {categories.map((cat, ci) => (
          <section key={cat.group} className="mt-24">
            <Reveal>
              <div className="flex items-end justify-between border-b border-white/10 pb-6 mb-10">
                <h2 className="font-display text-3xl md:text-5xl">{cat.group}</h2>
                <div className="text-[11px] uppercase tracking-[0.3em] text-gold">
                  {String(ci + 1).padStart(2, "0")} / {String(categories.length).padStart(2, "0")}
                </div>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.items.map((p, i) => (
                <Reveal key={p.name} delay={i * 0.05}>
                  <motion.article
                    whileHover={{ y: -6 }}
                    className="group relative overflow-hidden rounded-2xl glass shadow-luxe"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <motion.img
                        src={p.img}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                        whileHover={{ scale: 1.07 }}
                        transition={{ duration: 1.2 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <div className="text-[10px] uppercase tracking-[0.3em] text-gold mb-2">Prominance</div>
                      <h3 className="font-display text-2xl">{p.name}</h3>
                      <p className="mt-2 text-sm text-foreground/70 leading-relaxed">{p.desc}</p>
                    </div>
                  </motion.article>
                </Reveal>
              ))}
            </div>
          </section>
        ))}

        <div className="mt-24 text-center">
          <Link to="/contact" className="inline-flex rounded-full bg-gradient-to-br from-gold to-[#a89572] text-ink px-7 py-4 text-sm font-medium btn-luxe glow-sweep shadow-gold-glow">
            Request a Detailed Catalogue →
          </Link>
        </div>
      </div>
    </div>
  );
}
