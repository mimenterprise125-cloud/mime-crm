import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { useRefresh } from "@/lib/refresh-context";
import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sidebar } from "@/components/site/Sidebar";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { createLoadingGuard } from "@/lib/safe-async";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  project_type: string;
  source: string;
  created_at: string;
}

interface Project {
  id: string;
  name: string;
  status: string;
  total_with_gst: number;
  next_payment_date: string | null;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  project_id?: string;
  due_date: string;
  notes?: string;
}

function DashboardComponent() {
  const { userProfile, loading } = useAuth();
  const { onRefresh } = useRefresh();
  const [redirecting, setRedirecting] = useState(false);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [outstandingPayments, setOutstandingPayments] = useState<Payment[]>([]);
  const [dashLoading, setDashLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    quotationSent: 0,
    convertedLeads: 0,
    activeProjects: 0,
    completedProjects: 0,
    outstandingPayments: 0,
    totalPending: 0,
  });

  useEffect(() => {
    if (!loading && !userProfile) {
      setRedirecting(true);
      setTimeout(() => window.location.href = "/login", 1000);
    }
  }, [userProfile, loading]);

  useEffect(() => {
    if (userProfile) {
      fetchDashboardData();
    }
  }, [userProfile]);

  useEffect(() => {
    const unsubscribe = onRefresh(fetchDashboardData);
    return unsubscribe;
  }, [onRefresh]);

  const fetchDashboardData = async () => {
    try {
      setDashLoading(true);
      const newStats = {
        totalLeads: 0,
        newLeads: 0,
        quotationSent: 0,
        convertedLeads: 0,
        activeProjects: 0,
        completedProjects: 0,
        outstandingPayments: 0,
        totalPending: 0,
      };

      // Fetch recent leads
      const { data: leads } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (leads) {
        setRecentLeads(leads);
        newStats.totalLeads = leads.length;
        newStats.newLeads = leads.filter(l => l.status === "NEW").length;
        newStats.quotationSent = leads.filter(l => l.status === "QUOTATION_SENT").length;
        newStats.convertedLeads = leads.filter(l => l.status === "CONVERTED").length;
      }

      // Fetch recent projects
      const { data: projects } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (projects) {
        setRecentProjects(projects);
        newStats.activeProjects = projects.filter(p => p.status === "ACTIVE").length;
        newStats.completedProjects = projects.filter(p => p.status === "COMPLETED").length;
      }

      // Fetch outstanding payments - calculate from converted leads and their quotations
      let outstandingCount = 0;
      let outstandingAmount = 0;
      let paymentCards: Payment[] = [];
      
      try {
        // Get all converted leads
        const { data: convertedLeads } = await supabase
          .from("leads")
          .select("id, name")
          .eq("status", "CONVERTED");

        if (convertedLeads && convertedLeads.length > 0) {
          // Get their quotations
          const { data: quotations } = await supabase
            .from("quotations")
            .select("id, lead_id, total_with_gst")
            .in("lead_id", convertedLeads.map(l => l.id));

          if (quotations && quotations.length > 0) {
            // Get payment records for these leads
            const { data: payments } = await supabase
              .from("payment_history")
              .select("*")
              .in("lead_id", convertedLeads.map(l => l.id));

            // Calculate outstanding for each converted lead
            quotations.forEach(q => {
              const leadPayments = payments?.filter(p => p.lead_id === q.lead_id) || [];
              const totalPaid = leadPayments.reduce((sum, p) => sum + (p.amount_paid || 0), 0);
              const outstanding = q.total_with_gst - totalPaid;

              if (outstanding > 0) {
                outstandingCount++;
                outstandingAmount += outstanding;
                
                const leadName = convertedLeads.find(l => l.id === q.lead_id)?.name || "Unknown";
                paymentCards.push({
                  id: q.id,
                  amount: outstanding,
                  status: "PENDING",
                  due_date: new Date().toISOString(),
                  notes: `Outstanding for ${leadName} - Total: ₹${q.total_with_gst}, Paid: ₹${totalPaid}`,
                } as Payment);
              }
            });
          }
        }
      } catch (e) {
        console.log("Error calculating outstanding payments:", e);
      }

      setOutstandingPayments(paymentCards);
      newStats.outstandingPayments = outstandingCount;
      newStats.totalPending = outstandingAmount;

      setStats(newStats);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setDashLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ink via-ink/95 to-ink/90">
        <p className="text-gold">Loading...</p>
      </div>
    );
  }

  if (redirecting || !userProfile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink via-ink/95 to-ink/90">
      <Sidebar />

      <div className="md:ml-64">
        {/* Header */}
        <header className="border-b border-gold/10 bg-ink-dark/50 backdrop-blur-sm sticky top-0">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-display text-gold">Dashboard</h1>
            <p className="text-sm text-gold/60">Welcome, {userProfile?.full_name || "User"}</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-ink-dark border-gold/20 p-4 border">
              <p className="text-gold/60 text-xs uppercase">Total Leads</p>
              <p className="text-2xl font-bold text-gold mt-2">{stats.totalLeads}</p>
            </Card>
            <Card className="bg-ink-dark border-gold/20 p-4 border">
              <p className="text-gold/60 text-xs uppercase">New</p>
              <p className="text-2xl font-bold text-blue-400 mt-2">{stats.newLeads}</p>
            </Card>
            <Card className="bg-ink-dark border-gold/20 p-4 border">
              <p className="text-gold/60 text-xs uppercase">Quotation Sent</p>
              <p className="text-2xl font-bold text-orange-400 mt-2">{stats.quotationSent}</p>
            </Card>
            <Card className="bg-ink-dark border-gold/20 p-4 border">
              <p className="text-gold/60 text-xs uppercase">Converted</p>
              <p className="text-2xl font-bold text-green-400 mt-2">{stats.convertedLeads}</p>
            </Card>
          </div>

          {/* Projects & Payments Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Card className="bg-ink-dark border-gold/20 p-4 border">
              <p className="text-gold/60 text-xs uppercase">Active Projects</p>
              <p className="text-2xl font-bold text-green-400 mt-2">{stats.activeProjects}</p>
            </Card>
            <Card className="bg-ink-dark border-gold/20 p-4 border">
              <p className="text-gold/60 text-xs uppercase">Outstanding</p>
              <p className="text-2xl font-bold text-red-400 mt-2">₹{(stats.totalPending / 100000).toFixed(1)}L</p>
            </Card>
            <Card className="bg-ink-dark border-gold/20 p-4 border">
              <p className="text-gold/60 text-xs uppercase">Pending Payments</p>
              <p className="text-2xl font-bold text-yellow-400 mt-2">{stats.outstandingPayments}</p>
            </Card>
          </div>

          {/* Recent Leads */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gold mb-4">Recent Leads</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentLeads.slice(0, 6).map((lead) => (
                <Dialog key={lead.id}>
                  <DialogTrigger asChild>
                    <Card className="bg-ink-dark border-gold/20 p-4 border cursor-pointer hover:border-gold/50 transition">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gold">{lead.name}</h3>
                        <p className="text-white/70 text-sm">{lead.phone}</p>
                        <p className="text-gold/60 text-xs">{lead.email}</p>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-1 rounded ${
                            lead.status === "CONVERTED" ? "bg-green-500/20 text-green-400" :
                            lead.status === "QUOTATION_SENT" ? "bg-orange-500/20 text-orange-400" :
                            lead.status === "NEW" ? "bg-blue-500/20 text-blue-400" :
                            "bg-gray-500/20 text-gray-400"
                          }`}>
                            {lead.status}
                          </span>
                          <span className="text-xs text-gold/60">Click for details</span>
                        </div>
                      </div>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="bg-ink-dark border-gold/20 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-gold">{lead.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gold/60 text-xs uppercase">Email</p>
                          <p className="text-white">{lead.email}</p>
                        </div>
                        <div>
                          <p className="text-gold/60 text-xs uppercase">Phone</p>
                          <p className="text-white">{lead.phone}</p>
                        </div>
                        <div>
                          <p className="text-gold/60 text-xs uppercase">Project Type</p>
                          <p className="text-white">{lead.project_type || "—"}</p>
                        </div>
                        <div>
                          <p className="text-gold/60 text-xs uppercase">Source</p>
                          <p className="text-white">{lead.source}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button 
                          onClick={() => window.location.href = `mailto:${lead.email}`}
                          className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Email
                        </Button>
                        <Button 
                          onClick={() => window.location.href = `tel:${lead.phone}`}
                          className="flex-1 bg-green-600 text-white hover:bg-green-700"
                        >
                          Call
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>

          {/* Recent Projects */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gold mb-4">Recent Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentProjects.slice(0, 6).map((project) => (
                <Dialog key={project.id}>
                  <DialogTrigger asChild>
                    <Card className="bg-ink-dark border-gold/20 p-4 border cursor-pointer hover:border-gold/50 transition">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gold">{project.name}</h3>
                        <p className="text-gold text-lg font-bold">₹{project.total_with_gst}</p>
                        {project.next_payment_date && (
                          <p className="text-gold/60 text-xs">
                            Next Payment: {new Date(project.next_payment_date).toLocaleDateString()}
                          </p>
                        )}
                        <span className={`text-xs px-2 py-1 rounded inline-block ${
                          project.status === "ACTIVE" ? "bg-green-500/20 text-green-400" :
                          project.status === "COMPLETED" ? "bg-blue-500/20 text-blue-400" :
                          "bg-gray-500/20 text-gray-400"
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="bg-ink-dark border-gold/20 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-gold">{project.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gold/60 text-xs uppercase">Total Amount</p>
                          <p className="text-white text-lg font-bold">₹{project.total_with_gst}</p>
                        </div>
                        <div>
                          <p className="text-gold/60 text-xs uppercase">Status</p>
                          <p className="text-white">{project.status}</p>
                        </div>
                        {project.next_payment_date && (
                          <div className="col-span-2">
                            <p className="text-gold/60 text-xs uppercase">Next Payment</p>
                            <p className="text-white">{new Date(project.next_payment_date).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>

          {/* Outstanding Payments */}
          <div>
            <h2 className="text-xl font-semibold text-gold mb-4">Outstanding Payments</h2>
            {outstandingPayments.length === 0 ? (
              <Card className="bg-ink-dark border-gold/20 p-8 border text-center">
                <p className="text-gold/60">No outstanding payments</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {outstandingPayments.slice(0, 6).map((payment) => (
                  <Dialog key={payment.id}>
                    <DialogTrigger asChild>
                      <Card className="bg-ink-dark border-gold/20 p-4 border cursor-pointer hover:border-gold/50 transition">
                        <div className="space-y-2">
                          <p className="text-gold/60 text-xs uppercase">Amount Due</p>
                          <p className="text-red-400 text-2xl font-bold">₹{payment.amount?.toLocaleString() || "0"}</p>
                          {payment.due_date && (
                            <p className="text-gold/60 text-xs">
                              Due: {new Date(payment.due_date).toLocaleDateString()}
                            </p>
                          )}
                          <span className="text-xs px-2 py-1 rounded inline-block bg-red-500/20 text-red-400">
                            {payment.status || "PENDING"}
                          </span>
                        </div>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="bg-ink-dark border-gold/20 max-w-2xl !bg-ink-dark">
                      <DialogHeader>
                        <DialogTitle className="text-gold">Payment Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-gold/60 text-xs uppercase">Amount Due</p>
                            <p className="text-white text-lg font-bold">₹{payment.amount?.toLocaleString() || "0"}</p>
                          </div>
                          <div>
                            <p className="text-gold/60 text-xs uppercase">Status</p>
                            <p className="text-white">{payment.status || "PENDING"}</p>
                          </div>
                          {payment.due_date && (
                            <div className="col-span-2">
                              <p className="text-gold/60 text-xs uppercase">Due Date</p>
                              <p className="text-white">{new Date(payment.due_date).toLocaleDateString()}</p>
                            </div>
                          )}
                          {payment.notes && (
                            <div className="col-span-2">
                              <p className="text-gold/60 text-xs uppercase">Notes</p>
                              <p className="text-white">{payment.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard")({
  component: DashboardComponent,
});
