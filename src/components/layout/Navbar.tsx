import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Menu, X, Calendar, User } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsLoggedIn(!!session?.user);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-card/95 backdrop-blur-lg shadow-soft border-b border-border/50"
            : "bg-transparent"
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20 px-4 md:px-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-primary-foreground font-display font-bold text-xl">D</span>
              </div>
              <div>
                <span className="font-display font-bold text-xl text-foreground">DentalCare</span>
                <p className="text-xs text-muted-foreground -mt-0.5">Premium Dental Clinic</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    location.pathname === link.href
                      ? "text-primary bg-primary/10"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              <Link to={isLoggedIn ? "/patient/dashboard" : "/patient/auth"}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden xl:inline">{isLoggedIn ? "My Portal" : "Patient Login"}</span>
                </Button>
              </Link>
              <a href="tel:+1234567890">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Phone className="w-4 h-4" />
                  <span className="hidden xl:inline">+1 234 567 890</span>
                </Button>
              </a>
              <Link to="/book-appointment">
                <Button size="sm" className="gap-2 cta-gradient border-0">
                  <Calendar className="w-4 h-4" />
                  Book Now
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden absolute top-full left-0 right-0 bg-card/98 backdrop-blur-lg border-b border-border shadow-medium transition-all duration-300 ${
            isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="container-custom py-6 px-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                    location.pathname === link.href
                      ? "text-primary bg-primary/10"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-border">
              <a href="tel:+1234567890" className="w-full">
                <Button variant="outline" className="w-full gap-2">
                  <Phone className="w-4 h-4" />
                  Call Us Now
                </Button>
              </a>
              <Link to={isLoggedIn ? "/patient/dashboard" : "/patient/auth"} className="w-full">
                <Button variant="secondary" className="w-full gap-2">
                  <User className="w-4 h-4" />
                  {isLoggedIn ? "My Portal" : "Patient Login"}
                </Button>
              </Link>
              <Link to="/book-appointment" className="w-full">
                <Button className="w-full gap-2 cta-gradient border-0">
                  <Calendar className="w-4 h-4" />
                  Book Appointment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Floating Book Button (Mobile) */}
      <Link
        to="/book-appointment"
        className="fixed bottom-6 left-6 z-40 lg:hidden"
      >
        <Button size="lg" className="cta-gradient border-0 shadow-lg gap-2">
          <Calendar className="w-5 h-5" />
          Book Now
        </Button>
      </Link>
    </>
  );
};

export default Navbar;
