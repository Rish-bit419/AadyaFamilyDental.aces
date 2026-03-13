import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Users, Clock, CheckCircle, Check, X, Trash2 } from "lucide-react";

interface StatsData {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedToday: number;
  completedThisMonth: number;
}

interface Appointment {
  id: string;
  patient_name: string;
  service_name: string;
  preferred_date: string;
  preferred_time: string;
  status: string;
  created_at: string;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<StatsData>({
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedToday: 0,
    completedThisMonth: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all appointments
      const { data: appointments, error } = await supabase
        .from("appointments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const today = new Date().toISOString().split("T")[0];
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      setStats({
        totalAppointments: appointments?.length || 0,
        pendingAppointments: appointments?.filter((a) => a.status === "pending").length || 0,
        confirmedToday: appointments?.filter(
          (a) => a.status === "confirmed" && a.preferred_date === today
        ).length || 0,
        completedThisMonth: appointments?.filter(
          (a) => a.status === "completed" && new Date(a.created_at) >= startOfMonth
        ).length || 0,
      });

      setRecentAppointments((appointments || []).slice(0, 5));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      label: "Total Appointments",
      value: stats.totalAppointments,
      icon: Calendar,
      color: "bg-primary",
    },
    {
      label: "Pending",
      value: stats.pendingAppointments,
      icon: Clock,
      color: "bg-amber-500",
    },
    {
      label: "Today's Confirmed",
      value: stats.confirmedToday,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Completed (Month)",
      value: stats.completedThisMonth,
      icon: CheckCircle,
      color: "bg-green-500",
    },
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-card rounded-2xl"></div>
          ))}
        </div>
        <div className="h-96 bg-card rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-3xl font-bold text-foreground">{stat.value}</span>
            </div>
            <p className="text-muted-foreground font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Appointments */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Recent Appointments
          </h2>
        </div>
        
        {recentAppointments.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No appointments yet</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentAppointments.map((appointment) => (
              <div key={appointment.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-semibold text-foreground">{appointment.patient_name}</p>
                    <p className="text-sm text-muted-foreground">{appointment.service_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {new Date(appointment.preferred_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">{appointment.preferred_time}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
