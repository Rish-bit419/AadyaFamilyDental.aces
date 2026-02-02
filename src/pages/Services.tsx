import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, Shield, Heart, Smile, Stethoscope, Zap, Baby, Scissors } from "lucide-react";

const services = [
  {
    icon: Shield,
    title: "General Dentistry",
    description: "Comprehensive exams, professional cleanings, and preventive care to maintain optimal oral health. We catch problems early to save you time and money.",
    features: ["Dental Exams", "Professional Cleanings", "X-Rays", "Fluoride Treatment", "Sealants"],
  },
  {
    icon: Sparkles,
    title: "Teeth Whitening",
    description: "Achieve a brighter, more radiant smile with our professional whitening treatments. Safe, effective, and long-lasting results.",
    features: ["In-Office Whitening", "Take-Home Kits", "Touch-Up Treatments", "Sensitivity-Free Options"],
  },
  {
    icon: Heart,
    title: "Dental Implants",
    description: "Permanent tooth replacement solutions that look, feel, and function like natural teeth. Restore your smile and confidence.",
    features: ["Single Tooth Implants", "Full Arch Restoration", "Implant-Supported Dentures", "Bone Grafting"],
  },
  {
    icon: Smile,
    title: "Orthodontics",
    description: "Straighten your teeth and improve your bite with modern orthodontic solutions. Options for all ages and lifestyles.",
    features: ["Traditional Braces", "Clear Aligners", "Invisalign", "Retainers", "Early Intervention"],
  },
  {
    icon: Stethoscope,
    title: "Root Canal Therapy",
    description: "Gentle and effective treatment to save damaged teeth and relieve pain. Our modern techniques ensure comfort throughout.",
    features: ["Pain Relief", "Tooth Preservation", "Infection Treatment", "Crown Placement"],
  },
  {
    icon: Zap,
    title: "Cosmetic Dentistry",
    description: "Transform your smile with our range of cosmetic procedures. From subtle enhancements to complete smile makeovers.",
    features: ["Porcelain Veneers", "Dental Bonding", "Smile Makeovers", "Gum Contouring"],
  },
  {
    icon: Baby,
    title: "Pediatric Dentistry",
    description: "Specialized dental care for children in a fun, friendly environment. Building healthy habits that last a lifetime.",
    features: ["Child-Friendly Exams", "Cavity Prevention", "Fluoride Treatments", "Dental Education"],
  },
  {
    icon: Scissors,
    title: "Oral Surgery",
    description: "Expert surgical procedures performed with precision and care. From wisdom teeth to complex extractions.",
    features: ["Tooth Extractions", "Wisdom Teeth Removal", "Bone Grafting", "Sedation Options"],
  },
];

const Services = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              Our Services
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Comprehensive Dental Care for Your Whole Family
            </h1>
            <p className="text-lg text-muted-foreground">
              From routine check-ups to advanced treatments, we offer a full spectrum of dental services using the latest technology and techniques.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid gap-12">
            {services.map((service, index) => (
              <div
                key={service.title}
                className={`grid lg:grid-cols-2 gap-8 items-center animate-slide-up ${
                  index % 2 === 1 ? "lg:direction-rtl" : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`space-y-6 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div className="w-16 h-16 rounded-2xl bg-teal-light flex items-center justify-center">
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    {service.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="grid grid-cols-2 gap-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to="/book-appointment">
                    <Button variant="default" size="lg">
                      Book This Service
                    </Button>
                  </Link>
                </div>

                <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-teal-light to-secondary flex items-center justify-center">
                    <service.icon className="w-20 h-20 text-primary/30" />
                  </div>
                </div>
              </div>
            ))}
          </div>
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
