import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Shield, Heart, Smile, Stethoscope, Zap } from "lucide-react";

const services = [
  {
    icon: Shield,
    title: "General Dentistry",
    description: "Comprehensive exams, cleanings, and preventive care to maintain your oral health.",
  },
  {
    icon: Sparkles,
    title: "Teeth Whitening",
    description: "Professional whitening treatments for a brighter, more confident smile.",
  },
  {
    icon: Heart,
    title: "Dental Implants",
    description: "Permanent tooth replacement solutions that look and function like natural teeth.",
  },
  {
    icon: Smile,
    title: "Orthodontics",
    description: "Braces and clear aligners to straighten teeth and improve your bite.",
  },
  {
    icon: Stethoscope,
    title: "Root Canal",
    description: "Gentle and effective treatment to save damaged teeth and relieve pain.",
  },
  {
    icon: Zap,
    title: "Cosmetic Dentistry",
    description: "Veneers, bonding, and smile makeovers for the perfect aesthetic result.",
  },
];

const ServicesSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 animate-slide-up">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Our Services
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Comprehensive Dental Care
          </h2>
          <p className="text-lg text-muted-foreground">
            From routine check-ups to advanced treatments, we offer a full range of dental services to keep your smile healthy and beautiful.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group card-elevated card-hover rounded-2xl p-8 border border-border/50 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-teal-light flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/services">
            <Button variant="outline" size="lg">
              View All Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
