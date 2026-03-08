import { ReactNode, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [phone, setPhone] = useState("063663 60115");
  const [phoneRaw, setPhoneRaw] = useState("+916366360115");

  useEffect(() => {
    supabase
      .from("clinic_settings")
      .select("value")
      .eq("key", "phone")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) {
          setPhone(data.value);
          setPhoneRaw("tel:+" + data.value.replace(/\D/g, ""));
        }
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />

      {/* Floating Call Button */}
      <a
        href={phoneRaw}
        className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-1 group"
      >
        <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
          <Phone className="w-6 h-6" />
        </div>
        <span className="text-xs font-semibold text-foreground bg-card px-2 py-0.5 rounded-full shadow-sm border border-border/50">
          {phone}
        </span>
      </a>
    </div>
  );
};

export default Layout;
