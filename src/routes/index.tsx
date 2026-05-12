import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import heroVilla from "@/assets/hero-villa.jpg";
import productBifold from "@/assets/product-bifold.jpg";
import productCasement from "@/assets/product-casement.jpg";
import productLiftslide from "@/assets/product-liftslide.jpg";
import productTilt from "@/assets/product-tilt.jpg";
import productFrench from "@/assets/product-french.jpg";
import productBay from "@/assets/product-bay.jpg";
import projectVilla from "@/assets/project-villa1.jpg";
import projectPenthouse from "@/assets/project-penthouse.jpg";
import projectGarden from "@/assets/project-garden.jpg";
import projectBath from "@/assets/project-bath.jpg";
import { Particles } from "@/components/site/Particles";
import { AnimatedWindow } from "@/components/site/AnimatedWindow";
import { Reveal, SplitHeading } from "@/components/site/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MIM Enterprises — Crafted For Modern Living" },
      {
        name: "description",
        content:
          "Cinematic luxury uPVC doors & windows. Authorised Partner of Prominance. German-engineered systems for villas, penthouses & modern homes.",
      },
      { property: "og:title", content: "MIM Enterprises — Crafted For Modern Living" },
      { property: "og:image", content: heroVilla },
    ],
  }),
  component: HomePage,
});

const badges = ["German Engineering", "Sound Insulation", "Weather Resistant", "Energy Efficient"];

const CONTACT_INFO = {
  phone: "9957640581",
  email: "mimenterprises123@gmail.com",
  location: "A T ROAD, south, opp. mambooz dhaba, Amolapatty, Dibrugarh, Assam 786001",
  whatsapp: "9957640581",
};

const products = [
  { name: "Lift & Slide Doors", desc: "Effortless premium glide for heavy luxury panels.", img: productLiftslide },
  { name: "Bi-Fold Doors", desc: "Accordion folding for seamless indoor-outdoor living.", img: productBifold },
  { name: "Casement Windows", desc: "Outward swing engineered for ventilation & light.", img: productCasement },
  { name: "Tilt & Turn Windows", desc: "Dual-mode European hardware for adaptive comfort.", img: productTilt },
  { name: "French Doors", desc: "Architectural elegance with multi-point security.", img: productFrench },
  { name: "Bay Windows", desc: "Sculptural curves crafted for cinematic interiors.", img: productBay },
];

const projects = [
  { img: projectVilla, title: "Lakeside Villa", tag: "Residential" },
  { img: projectPenthouse, title: "Skyline Penthouse", tag: "High-Rise" },
  { img: projectGarden, title: "Garden Conservatory", tag: "Bi-Fold System" },
  { img: projectBath, title: "Marble Bath Suite", tag: "Tilt & Turn" },
];

const features = [
  { k: "01", t: "German Engineering", d: "Multi-chamber Prominance profiles built to European DIN standards." },
  { k: "02", t: "Acoustic Insulation", d: "Up to 42dB reduction with double-sealed gasket systems." },
  { k: "03", t: "Thermal Efficiency", d: "Low U-values keep interiors silent, cool and energy-light." },
  { k: "04", t: "Weather Resistant", d: "Cyclonic-grade glazing tested against monsoon and dust ingress." },
  { k: "05", t: "Multi-Point Locking", d: "Forged stainless hardware for villa-grade security." },
  { k: "06", t: "Lead-Free Profiles", d: "Eco-conscious calcium-zinc formulations, certified safe." },
];

const stats = [
  { n: "500+", l: "Premium Installations" },
  { n: "42dB", l: "Sound Reduction" },
  { n: "10Yr", l: "Hardware Warranty" },
  { n: "100%", l: "Lead-Free Profiles" },
];

function HomePage() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  // Simplified parallax - disabled on mobile
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1]);
  const heroBlur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(0px)"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const [showMyWorks, setShowMyWorks] = useState(false);
  const [myWorksPhone, setMyWorksPhone] = useState("");
  const [myWorksData, setMyWorksData] = useState<any>(null);
  const [myWorksLoading, setMyWorksLoading] = useState(false);

  const searchMyWorks = async () => {
    if (!myWorksPhone.trim()) {
      toast.error("Mobile number required", {
        description: "Please enter your 10-digit mobile number",
      });
      return;
    }

    if (myWorksPhone.length < 10) {
      toast.error("Invalid mobile number", {
        description: "Please enter a valid 10-digit number",
      });
      return;
    }

    setMyWorksLoading(true);
    try {
      console.log("Searching for phone:", myWorksPhone);
      
      // Search for leads with this phone number
      const { data: leads, error: leadsError } = await supabase
        .from("leads")
        .select("id, name, email, phone, status, created_at")
        .eq("phone", myWorksPhone);

      console.log("Leads response:", { leads, leadsError });

      if (leadsError) {
        console.error("Leads error:", leadsError);
        toast.error("Database error", {
          description: `Failed to fetch leads: ${leadsError.message}`,
        });
        return;
      }

      if (!leads || leads.length === 0) {
        toast.error("No records found", {
          description: `No projects found for phone number ${myWorksPhone}. Please check and try again.`,
        });
        setMyWorksData(null);
        setMyWorksLoading(false);
        return;
      }

      const lead = leads[0]; // Use the first matching lead
      console.log("Found lead:", lead);

      // Get related quotations and projects
      const { data: quotations, error: quotationsError } = await supabase
        .from("quotations")
        .select("*")
        .eq("lead_id", lead.id);

      if (quotationsError) {
        console.error("Quotations error:", quotationsError);
        toast.warning("Could not load quotations", {
          description: quotationsError.message,
        });
      }

      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .eq("lead_id", lead.id);

      if (projectsError) {
        console.error("Projects error:", projectsError);
        toast.warning("Could not load projects", {
          description: projectsError.message,
        });
      }

      const { data: payments, error: paymentsError } = await supabase
        .from("payments")
        .select("*")
        .eq("lead_id", lead.id);

      if (paymentsError) {
        console.error("Payments error:", paymentsError);
        toast.warning("Could not load payments", {
          description: paymentsError.message,
        });
      }

      const totalQuoted = quotations?.reduce((sum: number, q: any) => sum + (q.total_amount || 0), 0) || 0;
      const totalPaid = payments?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0;
      const balance = totalQuoted - totalPaid;

      console.log("Data aggregated:", { totalQuoted, totalPaid, balance });

      setMyWorksData({
        lead: lead,
        quotations: quotations || [],
        projects: projects || [],
        payments: payments || [],
        totalQuoted,
        totalPaid,
        balance,
      });

      toast.success("Project found!", {
        description: `Welcome ${lead.name || "there"}. Your project details are loaded.`,
      });
    } catch (error: any) {
      console.error("Error searching works:", error);
      const errorMessage = error?.message || "An unexpected error occurred";
      toast.error("Search failed", {
        description: errorMessage,
      });
    } finally {
      setMyWorksLoading(false);
    }
  };

  return (
    <>
      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen w-full overflow-hidden">
        {/* Cinematic background image with parallax */}
        <motion.div
          className="absolute inset-0"
          style={{ scale: heroScale, filter: heroBlur, opacity: heroOpacity }}
        >
          <img
            src={heroVilla}
            alt="Luxury villa with floor-to-ceiling uPVC sliding doors at golden hour"
            className="h-full w-full object-cover"
            width={1920}
            height={1080}
            loading="lazy"
          />
          {/* Ambient cinematic gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/30 to-ink" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,transparent_0%,oklch(0.13_0_0/0.55)_70%)]" />
          {/* Light sweep animation removed - was causing performance issues */}
        </motion.div>

        <Particles count={isMobile ? 0 : 32} />

        {/* Hero content */}
        <motion.div
          style={{ y: contentY }}
          className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 pt-32 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="inline-flex items-center gap-3 rounded-full glass px-5 py-2 text-[11px] uppercase tracking-[0.3em] text-gold"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            Authorised Partner of Prominance
          </motion.div>

          <SplitHeading
            text="Crafted For Modern Living"
            delay={0.4}
            className="mt-8 font-display text-5xl sm:text-7xl md:text-[112px] leading-[0.95] tracking-tight max-w-5xl"
          />

          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-8 max-w-xl text-base md:text-lg text-foreground/70 leading-relaxed"
          >
            Premium uPVC doors & windows engineered for elegance, insulation,
            security and the architecture of modern living.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/products"
              className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-br from-gold to-[#a89572] text-ink px-7 py-4 text-sm font-medium btn-luxe glow-sweep shadow-gold-glow"
            >
              Explore Products
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 rounded-full glass-strong px-7 py-4 text-sm font-medium btn-luxe"
            >
              Get Free Quote
            </Link>
            <button
              onClick={() => setShowMyWorks(true)}
              className="inline-flex items-center gap-3 rounded-full glass-strong px-7 py-4 text-sm font-medium btn-luxe hover:bg-white/10 transition"
            >
              My Works
            </button>
          </motion.div>

          {/* Floating badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.8 }}
            className="mt-16 flex flex-wrap justify-center gap-3"
          >
            {badges.map((b, i) => (
              <motion.div
                key={b}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-full glass px-4 py-2 text-[11px] uppercase tracking-wider text-foreground/80"
              >
                {b}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-foreground/50"
        >
          Scroll
          <span className="block h-12 w-px bg-gradient-to-b from-gold/60 to-transparent" />
        </motion.div>
      </section>

      {/* MARQUEE */}
      <section className="relative overflow-hidden border-y border-white/5 py-6 bg-onyx/40">
        <div className="flex marquee-track whitespace-nowrap">
          {[...Array(2)].map((_, dup) => (
            <div key={dup} className="flex shrink-0 items-center gap-12 pr-12">
              {[
                "Sliding Systems",
                "Casement",
                "Tilt & Turn",
                "Bi-Fold",
                "Lift & Slide",
                "French Doors",
                "Villa Doors",
                "Bay Windows",
                "Mesh Systems",
                "Toughened Glass",
              ].map((t) => (
                <span key={t} className="flex items-center gap-12">
                  <span className="font-display text-2xl tracking-tight text-foreground/40">{t}</span>
                  <span className="text-gold">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* INTRO / ANIMATED WINDOW SHOWCASE */}
      <section className="relative py-32 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Reveal>
              <div className="text-[11px] uppercase tracking-[0.3em] text-gold">The Experience</div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight">
                Architecture<br />in <span className="text-gradient-gold italic">motion.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-md text-foreground/70 leading-relaxed">
                Every Prominance system is a piece of engineering choreography —
                rails glide, gaskets seal, hardware locks with the satisfying
                weight of European precision. Watch the systems come alive.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-10 grid grid-cols-2 gap-6 max-w-md">
                {stats.map((s) => (
                  <div key={s.l} className="border-l border-gold/30 pl-4">
                    <div className="font-display text-3xl text-gradient-gold">{s.n}</div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{s.l}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <AnimatedWindow />
          </Reveal>
        </div>
      </section>

      {/* PRODUCT SHOWCASE */}
      <section className="relative py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <Reveal>
                <div className="text-[11px] uppercase tracking-[0.3em] text-gold">Collection</div>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-3 font-display text-4xl md:text-6xl leading-tight max-w-xl">
                  A system for every<br />architectural intent.
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <Link to="/products" className="text-sm text-foreground/70 hover:text-gold inline-flex items-center gap-2">
                View all products <span>→</span>
              </Link>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p, i) => (
              <Reveal key={p.name} delay={i * (isMobile ? 0.02 : 0.06)}>
                <motion.article
                  whileHover={isMobile ? {} : { y: -8 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="group relative overflow-hidden rounded-2xl glass shadow-luxe"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <motion.img
                      src={p.img}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                      whileHover={isMobile ? {} : { scale: 1.08 }}
                      transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/5 group-hover:ring-gold/30 transition-all duration-500" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-gold mb-2">Prominance</div>
                    <h3 className="font-display text-2xl">{p.name}</h3>
                    <p className="mt-2 text-sm text-foreground/70 leading-relaxed">{p.desc}</p>
                    <div className="mt-4 inline-flex items-center gap-2 text-xs text-foreground/60 group-hover:text-gold transition-colors">
                      Discover system <span className="transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="relative py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16">
            <Reveal>
              <div className="text-[11px] uppercase tracking-[0.3em] text-gold">Projects</div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-3 font-display text-4xl md:text-6xl leading-tight max-w-2xl">
                Where Prominance meets <span className="text-gradient-gold italic">place.</span>
              </h2>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[260px]">
            <Reveal className="md:col-span-7 md:row-span-2"><ProjectCard p={projects[0]} large /></Reveal>
            <Reveal delay={0.1} className="md:col-span-5"><ProjectCard p={projects[1]} /></Reveal>
            <Reveal delay={0.2} className="md:col-span-5"><ProjectCard p={projects[3]} /></Reveal>
            <Reveal delay={0.3} className="md:col-span-12"><ProjectCard p={projects[2]} /></Reveal>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,oklch(0.82_0.10_80/0.10),transparent_60%)]" />
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <Reveal>
              <div className="text-[11px] uppercase tracking-[0.3em] text-gold">Why MIM × Prominance</div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-3 font-display text-4xl md:text-6xl leading-tight">
                Engineered for the rare.
              </h2>
            </Reveal>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <Reveal key={f.t} delay={i * (isMobile ? 0.02 : 0.05)}>
                <motion.div
                  whileHover={isMobile ? {} : { y: -6 }}
                  className="group relative h-full glass rounded-2xl p-8 overflow-hidden"
                >
                  {!isMobile && (
                    <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  )}
                  <div className="font-display text-sm text-gold/70 tracking-widest">{f.k}</div>
                  <h3 className="mt-4 font-display text-2xl">{f.t}</h3>
                  <p className="mt-3 text-sm text-foreground/65 leading-relaxed">{f.d}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl glass-strong shadow-luxe p-12 md:p-20 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.82_0.10_80/0.18),transparent_60%)]" />
              <div className="absolute -inset-px rounded-3xl pointer-events-none" style={{ background: "linear-gradient(135deg, oklch(0.82 0.08 80 / 0.4), transparent 40%, oklch(0.82 0.08 80 / 0.2))", WebkitMask: "linear-gradient(#000,#000) content-box, linear-gradient(#000,#000)", WebkitMaskComposite: "xor", padding: "1px" }} />
              <div className="relative">
                <div className="text-[11px] uppercase tracking-[0.3em] text-gold">Begin</div>
                <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight">
                  Bring your architecture<br /> to <span className="text-gradient-gold italic">life.</span>
                </h2>
                <p className="mt-6 max-w-xl mx-auto text-foreground/70">
                  Schedule a private consultation with our specialists.
                  Site-survey, design proposal and quote — complimentary.
                </p>
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                  <Link to="/contact" className="rounded-full bg-gradient-to-br from-gold to-[#a89572] text-ink px-7 py-4 text-sm font-medium btn-luxe glow-sweep shadow-gold-glow">
                    Request a Consultation
                  </Link>
                  <Link to="/products" className="rounded-full glass px-7 py-4 text-sm font-medium btn-luxe">
                    Browse the Collection
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER: MIM Enterprises */}
      <footer className="relative border-t border-white/5 py-12 md:py-16 bg-ink-dark/50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-display text-gold">MIM Enterprises</h2>
              <p className="text-sm text-gold/60 mt-1">Authorised Partner of Prominance</p>
              <p className="mt-4 text-foreground/70 max-w-lg">
                Premium German-engineered uPVC door & window systems crafted for modern luxury architecture. Designed for elegance, insulation, security and timeless living.
              </p>
            </div>

            <div>
              <h3 className="text-gold font-display text-xl mb-4">Explore</h3>
              <div className="flex flex-col gap-2">
                <Link to="/products" className="text-white hover:text-gold">Products</Link>
                <Link to="/configurator" className="text-white hover:text-gold">Configurator</Link>
                <Link to="/projects-crm" className="text-white hover:text-gold">Projects</Link>
                <Link to="/contact" className="text-white hover:text-gold">Contact</Link>
              </div>

              <div className="mt-6">
                <p className="text-sm text-foreground/70">{CONTACT_INFO.email}</p>
                <p className="text-sm text-foreground/70">+91 {CONTACT_INFO.phone}</p>

                <div className="mt-4">
                  <Link to="/login" className="text-white hover:text-gold">Login</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-xs text-foreground/50">
              © 2026 MIM Enterprises. Crafted for modern living.
            </p>
          </div>
        </div>
      </footer>

      {/* MY WORKS MODAL */}
      <Dialog open={showMyWorks} onOpenChange={setShowMyWorks}>
        <DialogContent className="!bg-ink-dark border-gold/20 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gold">My Works - Track Your Project</DialogTitle>
          </DialogHeader>

          {!myWorksData ? (
            <div className="space-y-4">
              <p className="text-foreground/70 text-sm">
                Enter your mobile number to view your payment history and project status
              </p>
              <div className="space-y-3">
                <Input
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={myWorksPhone}
                  onChange={(e) => setMyWorksPhone(e.target.value.replace(/\D/g, ""))}
                  className="bg-ink border-gold/20 text-white placeholder:text-white/30"
                  maxLength={10}
                />
                <Button
                  onClick={searchMyWorks}
                  disabled={myWorksLoading}
                  className="w-full bg-gold text-ink hover:bg-gold/90"
                >
                  {myWorksLoading ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Project Status */}
              <Card className="bg-black border-gold/20 p-4">
                <h3 className="text-gold font-semibold mb-3">Project Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Status:</span>
                    <span className={`px-3 py-1 rounded text-xs font-semibold ${
                      myWorksData.lead.status === "converted" ? "bg-green-500/20 text-green-400" :
                      myWorksData.lead.status === "in-progress" ? "bg-blue-500/20 text-blue-400" :
                      "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {myWorksData.lead.status?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Created:</span>
                    <span>{new Date(myWorksData.lead.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>

              {/* Payment Summary */}
              <Card className="bg-black border-gold/20 p-4">
                <h3 className="text-gold font-semibold mb-3">Payment Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Total Quoted:</span>
                    <span className="text-gold font-semibold">₹{myWorksData.totalQuoted.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Total Paid:</span>
                    <span className="text-green-400 font-semibold">₹{myWorksData.totalPaid.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gold/10 pt-2 flex justify-between">
                    <span className="text-foreground/70">Balance Remaining:</span>
                    <span className={myWorksData.balance > 0 ? "text-orange-400 font-semibold" : "text-green-400 font-semibold"}>
                      ₹{myWorksData.balance.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Quotations */}
              {myWorksData.quotations.length > 0 && (
                <Card className="bg-black border-gold/20 p-4">
                  <h3 className="text-gold font-semibold mb-3">Quotations ({myWorksData.quotations.length})</h3>
                  <div className="space-y-2 text-sm">
                    {myWorksData.quotations.map((q: any) => (
                      <div key={q.id} className="flex justify-between p-2 bg-ink-dark/50 rounded">
                        <span className="text-foreground/70">{q.total_sqft} Sq.Ft @ ₹{q.rate_per_sqft}/Sq.Ft</span>
                        <span className="text-gold font-semibold">₹{(q.total_amount || 0).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Projects */}
              {myWorksData.projects.length > 0 && (
                <Card className="bg-black border-gold/20 p-4">
                  <h3 className="text-gold font-semibold mb-3">Projects ({myWorksData.projects.length})</h3>
                  <div className="space-y-2 text-sm">
                    {myWorksData.projects.map((p: any) => (
                      <div key={p.id} className="flex justify-between p-2 bg-ink-dark/50 rounded">
                        <span className="text-foreground/70">{p.name}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          p.status === "completed" ? "bg-green-500/20 text-green-400" :
                          p.status === "in-progress" ? "bg-blue-500/20 text-blue-400" :
                          "bg-gray-500/20 text-gray-400"
                        }`}>
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    setMyWorksData(null);
                    setMyWorksPhone("");
                  }}
                  variant="outline"
                  className="flex-1 border-gold/20 text-gold hover:bg-gold/10"
                >
                  Search Another
                </Button>
                <a
                  href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=Hi%20MIM%20Enterprises%2C%20I%20have%20a%20question%20about%20my%20project`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Contact via WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function ProjectCard({ p, large = false }: { p: { img: string; title: string; tag: string }; large?: boolean }) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  
  return (
    <motion.div
      whileHover={isMobile ? {} : { scale: 1.01 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className="group relative h-full overflow-hidden rounded-2xl shadow-luxe"
    >
      <motion.img
        src={p.img}
        alt={p.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        whileHover={isMobile ? {} : { scale: 1.08 }}
        transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/5 group-hover:ring-gold/40 transition-all duration-500" />
      <div className="absolute bottom-0 inset-x-0 p-6 md:p-8">
        <div className="text-[10px] uppercase tracking-[0.3em] text-gold">{p.tag}</div>
        <h3 className={`mt-2 font-display ${large ? "text-3xl md:text-5xl" : "text-2xl"}`}>{p.title}</h3>
      </div>
    </motion.div>
  );
}
