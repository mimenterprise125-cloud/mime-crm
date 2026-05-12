import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import projectVilla from "@/assets/project-villa1.jpg";
import projectPenthouse from "@/assets/project-penthouse.jpg";
import projectGarden from "@/assets/project-garden.jpg";
import projectBath from "@/assets/project-bath.jpg";
import productLiftslide from "@/assets/product-liftslide.jpg";
import productFrench from "@/assets/product-french.jpg";
import productBay from "@/assets/product-bay.jpg";
import productTilt from "@/assets/product-tilt.jpg";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — MIM Enterprises | Luxury uPVC Installations" },
      { name: "description", content: "Selected installations: lakeside villas, skyline penthouses, conservatories and luxury suites featuring Prominance uPVC systems." },
      { property: "og:image", content: projectVilla },
    ],
  }),
  component: ProjectsPage,
});

const items = [
  { img: projectVilla, title: "Lakeside Villa", tag: "Residential", h: "tall" },
  { img: projectPenthouse, title: "Skyline Penthouse", tag: "High-Rise" },
  { img: productLiftslide, title: "Coastal Retreat", tag: "Lift & Slide" },
  { img: projectGarden, title: "Garden Conservatory", tag: "Bi-Fold" , h: "wide"},
  { img: projectBath, title: "Marble Suite", tag: "Tilt & Turn" },
  { img: productFrench, title: "Heritage Manor", tag: "French Doors" },
  { img: productBay, title: "Reading Pavilion", tag: "Bay Window", h: "tall" },
  { img: productTilt, title: "Boutique Hotel", tag: "Casement" },
];

function ProjectsPage() {
  return (
    <div className="pt-40 pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="text-[11px] uppercase tracking-[0.3em] text-gold">Selected Works</div>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-3 font-display text-5xl md:text-7xl leading-[0.95] max-w-4xl">
            Where engineering meets <span className="text-gradient-gold italic">atmosphere.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-2xl text-foreground/70 leading-relaxed">
            A curated showcase of Prominance installations — villas, penthouses,
            conservatories and bespoke suites where light, glass and silence
            were composed in equal measure.
          </p>
        </Reveal>

        <div className="mt-16 columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
          {items.map((it, i) => (
            <motion.figure
              key={it.title}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: (i % 6) * 0.05 }}
              whileHover={{ y: -6 }}
              className={`group relative mb-6 break-inside-avoid overflow-hidden rounded-2xl shadow-luxe ${it.h === "tall" ? "aspect-[3/4]" : it.h === "wide" ? "aspect-[16/10]" : "aspect-[4/5]"}`}
            >
              <motion.img
                src={it.img}
                alt={it.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-700" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/5 group-hover:ring-gold/40 transition-all duration-500" />
              <figcaption className="absolute bottom-0 inset-x-0 p-6">
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold">{it.tag}</div>
                <h3 className="mt-2 font-display text-2xl">{it.title}</h3>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </div>
  );
}
