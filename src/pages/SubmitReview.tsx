 import { useState } from "react";
 import Layout from "@/components/layout/Layout";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Textarea } from "@/components/ui/textarea";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { supabase } from "@/integrations/supabase/client";
 import { useToast } from "@/hooks/use-toast";
 import { Star, CheckCircle, Heart, Send } from "lucide-react";
 import { z } from "zod";
 
 const reviewSchema = z.object({
   name: z.string().min(2, "Name is required"),
   email: z.string().email("Valid email required").optional().or(z.literal("")),
   phone: z.string().optional(),
   rating: z.number().min(1).max(5),
   treatment: z.string().optional(),
   review: z.string().min(10, "Review must be at least 10 characters").max(1000),
 });
 
 const treatmentTypes = [
   "General Checkup",
   "Teeth Cleaning",
   "Teeth Whitening",
   "Dental Implants",
   "Invisalign / Braces",
   "Root Canal",
   "Cosmetic Dentistry",
   "Emergency Care",
   "Other",
 ];
 
 const SubmitReview = () => {
   const { toast } = useToast();
   const [isSubmitted, setIsSubmitted] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [rating, setRating] = useState(5);
   const [hoveredRating, setHoveredRating] = useState(0);
   const [formData, setFormData] = useState({
     name: "",
     email: "",
     phone: "",
     treatment: "",
     review: "",
   });
   const [errors, setErrors] = useState<Record<string, string>>({});
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setErrors({});
 
     const result = reviewSchema.safeParse({ ...formData, rating });
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
       const { error } = await supabase.from("patient_reviews").insert({
         patient_name: formData.name,
         patient_email: formData.email || null,
         patient_phone: formData.phone || null,
         rating: rating,
         treatment_type: formData.treatment || null,
         review_text: formData.review,
       });
 
       if (error) throw error;
 
       setIsSubmitted(true);
     } catch (error) {
       toast({
         title: "Error",
         description: "Failed to submit review. Please try again.",
         variant: "destructive",
       });
     } finally {
       setIsLoading(false);
     }
   };
 
   if (isSubmitted) {
     return (
       <Layout>
         <section className="section-padding bg-background min-h-[60vh] flex items-center">
           <div className="container-custom">
             <div className="max-w-lg mx-auto text-center animate-scale-in">
               <div className="w-20 h-20 rounded-full bg-teal-light flex items-center justify-center mx-auto mb-6">
                 <Heart className="w-10 h-10 text-primary fill-primary" />
               </div>
               <h1 className="font-display text-3xl font-bold text-foreground mb-4">
                 Thank You for Your Review!
               </h1>
               <p className="text-muted-foreground mb-6">
                 Your feedback means the world to us. Your review will be published after approval.
               </p>
               <div className="flex justify-center gap-1 mb-6">
                 {[1, 2, 3, 4, 5].map((star) => (
                   <Star
                     key={star}
                     className={`w-8 h-8 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-muted"}`}
                   />
                 ))}
               </div>
               <Button onClick={() => {
                 setIsSubmitted(false);
                 setFormData({ name: "", email: "", phone: "", treatment: "", review: "" });
                 setRating(5);
               }}>
                 Submit Another Review
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
           <div className="max-w-2xl mx-auto">
             <div className="text-center mb-12 animate-slide-up">
               <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                 <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
               </div>
               <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                 Share Your Experience
               </h1>
               <p className="text-lg text-muted-foreground">
                 Your feedback helps us improve and helps others make informed decisions.
               </p>
             </div>
 
             <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-soft animate-slide-up" style={{ animationDelay: "0.1s" }}>
               <form onSubmit={handleSubmit} className="space-y-6">
                 {/* Star Rating */}
                 <div className="text-center">
                   <Label className="text-lg font-medium block mb-3">How was your experience?</Label>
                   <div className="flex justify-center gap-2">
                     {[1, 2, 3, 4, 5].map((star) => (
                       <button
                         key={star}
                         type="button"
                         className="transition-transform hover:scale-110"
                         onMouseEnter={() => setHoveredRating(star)}
                         onMouseLeave={() => setHoveredRating(0)}
                         onClick={() => setRating(star)}
                       >
                         <Star
                           className={`w-10 h-10 transition-colors ${
                             star <= (hoveredRating || rating)
                               ? "text-yellow-400 fill-yellow-400"
                               : "text-muted-foreground/30"
                           }`}
                         />
                       </button>
                     ))}
                   </div>
                   <p className="text-sm text-muted-foreground mt-2">
                     {rating === 5 && "Excellent!"}
                     {rating === 4 && "Very Good"}
                     {rating === 3 && "Good"}
                     {rating === 2 && "Fair"}
                     {rating === 1 && "Poor"}
                   </p>
                 </div>
 
                 <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <Label htmlFor="name">Your Name *</Label>
                     <Input
                       id="name"
                       placeholder="John D."
                       value={formData.name}
                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                       className={errors.name ? "border-destructive" : ""}
                     />
                     {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                   </div>
 
                   <div className="space-y-2">
                     <Label htmlFor="treatment">Treatment Received</Label>
                     <Select
                       value={formData.treatment}
                       onValueChange={(value) => setFormData({ ...formData, treatment: value })}
                     >
                       <SelectTrigger>
                         <SelectValue placeholder="Select treatment" />
                       </SelectTrigger>
                       <SelectContent>
                         {treatmentTypes.map((type) => (
                           <SelectItem key={type} value={type}>
                             {type}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   </div>
                 </div>
 
                 <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <Label htmlFor="email">Email (optional)</Label>
                     <Input
                       id="email"
                       type="email"
                       placeholder="john@example.com"
                       value={formData.email}
                       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                     />
                   </div>
 
                   <div className="space-y-2">
                     <Label htmlFor="phone">Phone (optional)</Label>
                     <Input
                       id="phone"
                       type="tel"
                       placeholder="(123) 456-7890"
                       value={formData.phone}
                       onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                     />
                   </div>
                 </div>
 
                 <div className="space-y-2">
                   <Label htmlFor="review">Your Review *</Label>
                   <Textarea
                     id="review"
                     placeholder="Tell us about your experience at our clinic..."
                     rows={5}
                     value={formData.review}
                     onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                     className={errors.review ? "border-destructive" : ""}
                   />
                   {errors.review && <p className="text-sm text-destructive">{errors.review}</p>}
                   <p className="text-xs text-muted-foreground text-right">
                     {formData.review.length}/1000 characters
                   </p>
                 </div>
 
                 <Button type="submit" size="xl" className="w-full gap-2" disabled={isLoading}>
                   <Send className="w-5 h-5" />
                   {isLoading ? "Submitting..." : "Submit Review"}
                 </Button>
 
                 <p className="text-sm text-muted-foreground text-center">
                   Your review will be published after approval by our team.
                 </p>
               </form>
             </div>
           </div>
         </div>
       </section>
     </Layout>
   );
 };
 
 export default SubmitReview;