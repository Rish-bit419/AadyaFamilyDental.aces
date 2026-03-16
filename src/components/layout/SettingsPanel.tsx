import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthReady } from "@/hooks/use-auth-ready";
import {
  Home, Info, Briefcase, Image, BookOpen, Calendar,
  Phone, LayoutDashboard, Shield, Settings, User
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const menuItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "About", href: "/about", icon: Info },
  { label: "Services", href: "/services", icon: Briefcase },
  { label: "Gallery", href: "/gallery", icon: Image },
  { label: "Blog", href: "/blog", icon: BookOpen },
  { label: "Book Appointment", href: "/book-appointment", icon: Calendar },
  { label: "Contact", href: "/contact", icon: Phone },
];

const SettingsPanel = () => {
  const { user, isReady, isAuthenticated } = useAuthReady();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadUserData = async () => {
      if (!isReady) return;

      if (!user) {
        if (!isMounted) return;
        setUserName(null);
        setIsAdmin(false);
        return;
      }

      const fallback = user.user_metadata?.full_name || user.email || "Patient";

      const [{ data: profile }, { data: hasAdmin }] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
        supabase.rpc("has_role", {
          _user_id: user.id,
          _role: "admin",
        }),
      ]);

      if (!isMounted) return;
      setUserName(profile?.full_name || fallback);
      setIsAdmin(!!hasAdmin);
    };

    void loadUserData();

    return () => {
      isMounted = false;
    };
  }, [isReady, user]);

  const handlePatientDashboard = () => {
    setOpen(false);
    navigate(isAuthenticated ? "/patient/dashboard" : "/patient/auth");
  };

  const handleAdmin = () => {
    setOpen(false);
    navigate(isAuthenticated && isAdmin ? "/admin/dashboard" : "/admin/login");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="p-2 rounded-lg text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
          aria-label="Open navigation menu"
        >
          <Settings className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[300px] bg-card/95 backdrop-blur-xl border-r border-border/50 p-0">
        <SheetHeader className="p-6 pb-4 border-b border-border/50">
          <SheetTitle className="text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {isAuthenticated ? `Welcome, ${userName || "Patient"}` : "Guest User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isAuthenticated ? "Logged in" : "Sign in for full access"}
                </p>
              </div>
            </div>
          </SheetTitle>
        </SheetHeader>

        <nav className="p-4 flex flex-col gap-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-200"
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          ))}

          <div className="h-px bg-border/50 my-2" />

          <button
            onClick={handlePatientDashboard}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-200 w-full text-left"
          >
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            <span>Patient Dashboard</span>
          </button>

          <button
            onClick={handleAdmin}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-200 w-full text-left"
          >
            <Shield className="w-5 h-5 shrink-0" />
            <span>Admin</span>
          </button>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsPanel;
