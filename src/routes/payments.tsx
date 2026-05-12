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
  status: string;
}

interface Quotation {
  id: string;
  lead_id: string;
  total_with_gst: number;
}

interface Payment {
  id: string;
  lead_id: string;
  amount: number;
  amount_paid: number;
  payment_date: string;
  payment_method?: string;
  reference_number?: string;
  notes?: string;
}

function PaymentsPageComponent() {
  const { userProfile, loading } = useAuth();
  const [convertedLeads, setConvertedLeads] = useState<Lead[]>([]);
  const [quotationsMap, setQuotationsMap] = useState<Map<string, Quotation>>(new Map());
  const [paymentsMap, setPaymentsMap] = useState<Map<string, Payment[]>>(new Map());
  const [loading2, setLoading2] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ amount: "", payment_date: "", method: "TRANSFER" });

  useEffect(() => {
    if (!loading && !userProfile) window.location.href = "/login";
  }, [userProfile, loading]);

  useEffect(() => {
    if (userProfile) {
      fetchData();
    }
  }, [userProfile]);

  const fetchData = async () => {
    setLoading2(true);
    try {
      // Fetch converted leads
      const { data: leadsData } = await supabase.from("leads").select("*").eq("status", "CONVERTED");
      setConvertedLeads(leadsData || []);

      // Fetch quotations
      const { data: quotationsData } = await supabase.from("quotations").select("id, lead_id, total_with_gst");
      const quotationsMap = new Map();
      quotationsData?.forEach(q => quotationsMap.set(q.lead_id, q));
      setQuotationsMap(quotationsMap);

      // Fetch payments (if table exists, otherwise create empty map)
      try {
        const { data: paymentsData } = await supabase.from("payment_history").select("*");
        const paymentsMap = new Map<string, Payment[]>();
        paymentsData?.forEach(p => {
          const leadPayments = paymentsMap.get(p.lead_id) || [];
          leadPayments.push(p);
          paymentsMap.set(p.lead_id, leadPayments);
        });
        setPaymentsMap(paymentsMap);
      } catch (e) {
        setPaymentsMap(new Map());
      }
      setLoading2(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading2(false);
    }
  };

  const addPayment = async (leadId: string) => {
    if (!paymentForm.amount) {
      toast.error("Please enter payment amount");
      return;
    }

    try {
      const paymentRecord = {
        lead_id: leadId,
        amount_paid: Number(paymentForm.amount),
        payment_date: paymentForm.payment_date || new Date().toISOString().split('T')[0],
        payment_method: paymentForm.method,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("payment_history").insert([paymentRecord]);
      
      if (error) {
        toast.error("Failed to record payment: " + error.message);
        return;
      }

      setPaymentForm({ amount: "", payment_date: "", method: "TRANSFER" });
      setShowPaymentForm(false);
      toast.success("Payment recorded successfully!");
      
      // Refresh data after short delay to ensure DB is updated
      setTimeout(() => {
        fetchData();
      }, 500);
    } catch (error: any) {
      toast.error("Error: " + error.message);
    }
  };

  const getPaymentStats = (leadId: string) => {
    const quotation = quotationsMap.get(leadId);
    const payments = paymentsMap.get(leadId) || [];
    const totalAmount = quotation?.total_with_gst || 0;
    const paidAmount = payments.reduce((sum, p) => sum + (p.amount || p.amount_paid || 0), 0);
    const remaining = totalAmount - paidAmount;
    const percentage = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;

    return { totalAmount, paidAmount, remaining, percentage, payments };
  };

  if (loading || loading2) return <div className="min-h-screen bg-gradient-to-br from-ink via-ink/95 to-ink/90 flex items-center justify-center"><p className="text-gold">Loading...</p></div>;
  if (!userProfile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink via-ink/95 to-ink/90">
      <Sidebar />
      <div className="md:ml-64">
        <header className="border-b border-gold/10 bg-ink-dark/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-display text-gold">Payments</h1>
            <p className="text-sm text-gold/60 mt-1">Track payments and outstanding amounts</p>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-ink-dark border-gold/20 p-4">
              <p className="text-gold/60 text-xs">TOTAL LEADS</p>
              <p className="text-2xl font-bold text-gold">{convertedLeads.length}</p>
            </Card>
            <Card className="bg-ink-dark border-gold/20 p-4">
              <p className="text-gold/60 text-xs">TOTAL QUOTED</p>
              <p className="text-2xl font-bold text-gold">₹{Array.from(quotationsMap.values()).reduce((sum, q) => sum + (q.total_with_gst || 0), 0).toLocaleString()}</p>
            </Card>
            <Card className="bg-ink-dark border-gold/20 p-4">
              <p className="text-gold/60 text-xs">TOTAL PAID</p>
              <p className="text-2xl font-bold text-green-400">₹{Array.from(paymentsMap.values()).flat().reduce((sum, p) => sum + (p.amount || p.amount_paid || 0), 0).toLocaleString()}</p>
            </Card>
            <Card className="bg-ink-dark border-gold/20 p-4">
              <p className="text-gold/60 text-xs">OUTSTANDING</p>
              <p className="text-2xl font-bold text-orange-400">₹{convertedLeads.reduce((sum, lead) => sum + getPaymentStats(lead.id).remaining, 0).toLocaleString()}</p>
            </Card>
          </div>

          {/* Payment Cards Grid */}
          <h2 className="text-2xl font-semibold text-gold mb-4">Converted Leads with Payment Tracking</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {convertedLeads.map(lead => {
              const { totalAmount, paidAmount, remaining, percentage } = getPaymentStats(lead.id);
              return (
                <Dialog key={lead.id} open={showModal && selectedLead?.id === lead.id} onOpenChange={(open) => !open && setShowModal(false)}>
                  <DialogTrigger asChild>
                    <Card className="bg-ink-dark border-gold/20 p-4 cursor-pointer hover:border-gold/50 transition">
                      <div onClick={() => { setSelectedLead(lead); setShowModal(true); }} className="space-y-3">
                        <h3 className="font-semibold text-gold">{lead.name}</h3>
                        <p className="text-white/80 text-sm">{lead.phone}</p>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs"><span className="text-gold/60">Total Quoted</span><span className="text-white">₹{totalAmount.toLocaleString()}</span></div>
                          <div className="flex justify-between text-xs"><span className="text-gold/60">Paid</span><span className="text-green-400">₹{paidAmount.toLocaleString()}</span></div>
                          <div className="flex justify-between text-xs"><span className="text-gold/60">Remaining</span><span className="text-orange-400">₹{remaining.toLocaleString()}</span></div>
                        </div>
                        <div className="w-full bg-ink/50 rounded-full h-2 mt-2"><div className="bg-gold h-2 rounded-full transition" style={{ width: `${Math.min(percentage, 100)}%` }}></div></div>
                        <p className="text-xs text-gold/60">{Math.round(percentage)}% paid</p>
                      </div>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="bg-ink-dark border-gold/20 max-w-2xl max-h-[90vh] overflow-y-auto !bg-ink-dark">
                    <DialogHeader><DialogTitle className="text-gold">{lead.name} - Payment Details</DialogTitle></DialogHeader>
                    <div className="space-y-6">
                      {/* Lead Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-gold/60 text-xs uppercase">Name</p><p className="text-white font-medium">{lead.name}</p></div>
                        <div><p className="text-gold/60 text-xs uppercase">Phone</p><p className="text-white font-medium">{lead.phone}</p></div>
                        <div><p className="text-gold/60 text-xs uppercase">Email</p><p className="text-white text-sm">{lead.email}</p></div>
                        <div><p className="text-gold/60 text-xs uppercase">Status</p><p className="text-green-400 font-medium">CONVERTED</p></div>
                      </div>

                      {/* Quotation Summary */}
                      {quotationsMap.get(lead.id) && (
                        <div className="border-t border-gold/20 pt-4">
                          <h3 className="text-gold font-semibold mb-2">📊 Quotation Amount</h3>
                          <p className="text-3xl font-bold text-gold">₹{getPaymentStats(lead.id).totalAmount.toLocaleString()}</p>
                        </div>
                      )}

                      {/* Payment Summary */}
                      <div className="border-t border-gold/20 pt-4">
                        <h3 className="text-gold font-semibold mb-3">💰 Payment Summary</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between"><span className="text-gold/60">Total Quoted</span><span className="text-white font-medium">₹{getPaymentStats(lead.id).totalAmount.toLocaleString()}</span></div>
                          <div className="flex justify-between"><span className="text-gold/60">Amount Paid</span><span className="text-green-400 font-medium">₹{getPaymentStats(lead.id).paidAmount.toLocaleString()}</span></div>
                          <div className="border-t border-gold/20 pt-2"></div>
                          <div className="flex justify-between"><span className="text-gold/60">Outstanding</span><span className="text-orange-400 font-bold text-lg">₹{getPaymentStats(lead.id).remaining.toLocaleString()}</span></div>
                        </div>
                        <div className="w-full bg-ink/50 rounded-full h-3 mt-4"><div className="bg-gold h-3 rounded-full transition" style={{ width: `${Math.min(getPaymentStats(lead.id).percentage, 100)}%` }}></div></div>
                        <p className="text-center text-xs text-gold/60 mt-2">{Math.round(getPaymentStats(lead.id).percentage)}% paid</p>
                      </div>

                      {/* Payment History */}
                      {getPaymentStats(lead.id).payments.length > 0 && (
                        <div className="border-t border-gold/20 pt-4">
                          <h3 className="text-gold font-semibold mb-3">📝 Payment History</h3>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {getPaymentStats(lead.id).payments
                              .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime())
                              .map((payment) => (
                                <div key={`${payment.id}-${payment.payment_date}`} className="border-l-2 border-gold/30 pl-3 py-2 text-sm">
                                  <div className="flex justify-between"><span className="text-gold font-semibold">₹{(payment.amount || payment.amount_paid || 0).toLocaleString()}</span><span className="text-gold/60">{new Date(payment.payment_date).toLocaleDateString()}</span></div>
                                  {payment.payment_method && <p className="text-white/70 text-xs mt-1">Method: {payment.payment_method}</p>}
                                  {payment.reference_number && <p className="text-white/70 text-xs">Ref: {payment.reference_number}</p>}
                                  {payment.notes && <p className="text-white/70 text-xs">{payment.notes}</p>}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Add Payment Form */}
                      <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
                        <DialogTrigger asChild>
                          <Button className="w-full bg-green-600 hover:bg-green-700 text-white">+ Add Payment</Button>
                        </DialogTrigger>
                        <DialogContent className="bg-ink-dark border-gold/20 max-w-sm !bg-ink-dark">
                          <DialogHeader><DialogTitle className="text-gold">Record Payment for {lead.name}</DialogTitle></DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <p className="text-gold/60 text-xs uppercase mb-2">Amount (₹)</p>
                              <Input type="number" placeholder="Enter payment amount" value={paymentForm.amount} onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})} className="bg-ink border-gold/20 text-white" />
                            </div>
                            <div>
                              <p className="text-gold/60 text-xs uppercase mb-2">Payment Date</p>
                              <Input type="date" value={paymentForm.payment_date} onChange={(e) => setPaymentForm({...paymentForm, payment_date: e.target.value})} className="bg-ink border-gold/20 text-white" />
                            </div>
                            <div>
                              <p className="text-gold/60 text-xs uppercase mb-2">Method</p>
                              <select value={paymentForm.method} onChange={(e) => setPaymentForm({...paymentForm, method: e.target.value})} className="w-full px-3 py-2 rounded bg-ink border border-gold/20 text-white text-sm"><option value="TRANSFER">Bank Transfer</option><option value="CASH">Cash</option><option value="CHEQUE">Cheque</option><option value="UPI">UPI</option></select>
                            </div>
                            <Button onClick={() => addPayment(lead.id)} className="w-full bg-gold text-ink hover:bg-gold/90">Record Payment</Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4 border-t border-gold/20">
                        <Button onClick={() => window.location.href = `tel:${lead.phone}`} className="flex-1 bg-green-600 hover:bg-green-700 text-white">📞 Call</Button>
                        <Button onClick={() => window.location.href = `mailto:${lead.email}`} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">📧 Email</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              );
            })}
          </div>

          {convertedLeads.length === 0 && (
            <Card className="bg-ink-dark border-gold/20 p-8 text-center">
              <p className="text-gold/60">No converted leads yet. Convert some leads to see payment tracking.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/payments")({
  component: PaymentsPageComponent,
});
