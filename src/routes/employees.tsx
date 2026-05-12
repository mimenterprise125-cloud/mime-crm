import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRefresh } from "@/lib/refresh-context";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Sidebar } from "@/components/site/Sidebar";
import { toast } from "sonner";

interface Employee {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  created_at: string;
}

interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  status: string;
  notes: string;
  employee_name?: string;
}

interface MonthlyStats {
  present: number;
  absent: number;
  leave: number;
  total: number;
}

function EmployeesPageComponent() {
  const { userProfile, loading } = useAuth();
  const { onRefresh } = useRefresh();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("employees");
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [showAttendanceSummary, setShowAttendanceSummary] = useState(false);
  const [selectedEmployeeForSummary, setSelectedEmployeeForSummary] = useState<Employee | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showQuickMark, setShowQuickMark] = useState(false);
  const [quickMarkDate, setQuickMarkDate] = useState<string>("");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: "",
  });
  const [attendanceData, setAttendanceData] = useState({
    employee_id: "",
    date: new Date(),
    status: "PRESENT",
    notes: "",
  });
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !userProfile) {
      window.location.href = "/login";
    }
  }, [userProfile, loading]);

  useEffect(() => {
    if (userProfile) {
      fetchEmployees();
      fetchAttendance();
    }
  }, [userProfile]);

  useEffect(() => {
    const unsubscribe = onRefresh(() => {
      fetchEmployees();
      fetchAttendance();
    });
    return unsubscribe;
  }, [onRefresh]);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEmployees(data || []);
      setFilteredEmployees(data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to fetch employees");
    } finally {
      setEmployeesLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      const { data, error } = await supabase
        .from("attendance")
        .select("id, employee_id, date, status, notes, employees(full_name)")
        .order("date", { ascending: false })
        .limit(100);

      if (error) throw error;
      
      // Enrich attendance with employee names - try from joined data first, then from local employees array
      const enrichedAttendance = (data || []).map((record: any) => {
        let employeeName = record.employees?.full_name || "Unknown";
        
        // If still unknown, try to find from employees array
        if (employeeName === "Unknown" && employees.length > 0) {
          const emp = employees.find(e => e.id === record.employee_id);
          employeeName = emp?.full_name || "Unknown";
        }
        
        return {
          ...record,
          employee_name: employeeName
        };
      });
      
      setAttendance(enrichedAttendance);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast.error("Failed to fetch attendance");
    }
  };

  useEffect(() => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(
        (emp) =>
          emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.phone.includes(searchTerm)
      );
    }

    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  const handleCreateEmployee = async () => {
    if (!formData.full_name || !formData.phone) {
      toast.error("Name and phone are required");
      return;
    }

    try {
      const email = formData.email || `${formData.full_name.toLowerCase().replace(" ", ".")}@mim.com`;

      const { error } = await supabase.from("employees").insert({
        full_name: formData.full_name,
        email: email,
        phone: formData.phone,
        role: formData.role,
        created_by: userProfile?.id,
        status: "ACTIVE",
      });

      if (error) throw error;

      setFormData({
        full_name: "",
        email: "",
        phone: "",
        role: "",
      });
      setShowForm(false);
      toast.success("Employee added successfully!");
      fetchEmployees();
    } catch (error: any) {
      toast.error("Error adding employee: " + error.message);
    }
  };

  const handleMarkAttendance = async () => {
    if (!attendanceData.employee_id) {
      toast.error("Please select an employee");
      return;
    }

    try {
      const dateStr = attendanceData.date.toISOString().split("T")[0];

      // Delete existing attendance for this date if any
      await supabase
        .from("attendance")
        .delete()
        .match({
          employee_id: attendanceData.employee_id,
          date: dateStr,
        });

      // Insert new record
      const { error } = await supabase.from("attendance").insert({
        employee_id: attendanceData.employee_id,
        date: dateStr,
        status: attendanceData.status,
        notes: attendanceData.notes,
        marked_by: userProfile?.id,
      });

      if (error) throw error;

      setAttendanceData({
        employee_id: "",
        date: new Date(),
        status: "PRESENT",
        notes: "",
      });
      setShowAttendanceForm(false);
      toast.success("Attendance marked successfully!");
      await fetchAttendance();
    } catch (error: any) {
      toast.error("Error marking attendance: " + error.message);
    }
  };

  const deleteEmployee = async (employeeId: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      try {
        const { error } = await supabase.from("employees").delete().eq("id", employeeId);

        if (error) throw error;
        toast.success("Employee deleted successfully!");
        fetchEmployees();
      } catch (error: any) {
        toast.error("Error deleting employee: " + error.message);
      }
    }
  };

  const getMonthlyStats = (employee: Employee, month: Date): MonthlyStats => {
    const monthStart = new Date(month.getFullYear(), month.getMonth(), 1).toISOString().split("T")[0];
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0).toISOString().split("T")[0];

    const monthRecords = attendance.filter(
      (a) => a.employee_id === employee.id && a.date >= monthStart && a.date <= monthEnd
    );

    return {
      present: monthRecords.filter(a => a.status === "PRESENT").length,
      absent: monthRecords.filter(a => a.status === "ABSENT").length,
      leave: monthRecords.filter(a => a.status === "LEAVE").length,
      total: monthRecords.length,
    };
  };

  const getAttendanceColor = (status: string) => {
    const colors: Record<string, string> = {
      PRESENT: "bg-green-500/20 text-green-400 border-green-500/30",
      ABSENT: "bg-red-500/20 text-red-400 border-red-500/30",
      LEAVE: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    };
    return colors[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const presentToday = attendance.filter(
    (a) => a.date === new Date().toISOString().split("T")[0] && a.status === "PRESENT"
  ).length;

  const absentToday = attendance.filter(
    (a) => a.date === new Date().toISOString().split("T")[0] && a.status === "ABSENT"
  ).length;

  const onLeaveToday = attendance.filter(
    (a) => a.date === new Date().toISOString().split("T")[0] && a.status === "LEAVE"
  ).length;

  if (loading || employeesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ink via-ink/95 to-ink/90 flex items-center justify-center">
        <p className="text-gold">Loading...</p>
      </div>
    );
  }

  if (!userProfile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink via-ink/95 to-ink/90">
      <Sidebar />
      
      <div className="md:ml-64">
      {/* Header */}
      <header className="border-b border-gold/10 bg-ink-dark/50 backdrop-blur-sm sticky top-0">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-display text-gold">Employees Management</h1>
              <p className="text-sm text-gold/60">Manage staff and track attendance</p>
            </div>
            {activeTab === "employees" ? (
              <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogTrigger asChild>
                  <Button className="bg-gold text-ink hover:bg-gold/90">+ Add Employee</Button>
                </DialogTrigger>
                <DialogContent className="!bg-ink-dark border-gold/20 max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-gold">Add New Employee</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Full Name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="bg-ink border-gold/20 text-white"
                    />
                    <Input
                      placeholder="Email (Optional)"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-ink border-gold/20 text-white"
                    />
                    <Input
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-ink border-gold/20 text-white"
                    />
                    <Input
                      placeholder="Role (e.g., Technician, Manager)"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="bg-ink border-gold/20 text-white"
                    />
                    <Button
                      onClick={handleCreateEmployee}
                      className="w-full bg-gold text-ink hover:bg-gold/90"
                    >
                      Add Employee
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Dialog open={showAttendanceForm} onOpenChange={setShowAttendanceForm}>
                <DialogTrigger asChild>
                  <Button className="bg-gold text-ink hover:bg-gold/90">Mark Attendance</Button>
                </DialogTrigger>
                <DialogContent className="!bg-ink-dark border-gold/20 max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-gold">Mark Attendance</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <select
                      value={attendanceData.employee_id}
                      onChange={(e) =>
                        setAttendanceData({ ...attendanceData, employee_id: e.target.value })
                      }
                      className="w-full bg-ink border border-gold/20 text-white rounded p-2"
                    >
                      <option value="">Select Employee</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.full_name}
                        </option>
                      ))}
                    </select>

                    <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-ink border border-gold/20 text-gold hover:bg-ink-dark">
                          {attendanceData.date.toLocaleDateString()} (Today Only)
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="!bg-ink-dark border-gold/20 max-w-sm">
                        <DialogHeader>
                          <DialogTitle className="text-gold">Select Today</DialogTitle>
                        </DialogHeader>
                        <div className="flex justify-center">
                          <Calendar
                            mode="single"
                            selected={new Date()}
                            disabled={(date) => {
                              const today = new Date();
                              return date.toDateString() !== today.toDateString();
                            }}
                            onSelect={(date) => {
                              if (date) {
                                setAttendanceData({ ...attendanceData, date });
                                setCalendarOpen(false);
                              }
                            }}
                            className="text-white"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>

                    <select
                      value={attendanceData.status}
                      onChange={(e) =>
                        setAttendanceData({ ...attendanceData, status: e.target.value })
                      }
                      className="w-full bg-ink border border-gold/20 text-white rounded p-2"
                    >
                      <option value="PRESENT">Present</option>
                      <option value="ABSENT">Absent</option>
                      <option value="LEAVE">Leave</option>
                    </select>

                    <textarea
                      placeholder="Notes (Optional)"
                      value={attendanceData.notes}
                      onChange={(e) =>
                        setAttendanceData({ ...attendanceData, notes: e.target.value })
                      }
                      className="w-full bg-ink border border-gold/20 text-white rounded p-2"
                      rows={2}
                    />

                    <Button
                      onClick={handleMarkAttendance}
                      className="w-full bg-gold text-ink hover:bg-gold/90"
                    >
                      Mark Attendance
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Search */}
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-ink border-gold/20 text-white"
          />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="bg-ink-dark border-gold/20 p-4">
            <p className="text-xs text-gold/60">Total Employees</p>
            <p className="text-2xl font-bold text-gold">{employees.length}</p>
          </Card>
          <Card className="bg-ink-dark border-gold/20 p-4">
            <p className="text-xs text-gold/60">Active</p>
            <p className="text-2xl font-bold text-green-400">
              {employees.filter((e) => e.status === "ACTIVE").length}
            </p>
          </Card>
          <Card className="bg-ink-dark border-gold/20 p-4">
            <p className="text-xs text-gold/60">Inactive</p>
            <p className="text-2xl font-bold text-red-400">
              {employees.filter((e) => e.status !== "ACTIVE").length}
            </p>
          </Card>
        </div>

            {/* Employees Table */}
            <Card className="bg-ink-dark border-gold/20 overflow-hidden">
              {filteredEmployees.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gold/60">No employees found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gold/10 bg-ink/50">
                      <tr className="text-left text-xs text-gold/60 uppercase">
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3 hidden sm:table-cell">Email</th>
                        <th className="px-4 py-3 hidden md:table-cell">Phone</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map((emp) => (
                        <tr key={emp.id} className="border-b border-gold/10 hover:bg-ink/50">
                          <td className="px-4 py-3">
                            <p className="text-white font-medium">{emp.full_name}</p>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <p className="text-white/70 text-sm">{emp.email}</p>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <p className="text-white/70 text-sm">{emp.phone}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-gold text-sm">{emp.role}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                emp.status === "ACTIVE"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {emp.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedEmployeeForSummary(emp);
                                  setShowAttendanceSummary(true);
                                }}
                                className="text-xs border-gold/20 text-gold hover:bg-gold/10"
                              >
                                Attendance
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteEmployee(emp.id)}
                                className="text-xs border-red-500/20 text-red-400 hover:bg-red-500/10"
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

        {/* Attendance Summary Modal */}
        <Dialog open={showAttendanceSummary} onOpenChange={setShowAttendanceSummary}>
          <DialogContent className="!bg-ink-dark border-gold/20 max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-gold">
                {selectedEmployeeForSummary?.full_name} - Attendance Summary
              </DialogTitle>
            </DialogHeader>
            
            {selectedEmployeeForSummary && (
              <div className="space-y-6">
                {/* Month Selection */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
                    className="px-3 py-2 bg-gold/20 text-gold rounded hover:bg-gold/30"
                  >
                    ← Previous
                  </button>
                  <h3 className="text-gold font-semibold">
                    {selectedMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </h3>
                  <button
                    onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
                    className="px-3 py-2 bg-gold/20 text-gold rounded hover:bg-gold/30"
                  >
                    Next →
                  </button>
                </div>

                {/* Stats Cards */}
                {(() => {
                  const stats = getMonthlyStats(selectedEmployeeForSummary, selectedMonth);
                  return (
                    <div className="grid grid-cols-4 gap-2">
                      <Card className="bg-green-500/20 border-green-500/30 p-3 text-center">
                        <p className="text-xs text-green-300/60">Present</p>
                        <p className="text-2xl font-bold text-green-400">{stats.present}</p>
                      </Card>
                      <Card className="bg-red-500/20 border-red-500/30 p-3 text-center">
                        <p className="text-xs text-red-300/60">Absent</p>
                        <p className="text-2xl font-bold text-red-400">{stats.absent}</p>
                      </Card>
                      <Card className="bg-yellow-500/20 border-yellow-500/30 p-3 text-center">
                        <p className="text-xs text-yellow-300/60">Leave</p>
                        <p className="text-2xl font-bold text-yellow-400">{stats.leave}</p>
                      </Card>
                      <Card className="bg-gold/20 border-gold/30 p-3 text-center">
                        <p className="text-xs text-gold/60">Total Days</p>
                        <p className="text-2xl font-bold text-gold">{stats.total}</p>
                      </Card>
                    </div>
                  );
                })()}

                {/* Month Attendance Calendar */}
                <div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                      <div key={day} className="py-2 text-gold/60 font-semibold">
                        {day}
                      </div>
                    ))}
                    
                    {(() => {
                      const firstDay = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
                      const lastDay = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
                      const startDate = new Date(firstDay);
                      startDate.setDate(startDate.getDate() - firstDay.getDay());
                      
                      // Empty cells for days before month starts
                      const emptyStart = [];
                      for (let i = 0; i < firstDay.getDay(); i++) {
                        emptyStart.push(<div key={`empty-start-${i}`}></div>);
                      }

                      // Days of the month
                      const days = [];
                      for (let i = 1; i <= lastDay.getDate(); i++) {
                        const date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), i);
                        const dateStr = date.toISOString().split("T")[0];
                        const monthStr = selectedMonth.toISOString().split("T")[0];
                        
                        const record = attendance.find(
                          a => a.employee_id === selectedEmployeeForSummary.id && a.date === dateStr
                        );

                        let bgColor = "bg-ink/30 border-ink-dark/20";
                        let textColor = "text-white/50";

                        if (record) {
                          if (record.status === "PRESENT") {
                            bgColor = "bg-green-500/30 border-green-500/50";
                            textColor = "text-green-400";
                          } else if (record.status === "ABSENT") {
                            bgColor = "bg-red-500/30 border-red-500/50";
                            textColor = "text-red-400";
                          } else if (record.status === "LEAVE") {
                            bgColor = "bg-yellow-500/30 border-yellow-500/50";
                            textColor = "text-yellow-400";
                          }
                        }

                        const today = new Date().toISOString().split("T")[0];
                        const isToday = dateStr === today;
                        
                        days.push(
                          <div
                            key={dateStr}
                            className={`p-1 rounded border ${bgColor} ${textColor} ${
                              isToday ? "cursor-pointer ring-2 ring-gold/80 hover:ring-gold" : ""
                            }`}
                            title={record ? record.status : isToday ? "Click to mark attendance" : "No record"}
                            onClick={() => {
                              if (isToday) {
                                setQuickMarkDate(dateStr);
                                setShowQuickMark(true);
                              }
                            }}
                          >
                            {i}
                          </div>
                        );
                      }

                      return [...emptyStart, ...days];
                    })()}
                  </div>
                </div>

                {/* Recent Records for this Month - REMOVED */}

              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Quick Mark Attendance Dialog */}
        <Dialog open={showQuickMark} onOpenChange={setShowQuickMark}>
          <DialogContent className="!bg-ink-dark border-gold/20 max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-gold">Mark Attendance for {quickMarkDate}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-white text-sm">
                Select status for <span className="text-gold font-semibold">{selectedEmployeeForSummary?.full_name}</span>
              </p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={async () => {
                    try {
                      // Delete existing attendance for this date if any
                      await supabase
                        .from("attendance")
                        .delete()
                        .match({
                          employee_id: selectedEmployeeForSummary?.id || "",
                          date: quickMarkDate,
                        });

                      // Insert new record
                      const { error } = await supabase.from("attendance").insert({
                        employee_id: selectedEmployeeForSummary?.id || "",
                        date: quickMarkDate,
                        status: "PRESENT",
                        notes: "",
                        marked_by: userProfile?.id,
                      });

                      if (error) throw error;

                      toast.success("Marked as Present");
                      setShowQuickMark(false);
                      fetchAttendance();
                    } catch (error) {
                      console.error("Error:", error);
                      toast.error("Failed to mark attendance");
                    }
                  }}
                  className="bg-green-500/30 hover:bg-green-500/50 text-green-300 border border-green-500/50"
                >
                  Present
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      // Delete existing attendance for this date if any
                      await supabase
                        .from("attendance")
                        .delete()
                        .match({
                          employee_id: selectedEmployeeForSummary?.id || "",
                          date: quickMarkDate,
                        });

                      // Insert new record
                      const { error } = await supabase.from("attendance").insert({
                        employee_id: selectedEmployeeForSummary?.id || "",
                        date: quickMarkDate,
                        status: "ABSENT",
                        notes: "",
                        marked_by: userProfile?.id,
                      });

                      if (error) throw error;

                      toast.success("Marked as Absent");
                      setShowQuickMark(false);
                      fetchAttendance();
                    } catch (error) {
                      console.error("Error:", error);
                      toast.error("Failed to mark attendance");
                    }
                  }}
                  className="bg-red-500/30 hover:bg-red-500/50 text-red-300 border border-red-500/50"
                >
                  Absent
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      // Delete existing attendance for this date if any
                      await supabase
                        .from("attendance")
                        .delete()
                        .match({
                          employee_id: selectedEmployeeForSummary?.id || "",
                          date: quickMarkDate,
                        });

                      // Insert new record
                      const { error } = await supabase.from("attendance").insert({
                        employee_id: selectedEmployeeForSummary?.id || "",
                        date: quickMarkDate,
                        status: "LEAVE",
                        notes: "",
                        marked_by: userProfile?.id,
                      });

                      if (error) throw error;

                      toast.success("Marked as Leave");
                      setShowQuickMark(false);
                      fetchAttendance();
                    } catch (error) {
                      console.error("Error:", error);
                      toast.error("Failed to mark attendance");
                    }
                  }}
                  className="bg-yellow-500/30 hover:bg-yellow-500/50 text-yellow-300 border border-yellow-500/50"
                >
                  Leave
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/employees")({
  component: EmployeesPageComponent,
});
