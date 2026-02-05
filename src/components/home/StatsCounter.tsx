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
     <section ref={sectionRef} className="py-16 bg-gradient-to-r from-primary via-teal-dark to-primary">
       <div className="container-custom">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
           {stats.map((stat, index) => (
             <div
               key={index}
               className="text-center animate-slide-up"
               style={{ animationDelay: `${index * 0.1}s` }}
             >
               <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                 <stat.icon className="w-8 h-8 text-white" />
               </div>
               <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                 {stat.value < 10 ? counts[index].toFixed(1) : counts[index].toLocaleString()}
                 {stat.suffix}
               </div>
               <div className="text-white/80 text-sm font-medium">{stat.label}</div>
             </div>
           ))}
         </div>
       </div>
     </section>
   );
 };
 
 export default StatsCounter;