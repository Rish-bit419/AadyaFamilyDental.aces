import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Home, Info, Briefcase, Image, BookOpen, Calendar,
  Phone, LayoutDashboard, Shield, Settings, X, User
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      setIsLoggedIn(!!session?.user);
      if (session?.user) {
        setUserName(session.user.user_metadata?.full_name || session.user.email || "Patient");
        const { data } = await supabase.rpc("has_role", {
          _user_id: session.user.id,
          _role: "admin",
        });
        setIsAdmin(!!data);
      } else {
        setUserName(null);
        setIsAdmin(false);
      }
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setIsLoggedIn(!!session?.user);
      if (session?.user) {
        setUserName(session.user.user_metadata?.full_name || session.user.email || "Patient");
        const { data } = await supabase.rpc("has_role", {
          _user_id: session.user.id,
          _role: "admin",
        });
        setIsAdmin(!!data);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handlePatientDashboard = () => {
    setOpen(false);
    navigate(isLoggedIn ? "/patient/dashboard" : "/patient/auth");
  };

  const handleAdmin = () => {
    setOpen(false);
    navigate(isLoggedIn && isAdmin ? "/admin/dashboard" : "/admin/login");
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
                  {isLoggedIn ? `Welcome, ${userName}` : "Guest User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isLoggedIn ? "Logged in" : "Sign in for full access"}
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
