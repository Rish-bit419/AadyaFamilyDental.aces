import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, Clock, User, LogOut, Heart, Star, 
  Video, Calculator, Smile, MessageSquare, ArrowRight, CheckCircle, UserCog
} from "lucide-react";
import { User as UserType } from "@supabase/supabase-js";
import PersonalInfo from "@/components/patient/PersonalInfo";

interface Appointment {
  id: string;
  service_name: string;
  preferred_date: string;
  preferred_time: string;
  status: string;
}

type DashboardTab = "overview" | "personal";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [profileName, setProfileName] = useState<string | null>(null);
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", userId)
      .single();
    if (data) {
      setProfileName(data.full_name);
      setProfileAvatar(data.avatar_url);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        navigate("/patient/auth");
      } else {
        setUser(session.user);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate("/patient/auth");
      } else {
        setUser(session.user);
        loadProfile(session.user.id);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out successfully" });
    navigate("/");
  };

  const handleProfileUpdate = () => {
    if (user) loadProfile(user.id);
  };

  const displayName = profileName || user?.user_metadata?.full_name || "Patient";

  const quickActions = [
    { icon: Calendar, label: "Book Appointment", href: "/book-appointment", color: "bg-primary" },
    { icon: Video, label: "Virtual Consultation", href: "/virtual-consultation", color: "bg-accent" },
    { icon: Calculator, label: "Cost Calculator", href: "/cost-calculator", color: "bg-teal-dark" },
    { icon: Smile, label: "Smile Simulator", href: "/smile-simulator", color: "bg-coral" },
    { icon: Star, label: "Leave Review", href: "/submit-review", color: "bg-yellow-500" },
  ];

  const tabs = [
    { id: "overview" as DashboardTab, label: "Overview", icon: Calendar },
    { id: "personal" as DashboardTab, label: "Personal Info", icon: UserCog },
  ];

  if (isLoading) {
    return (
      <Layout>
        <section className="section-padding min-h-[60vh] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="section-padding bg-gradient-to-b from-secondary to-background">
        <div className="container-custom">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 animate-slide-up">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center border-2 border-border">
                {profileAvatar ? (
                  <img src={profileAvatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-7 h-7 text-primary" />
                )}
              </div>
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  Welcome back, {displayName.split(" ")[0]}!
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage your dental care from one place
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 animate-slide-up border-b border-border/50 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-primary bg-primary/10 border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "personal" && user ? (
            <div className="animate-slide-up">
              <PersonalInfo user={user} onProfileUpdate={handleProfileUpdate} />
            </div>
          ) : (
            <>
              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                {quickActions.map((action, i) => (
                  <Link
                    key={i}
                    to={action.href}
                    className="group p-6 bg-card rounded-2xl border border-border/50 hover:shadow-medium transition-all text-center"
                  >
                    <div className={`w-14 h-14 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="font-medium text-foreground text-sm">{action.label}</span>
                  </Link>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Appointments */}
                <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border/50 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Your Appointments
                    </h2>
                    <Link to="/book-appointment">
                      <Button size="sm" variant="outline" className="gap-1">
                        Book New <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>

                  {appointments.length > 0 ? (
                    <div className="space-y-3">
                      {appointments.map((apt) => (
                        <div key={apt.id} className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                          <div className="w-12 h-12 rounded-xl bg-teal-light flex items-center justify-center">
                            <Clock className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{apt.service_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {apt.preferred_date} at {apt.preferred_time}
                            </p>
                          </div>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                            apt.status === "confirmed" ? "bg-green-100 text-green-700" :
                            apt.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground mb-4">No upcoming appointments</p>
                      <Link to="/book-appointment">
                        <Button size="sm">Book Your First Appointment</Button>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
                  {/* Profile Card */}
                  <div className="bg-card rounded-2xl p-6 border border-border/50">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center border border-border">
                        {profileAvatar ? (
                          <img src={profileAvatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-7 h-7 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{displayName}</h3>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Account verified</span>
                    </div>
                  </div>

                  {/* Dental Health Tips */}
                  <div className="bg-card rounded-2xl p-6 border border-border/50">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-primary" />
                      Dental Health Tips
                    </h3>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        Brush twice daily for 2 minutes
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        Floss at least once a day
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        Visit your dentist every 6 months
                      </li>
                    </ul>
                  </div>

                  {/* Help */}
                  <div className="bg-gradient-to-br from-primary to-teal-dark rounded-2xl p-6 text-white">
                    <MessageSquare className="w-8 h-8 mb-3" />
                    <h3 className="font-semibold mb-2">Need Help?</h3>
                    <p className="text-sm opacity-90 mb-4">
                      Contact our support team for any questions
                    </p>
                    <Link to="/contact">
                      <Button variant="hero" size="sm">Contact Us</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default PatientDashboard;
