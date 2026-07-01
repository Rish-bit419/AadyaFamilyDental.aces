import { CalendarCheck, Stethoscope, ClipboardList, Smile } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: CalendarCheck,
    title: "Book Your Visit",
    description: "Pick a convenient slot online or call us — we confirm within minutes.",
  },
  {
    icon: Stethoscope,
    title: "Meet Our Specialists",
    description: "Detailed consultation with digital X-rays and a full oral health check.",
  },
  {
    icon: ClipboardList,
    title: "Personalised Plan",
    description: "Transparent treatment options with pricing tailored to your needs.",
  },
  {
    icon: Smile,
    title: "Care & Comfort",
    description: "Painless treatment followed by lifetime aftercare and check-ups.",
  },
];

const ProcessSteps = () => {
  return (
    <section className="section-padding relative overflow-hidden bg-background">
      {/* Decorative grid + blobs */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="glow-orb w-80 h-80 bg-primary/10 -top-20 -left-20" />
      <div className="glow-orb w-96 h-96 bg-accent/10 -bottom-24 -right-16" />

      <div className="container-custom relative">
        <div className="text-center max-w-2xl mx-auto mb-14 animate-slide-up">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            How It Works
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Your Journey to a Confident Smile
          </h2>
          <p className="text-muted-foreground text-lg">
            Simple, transparent and gentle — from your first click to your final follow-up.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="relative group animate-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="glass-card rounded-3xl p-6 h-full transition-all duration-300 hover:-translate-y-1.5">
                  {/* Step number */}
                  <div className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm shadow-md">
                    0{i + 1}
                  </div>

                  {/* Icon */}
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-teal-dark flex items-center justify-center mb-5 mx-auto shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform">
                    <step.icon className="w-8 h-8 text-primary-foreground" />
                    <span className="absolute inset-0 rounded-2xl bg-primary/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                  </div>

                  <h3 className="font-display text-xl font-bold text-foreground mb-2 text-center">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed text-center">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/book-appointment">
            <Button variant="cta" size="lg" className="group">
              Start Your Journey
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
