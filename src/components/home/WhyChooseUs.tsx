import { LayoutGrid, MonitorSmartphone, Award, ShieldCheck } from "lucide-react";
import dentistImage from "@/assets/dentist-treating.jpg";

const features = [
  {
    icon: LayoutGrid,
    title: "Expert Care Team",
    description: "Highly qualified dentists with years of experience in all dental specialties",
  },
  {
    icon: MonitorSmartphone,
    title: "Advanced Technology",
    description: "Latest equipment including digital X-rays, laser dentistry, and modern sterilization",
  },
  {
    icon: Award,
    title: "Premium Experience",
    description: "Comfortable clinic environment designed to make your visit stress-free and pleasant",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Hygienic",
    description: "Strict sterilization protocols and infection control standards for your safety",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Image with badge */}
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8 lg:hidden">
              Why Choose Aadya Dental?
            </h2>
            <div className="relative">
              <img
                src={dentistImage}
                alt="Dentist treating a patient at Aadya Dental"
                className="w-full max-w-lg rounded-2xl object-cover aspect-[4/5] shadow-medium"
              />
              {/* Floating badge */}
              <div className="absolute top-6 right-0 lg:-right-8 bg-primary text-primary-foreground rounded-2xl px-6 py-5 shadow-lg max-w-[220px]">
                <p className="text-lg font-semibold leading-snug">
                  Bengaluru's trusted dental care partner
                </p>
              </div>
            </div>
          </div>

          {/* Right - Features timeline */}
          <div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-12 hidden lg:block">
              Why Choose Aadya Dental?
            </h2>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

              <div className="space-y-10">
                {features.map((feature, index) => (
                  <div key={feature.title} className="flex items-start gap-6 relative animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    {/* Icon circle */}
                    <div className="relative z-10 w-12 h-12 rounded-full bg-card border-2 border-border flex items-center justify-center flex-shrink-0 shadow-soft">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>

                    {/* Text */}
                    <div className="pt-1">
                      <h3 className="font-display text-lg font-bold text-foreground mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
