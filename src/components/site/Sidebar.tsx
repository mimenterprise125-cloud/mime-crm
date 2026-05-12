import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

const menuItems = [
  { label: "Dashboard", href: "/dashboard", roles: ["admin", "sales", "operations", "accounts"] },
  { label: "Leads", href: "/leads", roles: ["admin", "sales"] },
  { label: "Projects", href: "/projects-crm", roles: ["admin", "operations", "sales"] },
  { label: "Payments", href: "/payments", roles: ["admin", "accounts"] },
  { label: "Employees", href: "/employees", roles: ["admin", "operations"] },
];

export function Sidebar() {
  const { userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const filteredItems = menuItems.filter(item =>
    userProfile && item.roles.includes(userProfile.role)
  );

  const handleLogout = async () => {
    try {
      setIsOpen(false);
      toast.loading("Logging out...");
      
      // Sign out from auth context
      await signOut();
      
      // Clear all local and session storage
      localStorage.clear();
      sessionStorage.clear();
      
      toast.success("Logged out successfully");
      
      // Immediate redirect to homepage
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
      
      // Force logout with direct Supabase call
      try {
        await supabase.auth.signOut({ scope: "local" });
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/";
      } catch (err) {
        console.error("Force logout failed:", err);
        // Last resort - just redirect to homepage
        window.location.href = "/";
      }
    }
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 md:hidden p-2 rounded-lg bg-gold/10 text-gold hover:bg-gold/20 transition"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 !bg-ink-dark flex flex-col transition-all duration-300 z-30 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Card */}
        <div className="m-4 p-4 rounded-lg border border-gold/20 bg-ink-dark/80">
          <h2 className="text-xl font-display text-gold">MIM</h2>
          <p className="text-xs text-gold/60 mt-1">{userProfile?.role.toUpperCase()}</p>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="block px-4 py-3 rounded-lg transition text-gold/70 hover:text-gold border border-gold/10 hover:border-gold/30 bg-ink-dark/50 hover:bg-ink-dark/80 text-sm font-medium"
              activeProps={{
                className: "bg-gold/10 text-gold border-gold/30",
              }}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="m-4 p-4 rounded-lg border border-red-500/30 bg-red-500/10">
          <Button
            onClick={handleLogout}
            className="w-full justify-center bg-red-600 text-white hover:bg-red-700"
          >
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
