import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sidebar } from "@/components/site/Sidebar";

interface Project {
  id: string;
  name: string;
  lead_id: string;
  total_sqft?: number;
  rate_per_sqft?: number;
  final_amount: number;
  total_with_gst: number;
  status: string;
  created_at: string;
  next_payment_date?: string;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface Quotation {
  id: string;
  lead_id: string;
  total_sqft: number;
  rate_per_sqft: number;
  subtotal: number;
  gst_percentage: number;
  gst_amount: number;
  total_with_gst: number;
  profit_percentage: number;
  notes: string;
}

function ProjectsPageComponent() {
  const { userProfile, loading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [leadsMap, setLeadsMap] = useState<Map<string, Lead>>(new Map());
  const [quotationsMap, setQuotationsMap] = useState<Map<string, Quotation>>(new Map());
  const [loading2, setLoading2] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!loading && !userProfile) window.location.href = "/login";
  }, [userProfile, loading]);

  useEffect(() => {
    if (userProfile) {
      fetchData();
    }
  }, [userProfile]);

  const fetchData = async () => {
    try {
      // Fetch all projects
      const { data: projectsData } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (projectsData) setProjects(projectsData);

      // Fetch all converted leads
      const { data: leadsData } = await supabase.from("leads").select("*").eq("status", "CONVERTED");
      const leadsMap = new Map();
      leadsData?.forEach(lead => leadsMap.set(lead.id, lead));
      setLeadsMap(leadsMap);

      // Fetch all quotations
      const { data: quotationsData } = await supabase.from("quotations").select("*");
      const quotationsMap = new Map();
      quotationsData?.forEach(q => quotationsMap.set(q.lead_id, q));
      setQuotationsMap(quotationsMap);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading2(false);
    }
  };

  const updateProjectStatus = async (projectId: string, newStatus: string) => {
    try {
      await supabase.from("projects").update({ status: newStatus }).eq("id", projectId);
      setProjects(projects.map(p => p.id === projectId ? {...p, status: newStatus} : p));
      if (selectedProject?.id === projectId) setSelectedProject({...selectedProject, status: newStatus});
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const attendedProjects = projects.filter(p => ["ATTENDED", "COMPLETED", "IN_PROGRESS"].includes(p.status));
  const unattendedProjects = projects.filter(p => !["ATTENDED", "COMPLETED", "IN_PROGRESS"].includes(p.status));

  const statusColors: Record<string, string> = {
    ATTENDED: "bg-green-500/20 text-green-400",
    COMPLETED: "bg-blue-500/20 text-blue-400",
    IN_PROGRESS: "bg-yellow-500/20 text-yellow-400",
    PENDING: "bg-orange-500/20 text-orange-400",
    ON_HOLD: "bg-red-500/20 text-red-400",
    CANCELLED: "bg-gray-500/20 text-gray-400",
  };

  if (loading || loading2) return <div className="min-h-screen bg-gradient-to-br from-ink via-ink/95 to-ink/90 flex items-center justify-center"><p className="text-gold">Loading...</p></div>;
  if (!userProfile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink via-ink/95 to-ink/90">
      <Sidebar />
      <div className="md:ml-64">
        <header className="border-b border-gold/10 bg-ink-dark/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-display text-gold">Projects</h1>
            <p className="text-sm text-gold/60 mt-1">Manage attended and unattended projects</p>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-black border-gold/20 p-4"><p className="text-gold/60 text-xs">TOTAL</p><p className="text-2xl font-bold text-gold">{projects.length}</p></Card>
            <Card className="bg-black border-gold/20 p-4"><p className="text-gold/60 text-xs">ATTENDED</p><p className="text-2xl font-bold text-green-400">{attendedProjects.length}</p></Card>
            <Card className="bg-black border-gold/20 p-4"><p className="text-gold/60 text-xs">UNATTENDED</p><p className="text-2xl font-bold text-orange-400">{unattendedProjects.length}</p></Card>
            <Card className="bg-black border-gold/20 p-4"><p className="text-gold/60 text-xs">COMPLETED</p><p className="text-2xl font-bold text-blue-400">{projects.filter(p => p.status === "COMPLETED").length}</p></Card>
          </div>

          {/* Attended Projects */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gold mb-4">✅ Attended Projects ({attendedProjects.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {attendedProjects.length > 0 ? attendedProjects.map(project => {
                const lead = leadsMap.get(project.lead_id);
                const quotation = quotationsMap.get(project.lead_id);
                return (
                  <Dialog key={project.id} open={showModal && selectedProject?.id === project.id} onOpenChange={(open) => !open && setShowModal(false)}>
                    <DialogTrigger asChild>
                      <Card className="bg-black border-gold/20 p-4 cursor-pointer hover:border-gold/50 transition">
                        <div onClick={() => { setSelectedProject(project); setShowModal(true); }} className="space-y-2">
                          <h3 className="font-semibold text-gold">{project.name || "Project"}</h3>
                          <p className="text-white/80 text-sm">{lead?.name || "Unknown Lead"}</p>
                          <p className="text-gold/60 text-xs">{lead?.phone}</p>
                          <div className="flex justify-between items-center pt-2"><span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">{project.status}</span><span className="text-lg font-bold text-gold">₹{project.total_with_gst?.toLocaleString()}</span></div>
                        </div>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="bg-black border-gold/20 max-w-2xl">
                      <DialogHeader><DialogTitle className="text-gold">{project.name || "Project"}</DialogTitle></DialogHeader>
                      <div className="space-y-6">
                        {/* Lead Info */}
                        <div className="grid grid-cols-2 gap-4">
                          <div><p className="text-gold/60 text-xs uppercase">Lead Name</p><p className="text-white font-medium">{lead?.name}</p></div>
                          <div><p className="text-gold/60 text-xs uppercase">Phone</p><p className="text-white font-medium">{lead?.phone}</p></div>
                          <div><p className="text-gold/60 text-xs uppercase">Email</p><p className="text-white font-medium text-sm">{lead?.email}</p></div>
                          <div><p className="text-gold/60 text-xs uppercase">Total Amount</p><p className="text-gold font-bold text-lg">₹{project.total_with_gst?.toLocaleString()}</p></div>
                        </div>

                        {/* Status */}
                        <div>
                          <p className="text-gold/60 text-xs uppercase mb-2">Status</p>
                          <select value={project.status} onChange={(e) => { updateProjectStatus(project.id, e.target.value); }} className={`w-full px-3 py-2 rounded border border-gold/20 bg-ink text-white text-sm ${statusColors[project.status] || "text-white"}`}>
                            <option value="ATTENDED">ATTENDED</option>
                            <option value="IN_PROGRESS">IN PROGRESS</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="PENDING">PENDING</option>
                            <option value="ON_HOLD">ON HOLD</option>
                          </select>
                        </div>

                        {/* Quotation Info */}
                        {quotation && (
                          <div className="border-t border-gold/20 pt-4">
                            <h3 className="text-gold font-semibold mb-3">📊 Quotation Details</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between"><span className="text-gold/60">Sq Ft</span><span className="text-white">{quotation.total_sqft}</span></div>
                              <div className="flex justify-between"><span className="text-gold/60">Rate/SqFt</span><span className="text-white">₹{quotation.rate_per_sqft}</span></div>
                              <div className="flex justify-between"><span className="text-gold/60">Subtotal</span><span className="text-white">₹{quotation.subtotal?.toLocaleString()}</span></div>
                              <div className="flex justify-between"><span className="text-gold/60">GST ({quotation.gst_percentage}%)</span><span className="text-white">₹{quotation.gst_amount?.toLocaleString()}</span></div>
                              <div className="flex justify-between border-t border-gold/20 pt-2"><span className="text-gold/60">Total with GST</span><span className="text-gold font-bold">₹{quotation.total_with_gst?.toLocaleString()}</span></div>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-4 border-t border-gold/20">
                          <Button onClick={() => window.location.href = `tel:${lead?.phone}`} className="flex-1 bg-green-600 hover:bg-green-700 text-white">📞 Call</Button>
                          <Button onClick={() => window.location.href = `mailto:${lead?.email}`} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">📧 Email</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                );
              }) : <Card className="bg-black border-gold/20 p-8 text-center col-span-full"><p className="text-gold/60">No attended projects yet</p></Card>}
            </div>
          </div>

          {/* Unattended Projects */}
          <div>
            <h2 className="text-2xl font-semibold text-gold mb-4">⏳ Unattended Projects ({unattendedProjects.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unattendedProjects.length > 0 ? unattendedProjects.map(project => {
                const lead = leadsMap.get(project.lead_id);
                const quotation = quotationsMap.get(project.lead_id);
                return (
                  <Dialog key={project.id} open={showModal && selectedProject?.id === project.id} onOpenChange={(open) => !open && setShowModal(false)}>
                    <DialogTrigger asChild>
                      <Card className="bg-black border-gold/20 p-4 cursor-pointer hover:border-gold/50 transition opacity-75 hover:opacity-100">
                        <div onClick={() => { setSelectedProject(project); setShowModal(true); }} className="space-y-2">
                          <h3 className="font-semibold text-gold">{project.name || "Project"}</h3>
                          <p className="text-white/80 text-sm">{lead?.name || "Unknown Lead"}</p>
                          <p className="text-gold/60 text-xs">{lead?.phone}</p>
                          <div className="flex justify-between items-center pt-2"><span className={`text-xs px-2 py-1 rounded ${statusColors[project.status] || "bg-gray-500/20 text-gray-400"}`}>{project.status}</span><span className="text-lg font-bold text-gold">₹{project.total_with_gst?.toLocaleString()}</span></div>
                        </div>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="bg-black border-gold/20 max-w-2xl">
                      <DialogHeader><DialogTitle className="text-gold">{project.name || "Project"}</DialogTitle></DialogHeader>
                      <div className="space-y-6">
                        {/* Lead Info */}
                        <div className="grid grid-cols-2 gap-4">
                          <div><p className="text-gold/60 text-xs uppercase">Lead Name</p><p className="text-white font-medium">{lead?.name}</p></div>
                          <div><p className="text-gold/60 text-xs uppercase">Phone</p><p className="text-white font-medium">{lead?.phone}</p></div>
                          <div><p className="text-gold/60 text-xs uppercase">Email</p><p className="text-white font-medium text-sm">{lead?.email}</p></div>
                          <div><p className="text-gold/60 text-xs uppercase">Total Amount</p><p className="text-gold font-bold text-lg">₹{project.total_with_gst?.toLocaleString()}</p></div>
                        </div>

                        {/* Status */}
                        <div>
                          <p className="text-gold/60 text-xs uppercase mb-2">Status</p>
                          <select value={project.status} onChange={(e) => { updateProjectStatus(project.id, e.target.value); }} className={`w-full px-3 py-2 rounded border border-gold/20 bg-ink text-white text-sm ${statusColors[project.status] || "text-white"}`}>
                            <option value="ATTENDED">ATTENDED</option>
                            <option value="PENDING">PENDING</option>
                            <option value="ON_HOLD">ON HOLD</option>
                            <option value="CANCELLED">CANCELLED</option>
                            <option value="IN_PROGRESS">IN PROGRESS</option>
                          </select>
                        </div>

                        {/* Quotation Info */}
                        {quotation && (
                          <div className="border-t border-gold/20 pt-4">
                            <h3 className="text-gold font-semibold mb-3">📊 Quotation Details</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between"><span className="text-gold/60">Sq Ft</span><span className="text-white">{quotation.total_sqft}</span></div>
                              <div className="flex justify-between"><span className="text-gold/60">Rate/SqFt</span><span className="text-white">₹{quotation.rate_per_sqft}</span></div>
                              <div className="flex justify-between"><span className="text-gold/60">Subtotal</span><span className="text-white">₹{quotation.subtotal?.toLocaleString()}</span></div>
                              <div className="flex justify-between"><span className="text-gold/60">GST ({quotation.gst_percentage}%)</span><span className="text-white">₹{quotation.gst_amount?.toLocaleString()}</span></div>
                              <div className="flex justify-between border-t border-gold/20 pt-2"><span className="text-gold/60">Total with GST</span><span className="text-gold font-bold">₹{quotation.total_with_gst?.toLocaleString()}</span></div>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-4 border-t border-gold/20">
                          <Button onClick={() => window.location.href = `tel:${lead?.phone}`} className="flex-1 bg-green-600 hover:bg-green-700 text-white">📞 Call</Button>
                          <Button onClick={() => window.location.href = `mailto:${lead?.email}`} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">📧 Email</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                );
              }) : <Card className="bg-black border-gold/20 p-8 text-center col-span-full"><p className="text-gold/60">No unattended projects yet</p></Card>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/projects-crm")({ component: ProjectsPageComponent });
