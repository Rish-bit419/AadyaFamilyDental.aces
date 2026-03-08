 import { useState } from "react";
 import Layout from "@/components/layout/Layout";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Textarea } from "@/components/ui/textarea";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { supabase } from "@/integrations/supabase/client";
 import { useToast } from "@/hooks/use-toast";
 import { Video, Clock, Shield, CheckCircle, Calendar, User, Mail, Phone as PhoneIcon, MessageSquare } from "lucide-react";
 import { z } from "zod";
 
 const consultationSchema = z.object({
   name: z.string().min(2, "Name is required"),
   email: z.string().email("Valid email required"),
   phone: z.string().min(10, "Valid phone required"),
   date: z.string().min(1, "Date is required"),
   time: z.string().min(1, "Time is required"),
   type: z.string().min(1, "Consultation type is required"),
   concern: z.string().max(1000).optional(),
 });
 
 const consultationTypes = [
   { value: "general", label: "General Dental Consultation" },
   { value: "cosmetic", label: "Cosmetic Dentistry" },
   { value: "orthodontics", label: "Orthodontics / Invisalign" },
   { value: "implants", label: "Dental Implants" },
   { value: "emergency", label: "Dental Emergency" },
   { value: "second-opinion", label: "Second Opinion" },
 ];
 
 const timeSlots = [
   "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
   "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM",
 ];
 
 const VirtualConsultation = () => {
   const { toast } = useToast();
   const [isSubmitted, setIsSubmitted] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [formData, setFormData] = useState({
     name: "",
     email: "",
     phone: "",
     date: "",
     time: "",
     type: "",
     concern: "",
   });
   const [errors, setErrors] = useState<Record<string, string>>({});
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setErrors({});
 
     const result = consultationSchema.safeParse(formData);
     if (!result.success) {
       const fieldErrors: Record<string, string> = {};
       result.error.errors.forEach((error) => {
         if (error.path[0]) {
           fieldErrors[error.path[0] as string] = error.message;
         }
       });
       setErrors(fieldErrors);
       return;
     }
 
     setIsLoading(true);
 
     try {
       const { error } = await supabase.from("virtual_consultations").insert({
         patient_name: formData.name,
         patient_email: formData.email,
         patient_phone: formData.phone,
         preferred_date: formData.date,
         preferred_time: formData.time,
         consultation_type: formData.type,
         concern_description: formData.concern || null,
       });
 
       if (error) throw error;
 
       setIsSubmitted(true);
     } catch (error) {
       toast({
         title: "Error",
         description: "Failed to book consultation. Please try again.",
         variant: "destructive",
       });
     } finally {
       setIsLoading(false);
     }
   };
 
   const benefits = [
    { icon: Video, title: "HD Video Call", desc: "Crystal clear video consultations" },
    { icon: Clock, title: "15-30 Minutes", desc: "Comprehensive discussion time" },
    { icon: Shield, title: "Secure & Private", desc: "Confidential consultations" },
   ];
 
   if (isSubmitted) {
     return (
       <Layout>
         <section className="section-padding bg-background min-h-[60vh] flex items-center">
           <div className="container-custom">
             <div className="max-w-lg mx-auto text-center animate-scale-in">
               <div className="w-20 h-20 rounded-full bg-teal-light flex items-center justify-center mx-auto mb-6">
                 <CheckCircle className="w-10 h-10 text-primary" />
               </div>
               <h1 className="font-display text-3xl font-bold text-foreground mb-4">
                 Consultation Booked!
               </h1>
               <p className="text-muted-foreground mb-2">
                 Your virtual consultation has been scheduled for:
               </p>
               <p className="text-lg font-semibold text-primary mb-6">
                 {formData.date} at {formData.time}
               </p>
               <p className="text-muted-foreground mb-6">
                 You'll receive a confirmation email with the video call link shortly.
               </p>
               <Button onClick={() => setIsSubmitted(false)}>
                 Book Another Consultation
               </Button>
             </div>
           </div>
         </section>
       </Layout>
     );
   }
 
   return (
     <Layout>
       <section className="section-padding bg-gradient-to-b from-secondary to-background">
         <div className="container-custom">
           <div className="max-w-5xl mx-auto">
             <div className="text-center mb-12 animate-slide-up">
               <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
                 <Video className="w-4 h-4 text-primary" />
                 <span className="text-sm font-semibold text-primary">Virtual Care</span>
               </div>
               <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                 Virtual Consultation
               </h1>
               <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                 Connect with our dental experts from the comfort of your home. Get professional advice without visiting the clinic.
               </p>
             </div>
 
             {/* Benefits */}
             <div className="grid md:grid-cols-3 gap-6 mb-12 animate-slide-up" style={{ animationDelay: "0.1s" }}>
               {benefits.map((benefit, i) => (
                 <div key={i} className="bg-card p-6 rounded-2xl border border-border/50 text-center hover:shadow-soft transition-shadow">
                   <div className="w-14 h-14 rounded-xl bg-teal-light flex items-center justify-center mx-auto mb-4">
                     <benefit.icon className="w-7 h-7 text-primary" />
                   </div>
                   <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                   <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                 </div>
               ))}
             </div>
 
             {/* Form */}
             <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-soft animate-slide-up" style={{ animationDelay: "0.2s" }}>
               <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <Label htmlFor="name" className="flex items-center gap-2">
                       <User className="w-4 h-4 text-muted-foreground" />
                       Full Name *
                     </Label>
                      <Input
                        id="name"
                        placeholder="Rahul Sharma"
                        value={formData.name}
                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                       className={errors.name ? "border-destructive" : ""}
                     />
                     {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                   </div>
 
                   <div className="space-y-2">
                     <Label htmlFor="email" className="flex items-center gap-2">
                       <Mail className="w-4 h-4 text-muted-foreground" />
                       Email Address *
                     </Label>
                     <Input
                       id="email"
                       type="email"
                       placeholder="john@example.com"
                       value={formData.email}
                       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                       className={errors.email ? "border-destructive" : ""}
                     />
                     {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                   </div>
 
                   <div className="space-y-2">
                     <Label htmlFor="phone" className="flex items-center gap-2">
                       <PhoneIcon className="w-4 h-4 text-muted-foreground" />
                       Phone Number *
                     </Label>
                     <Input
                       id="phone"
                       type="tel"
                       placeholder="(123) 456-7890"
                       value={formData.phone}
                       onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                       className={errors.phone ? "border-destructive" : ""}
                     />
                     {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                   </div>
 
                   <div className="space-y-2">
                     <Label htmlFor="type">Consultation Type *</Label>
                     <Select
                       value={formData.type}
                       onValueChange={(value) => setFormData({ ...formData, type: value })}
                     >
                       <SelectTrigger className={errors.type ? "border-destructive" : ""}>
                         <SelectValue placeholder="Select type" />
                       </SelectTrigger>
                       <SelectContent>
                         {consultationTypes.map((type) => (
                           <SelectItem key={type.value} value={type.value}>
                             {type.label}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                     {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                   </div>
 
                   <div className="space-y-2">
                     <Label htmlFor="date" className="flex items-center gap-2">
                       <Calendar className="w-4 h-4 text-muted-foreground" />
                       Preferred Date *
                     </Label>
                     <Input
                       id="date"
                       type="date"
                       value={formData.date}
                       onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                       min={new Date().toISOString().split("T")[0]}
                       className={errors.date ? "border-destructive" : ""}
                     />
                     {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
                   </div>
 
                   <div className="space-y-2">
                     <Label htmlFor="time" className="flex items-center gap-2">
                       <Clock className="w-4 h-4 text-muted-foreground" />
                       Preferred Time *
                     </Label>
                     <Select
                       value={formData.time}
                       onValueChange={(value) => setFormData({ ...formData, time: value })}
                     >
                       <SelectTrigger className={errors.time ? "border-destructive" : ""}>
                         <SelectValue placeholder="Select time" />
                       </SelectTrigger>
                       <SelectContent>
                         {timeSlots.map((time) => (
                           <SelectItem key={time} value={time}>
                             {time}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                     {errors.time && <p className="text-sm text-destructive">{errors.time}</p>}
                   </div>
                 </div>
 
                 <div className="space-y-2">
                   <Label htmlFor="concern" className="flex items-center gap-2">
                     <MessageSquare className="w-4 h-4 text-muted-foreground" />
                     Describe Your Concern (Optional)
                   </Label>
                   <Textarea
                     id="concern"
                     placeholder="Tell us about your dental concerns or questions..."
                     rows={4}
                     value={formData.concern}
                     onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
                   />
                 </div>
 
                 <Button type="submit" size="xl" className="w-full gap-2" disabled={isLoading}>
                   <Video className="w-5 h-5" />
                   {isLoading ? "Booking..." : "Book Virtual Consultation"}
                 </Button>
 
                 <p className="text-sm text-muted-foreground text-center">
                   Free consultation • No commitment required
                 </p>
               </form>
             </div>
           </div>
         </div>
       </section>
     </Layout>
   );
 };
 
 export default VirtualConsultation;