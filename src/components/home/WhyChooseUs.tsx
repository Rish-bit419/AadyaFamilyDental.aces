import { Award, Clock, Users, Star } from "lucide-react";

const features = [
  {
    icon: Award,
    stat: "15+",
    statLabel: "Years",
    title: "Experienced Team",
    description: "Ongoing training in the latest dental techniques and technologies.",
  },
  {
    icon: Clock,
    stat: "7",
    statLabel: "Days/Week",
    title: "Always Open",
    description: "Evenings and weekends available to fit your schedule.",
  },
  {
    icon: Users,
    stat: "10K+",
    statLabel: "Patients",
    title: "Family-Friendly",
    description: "Caring for every age group — toddlers to seniors.",
  },
  {
    icon: Star,
    stat: "4.9",
    statLabel: "Rating",
    title: "Top Rated",
    description: "Trusted by thousands with near-perfect reviews.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 md:py-28 bg-secondary">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-primary uppercase tracking-[0.15em]">
            Why Choose Us
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3">
            Your Smile, Our Priority
          </h2>
        </div>

        {/* Feature strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group text-center p-6 md:p-8 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-glow transition-all duration-300"
            >
              {/* Big stat */}
              <p className="text-4xl md:text-5xl font-bold text-primary mb-1 group-hover:scale-110 transition-transform duration-300 inline-block">
                {feature.stat}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-5">
                {feature.statLabel}
              </p>

              {/* Icon */}
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors duration-300">
                <feature.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>

              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
