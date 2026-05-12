import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sidebar } from "@/components/site/Sidebar";
import { supabase } from "@/lib/supabase";

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  convertedLeads: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalPayments: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  totalEmployees: number;
  nextPaymentDate: string | null;
}

interface LeadItem {
  id: string;
  name: string;
  status: string;
  email: string;
}

interface ProjectItem {
  id: string;
  name: string;
  status: string;
  next_payment_date: string | null;
}

function DashboardComponent() {
  const { userProfile, signOut, loading } = useAuth();
  const [redirecting, setRedirecting] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    newLeads: 0,
    convertedLeads: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalPayments: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    totalEmployees: 0,
    nextPaymentDate: null,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [recentLeads, setRecentLeads] = useState<LeadItem[]>([]);
  const [recentProjects, setRecentProjects] = useState<ProjectItem[]>([]);

  useEffect(() => {
    if (!loading && !userProfile) {
      setRedirecting(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    }
  }, [userProfile, loading]);

  useEffect(() => {
    if (userProfile) {
      fetchStats();
    }
  }, [userProfile]);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      
      // Fetch leads stats
      const { count: totalLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact" });

      const { count: newLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact" })
        .eq("status", "NEW");

      const { count: convertedLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact" })
        .eq("status", "CONVERTED");

      // Fetch recent leads
      const { data: leads } = await supabase
        .from("leads")
        .select("id, name, status, email")
        .order("created_at", { ascending: false })
        .limit(5);

      if (leads) setRecentLeads(leads);

      // Fetch projects stats
      const { count: totalProjects } = await supabase
        .from("projects")
        .select("*", { count: "exact" });

      const { count: activeProjects } = await supabase
        .from("projects")
        .select("*", { count: "exact" })
        .eq("status", "ACTIVE");

      const { count: completedProjects } = await supabase
        .from("projects")
        .select("*", { count: "exact" })
        .eq("status", "COMPLETED");

      // Fetch recent projects
      const { data: projects } = await supabase
        .from("projects")
        .select("id, name, status, next_payment_date")
        .order("created_at", { ascending: false })
        .limit(5);

      if (projects) setRecentProjects(projects);

      // Get next payment date (nearest upcoming payment)
      const { data: paymentDates } = await supabase
        .from("projects")
        .select("next_payment_date")
        .not("next_payment_date", "is", null)
        .order("next_payment_date", { ascending: true })
        .limit(1);

      let nextPaymentDate = null;
      if (paymentDates && paymentDates.length > 0) {
        nextPaymentDate = paymentDates[0].next_payment_date;
      }

      // Fetch payments stats
      const { count: totalPayments, data: paymentData } = await supabase
        .from("payments")
        .select("amount, status", { count: "exact" });

      let totalAmount = 0;
      let paidAmount = 0;
      let pendingAmount = 0;

      if (paymentData) {
        paymentData.forEach((payment: any) => {
          totalAmount += payment.amount || 0;
          if (payment.status === "PAID") {
            paidAmount += payment.amount || 0;
          } else {
            pendingAmount += payment.amount || 0;
          }
        });
      }

      // Fetch employees stats
      const { count: totalEmployees } = await supabase
        .from("employees")
        .select("*", { count: "exact" });

      setStats({
        totalLeads: totalLeads || 0,
        newLeads: newLeads || 0,
        convertedLeads: convertedLeads || 0,
        totalProjects: totalProjects || 0,
        activeProjects: activeProjects || 0,
        completedProjects: completedProjects || 0,
        totalPayments: totalPayments || 0,
        totalAmount: totalAmount,
        paidAmount: paidAmount,
        pendingAmount: pendingAmount,
        totalEmployees: totalEmployees || 0,
        nextPaymentDate: nextPaymentDate,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ink via-ink/95 to-ink/90">
        <div className="text-center">
          <div className="text-3xl font-display text-gold mb-4">MIM</div>
          <p className="text-gold/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (redirecting || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ink via-ink/95 to-ink/90">
        <div className="text-center">
          <p className="text-gold/60">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink via-ink/95 to-ink/90">
      <Sidebar />

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Header */}
        <header className="border-b border-gold/10 bg-ink-dark/50 backdrop-blur-sm sticky top-0">
          <div className="px-4 md:px-8 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-display text-gold">Dashboard</h1>
              <p className="text-sm text-gold/60">Welcome, {userProfile?.full_name || "User"}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-white/80">{userProfile?.email}</p>
                <p className="text-xs text-gold/60 capitalize">{userProfile?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 md:px-8 py-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-ink-card border-gold/20 p-6 hover:border-gold/40 transition-colors">
              <h3 className="text-gold font-semibold mb-2 text-sm">📋 Total Leads</h3>
              <p className="text-3xl font-bold text-white">{stats.totalLeads}</p>
              <p className="text-xs text-gold/60 mt-2">
                <span className="text-green-400">{stats.convertedLeads} converted</span> • <span className="text-blue-400">{stats.newLeads} new</span>
              </p>
            </Card>

            <Card className="bg-ink-card border-gold/20 p-6 hover:border-gold/40 transition-colors">
              <h3 className="text-gold font-semibold mb-2 text-sm">🏗️ Total Projects</h3>
              <p className="text-3xl font-bold text-white">{stats.totalProjects}</p>
              <p className="text-xs text-gold/60 mt-2">
                <span className="text-orange-400">{stats.activeProjects} active</span> • <span className="text-green-400">{stats.completedProjects} done</span>
              </p>
            </Card>

            <Card className="bg-ink-card border-gold/20 p-6 hover:border-gold/40 transition-colors">
              <h3 className="text-gold font-semibold mb-2 text-sm">💰 Total Amount</h3>
              <p className="text-3xl font-bold text-white">₹{(stats.totalAmount / 100000).toFixed(1)}L</p>
              <p className="text-xs text-gold/60 mt-2">
                <span className="text-green-400">₹{(stats.paidAmount / 100000).toFixed(1)}L paid</span> • <span className="text-yellow-400">₹{(stats.pendingAmount / 100000).toFixed(1)}L pending</span>
              </p>
            </Card>

            <Card className="bg-ink-card border-gold/20 p-6 hover:border-gold/40 transition-colors">
              <h3 className="text-gold font-semibold mb-2 text-sm">� Next Payment</h3>
              <p className="text-3xl font-bold text-white">
                {stats.nextPaymentDate
                  ? new Date(stats.nextPaymentDate).toLocaleDateString()
                  : "—"}
              </p>
              <p className="text-xs text-gold/60 mt-2">Nearest upcoming payment</p>
            </Card>
          </div>

          {/* Additional Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-ink-card border-gold/20 p-6 hover:border-gold/40 transition-colors">
              <h3 className="text-gold font-semibold mb-4 text-sm">Leads Pipeline</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gold/70">New</span>
                  <span className="text-blue-400 font-semibold">{stats.newLeads}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gold/70">Converted</span>
                  <span className="text-green-400 font-semibold">{stats.convertedLeads}</span>
                </div>
                <div className="h-2 bg-gold/10 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                    style={{
                      width: stats.totalLeads > 0 ? `${(stats.convertedLeads / stats.totalLeads) * 100}%` : "0%",
                    }}
                  />
                </div>
              </div>
            </Card>

            <Card className="bg-ink-card border-gold/20 p-6 hover:border-gold/40 transition-colors">
              <h3 className="text-gold font-semibold mb-4 text-sm">Projects Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gold/70">Active</span>
                  <span className="text-orange-400 font-semibold">{stats.activeProjects}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gold/70">Completed</span>
                  <span className="text-green-400 font-semibold">{stats.completedProjects}</span>
                </div>
                <div className="h-2 bg-gold/10 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-green-500"
                    style={{
                      width: stats.totalProjects > 0 ? `${(stats.completedProjects / stats.totalProjects) * 100}%` : "0%",
                    }}
                  />
                </div>
              </div>
            </Card>

            <Card className="bg-ink-card border-gold/20 p-6 hover:border-gold/40 transition-colors">
              <h3 className="text-gold font-semibold mb-4 text-sm">Payment Collection</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gold/70">Collected</span>
                  <span className="text-green-400 font-semibold">₹{(stats.paidAmount / 100000).toFixed(1)}L</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gold/70">Pending</span>
                  <span className="text-yellow-400 font-semibold">₹{(stats.pendingAmount / 100000).toFixed(1)}L</span>
                </div>
                <div className="h-2 bg-gold/10 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-yellow-500"
                    style={{
                      width: stats.totalAmount > 0 ? `${(stats.paidAmount / stats.totalAmount) * 100}%` : "0%",
                    }}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Items */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
            {/* Recent Leads */}
            <Card className="bg-ink-card border-gold/20 p-6">
              <h3 className="text-gold font-semibold mb-4 text-sm">📋 Recent Leads</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {recentLeads.length > 0 ? (
                  recentLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="flex items-center justify-between p-3 rounded bg-ink/50 hover:bg-ink/70 transition-colors border border-gold/10"
                    >
                      <div>
                        <p className="text-white text-sm font-medium">{lead.name}</p>
                        <p className="text-gold/60 text-xs">{lead.email}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          lead.status === "NEW"
                            ? "bg-blue-500/20 text-blue-400"
                            : lead.status === "CONVERTED"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gold/60 text-sm text-center py-4">No leads yet</p>
                )}
              </div>
              <Button
                onClick={() => (window.location.href = "/leads")}
                className="w-full mt-4 bg-gold/20 text-gold hover:bg-gold/30"
              >
                View All Leads →
              </Button>
            </Card>

            {/* Recent Projects */}
            <Card className="bg-ink-card border-gold/20 p-6">
              <h3 className="text-gold font-semibold mb-4 text-sm">🏗️ Recent Projects</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {recentProjects.length > 0 ? (
                  recentProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 rounded bg-ink/50 hover:bg-ink/70 transition-colors border border-gold/10"
                    >
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{project.name}</p>
                        {project.next_payment_date && (
                          <p className="text-gold/60 text-xs">
                            Payment: {new Date(project.next_payment_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ml-2 ${
                          project.status === "ACTIVE"
                            ? "bg-orange-500/20 text-orange-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gold/60 text-sm text-center py-4">No projects yet</p>
                )}
              </div>
              <Button
                onClick={() => (window.location.href = "/projects-crm")}
                className="w-full mt-4 bg-gold/20 text-gold hover:bg-gold/30"
              >
                View All Projects →
              </Button>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard-old")({
  component: DashboardComponent,
});

