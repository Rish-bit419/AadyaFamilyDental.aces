 import { useState, useEffect } from "react";
 import { useNavigate } from "react-router-dom";
 import Layout from "@/components/layout/Layout";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { supabase } from "@/integrations/supabase/client";
 import { useToast } from "@/hooks/use-toast";
 import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Heart, Calendar, FileText } from "lucide-react";
 import { z } from "zod";
 
 const loginSchema = z.object({
   email: z.string().email("Please enter a valid email"),
   password: z.string().min(6, "Password must be at least 6 characters"),
 });
 
 const signupSchema = loginSchema.extend({
   fullName: z.string().min(2, "Name must be at least 2 characters"),
   confirmPassword: z.string(),
 }).refine((data) => data.password === data.confirmPassword, {
   message: "Passwords do not match",
   path: ["confirmPassword"],
 });
 
 const PatientAuth = () => {
   const navigate = useNavigate();
   const { toast } = useToast();
   const [isSignup, setIsSignup] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const [formData, setFormData] = useState({
     email: "",
     password: "",
     confirmPassword: "",
     fullName: "",
   });
   const [errors, setErrors] = useState<Record<string, string>>({});
 
   useEffect(() => {
     // Check if already logged in
     const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
       if (session?.user) {
         navigate("/patient/dashboard");
       }
     });
 
     supabase.auth.getSession().then(({ data: { session } }) => {
       if (session?.user) {
         navigate("/patient/dashboard");
       }
     });
 
     return () => subscription.unsubscribe();
   }, [navigate]);
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setErrors({});
 
     const schema = isSignup ? signupSchema : loginSchema;
     const result = schema.safeParse(formData);
 
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
       if (isSignup) {
         const { error } = await supabase.auth.signUp({
           email: formData.email,
           password: formData.password,
           options: {
             emailRedirectTo: `${window.location.origin}/patient/dashboard`,
             data: {
               full_name: formData.fullName,
             },
           },
         });
 
         if (error) throw error;
 
         toast({
           title: "Account created!",
           description: "You can now sign in to your patient portal.",
         });
         setIsSignup(false);
       } else {
         const { error } = await supabase.auth.signInWithPassword({
           email: formData.email,
           password: formData.password,
         });
 
         if (error) throw error;
 
         navigate("/patient/dashboard");
       }
     } catch (error: any) {
       toast({
         title: "Error",
         description: error.message || "Something went wrong",
         variant: "destructive",
       });
     } finally {
       setIsLoading(false);
     }
   };
 
   const benefits = [
     { icon: Calendar, title: "Easy Booking", desc: "Schedule appointments online 24/7" },
     { icon: FileText, title: "Treatment History", desc: "Access your complete dental records" },
     { icon: Heart, title: "Personalized Care", desc: "Get tailored treatment recommendations" },
   ];
 
   return (
     <Layout>
       <section className="section-padding bg-gradient-to-b from-secondary to-background min-h-[80vh]">
         <div className="container-custom">
           <div className="max-w-5xl mx-auto">
             <div className="grid lg:grid-cols-2 gap-12 items-center">
               {/* Left - Benefits */}
               <div className="hidden lg:block animate-slide-up">
                 <h1 className="font-display text-4xl font-bold text-foreground mb-6">
                   Your Personal <span className="text-primary">Dental Portal</span>
                 </h1>
                 <p className="text-muted-foreground mb-8">
                   Manage your dental health journey with ease. Book appointments, view your treatment history, and stay connected with your care team.
                 </p>
 
                 <div className="space-y-6">
                   {benefits.map((benefit, i) => (
                     <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border/50 hover:shadow-soft transition-shadow">
                       <div className="w-12 h-12 rounded-xl bg-teal-light flex items-center justify-center shrink-0">
                         <benefit.icon className="w-6 h-6 text-primary" />
                       </div>
                       <div>
                         <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                         <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
 
               {/* Right - Form */}
               <div className="bg-card rounded-2xl p-8 shadow-medium border border-border/50 animate-slide-up">
                 <div className="text-center mb-8">
                   <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                     <User className="w-8 h-8 text-primary" />
                   </div>
                   <h2 className="font-display text-2xl font-bold text-foreground">
                     {isSignup ? "Create Account" : "Welcome Back"}
                   </h2>
                   <p className="text-muted-foreground mt-2">
                     {isSignup
                       ? "Join our patient community today"
                       : "Sign in to access your portal"}
                   </p>
                 </div>
 
                 <form onSubmit={handleSubmit} className="space-y-4">
                   {isSignup && (
                     <div className="space-y-2">
                       <Label htmlFor="fullName">Full Name</Label>
                       <div className="relative">
                         <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                         <Input
                           id="fullName"
                           placeholder="John Doe"
                           className={`pl-10 ${errors.fullName ? "border-destructive" : ""}`}
                           value={formData.fullName}
                           onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                         />
                       </div>
                       {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                     </div>
                   )}
 
                   <div className="space-y-2">
                     <Label htmlFor="email">Email Address</Label>
                     <div className="relative">
                       <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                       <Input
                         id="email"
                         type="email"
                         placeholder="you@example.com"
                         className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                         value={formData.email}
                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                       />
                     </div>
                     {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                   </div>
 
                   <div className="space-y-2">
                     <Label htmlFor="password">Password</Label>
                     <div className="relative">
                       <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                       <Input
                         id="password"
                         type={showPassword ? "text" : "password"}
                         placeholder="••••••••"
                         className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                         value={formData.password}
                         onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                       />
                       <button
                         type="button"
                         className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                         onClick={() => setShowPassword(!showPassword)}
                       >
                         {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                       </button>
                     </div>
                     {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                   </div>
 
                   {isSignup && (
                     <div className="space-y-2">
                       <Label htmlFor="confirmPassword">Confirm Password</Label>
                       <div className="relative">
                         <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                         <Input
                           id="confirmPassword"
                           type="password"
                           placeholder="••••••••"
                           className={`pl-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                           value={formData.confirmPassword}
                           onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                         />
                       </div>
                       {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                     </div>
                   )}
 
                   <Button type="submit" className="w-full gap-2" size="lg" disabled={isLoading}>
                     {isLoading ? "Please wait..." : isSignup ? "Create Account" : "Sign In"}
                     <ArrowRight className="w-4 h-4" />
                   </Button>
                 </form>
 
                 <div className="mt-6 text-center">
                   <p className="text-sm text-muted-foreground">
                     {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                     <button
                       type="button"
                       className="text-primary font-medium hover:underline"
                       onClick={() => {
                         setIsSignup(!isSignup);
                         setErrors({});
                       }}
                     >
                       {isSignup ? "Sign In" : "Create One"}
                     </button>
                   </p>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </section>
     </Layout>
   );
 };
 
 export default PatientAuth;