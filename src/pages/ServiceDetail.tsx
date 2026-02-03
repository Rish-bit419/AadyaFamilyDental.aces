import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Clock, ArrowLeft, Calendar, Phone, Sparkles } from "lucide-react";
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

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [relatedServices, setRelatedServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .single();

      if (error || !data) {
        navigate("/services");
        return;
      }

      setService(data);

      // Fetch related services
      const { data: related } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .neq("id", id)
        .limit(3);

      if (related) {
        setRelatedServices(related);
      }

      setIsLoading(false);
    };

    fetchService();
  }, [id, navigate]);

  const getIcon = (iconName: string | null) => {
    if (!iconName) return Sparkles;
    const Icon = (LucideIcons as any)[iconName];
    return Icon || Sparkles;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="section-padding bg-background">
          <div className="container-custom">
            <div className="animate-pulse space-y-8">
              <div className="h-8 w-32 bg-muted rounded" />
              <div className="h-12 w-2/3 bg-muted rounded" />
              <div className="h-64 bg-muted rounded-2xl" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!service) return null;

  const IconComponent = getIcon(service.icon);

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-teal-light to-background">
        <div className="container-custom">
          {/* Breadcrumb */}
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Services</span>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <IconComponent className="w-10 h-10 text-primary" />
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                {service.name}
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {service.description}
              </p>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-4 mb-8">
                {service.duration_minutes && (
                  <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border/50">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{service.duration_minutes} min</span>
                  </div>
                )}
                {service.price && (
                  <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border/50">
                    <span className="text-sm font-medium">From ${service.price}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/book-appointment">
                  <Button size="lg" className="cta-gradient border-0">
                    <Calendar className="w-5 h-5 mr-2" />
                    Book This Treatment
                  </Button>
                </Link>
                <a href="tel:+1234567890">
                  <Button variant="outline" size="lg">
                    <Phone className="w-5 h-5 mr-2" />
                    Call to Inquire
                  </Button>
                </a>
              </div>
            </div>

            {/* Visual */}
            <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-teal-light flex items-center justify-center">
                <IconComponent className="w-32 h-32 text-primary/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      {service.features && service.features.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8 text-center animate-slide-up">
                What's Included
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {service.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-secondary rounded-xl animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Procedure Overview */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center animate-slide-up">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
              The Procedure
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Our expert team uses the latest technology and techniques to ensure 
              your comfort throughout the entire treatment process. We begin with 
              a thorough consultation to understand your needs, followed by a 
              personalized treatment plan designed specifically for you.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 mt-12">
              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="font-semibold text-foreground mb-2">Consultation</h3>
                <p className="text-sm text-muted-foreground">
                  Detailed examination and discussion of treatment options
                </p>
              </div>
              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold text-foreground mb-2">Treatment</h3>
                <p className="text-sm text-muted-foreground">
                  Expert care using advanced technology and techniques
                </p>
              </div>
              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold text-foreground mb-2">Follow-up</h3>
                <p className="text-sm text-muted-foreground">
                  Aftercare instructions and scheduled check-ups
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-custom">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8 text-center animate-slide-up">
              Related Services
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {relatedServices.map((related, index) => {
                const RelatedIcon = getIcon(related.icon);
                return (
                  <Link
                    key={related.id}
                    to={`/services/${related.id}`}
                    className="group bg-card rounded-2xl p-6 border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-14 h-14 rounded-xl bg-teal-light flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <RelatedIcon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {related.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {related.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding hero-gradient">
        <div className="container-custom text-center animate-slide-up">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Book your consultation today and take the first step towards a healthier, more beautiful smile.
          </p>
          <Link to="/book-appointment">
            <Button variant="hero" size="xl">
              Schedule Your Consultation
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default ServiceDetail;
