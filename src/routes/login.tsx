import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

function LoginComponent() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ink via-ink/95 to-ink/90">
        <Card className="w-full max-w-md bg-ink-dark border-gold/20 p-8 text-center">
          <div className="text-3xl mb-4">✓</div>
          <h2 className="text-gold text-xl font-semibold mb-2">Login Successful!</h2>
          <p className="text-gold/60 text-sm">Redirecting to dashboard...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ink via-ink/95 to-ink/90 p-4">
      <Card className="w-full max-w-md bg-ink-dark border-gold/20">
        <div className="p-8">
          {/* Logo/Branding */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display text-gold tracking-wider mb-2">MIM</h1>
            <p className="text-xs tracking-widest text-gold/70">ENTERPRISES CRM</p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="mb-6 bg-red-500/10 border-red-500/20 text-red-400 text-sm">
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gold/80 mb-2">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-ink border-gold/20 text-white placeholder:text-white/30"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gold/80 mb-2">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-ink border-gold/20 text-white placeholder:text-white/30"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-ink hover:bg-gold/90 font-semibold mt-6"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Home Link */}
          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-gold/60 hover:text-gold transition-colors">
              ← Back to Home
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/login")({
  component: LoginComponent,
});

