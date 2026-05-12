import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sidebar } from "@/components/site/Sidebar";
import { toast } from "sonner";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  project_type: string;
  status: string;
  message: string;
  created_at: string;
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
  created_at: string;
}

interface QuotationHistory {
  id: string;
  quotation_id: string;
  field_name: string;
  old_value: string;
  new_value: string;
  change_notes: string;
  created_at: string;
}

function LeadsPageComponent() {
  const { userProfile, loading } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [modalLead, setModalLead] = useState<Lead | null>(null);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [quotationHistory, setQuotationHistory] = useState<QuotationHistory[]>([]);
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [showModalOpen, setShowModalOpen] = useState(false);

  const leadStatuses = ["NEW", "CONTACTED", "FOLLOW_UP", "SITE_VISIT", "QUOTATION_SENT", "NEGOTIATION", "CONVERTED", "LOST"];

  const [formData, setFormData] = useState({ name: "", phone: "", email: "", location: "", project_type: "", message: "" });
  const [quotationForm, setQuotationForm] = useState({ total_sqft: 0, rate_per_sqft: 0, gst_percentage: 18, profit_percentage: 0, notes: "" });

  useEffect(() => {
    if (!loading && !userProfile) window.location.href = "/login";
  }, [userProfile, loading]);

  useEffect(() => {
    if (userProfile) fetchLeads();
  }, [userProfile]);

  const fetchLeads = async () => {
    setLeadsLoading(true);
    try {
      const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setLeads(data || []);
      setLeadsLoading(false);
    } catch (error) {
      console.error("Error fetching leads:", error);
      setLeadsLoading(false);
    }
  };

  const fetchQuotationForLead = async (leadId: string) => {
    try {
      const { data, error } = await supabase.from("quotations").select("*").eq("lead_id", leadId).order("created_at", { ascending: false }).limit(1);
      if (error) throw error;
      if (data && data.length > 0) {
        setSelectedQuotation(data[0]);
        fetchQuotationHistory(data[0].id);
      } else {
        setSelectedQuotation(null);
        setQuotationHistory([]);
      }
    } catch (error) {
      console.error("Error fetching quotation:", error);
    }
  };

  const fetchQuotationHistory = async (quotationId: string) => {
    try {
      const { data, error } = await supabase.from("quotation_history").select("*").eq("quotation_id", quotationId).order("created_at", { ascending: false });
      if (error) throw error;
      setQuotationHistory(data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const handleSelectLead = (lead: Lead) => {
    setModalLead(lead);
    setShowModalOpen(true);
    fetchQuotationForLead(lead.id);
  };

  const handleCreateLead = async () => {
    if (!formData.name || !formData.phone) { toast.error("Name and phone required"); return; }
    try {
      const { error } = await supabase.from("leads").insert({ ...formData, created_by: userProfile?.id, status: "NEW" });
      if (error) throw error;
      setFormData({ name: "", phone: "", email: "", location: "", project_type: "", message: "" });
      setShowAddForm(false);
      fetchLeads();
      toast.success("Lead created successfully!");
    } catch (error: any) {
      toast.error("Error: " + error.message);
    }
  };

  const handleCreateQuotation = async () => {
    if (!selectedLead || quotationForm.total_sqft <= 0 || quotationForm.rate_per_sqft <= 0) { toast.error("Fill all fields"); return; }
    try {
      const subtotal = quotationForm.total_sqft * quotationForm.rate_per_sqft;
      const gstAmount = subtotal * (quotationForm.gst_percentage / 100);
      const totalWithGst = subtotal + gstAmount;
      const { error } = await supabase.from("quotations").insert({
        lead_id: selectedLead.id,
        total_sqft: quotationForm.total_sqft,
        rate_per_sqft: quotationForm.rate_per_sqft,
        subtotal,
        gst_percentage: quotationForm.gst_percentage,
        gst_amount: gstAmount,
        total_with_gst: totalWithGst,
        profit_percentage: quotationForm.profit_percentage,
        notes: quotationForm.notes,
        created_by: userProfile?.id,
        created_at: new Date().toISOString(),
      });
      if (error) throw error;
      setQuotationForm({ total_sqft: 0, rate_per_sqft: 0, gst_percentage: 18, profit_percentage: 0, notes: "" });
      setShowQuotationForm(false);
      fetchQuotationForLead(selectedLead.id);
      toast.success("Quotation created successfully!");
    } catch (error: any) {
      toast.error("Error: " + error.message);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from("leads").update({ status: newStatus, updated_at: new Date() }).eq("id", leadId);
      if (error) throw error;
      fetchLeads();
      if (selectedLead?.id === leadId) setSelectedLead({ ...selectedLead, status: newStatus });
      toast.success("Status updated!");
    } catch (error: any) {
      toast.error("Error: " + error.message);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      NEW: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      CONTACTED: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      FOLLOW_UP: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      SITE_VISIT: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      QUOTATION_SENT: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      NEGOTIATION: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      CONVERTED: "bg-green-500/20 text-green-400 border-green-500/30",
      LOST: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return colors[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || lead.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading || leadsLoading) return <div className="min-h-screen bg-gradient-to-br from-ink via-ink/95 to-ink/90 flex items-center justify-center"><p className="text-gold">Loading...</p></div>;
  if (!userProfile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink via-ink/95 to-ink/90">
      <Sidebar />
      <div className="md:ml-64">
        <header className="border-b border-gold/10 bg-ink-dark/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-display text-gold">Leads</h1>
              <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                <DialogTrigger asChild><Button className="bg-gold text-ink hover:bg-gold/90">+ Add Lead</Button></DialogTrigger>
                <DialogContent className="bg-ink-dark border-gold/20">
                  <DialogHeader><DialogTitle className="text-gold">Create New Lead</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <Input placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-ink border-gold/20 text-white" />
                    <Input placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="bg-ink border-gold/20 text-white" />
                    <Input placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="bg-ink border-gold/20 text-white" />
                    <Input placeholder="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="bg-ink border-gold/20 text-white" />
                    <Input placeholder="Project Type" value={formData.project_type} onChange={(e) => setFormData({...formData, project_type: e.target.value})} className="bg-ink border-gold/20 text-white" />
                    <textarea placeholder="Message" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full bg-ink border border-gold/20 text-white rounded p-2" rows={3} />
                    <Button onClick={handleCreateLead} className="w-full bg-gold text-ink hover:bg-gold/90">Create</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex gap-4 flex-wrap">
              <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 min-w-[200px] bg-ink border-gold/20 text-white" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 bg-ink border border-gold/20 text-white rounded text-sm">
                <option value="ALL">All Status</option>
                {leadStatuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-ink-dark border-gold/20 p-4"><p className="text-gold/60 text-xs">Total</p><p className="text-2xl font-bold text-gold">{leads.length}</p></Card>
            <Card className="bg-ink-dark border-gold/20 p-4"><p className="text-gold/60 text-xs">New</p><p className="text-2xl font-bold text-blue-400">{leads.filter(l => l.status === "NEW").length}</p></Card>
            <Card className="bg-ink-dark border-gold/20 p-4"><p className="text-gold/60 text-xs">Pipeline</p><p className="text-2xl font-bold text-yellow-400">{leads.filter(l => ["CONTACTED", "FOLLOW_UP", "SITE_VISIT", "QUOTATION_SENT"].includes(l.status)).length}</p></Card>
            <Card className="bg-ink-dark border-gold/20 p-4"><p className="text-gold/60 text-xs">Converted</p><p className="text-2xl font-bold text-green-400">{leads.filter(l => l.status === "CONVERTED").length}</p></Card>
          </div>

          {/* Lead Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLeads.map(lead => (
              <Dialog key={lead.id} open={showModalOpen && modalLead?.id === lead.id} onOpenChange={(open) => !open && setShowModalOpen(false)}>
                <DialogTrigger asChild>
                  <Card className="bg-ink-dark border-gold/20 p-4 cursor-pointer hover:border-gold/50 transition transform hover:scale-105" onClick={() => handleSelectLead(lead)}>
                    <h3 className="font-semibold text-gold mb-2">{lead.name}</h3>
                    <p className="text-white/80 text-sm">{lead.phone}</p>
                    <p className="text-gold/60 text-xs mt-1">{lead.email}</p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(lead.status)}`}>{lead.status}</span>
                      <span className="text-xs text-gold/40">{lead.location}</span>
                    </div>
                  </Card>
                </DialogTrigger>

                <DialogContent className="bg-ink-dark border-gold/20 max-w-2xl">
                  <DialogHeader><DialogTitle className="text-gold">{lead.name}</DialogTitle></DialogHeader>
                  <div className="space-y-6">
                    {/* Lead Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div><p className="text-gold/60 text-xs uppercase">Email</p><p className="text-white">{lead.email}</p></div>
                      <div><p className="text-gold/60 text-xs uppercase">Phone</p><p className="text-white">{lead.phone}</p></div>
                      <div><p className="text-gold/60 text-xs uppercase">Location</p><p className="text-white">{lead.location || "—"}</p></div>
                      <div><p className="text-gold/60 text-xs uppercase">Project Type</p><p className="text-white">{lead.project_type || "—"}</p></div>
                    </div>

                    {lead.message && (<div><p className="text-gold/60 text-xs uppercase">Message</p><p className="text-white/80">{lead.message}</p></div>)}

                    {/* Status Update */}
                    <div><p className="text-gold/60 text-xs uppercase">Status</p><select value={lead.status} onChange={(e) => { updateLeadStatus(lead.id, e.target.value); setModalLead({...lead, status: e.target.value}); }} className="w-full mt-1 px-3 py-2 rounded border border-gold/20 bg-ink text-white"><>{leadStatuses.map(s => <option key={s} value={s}>{s}</option>)}</></select></div>

                    {/* Action Buttons */}
                    <div className="flex gap-2"><Button onClick={() => window.location.href = `mailto:${lead.email}`} className="flex-1 bg-blue-600 hover:bg-blue-700">Email</Button><Button onClick={() => window.location.href = `tel:${lead.phone}`} className="flex-1 bg-green-600 hover:bg-green-700">Call</Button></div>

                    {/* Quotation Section */}
                    {["QUOTATION_SENT", "NEGOTIATION", "CONVERTED"].includes(lead.status) && (
                      <>
                        {selectedQuotation && modalLead?.id === lead.id ? (
                          <div className="border-t border-gold/20 pt-4">
                            <div className="flex justify-between items-center mb-4"><h4 className="text-gold font-semibold">Quotation Details</h4><Button className="text-xs bg-orange-600 hover:bg-orange-700 h-8">Edit</Button></div>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div><p className="text-gold/60 text-xs">Sq.Ft</p><p className="font-bold text-white">{selectedQuotation.total_sqft}</p></div>
                              <div><p className="text-gold/60 text-xs">Rate/Sq.Ft</p><p className="font-bold text-white">₹{selectedQuotation.rate_per_sqft}</p></div>
                              <div><p className="text-gold/60 text-xs">Subtotal</p><p className="text-white">₹{selectedQuotation.subtotal}</p></div>
                              <div><p className="text-gold/60 text-xs">GST ({selectedQuotation.gst_percentage}%)</p><p className="text-white">₹{selectedQuotation.gst_amount}</p></div>
                              <div className="col-span-2"><p className="text-gold/60 text-xs">TOTAL</p><p className="text-2xl font-bold text-gold">₹{selectedQuotation.total_with_gst}</p></div>
                            </div>
                            {quotationHistory.length > 0 && (<div><p className="text-gold text-xs font-semibold mb-2">History</p><div className="space-y-1 max-h-32 overflow-y-auto">{quotationHistory.map(h => <div key={h.id} className="text-xs border-l border-gold/30 pl-2"><p className="text-gold">{h.field_name}: {h.old_value} → {h.new_value}</p></div>)}</div></div>)}
                          </div>
                        ) : (
                          <Dialog open={showQuotationForm && modalLead?.id === lead.id} onOpenChange={setShowQuotationForm}>
                            <DialogTrigger asChild><Button className="w-full bg-orange-600 hover:bg-orange-700">+ Add Quotation</Button></DialogTrigger>
                            <DialogContent className="bg-ink-dark border-gold/20"><DialogHeader><DialogTitle className="text-gold">Create Quotation</DialogTitle></DialogHeader><div className="space-y-3"><div><label className="text-gold text-xs">Sq.Ft *</label><Input type="number" value={quotationForm.total_sqft || ""} onChange={(e) => setQuotationForm({...quotationForm, total_sqft: parseFloat(e.target.value) || 0})} className="bg-ink border-gold/20 text-white text-sm mt-1" /></div><div><label className="text-gold text-xs">Rate/Sq.Ft *</label><Input type="number" value={quotationForm.rate_per_sqft || ""} onChange={(e) => setQuotationForm({...quotationForm, rate_per_sqft: parseFloat(e.target.value) || 0})} className="bg-ink border-gold/20 text-white text-sm mt-1" /></div><div><label className="text-gold text-xs">GST %</label><Input type="number" value={quotationForm.gst_percentage} onChange={(e) => setQuotationForm({...quotationForm, gst_percentage: parseFloat(e.target.value) || 18})} className="bg-ink border-gold/20 text-white text-sm mt-1" /></div><div><label className="text-gold text-xs">Profit %</label><Input type="number" value={quotationForm.profit_percentage} onChange={(e) => setQuotationForm({...quotationForm, profit_percentage: parseFloat(e.target.value) || 0})} className="bg-ink border-gold/20 text-white text-sm mt-1" /></div><div><label className="text-gold text-xs">Notes</label><textarea value={quotationForm.notes} onChange={(e) => setQuotationForm({...quotationForm, notes: e.target.value})} className="w-full bg-ink border border-gold/20 text-white rounded p-2 text-sm mt-1" rows={2} /></div><Button onClick={handleCreateQuotation} className="w-full bg-gold text-ink hover:bg-gold/90 text-sm">Create Quotation</Button></div></DialogContent>
                          </Dialog>
                        )}
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/leads")({ component: LeadsPageComponent });
