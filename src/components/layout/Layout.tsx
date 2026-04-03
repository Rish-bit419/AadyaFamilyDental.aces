import { ReactNode, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Phone } from "lucide-react";
import PromoBanner from "@/components/PromoBanner";
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
      <PromoBanner />
      <Navbar />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />

    </div>
  );
};

export default Layout;
