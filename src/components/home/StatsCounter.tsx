 import { useEffect, useState, useRef } from "react";
 import { Users, Star, Award, Clock } from "lucide-react";
 
 interface StatItem {
   icon: typeof Users;
   value: number;
   suffix: string;
   label: string;
 }
 
 const stats: StatItem[] = [
   { icon: Users, value: 10000, suffix: "+", label: "Happy Patients" },
   { icon: Star, value: 4.9, suffix: "", label: "Google Rating" },
   { icon: Award, value: 15, suffix: "+", label: "Years Experience" },
   { icon: Clock, value: 24, suffix: "/7", label: "Emergency Care" },
 ];
 
 const StatsCounter = () => {
   const [isVisible, setIsVisible] = useState(false);
   const [counts, setCounts] = useState(stats.map(() => 0));
   const sectionRef = useRef<HTMLDivElement>(null);
 
   useEffect(() => {
     const observer = new IntersectionObserver(
       (entries) => {
         if (entries[0].isIntersecting) {
           setIsVisible(true);
         }
       },
       { threshold: 0.3 }
     );
 
     if (sectionRef.current) {
       observer.observe(sectionRef.current);
     }
 
     return () => observer.disconnect();
   }, []);
 
   useEffect(() => {
     if (!isVisible) return;
 
     const duration = 2000;
     const steps = 60;
     const interval = duration / steps;
 
     let step = 0;
     const timer = setInterval(() => {
       step++;
       const progress = step / steps;
       const easeOut = 1 - Math.pow(1 - progress, 3);
 
       setCounts(stats.map((stat) => {
         if (stat.value < 10) {
           return parseFloat((stat.value * easeOut).toFixed(1));
         }
         return Math.floor(stat.value * easeOut);
       }));
 
       if (step >= steps) {
         clearInterval(timer);
         setCounts(stats.map((stat) => stat.value));
       }
     }, interval);
 
     return () => clearInterval(timer);
   }, [isVisible]);
 
  return (
    <section
      ref={sectionRef}
      className="relative py-20 overflow-hidden bg-gradient-to-br from-primary via-teal-dark to-primary"
    >
      {/* Decorative dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary-foreground/10 rounded-full blur-3xl" />

      <div className="container-custom relative">
        <div className="text-center mb-12 animate-slide-up">
          <span className="inline-block text-xs font-semibold text-primary-foreground/80 uppercase tracking-[0.2em] mb-3">
            By The Numbers
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">
            Trusted by thousands across Bengaluru
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative rounded-3xl p-6 md:p-8 text-center bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 hover:-translate-y-1 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg">
                <stat.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="text-3xl md:text-5xl font-bold text-primary-foreground mb-1 font-display tracking-tight">
                {stat.value < 10 ? counts[index].toFixed(1) : counts[index].toLocaleString()}
                <span className="text-accent">{stat.suffix}</span>
              </div>
              <div className="text-primary-foreground/80 text-sm font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
 };
 
 export default StatsCounter;