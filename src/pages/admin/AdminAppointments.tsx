import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Search, Phone, Mail, Filter, Trash2, Check, X, Clock } from "lucide-react";

interface Appointment {
  id: string;
  patient_name: string;
  patient_email: string | null;
  patient_phone: string;
  service_name: string;
  preferred_date: string;
  preferred_time: string;
  message: string | null;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  created_at: string;
}

const AdminAppointments = () => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchTerm, statusFilter]);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .order("preferred_date", { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.patient_name.toLowerCase().includes(term) ||
          a.patient_phone.includes(term) ||
          a.service_name.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }

    setFilteredAppointments(filtered);
  };

  const updateStatus = async (id: string, status: Appointment["status"]) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );

      toast({
        title: "Status updated",
        description: `Appointment marked as ${status}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;

    try {
      const { error } = await supabase.from("appointments").delete().eq("id", id);

      if (error) throw error;

      setAppointments((prev) => prev.filter((a) => a.id !== id));

      toast({
        title: "Deleted",
        description: "Appointment has been deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete appointment",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-amber-100 text-amber-700",
      confirmed: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-muted text-muted-foreground";
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 bg-card rounded-xl w-1/3"></div>
        <div className="h-96 bg-card rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Appointments</h1>
        <p className="text-muted-foreground mt-1">Manage patient appointments</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, or service..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Appointments List */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-soft overflow-hidden">
        {filteredAppointments.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No appointments found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="p-6 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Patient Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground text-lg">
                        {appointment.patient_name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {appointment.patient_phone}
                      </span>
                      {appointment.patient_email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {appointment.patient_email}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Service</p>
                      <p className="font-medium text-foreground">{appointment.service_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date & Time</p>
                      <p className="font-medium text-foreground">
                        {new Date(appointment.preferred_date).toLocaleDateString()} at {appointment.preferred_time}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {appointment.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => updateStatus(appointment.id, "confirmed")}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(appointment.id, "cancelled")}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </>
                    )}
                    {appointment.status === "confirmed" && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => updateStatus(appointment.id, "completed")}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Complete
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => deleteAppointment(appointment.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {appointment.message && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Note:</strong> {appointment.message}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAppointments;
