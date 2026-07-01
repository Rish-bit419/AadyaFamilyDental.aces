import { Award, ShieldCheck, Sparkles, HeartPulse, Stethoscope, Users, Star, BadgeCheck } from "lucide-react";

const items = [
  { icon: Award, label: "Award Winning Clinic" },
  { icon: ShieldCheck, label: "Sterilization Certified" },
  { icon: Sparkles, label: "Advanced Technology" },
  { icon: HeartPulse, label: "Painless Procedures" },
  { icon: Stethoscope, label: "Specialist Team" },
  { icon: Users, label: "10,000+ Happy Patients" },
  { icon: Star, label: "4.9★ Google Rated" },
  { icon: BadgeCheck, label: "IDA Registered" },
];

const TrustMarquee = () => {
  const loop = [...items, ...items];
  return (
    <section className="py-10 bg-gradient-to-r from-secondary/60 via-background to-secondary/60 border-y border-border/60 overflow-hidden">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="flex gap-4 animate-[marquee_28s_linear_infinite] whitespace-nowrap">
          {loop.map((it, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-card shrink-0"
            >
              <it.icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">{it.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default TrustMarquee;
