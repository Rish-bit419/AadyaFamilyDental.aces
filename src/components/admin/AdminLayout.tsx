import { useState, useEffect } from "react";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Calendar, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Stethoscope,
  Home,
  Users,
  Image,
  MessageSquare,
  FileText,
  MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { label: "Appointments", icon: Calendar, href: "/admin/appointments" },
  { label: "Services", icon: Stethoscope, href: "/admin/services" },
  { label: "Doctors", icon: Users, href: "/admin/doctors" },
  { label: "Gallery", icon: Image, href: "/admin/gallery" },
  { label: "Testimonials", icon: MessageSquare, href: "/admin/testimonials" },
  { label: "Blog", icon: FileText, href: "/admin/blog" },
  { label: "Locations", icon: MapPin, href: "/admin/locations" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    const applySession = (session: { user: any } | null) => {
      if (!isMounted) return;
      setUser(session?.user ?? null);
      setAuthReady(true);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session as { user: any } | null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      applySession(session as { user: any } | null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authReady) return;

    const verifyAdminAccess = async () => {
      if (!user) {
        setIsLoading(false);
        navigate("/admin/login", { replace: true });
        return;
      }

      setIsLoading(true);

      const { data: hasAdmin, error } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin" as const,
      });

      if (error) {
        setIsLoading(false);
        toast({
          title: "Could not verify access",
          description: "Please try signing in again.",
          variant: "destructive",
        });
        navigate("/admin/login", { replace: true });
        return;
      }

      if (!hasAdmin) {
        await supabase.auth.signOut();
        setIsLoading(false);
        toast({
          title: "Access denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        });
        navigate("/admin/login", { replace: true });
        return;
      }

      setIsLoading(false);
    };

    void verifyAdminAccess();
  }, [authReady, user?.id, navigate, toast]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You've been signed out successfully.",
    });
    navigate("/admin/login", { replace: true });
  };

  if (!authReady || isLoading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-12 h-12 rounded-xl bg-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300
        lg:translate-x-0 lg:static
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">D</span>
              </div>
              <div>
                <span className="font-display font-semibold text-foreground">DentalCare</span>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                  ${location.pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-2">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">View Website</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 lg:px-8 py-4 flex items-center justify-between">
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.email}
            </span>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
