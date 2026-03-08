import { Award, Clock, Users, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Award,
    title: "Experienced Team",
    description: "15+ years of expertise with ongoing training in the latest dental techniques.",
    stat: "15+",
    statLabel: "Years Experience",
  },
  {
    icon: Clock,
    title: "Open 7 Days",
    description: "Flexible scheduling including evenings and weekends for your convenience.",
    stat: "7/7",
    statLabel: "Days Available",
  },
  {
    icon: Users,
    title: "Family-Friendly",
    description: "Welcoming patients of all ages in a warm, comfortable environment.",
    stat: "10K+",
    statLabel: "Happy Patients",
  },
  {
    icon: Star,
    title: "Top Rated",
    description: "Consistently rated among the best dental clinics by our patients.",
    stat: "4.9",
    statLabel: "Google Rating",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Full-width split background */}
      <div className="absolute inset-0 flex">
        <div className="w-full lg:w-1/2 bg-primary" />
        <div className="hidden lg:block w-1/2 bg-background" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Left - Dark side with text */}
          <div className="bg-primary rounded-3xl lg:rounded-r-none p-10 md:p-14 text-primary-foreground">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/70 mb-4 block">
              Why Choose Us
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              We Don't Just Treat Teeth — We Build
              <span className="text-accent"> Confidence</span>
            </h2>
            <p className="text-primary-foreground/80 text-lg leading-relaxed mb-10 max-w-lg">
              From routine checkups to complete smile makeovers, our dedicated team ensures every visit is comfortable, efficient, and transformative.
            </p>

            {/* Mini stats row */}
            <div className="grid grid-cols-3 gap-6 mb-10">
              {[
                { value: "15+", label: "Years" },
                { value: "10K+", label: "Patients" },
                { value: "4.9★", label: "Rating" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-accent">{s.value}</p>
                  <p className="text-xs uppercase tracking-wider text-primary-foreground/60 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <Link
              to="/book-appointment"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-semibold px-6 py-3 rounded-full hover:gap-4 transition-all duration-300 group"
            >
              Book a Visit
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right - Feature cards */}
          <div className="bg-background rounded-3xl lg:rounded-l-none p-8 md:p-12 grid sm:grid-cols-2 gap-5 content-center">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-medium transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground text-base mb-1.5 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {feature.description}
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-primary">{feature.stat}</span>
                  <span className="text-xs text-muted-foreground">{feature.statLabel}</span>
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
