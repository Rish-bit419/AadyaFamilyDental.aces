import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Phone, Clock, MessageCircle, Mail, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { withTimeout } from "@/lib/with-timeout";

interface Location {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  working_hours: string | null;
  map_embed_url: string | null;
}

const fallbackLocations: Location[] = [
  {
    id: "fallback-location",
    name: "Main Clinic",
    address: "Bengaluru, Karnataka, India",
    phone: "+91 63663 60115",
    email: "info@dentalcare.in",
    whatsapp: "6366360115",
    working_hours: "Mon - Sat: 9 AM - 8 PM",
    map_embed_url: null,
  },
];

const LocationSection = () => {
  const [activeLocation, setActiveLocation] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);

  const { data: locations = fallbackLocations, isLoading } = useQuery({
    queryKey: ["locations-preview"],
    queryFn: async () => {
      try {
        const { data, error } = await withTimeout(
          supabase
            .from("locations")
            .select("*")
            .eq("is_active", true)
            .order("display_order"),
          4000,
          "Locations request timed out"
        );

        if (error || !data?.length) return fallbackLocations;
        return data as Location[];
      } catch {
        return fallbackLocations;
      }
    },
  });

  const current = locations[activeLocation] || fallbackLocations[0];

  const getContactCards = (loc: Location) => [
    { icon: MapPin, title: "Address", content: loc.address, action: null },
    { icon: Clock, title: "Hours", content: loc.working_hours || "Mon - Sat: 9 AM - 8 PM", action: null },
    { icon: Phone, title: "Phone", content: loc.phone || "+91 63663 60115", action: `tel:${(loc.phone || "+916366360115").replace(/\s/g, "")}` },
    { icon: Mail, title: "Email", content: loc.email || "info@dentalcare.in", action: `mailto:${loc.email || "info@dentalcare.in"}` },
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center mb-10 animate-slide-up">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">Visit Us</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Our Locations</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Modern clinics designed with your comfort in mind.</p>
        </div>

        {!isLoading && locations.length > 1 && (
          <div className="flex flex-wrap justify-center gap-3 mb-10 animate-slide-up">
            {locations.map((loc, i) => (
              <button
                key={loc.id}
                onClick={() => { setActiveLocation(i); setMapLoaded(false); }}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeLocation === i ? "bg-primary text-primary-foreground shadow-md" : "bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                <MapPin className="w-4 h-4 inline mr-1.5 -mt-0.5" />{loc.name}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="grid sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-4 bg-secondary rounded-2xl">
                  <Skeleton className="h-12 w-12 rounded-xl mb-3" />
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
            <Skeleton className="aspect-[4/3] rounded-3xl" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-12 items-center animate-slide-up">
            <div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-6">{current.name}</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {getContactCards(current).map((card, index) => (
                  <div key={card.title} className="group flex items-start gap-4 p-4 bg-secondary rounded-2xl hover:bg-card hover:shadow-soft transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                      <card.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground mb-1 flex items-center gap-2">
                        {card.title}
                        {card.action && <a href={card.action} className="text-primary hover:text-primary/80"><ExternalLink className="w-3 h-3" /></a>}
                      </p>
                      <p className="text-muted-foreground text-sm whitespace-pre-line">{card.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/book-appointment"><Button size="lg" className="cta-gradient border-0">Book Appointment</Button></Link>
                <a href={`https://wa.me/91${(current.whatsapp || "6366360115").replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg" className="group">
                    <MessageCircle className="w-5 h-5 mr-2 text-primary group-hover:scale-110 transition-transform" />WhatsApp Us
                  </Button>
                </a>
              </div>
            </div>
            <div>
              <div className="aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-medium border border-border/50 relative group bg-secondary">
                {current.map_embed_url ? (
                  <>
                    {!mapLoaded && <div className="absolute inset-0 bg-muted animate-pulse rounded-3xl" />}
                    <iframe
                      key={current.id}
                      src={current.map_embed_url}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${current.name} Location`}
                      className={`grayscale group-hover:grayscale-0 transition-all duration-500 ${mapLoaded ? "opacity-100" : "opacity-0"}`}
                      onLoad={() => setMapLoaded(true)}
                    />
                  </>
                ) : (
                  <div className="h-full w-full flex items-center justify-center p-8 text-center">
                    <div>
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-primary" />
                      </div>
                      <h4 className="font-display text-xl font-semibold text-foreground mb-2">Visit Our Clinic</h4>
                      <p className="text-muted-foreground">{current.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LocationSection;
