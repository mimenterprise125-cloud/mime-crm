import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    project_type: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      if (!formData.name || !formData.phone) {
        setError("Name and phone are required");
        setLoading(false);
        return;
      }

      if (formData.phone.length !== 10) {
        setError("Please enter a valid 10-digit phone number");
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase.from("leads").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        project_type: formData.project_type,
        message: formData.message,
        source: "website_contact",
        status: "NEW",
        created_at: new Date().toISOString(),
      });

      if (insertError) throw insertError;

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        location: "",
        project_type: "",
        message: "",
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error submitting contact form:", err);
      setError(err.message || "Failed to submit form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink via-ink/95 to-ink/90">
      {/* Contact Form Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-ink-dark border-gold/20 p-8">
            {/* Form Header */}
            <div className="mb-8 pb-6 border-b border-gold/20">
              <h1 className="text-4xl font-display text-gold mb-2">✉️ Get In Touch</h1>
              <p className="text-sm text-gold/70">
                Have a project in mind? Tell us about your vision. Our team will respond within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gold mb-2">
                  Full Name *
                </label>
                <Input
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-ink border-gold/20 text-white placeholder:text-white/40"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gold mb-2">
                  Email Address (Optional)
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-ink border-gold/20 text-white placeholder:text-white/40"
                />
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gold mb-2">
                  Phone Number * (10 digits)
                </label>
                <Input
                  type="tel"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => {
                    // Remove non-digits and limit to 10 digits
                    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setFormData({ ...formData, phone: cleaned });
                  }}
                  className="bg-ink border-gold/20 text-white placeholder:text-white/40"
                  maxLength={10}
                  required
                />
                {formData.phone && formData.phone.length !== 10 && (
                  <p className="text-xs text-yellow-400 mt-1">
                    Please enter a valid 10-digit number
                  </p>
                )}
              </div>

              {/* Location Field */}
              <div>
                <label className="block text-sm font-medium text-gold mb-2">
                  Location
                </label>
                <Input
                  type="text"
                  placeholder="City or area"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-ink border-gold/20 text-white placeholder:text-white/40"
                />
              </div>

              {/* Project Type Field */}
              <div>
                <label className="block text-sm font-medium text-gold mb-2">
                  Project Type
                </label>
                <select
                  value={formData.project_type}
                  onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                  className="w-full bg-ink border border-gold/20 text-white rounded px-3 py-2"
                >
                  <option value="">Select project type...</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Institutional">Institutional</option>
                  <option value="Hospitality">Hospitality</option>
                  <option value="Mixed Use">Mixed Use</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-medium text-gold mb-2">
                  Message / Project Details
                </label>
                <textarea
                  placeholder="Tell us about your project, requirements, timeline..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-ink border border-gold/20 text-white rounded px-3 py-2 placeholder:text-white/40 min-h-[120px]"
                  rows={5}
                />
              </div>

              {/* Error Alert */}
              {error && (
                <Alert className="bg-red-500/10 border-red-500/30">
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}

              {/* Success Alert */}
              {success && (
                <Alert className="bg-green-500/10 border-green-500/30">
                  <AlertDescription className="text-green-400">
                    ✓ Thank you! Your inquiry has been received. Our team will contact you soon.
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gold text-ink hover:bg-gold/90 font-semibold py-3 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Send Inquiry"}
              </Button>

              <p className="text-xs text-gold/60 text-center">
                * Required fields. We'll get back to you within 24 hours.
              </p>
            </form>
          </Card>

          {/* Info Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-ink-dark border-gold/20 p-6 text-center">
              <h3 className="text-gold font-semibold mb-2">📞 Call Us</h3>
              <p className="text-white/70 text-sm">+91 9957640581</p>
            </Card>
            <Card className="bg-ink-dark border-gold/20 p-6 text-center">
              <h3 className="text-gold font-semibold mb-2">📧 Email</h3>
              <p className="text-white/70 text-sm">mimenterprises123@gmail.com</p>
            </Card>
            <Card className="bg-ink-dark border-gold/20 p-6 text-center">
              <h3 className="text-gold font-semibold mb-2">📍 Visit Us</h3>
              <p className="text-white/70 text-sm">A T ROAD, Opposite Avanti Vihar, Nashik</p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});
