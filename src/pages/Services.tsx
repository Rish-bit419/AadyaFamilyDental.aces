import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string | null;
  features: string[] | null;
  duration_minutes: number | null;
  price: number | null;
  icon: string | null;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (!error && data) {
        setServices(data);
      }
      setIsLoading(false);
    };

    fetchServices();
  }, []);

  const getIcon = (iconName: string | null) => {
    if (!iconName) return Sparkles;
    const Icon = (LucideIcons as any)[iconName];
    return Icon || Sparkles;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-secondary to-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              Our Services
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Comprehensive Dental Care for Your Whole Family
            </h1>
            <p className="text-lg text-muted-foreground">
              From routine check-ups to advanced treatments, we offer a full spectrum of 
              dental services using the latest technology and techniques.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-72 bg-muted rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const IconComponent = getIcon(service.icon);
                return (
                  <Link
                    key={service.id}
                    to={`/services/${service.id}`}
                    className="group bg-card rounded-2xl overflow-hidden border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Icon Header */}
                    <div className="p-6 pb-0">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-light to-secondary flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-colors duration-300">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                        {service.description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between mb-4">
                        {service.duration_minutes && (
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{service.duration_minutes} min</span>
                          </div>
                        )}
                        {service.price && (
                          <span className="text-sm font-semibold text-primary">
                            From ₹{service.price}
                          </span>
                        )}
                      </div>

                      {/* Features Preview */}
                      {service.features && service.features.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {service.features.slice(0, 3).map((feature, i) => (
                            <span
                              key={i}
                              className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                          {service.features.length > 3 && (
                            <span className="text-xs text-primary font-medium">
                              +{service.features.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* CTA */}
                      <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                        <span>Learn More</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding hero-gradient">
        <div className="container-custom text-center animate-slide-up">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Not Sure Which Service You Need?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Book a consultation and our experts will recommend the best treatment plan for your unique needs.
          </p>
          <Link to="/book-appointment">
            <Button variant="hero" size="xl">
              Schedule a Consultation
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
