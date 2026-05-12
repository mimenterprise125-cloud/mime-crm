import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu when navigating
  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 w-full`}
    >
      <div
        className={`mx-auto w-full px-4 sm:px-6 transition-all duration-500 ${
          scrolled ? "py-2" : "py-4 sm:py-6"
        }`}
      >
        <div
          className={`flex items-center justify-between rounded-full px-4 sm:px-5 py-3 transition-all duration-500 max-w-7xl mx-auto ${
            scrolled ? "glass-strong shadow-luxe" : "bg-transparent"
          }`}
        >
          <Link to="/" className="group flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-gold to-[#8a7a55] grid place-items-center shadow-gold-glow">
              <span className="font-display text-[11px] sm:text-[13px] font-semibold text-ink">M</span>
            </div>
            <div className="leading-tight hidden sm:block">
              <div className="font-display text-xs sm:text-sm tracking-[0.18em] uppercase">MIM</div>
              <div className="text-[8px] sm:text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Enterprises</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="relative px-4 py-2 text-[13px] tracking-wide text-foreground/80 hover:text-foreground transition-colors"
                activeProps={{ className: "text-gold" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-foreground text-background px-4 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-[12px] font-medium tracking-wide btn-luxe glow-sweep whitespace-nowrap"
            >
              <span className="hidden sm:inline">Get a Quote</span>
              <span className="sm:hidden">Quote</span>
              <span className="text-gold">→</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden px-3 py-2 rounded-lg hover:bg-foreground/10 transition-colors text-sm font-medium"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute left-0 right-0 top-full mt-2 mx-4 rounded-2xl glass-strong shadow-luxe overflow-hidden z-40">
            <nav className="flex flex-col p-4 gap-2">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={handleNavClick}
                  className="px-4 py-3 text-sm tracking-wide text-foreground/80 hover:text-gold hover:bg-foreground/5 rounded-lg transition-colors"
                  activeProps={{ className: "text-gold bg-foreground/10" }}
                >
                  {n.label}
                </Link>
              ))}
              <div className="border-t border-foreground/10 my-2" />
              <Link
                to="/contact"
                onClick={handleNavClick}
                className="px-4 py-3 text-sm font-medium text-center rounded-lg bg-gold text-ink hover:bg-gold/90 transition-colors"
              >
                Get a Quote
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
