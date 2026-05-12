import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(() => {
    // Only show loading screen on initial page load
    return typeof window !== "undefined" && !sessionStorage.getItem("_mim_app_loaded");
  });

  useEffect(() => {
    if (!isLoading) return;
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Mark that app has been loaded in this session
      if (typeof window !== "undefined") {
        sessionStorage.setItem("_mim_app_loaded", "true");
      }
    }, 2500); // Show for 2.5 seconds on initial load only

    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoading ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      style={{ pointerEvents: isLoading ? "auto" : "none" }}
    >
      {/* Background fade in */}
      <motion.div
        className="absolute inset-0 bg-ink"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      />
      {/* Left sliding panel */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-ink via-ink to-ink/80"
        initial={{ x: 0, scaleY: 0 }}
        animate={{ 
          x: isLoading ? [0, 0, "-100%"] : 0,
          scaleY: isLoading ? [0, 1, 1] : 1
        }}
        transition={{ 
          x: { duration: 1.2, delay: isLoading ? 1 : 0.5, ease: [0.65, 0, 0.35, 1] },
          scaleY: { duration: 0.5, ease: "easeOut" },
        }}
        style={{
          background: "linear-gradient(90deg, oklch(0.13 0 0 / 1) 0%, oklch(0.13 0 0 / 0.95) 100%)",
          transformOrigin: "center",
        }}
      />

      {/* Right sliding panel */}
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2"
        initial={{ x: 0, scaleY: 0 }}
        animate={{ 
          x: isLoading ? [0, 0, "100%"] : 0,
          scaleY: isLoading ? [0, 1, 1] : 1
        }}
        transition={{ 
          x: { duration: 1.2, delay: isLoading ? 1 : 0.5, ease: [0.65, 0, 0.35, 1] },
          scaleY: { duration: 0.5, ease: "easeOut" },
        }}
        style={{
          background: "linear-gradient(90deg, oklch(0.13 0 0 / 0.95) 0%, oklch(0.13 0 0 / 1) 100%)",
          transformOrigin: "center",
        }}
      />

      {/* Center content during loading */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="text-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoading ? 0 : 0 }}
          transition={{ duration: 0.3, delay: isLoading ? 0.9 : 0 }}
        >
          <motion.div
            className="text-center"
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="font-display text-4xl tracking-[0.2em] uppercase">MIM</div>
            <div className="text-xs tracking-[0.3em] uppercase text-gold mt-2">Enterprises</div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mt-6 inline-block"
            >
              <div className="text-2xl text-gold">◆</div>
            </motion.div>
            <div className="mt-3 text-xs tracking-[0.2em] uppercase text-gold">Loading</div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
