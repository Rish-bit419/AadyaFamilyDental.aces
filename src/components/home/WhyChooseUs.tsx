import { Award, Clock, Users, Star, CheckCircle, Sparkles } from "lucide-react";
import { useState } from "react";

const features = [
  {
    icon: Award,
    title: "Experienced Team",
    description: "Our dentists have 15+ years of experience and ongoing training in the latest techniques.",
    stat: "15+",
    statLabel: "Years",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    icon: Clock,
    title: "Convenient Hours",
    description: "Flexible scheduling including evenings and weekends to fit your busy lifestyle.",
    stat: "7",
    statLabel: "Days/Week",
    gradient: "from-accent/20 to-accent/5",
  },
  {
    icon: Users,
    title: "Family-Friendly",
    description: "We welcome patients of all ages, from toddlers to seniors, in a warm environment.",
    stat: "10K+",
    statLabel: "Patients",
    gradient: "from-coral/20 to-coral/5",
  },
  {
    icon: Star,
    title: "Modern Technology",
    description: "State-of-the-art equipment for more accurate diagnoses and comfortable treatments.",
    stat: "4.9",
    statLabel: "Rating",
    gradient: "from-primary/20 to-primary/5",
  },
];

const WhyChooseUs = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section className="py-20 md:py-28 bg-background overflow-hidden relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(hsl(var(--primary)) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="container-custom relative">
        {/* Section Header - Centered */}
        <div className="text-center max-w-2xl mx-auto mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-5">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Why Choose Us</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">
            Excellence in Every <span className="text-primary">Smile</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We're committed to providing exceptional dental care that exceeds your expectations.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 items-center">
          {/* Image Side - 2 cols */}
          <div className="lg:col-span-2 relative animate-slide-up">
            <div className="relative">
              {/* Decorative ring */}
              <div className="absolute -inset-3 rounded-[2rem] border-2 border-dashed border-primary/20 -rotate-2" />
              
              <div className="aspect-[3/4] rounded-3xl bg-card shadow-medium overflow-hidden group relative">
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/70 to-muted animate-pulse" />
                )}
                <img
                  src="/clinic-interior.jpg"
                  alt="Modern dental clinic interior"
                  loading="lazy"
                  className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                {/* Gradient overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-foreground/60 to-transparent" />
              </div>

              {/* Stats Card */}
              <div className="absolute -bottom-6 -right-4 lg:-right-8 bg-card rounded-2xl p-5 shadow-medium border border-border/50 animate-slide-up" style={{ animationDelay: "0.3s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                    <span className="text-xl">😊</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">10K+</p>
                    <p className="text-xs text-muted-foreground">Happy Patients</p>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="absolute -top-4 -left-2 lg:-left-6 bg-card rounded-xl px-4 py-3 shadow-medium border border-border/50 animate-slide-up" style={{ animationDelay: "0.4s" }}>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-foreground text-sm">Certified Clinic</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid - 3 cols */}
          <div className="lg:col-span-3 grid sm:grid-cols-2 gap-5">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative bg-card rounded-2xl p-6 border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${(index + 1) * 0.12}s` }}
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative">
                  {/* Icon + Stat row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                      <feature.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                      {feature.stat} {feature.statLabel}
                    </span>
                  </div>

                  <h3 className="font-semibold text-foreground text-lg mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
