import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Star, Quote, User } from "lucide-react";

interface Testimonial {
  id: string;
  patient_name: string;
  patient_image_url: string | null;
  rating: number | null;
  review_text: string;
  treatment_type: string | null;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_active", true)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (!error && data) {
        setTestimonials(data);
      }
      setIsLoading(false);
    };

    fetchTestimonials();
  }, []);

  const treatmentTypes = ["all", ...new Set(testimonials.map((t) => t.treatment_type).filter(Boolean))];

  const filteredTestimonials = filter === "all"
    ? testimonials
    : testimonials.filter((t) => t.treatment_type === filter);

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-secondary to-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              Patient Reviews
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              What Our Patients Say
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Read genuine reviews from our happy patients who have experienced 
              our exceptional dental care firsthand.
            </p>

            {/* Google Reviews Badge */}
            <div className="inline-flex items-center gap-4 bg-card rounded-2xl px-6 py-4 shadow-soft border border-border/50">
              <img 
                src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" 
                alt="Google" 
                className="h-8 object-contain"
              />
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">4.9 out of 5 (500+ reviews)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      {treatmentTypes.length > 1 && (
        <section className="py-6 bg-background sticky top-0 z-20 border-b border-border/50">
          <div className="container-custom">
            <div className="flex flex-wrap gap-2 justify-center">
              {treatmentTypes.map((type) => (
                <Button
                  key={type}
                  variant={filter === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(type as string)}
                  className="capitalize"
                >
                  {type === "all" ? "All Reviews" : type}
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-muted rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredTestimonials.length === 0 ? (
            <div className="text-center py-20">
              <Quote className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No Reviews Yet
              </h3>
              <p className="text-muted-foreground">
                Be the first to share your experience with us!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTestimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="bg-card rounded-3xl p-8 border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 relative group animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Quote className="absolute top-6 right-6 w-12 h-12 text-primary/10 group-hover:text-primary/20 transition-colors" />
                  
                  {/* Rating */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-foreground leading-relaxed mb-6">
                    "{testimonial.review_text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    {testimonial.patient_image_url ? (
                      <img
                        src={testimonial.patient_image_url}
                        alt={testimonial.patient_name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-7 h-7 text-primary" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.patient_name}</p>
                      {testimonial.treatment_type && (
                        <p className="text-sm text-primary">{testimonial.treatment_type}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding hero-gradient">
        <div className="container-custom text-center animate-slide-up">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Experience the Difference?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join our family of satisfied patients and start your journey to a healthier, brighter smile.
          </p>
          <Link to="/book-appointment">
            <Button variant="hero" size="xl">
              Book Your Appointment
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Testimonials;
