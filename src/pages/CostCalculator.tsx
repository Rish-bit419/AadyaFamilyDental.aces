 import { useState, useEffect } from "react";
 import Layout from "@/components/layout/Layout";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Checkbox } from "@/components/ui/checkbox";
 import { supabase } from "@/integrations/supabase/client";
 import { useToast } from "@/hooks/use-toast";
 import { Calculator, Plus, Minus, Send, Sparkles, Phone, Calendar } from "lucide-react";
 import { Link } from "react-router-dom";
 
 interface ServiceOption {
   id: string;
   name: string;
   price: number | null;
   duration_minutes: number | null;
 }
 
 const CostCalculator = () => {
   const { toast } = useToast();
   const [services, setServices] = useState<ServiceOption[]>([]);
   const [selectedServices, setSelectedServices] = useState<Map<string, number>>(new Map());
   const [isLoading, setIsLoading] = useState(true);
   const [isSending, setIsSending] = useState(false);
   const [contactInfo, setContactInfo] = useState({ name: "", email: "", phone: "" });
 
   useEffect(() => {
     const fetchServices = async () => {
       const { data } = await supabase
         .from("services")
         .select("id, name, price, duration_minutes")
         .eq("is_active", true)
         .order("name");
 
       if (data) {
         setServices(data);
       }
       setIsLoading(false);
     };
     fetchServices();
   }, []);
 
   const toggleService = (serviceId: string) => {
     const newSelected = new Map(selectedServices);
     if (newSelected.has(serviceId)) {
       newSelected.delete(serviceId);
     } else {
       newSelected.set(serviceId, 1);
     }
     setSelectedServices(newSelected);
   };
 
   const updateQuantity = (serviceId: string, delta: number) => {
     const newSelected = new Map(selectedServices);
     const current = newSelected.get(serviceId) || 1;
     const newQty = Math.max(1, current + delta);
     newSelected.set(serviceId, newQty);
     setSelectedServices(newSelected);
   };
 
   const calculateTotal = () => {
     let total = 0;
     selectedServices.forEach((qty, id) => {
       const service = services.find((s) => s.id === id);
       if (service?.price) {
         total += service.price * qty;
       }
     });
     return total;
   };
 
   const calculateDuration = () => {
     let total = 0;
     selectedServices.forEach((qty, id) => {
       const service = services.find((s) => s.id === id);
       if (service?.duration_minutes) {
         total += service.duration_minutes * qty;
       }
     });
     return total;
   };
 
   const handleSendEstimate = async () => {
     if (selectedServices.size === 0) {
       toast({
         title: "No services selected",
         description: "Please select at least one service to get an estimate.",
         variant: "destructive",
       });
       return;
     }
 
     setIsSending(true);
 
     const selectedData = Array.from(selectedServices.entries()).map(([id, qty]) => {
       const service = services.find((s) => s.id === id);
       return { name: service?.name, quantity: qty, price: service?.price };
     });
 
     try {
       await supabase.from("cost_estimates").insert({
         patient_name: contactInfo.name || null,
         patient_email: contactInfo.email || null,
         patient_phone: contactInfo.phone || null,
         selected_services: selectedData,
         total_estimate: calculateTotal(),
       });
 
       toast({
         title: "Estimate saved!",
         description: "We'll contact you soon to discuss your treatment plan.",
       });
     } catch (error) {
       toast({
         title: "Error saving estimate",
         variant: "destructive",
       });
     } finally {
       setIsSending(false);
     }
   };
 
   const total = calculateTotal();
   const duration = calculateDuration();
 
   return (
     <Layout>
       <section className="section-padding bg-gradient-to-b from-secondary to-background">
         <div className="container-custom">
           <div className="max-w-4xl mx-auto">
             <div className="text-center mb-12 animate-slide-up">
               <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                 <Calculator className="w-8 h-8 text-primary" />
               </div>
               <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                 Treatment Cost Calculator
               </h1>
               <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                 Get an instant estimate for your dental treatment. Select the services you're interested in below.
               </p>
             </div>
 
             <div className="grid lg:grid-cols-3 gap-8">
               {/* Services List */}
               <div className="lg:col-span-2 space-y-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                 <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                   Select Services
                 </h2>
 
                 {isLoading ? (
                   <div className="space-y-3">
                     {[1, 2, 3, 4].map((i) => (
                       <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />
                     ))}
                   </div>
                 ) : (
                   <div className="space-y-3">
                     {services.map((service) => {
                       const isSelected = selectedServices.has(service.id);
                       const quantity = selectedServices.get(service.id) || 1;
 
                       return (
                         <div
                           key={service.id}
                           className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                             isSelected
                               ? "border-primary bg-teal-light/30"
                               : "border-border/50 bg-card hover:border-primary/50"
                           }`}
                           onClick={() => toggleService(service.id)}
                         >
                           <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                               <Checkbox checked={isSelected} className="pointer-events-none" />
                               <div>
                                 <h3 className="font-medium text-foreground">{service.name}</h3>
                                 {service.duration_minutes && (
                                   <p className="text-sm text-muted-foreground">
                                     ~{service.duration_minutes} min
                                   </p>
                                 )}
                               </div>
                             </div>
 
                             <div className="flex items-center gap-4">
                               {isSelected && (
                                 <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                   <button
                                     className="w-8 h-8 rounded-lg bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors"
                                     onClick={() => updateQuantity(service.id, -1)}
                                   >
                                     <Minus className="w-4 h-4" />
                                   </button>
                                   <span className="w-8 text-center font-medium">{quantity}</span>
                                   <button
                                     className="w-8 h-8 rounded-lg bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors"
                                     onClick={() => updateQuantity(service.id, 1)}
                                   >
                                     <Plus className="w-4 h-4" />
                                   </button>
                                 </div>
                               )}
                               <span className="font-semibold text-primary min-w-[80px] text-right">
                                 {service.price ? `$${service.price}` : "Consult"}
                               </span>
                             </div>
                           </div>
                         </div>
                       );
                     })}
                   </div>
                 )}
               </div>
 
               {/* Summary */}
               <div className="lg:sticky lg:top-24 h-fit animate-slide-up" style={{ animationDelay: "0.2s" }}>
                 <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
                   <h2 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                     <Sparkles className="w-5 h-5 text-primary" />
                     Your Estimate
                   </h2>
 
                   {selectedServices.size > 0 ? (
                     <>
                       <div className="space-y-3 mb-6">
                         {Array.from(selectedServices.entries()).map(([id, qty]) => {
                           const service = services.find((s) => s.id === id);
                           return (
                             <div key={id} className="flex justify-between text-sm">
                               <span className="text-muted-foreground">
                                 {service?.name} × {qty}
                               </span>
                               <span className="font-medium">
                                 ${(service?.price || 0) * qty}
                               </span>
                             </div>
                           );
                         })}
                       </div>
 
                       <div className="border-t border-border pt-4 mb-6">
                         <div className="flex justify-between items-center mb-2">
                           <span className="text-muted-foreground">Estimated Total</span>
                           <span className="text-2xl font-bold text-primary">${total}</span>
                         </div>
                         <div className="flex justify-between items-center text-sm">
                           <span className="text-muted-foreground">Est. Duration</span>
                           <span className="font-medium">{duration} min</span>
                         </div>
                       </div>
 
                       {/* Contact Form */}
                       <div className="space-y-3 mb-6">
                         <Label className="text-sm text-muted-foreground">Get detailed quote (optional)</Label>
                         <Input
                           placeholder="Your name"
                           value={contactInfo.name}
                           onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                         />
                         <Input
                           placeholder="Email"
                           type="email"
                           value={contactInfo.email}
                           onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                         />
                         <Input
                           placeholder="Phone"
                           type="tel"
                           value={contactInfo.phone}
                           onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                         />
                       </div>
 
                       <div className="space-y-3">
                         <Button
                           className="w-full gap-2"
                           onClick={handleSendEstimate}
                           disabled={isSending}
                         >
                           <Send className="w-4 h-4" />
                           {isSending ? "Saving..." : "Get Detailed Quote"}
                         </Button>
                         <Link to="/book-appointment" className="block">
                           <Button variant="outline" className="w-full gap-2">
                             <Calendar className="w-4 h-4" />
                             Book Consultation
                           </Button>
                         </Link>
                       </div>
                     </>
                   ) : (
                     <div className="text-center py-8">
                       <Calculator className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                       <p className="text-muted-foreground">
                         Select services to see your estimate
                       </p>
                     </div>
                   )}
 
                   <p className="text-xs text-muted-foreground mt-4 text-center">
                     *Prices are estimates. Final costs may vary based on individual needs.
                   </p>
                 </div>
 
                 {/* Call CTA */}
                 <div className="mt-4 p-4 bg-gradient-to-br from-accent to-coral rounded-xl text-white text-center">
                   <Phone className="w-6 h-6 mx-auto mb-2" />
                   <p className="text-sm font-medium">Questions? Call us!</p>
                   <a href="tel:+1234567890" className="font-bold">+1 234 567 890</a>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </section>
     </Layout>
   );
 };
 
 export default CostCalculator;