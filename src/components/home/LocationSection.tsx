import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Phone, Clock, MessageCircle, Mail, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const LocationSection = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("clinic_settings").select("key, value");
      if (data) {
        const settingsMap: Record<string, string> = {};
        data.forEach((s) => {
          if (s.value) settingsMap[s.key] = s.value;
        });
        setSettings(settingsMap);
      }
      setIsLoading(false);
    };
    fetchSettings();
  }, []);

  const contactCards = [
    {
      icon: MapPin,
      title: "Our Address",
      content: settings.address || "#42, 1st Floor, MG Road, Bangalore, Karnataka 560001",
      action: null,
    },
    {
      icon: Clock,
      title: "Working Hours",
      content: "Mon - Sat: 9:00 AM - 8:00 PM\nSun: 10:00 AM - 2:00 PM",
      action: null,
    },
    {
      icon: Phone,
      title: "Phone",
      content: settings.phone || "+91 98765 43210",
      action: `tel:${settings.phone || "+919876543210"}`,
    },
    {
      icon: Mail,
      title: "Email",
      content: settings.email || "info@dentalcare.in",
      action: `mailto:${settings.email || "info@dentalcare.in"}`,
    },
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-slide-up">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              Visit Us
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Conveniently Located for Your Comfort
            </h2>
            <p className="text-muted-foreground mb-8">
              Our modern clinic is designed with your comfort in mind. Easy parking, 
              wheelchair accessible, and a welcoming atmosphere await you.
            </p>

            {/* Contact Cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="p-4 bg-secondary rounded-2xl">
                    <Skeleton className="h-12 w-12 rounded-xl mb-3" />
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))
              ) : (
                contactCards.map((card, index) => (
                  <div 
                    key={card.title}
                    className="group flex items-start gap-4 p-4 bg-secondary rounded-2xl hover:bg-card hover:shadow-soft transition-all duration-300 cursor-default"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                      <card.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground mb-1 flex items-center gap-2">
                        {card.title}
                        {card.action && (
                          <a href={card.action} className="text-primary hover:text-primary/80">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </p>
                      <p className="text-muted-foreground text-sm whitespace-pre-line">
                        {card.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/book-appointment">
                <Button size="lg" className="cta-gradient border-0 group">
                  Book Appointment
                </Button>
              </Link>
              <a
                href={`https://wa.me/91${(settings.whatsapp || "9876543210").replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="group">
                  <MessageCircle className="w-5 h-5 mr-2 text-green-500 group-hover:scale-110 transition-transform" />
                  WhatsApp Us
                </Button>
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-medium border border-border/50 relative group">
              {!mapLoaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted/70 to-muted animate-shimmer" />
              )}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.985595932468!2d77.60649661482202!3d12.975540990849224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sMG%20Road%2C%20Bengaluru!5e0!3m2!1sen!2sin!4v1679589899925!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Clinic Location"
                className={`grayscale group-hover:grayscale-0 transition-all duration-500 ${mapLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setMapLoaded(true)}
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-foreground/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
