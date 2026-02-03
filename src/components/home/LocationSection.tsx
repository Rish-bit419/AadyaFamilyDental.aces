import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";

const LocationSection = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});

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
    };
    fetchSettings();
  }, []);

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
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 p-4 bg-secondary rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Our Address</p>
                  <p className="text-muted-foreground text-sm">
                    {settings.address || "123 Dental Street, Medical District, City 12345"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-secondary rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Working Hours</p>
                  <p className="text-muted-foreground text-sm">
                    Mon - Fri: 9:00 AM - 7:00 PM<br />
                    Sat: 9:00 AM - 5:00 PM<br />
                    Sun: Closed
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-secondary rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Contact Us</p>
                  <p className="text-muted-foreground text-sm">
                    Phone: {settings.phone || "+1 (234) 567-890"}<br />
                    Email: {settings.email || "info@dentalcare.com"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/book-appointment">
                <Button size="lg" className="cta-gradient border-0">
                  Book Appointment
                </Button>
              </Link>
              <a
                href={`https://wa.me/${(settings.whatsapp || "1234567890").replace(/\D/g, "")}`}
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
            <div className="aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-medium border border-border/50">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425878428698!3d40.74076794379132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sGoogle!5e0!3m2!1sen!2sus!4v1679589899925!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Clinic Location"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
