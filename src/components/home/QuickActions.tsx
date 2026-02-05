 import { Link } from "react-router-dom";
 import { Video, Calculator, Smile, Star, Calendar } from "lucide-react";
 
 const actions = [
   { icon: Calendar, label: "Book Appointment", href: "/book-appointment", color: "from-primary to-teal-dark" },
   { icon: Video, label: "Virtual Consultation", href: "/virtual-consultation", color: "from-accent to-coral" },
   { icon: Calculator, label: "Cost Calculator", href: "/cost-calculator", color: "from-teal-dark to-primary" },
   { icon: Smile, label: "Smile Simulator", href: "/smile-simulator", color: "from-coral to-accent" },
   { icon: Star, label: "Leave Review", href: "/submit-review", color: "from-yellow-400 to-yellow-600" },
 ];
 
 const QuickActions = () => {
   return (
     <section className="py-8 -mt-8 relative z-20">
       <div className="container-custom px-4">
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
           {actions.map((action, index) => (
             <Link
               key={index}
               to={action.href}
               className="group animate-slide-up"
               style={{ animationDelay: `${index * 0.05}s` }}
             >
               <div className="bg-card rounded-2xl p-4 md:p-6 border border-border/50 shadow-soft hover:shadow-medium transition-all text-center group-hover:-translate-y-1">
                 <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                   <action.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                 </div>
                 <span className="font-medium text-foreground text-xs md:text-sm">{action.label}</span>
               </div>
             </Link>
           ))}
         </div>
       </div>
     </section>
   );
 };
 
 export default QuickActions;