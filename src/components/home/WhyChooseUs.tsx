import { Award, Clock, Users, Star } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Experienced Team",
    description: "Our dentists have 15+ years of experience and ongoing training in the latest techniques.",
  },
  {
    icon: Clock,
    title: "Convenient Hours",
    description: "Flexible scheduling including evenings and weekends to fit your busy lifestyle.",
  },
  {
    icon: Users,
    title: "Family-Friendly",
    description: "We welcome patients of all ages, from toddlers to seniors, in a warm environment.",
  },
  {
    icon: Star,
    title: "Modern Technology",
    description: "State-of-the-art equipment for more accurate diagnoses and comfortable treatments.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="section-padding bg-secondary">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <div className="relative animate-slide-up">
            <div className="aspect-[4/3] rounded-3xl bg-card shadow-medium overflow-hidden">
              <img
                src="/clinic-interior.jpg"
                alt="Modern dental clinic interior"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center bg-teal-light">
                      <div class="text-center p-8">
                        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                          <svg class="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                          </svg>
                        </div>
                        <p class="text-foreground font-medium">Modern Clinic Facility</p>
                      </div>
                    </div>
                  `;
                }}
              />
            </div>
            {/* Stats Card */}
            <div className="absolute -bottom-8 -right-8 bg-card rounded-2xl p-6 shadow-medium animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-coral-light flex items-center justify-center">
                  <span className="text-2xl">😊</span>
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">10K+</p>
                  <p className="text-sm text-muted-foreground">Happy Patients</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-8">
            <div className="animate-slide-up">
              <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
                Why Choose Us
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Excellence in Every Smile
              </h2>
              <p className="text-lg text-muted-foreground">
                We're committed to providing exceptional dental care that exceeds your expectations. Here's what sets us apart.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="flex gap-4 animate-slide-up"
                  style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-teal-light flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
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
      </div>
    </section>
  );
};

export default WhyChooseUs;
