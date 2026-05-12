import { Outlet, Link, createRootRoute, HeadContent, Scripts, useLocation } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Header } from "@/components/site/Header";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { LoadingScreen } from "@/components/site/LoadingScreen";
import { AuthProvider } from "@/lib/auth-context";
import { RefreshProvider } from "@/lib/refresh-context";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl text-gradient-gold">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This door leads nowhere. Let's take you home.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium btn-luxe"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MIM Enterprises — Authorised Partner of Prominance | Luxury uPVC Doors & Windows" },
      {
        name: "description",
        content:
          "Cinematic luxury uPVC doors & windows by MIM Enterprises, Authorised Partner of Prominance. German-engineered for elegance, insulation, and modern architecture.",
      },
      { name: "author", content: "MIM Enterprises" },
      { property: "og:title", content: "MIM Enterprises — Luxury uPVC Doors & Windows" },
      { property: "og:description", content: "Premium uPVC systems crafted for modern living." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://api.fontshare.com/v2/css?f[]=clash-display@500,600,700&f[]=general-sans@400,500,600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponentInner() {
  const location = useLocation();
  
  // Hide header on login and protected pages (dashboard, leads, projects, etc.)
  const hiddenRoutes = ['/login', '/dashboard', '/leads', '/projects-crm', '/payments', '/employees', '/configurator'];
  const shouldShowHeader = !hiddenRoutes.some(route => location.pathname.startsWith(route));
  const shouldShowWhatsApp = !hiddenRoutes.some(route => location.pathname.startsWith(route));
  
  return (
    <>
      <LoadingScreen />
      {shouldShowHeader && <Header />}
      <main className="relative">
        <Outlet />
      </main>
      {shouldShowWhatsApp && <WhatsAppFab />}
    </>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <RefreshProvider>
        <RootComponentInner />
      </RefreshProvider>
    </AuthProvider>
  );
}
