import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Phone } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />

      {/* Floating Call Button */}
      <a
        href="tel:+916366360115"
        className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-1 group"
      >
        <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
          <Phone className="w-6 h-6" />
        </div>
        <span className="text-xs font-semibold text-foreground bg-card px-2 py-0.5 rounded-full shadow-sm border border-border/50">
          063663 60115
        </span>
      </a>
    </div>
  );
};

export default Layout;
