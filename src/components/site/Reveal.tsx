import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

const variants: Variants = {
  hidden: { opacity: 0, y: isMobile ? 20 : 40, filter: isMobile ? "blur(0px)" : "blur(12px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "h1" | "h2" | "h3" | "p" | "section";
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={{ duration: isMobile ? 0.5 : 0.9, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </Comp>
  );
}

export function SplitHeading({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");
  return (
    <h1 className={className}>
      {words.map((w, wi) => (
        <span key={wi} className="inline-block overflow-hidden align-bottom mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0, filter: isMobile ? "blur(0px)" : "blur(8px)" }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            transition={{
              duration: isMobile ? 0.6 : 1.1,
              delay: delay + wi * (isMobile ? 0.04 : 0.08),
              ease: [0.2, 0.8, 0.2, 1],
            }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}
