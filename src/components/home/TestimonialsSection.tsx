import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Star, Quote, ChevronLeft, ChevronRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkeletonTestimonialCard } from "@/components/ui/skeleton-cards";

interface Testimonial {
  id: string;
  patient_name: string;
  patient_image_url: string | null;
  rating: number | null;
  review_text: string;
  treatment_type: string | null;
}

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_active", true)
        .order("is_featured", { ascending: false })
        .limit(6);

      if (!error && data) {
        setTestimonials(data);
      }
      setIsLoading(false);
    };

    fetchTestimonials();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, testimonials.length - 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, testimonials.length - 2)) % Math.max(1, testimonials.length - 2));
  };

  if (isLoading) {
    return (
      <section className="section-padding bg-gradient-to-b from-secondary to-background">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              Testimonials
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              What Our Patients Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <SkeletonTestimonialCard key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const displayTestimonials = testimonials.length > 0 ? testimonials : [
    {
      id: "1",
      patient_name: "Sarah Johnson",
      patient_image_url: null,
      rating: 5,
      review_text: "Amazing experience! The team made me feel so comfortable during my dental implant procedure. The results exceeded my expectations.",
      treatment_type: "Dental Implants",
    },
    {
      id: "2",
      patient_name: "Michael Chen",
      patient_image_url: null,
      rating: 5,
      review_text: "I was terrified of dentists until I came here. They made me feel so comfortable, and the procedure was completely painless.",
      treatment_type: "General Dentistry",
    },
    {
      id: "3",
      patient_name: "Emily Rodriguez",
      patient_image_url: null,
      rating: 5,
      review_text: "Outstanding service from start to finish. The clinic is modern and clean, appointments are always on time.",
      treatment_type: "Teeth Whitening",
    },
  ];

  return (
    <section className="section-padding bg-gradient-to-b from-secondary to-background">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div className="max-w-2xl animate-slide-up">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              Testimonials
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              What Our Patients Say
            </h2>
            <p className="text-lg text-muted-foreground">
              Don't just take our word for it. See what our happy patients have to say.
            </p>
          </div>

          {/* Google Reviews Badge */}
          <div className="flex items-center gap-4 bg-card rounded-2xl px-6 py-4 shadow-soft border border-border/50 animate-slide-up hover:shadow-medium transition-shadow">
            <img 
              src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" 
              alt="Google" 
              className="h-8 object-contain"
            />
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-1">4.9 (500+ reviews)</p>
            </div>
          </div>
        </div>

        {/* Testimonials Slider */}
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out gap-6"
              style={{ transform: `translateX(-${currentIndex * (100 / 3 + 2)}%)` }}
            >
              {displayTestimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                >
                  <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-soft h-full relative group hover:shadow-medium hover:-translate-y-1 transition-all duration-300">
                    <Quote className="absolute top-6 right-6 w-12 h-12 text-primary/10 group-hover:text-primary/20 group-hover:scale-110 transition-all duration-300" />
                    
                    {/* Rating */}
                    <div className="flex gap-1 mb-6">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="w-5 h-5 fill-yellow-400 text-yellow-400 hover:scale-125 transition-transform" 
                          style={{ transitionDelay: `${i * 50}ms` }}
                        />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-foreground leading-relaxed mb-6 line-clamp-4">
                      "{testimonial.review_text}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-4 mt-auto">
                      {testimonial.patient_image_url ? (
                        <img
                          src={testimonial.patient_image_url}
                          alt={testimonial.patient_name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary/40 transition-colors"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
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
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          {displayTestimonials.length > 3 && (
            <div className="flex justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                className="rounded-full w-12 h-12 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                className="rounded-full w-12 h-12 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
