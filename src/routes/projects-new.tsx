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
  total_amount: number;
  status: string;
  next_payment_date?: string;
  created_at: string;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: string;
}

function ProjectsPageComponent() {
  const { userProfile, loading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [leads, setLeads] = useState<Map<string, Lead>>(new Map());
  const [loading2, setLoading2] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!loading && !userProfile) window.location.href = "/login";
  }, [userProfile, loading]);

  useEffect(() => {
    if (userProfile) {
      fetchProjects();
      fetchLeads();
    }
  }, [userProfile]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading2(false);
    }
  };

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase.from("leads").select("*");
      if (error) throw error;
      const map = new Map();
      data?.forEach(lead => map.set(lead.id, lead));
      setLeads(map);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateProjectStatus = async (projectId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from("projects").update({ status: newStatus }).eq("id", projectId);
      if (error) throw error;
      fetchProjects();
      if (selectedProject?.id === projectId) setSelectedProject({...selectedProject, status: newStatus});
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  const attendedProjects = projects.filter(p => p.status === "ATTENDED");
  const unattendedProjects = projects.filter(p => p.status !== "ATTENDED");

  if (loading || loading2) return <div className="min-h-screen bg-gradient-to-br from-ink via-ink/95 to-ink/90 flex items-center justify-center"><p className="text-gold">Loading...</p></div>;
  if (!userProfile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink via-ink/95 to-ink/90">
      <Sidebar />
      <div className="md:ml-64">
        <header className="border-b border-gold/10 bg-ink-dark/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-display text-gold">Projects</h1>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-ink-card border-gold/20 p-4"><p className="text-gold/60 text-xs">Total</p><p className="text-2xl font-bold text-gold">{projects.length}</p></Card>
            <Card className="bg-ink-card border-gold/20 p-4"><p className="text-gold/60 text-xs">Attended</p><p className="text-2xl font-bold text-green-400">{attendedProjects.length}</p></Card>
            <Card className="bg-ink-card border-gold/20 p-4"><p className="text-gold/60 text-xs">Unattended</p><p className="text-2xl font-bold text-orange-400">{unattendedProjects.length}</p></Card>
            <Card className="bg-ink-card border-gold/20 p-4"><p className="text-gold/60 text-xs">Active</p><p className="text-2xl font-bold text-blue-400">{projects.filter(p => p.status === "ACTIVE").length}</p></Card>
          </div>

          {/* Attended Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gold mb-4">Attended Projects ({attendedProjects.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {attendedProjects.map(project => {
                const lead = leads.get(project.lead_id);
                return (
                  <Dialog key={project.id} open={showModal && selectedProject?.id === project.id} onOpenChange={(open) => !open && setShowModal(false)}>
                    <DialogTrigger asChild>
                      <Card className="bg-ink-card border-gold/20 p-4 cursor-pointer hover:border-gold/50 transition" onClick={() => { setSelectedProject(project); setShowModal(true); }}>
                        <h3 className="font-semibold text-gold">{project.name}</h3>
                        <p className="text-white/80 text-sm mt-1">{lead?.name}</p>
                        <p className="text-gold/60 text-xs">{lead?.phone}</p>
                        <div className="mt-3 flex justify-between"><span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">ATTENDED</span><span className="text-lg font-bold text-gold">₹{project.total_amount}</span></div>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="bg-ink-card border-gold/20 max-w-md">
                      <DialogHeader><DialogTitle className="text-gold">{project.name}</DialogTitle></DialogHeader>
                      <div className="space-y-4">
                        <div><p className="text-gold/60 text-xs">LEAD</p><p className="text-white">{lead?.name}</p></div>
                        <div><p className="text-gold/60 text-xs">CONTACT</p><p className="text-white">{lead?.phone}</p></div>
                        <div><p className="text-gold/60 text-xs">TOTAL AMOUNT</p><p className="text-2xl font-bold text-gold">₹{project.total_amount}</p></div>
                        <div><p className="text-gold/60 text-xs">STATUS</p><select value={project.status} onChange={(e) => { updateProjectStatus(project.id, e.target.value); }} className="w-full mt-1 px-2 py-1 text-sm rounded bg-ink border border-gold/20 text-white"><option value="ATTENDED">ATTENDED</option><option value="ACTIVE">ACTIVE</option><option value="COMPLETED">COMPLETED</option></select></div>
                      </div>
                    </DialogContent>
                  </Dialog>
                );
              })}
            </div>
          </div>

          {/* Unattended Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gold mb-4">Unattended Projects ({unattendedProjects.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unattendedProjects.map(project => {
                const lead = leads.get(project.lead_id);
                return (
                  <Dialog key={project.id} open={showModal && selectedProject?.id === project.id} onOpenChange={(open) => !open && setShowModal(false)}>
                    <DialogTrigger asChild>
                      <Card className="bg-ink-card border-gold/20 p-4 cursor-pointer hover:border-gold/50 transition opacity-75" onClick={() => { setSelectedProject(project); setShowModal(true); }}>
                        <h3 className="font-semibold text-gold">{project.name}</h3>
                        <p className="text-white/80 text-sm mt-1">{lead?.name}</p>
                        <p className="text-gold/60 text-xs">{lead?.phone}</p>
                        <div className="mt-3 flex justify-between"><span className="text-xs px-2 py-1 rounded bg-orange-500/20 text-orange-400">{project.status}</span><span className="text-lg font-bold text-gold">₹{project.total_amount}</span></div>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="bg-ink-card border-gold/20 max-w-md">
                      <DialogHeader><DialogTitle className="text-gold">{project.name}</DialogTitle></DialogHeader>
                      <div className="space-y-4">
                        <div><p className="text-gold/60 text-xs">LEAD</p><p className="text-white">{lead?.name}</p></div>
                        <div><p className="text-gold/60 text-xs">CONTACT</p><p className="text-white">{lead?.phone}</p></div>
                        <div><p className="text-gold/60 text-xs">TOTAL AMOUNT</p><p className="text-2xl font-bold text-gold">₹{project.total_amount}</p></div>
                        <div><p className="text-gold/60 text-xs">STATUS</p><select value={project.status} onChange={(e) => { updateProjectStatus(project.id, e.target.value); }} className="w-full mt-1 px-2 py-1 text-sm rounded bg-ink border border-gold/20 text-white"><option value="ATTENDED">ATTENDED</option><option value="ACTIVE">ACTIVE</option><option value="COMPLETED">COMPLETED</option></select></div>
                      </div>
                    </DialogContent>
                  </Dialog>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/projects-new")({ component: ProjectsPageComponent });
