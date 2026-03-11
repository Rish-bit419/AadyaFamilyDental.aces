import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, User, MessageCircle, CheckCircle, Phone, UserPlus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const appointmentSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please enter a valid email").optional().or(z.literal("")),
  phone: z.string().trim().min(10, "Please enter a valid phone number").max(20),
  service: z.string().min(1, "Please select a service"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  message: z.string().max(1000).optional(),
});

const services = [
  "General Checkup",
  "Teeth Cleaning",
  "Teeth Whitening",
  "Dental Implants",
  "Orthodontics",
  "Root Canal",
  "Cosmetic Dentistry",
  "Pediatric Dentistry",
  "Other",
];

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

const BookAppointment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSignupBanner, setShowSignupBanner] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate form
    const result = appointmentSchema.safeParse(formData);
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
      // Save to database
      const { error } = await supabase.from("appointments").insert({
        patient_name: formData.name,
        patient_email: formData.email || null,
        patient_phone: formData.phone,
        service_name: formData.service,
        preferred_date: formData.date,
        preferred_time: formData.time,
        message: formData.message || null,
        status: "pending",
      });

      if (error) throw error;

      setIsSubmitted(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit appointment. Please try again.",
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
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Appointment Request Sent!
              </h1>
              <p className="text-muted-foreground mb-6">
                Thank you for booking with us. Our team will get back to you within 24 hours to confirm your appointment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="default" onClick={() => setIsSubmitted(false)}>
                  Book Another Appointment
                </Button>
                <a href="tel:+916366360115">
                  <Button variant="outline">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Us Instead
                  </Button>
                </a>
                <p className="text-sm text-muted-foreground font-medium mt-2">063663 60115</p>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              Book Appointment
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Schedule Your Visit
            </h1>
            <p className="text-lg text-muted-foreground">
              Fill out the form below and we'll confirm your appointment within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Sign Up Banner */}
      {showSignupBanner && (
        <div className="bg-primary/10 border-b border-primary/20">
          <div className="container-custom py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <UserPlus className="w-5 h-5 text-primary shrink-0" />
              <p className="text-sm text-foreground">
                <span className="font-medium">Want to track your appointments?</span>{" "}
                Sign up as a patient to store your data and view appointment status.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link to="/patient/auth">
                <Button size="sm" variant="default" className="gap-1">
                  <UserPlus className="w-3 h-3" /> Sign Up
                </Button>
              </Link>
              <button
                onClick={() => setShowSignupBanner(false)}
                className="p-1 rounded-md hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Form */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8 animate-slide-up">
              {/* Personal Information */}
              <div className="space-y-6">
                <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Personal Information
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <Label htmlFor="name">Full Name *</Label>
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
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="rahul@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
              </div>

              {/* Appointment Details */}
              <div className="space-y-6">
                <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Appointment Details
                </h2>

                <div className="space-y-2">
                  <Label htmlFor="service">Service Required *</Label>
                  <Select
                    value={formData.service}
                    onValueChange={(value) => setFormData({ ...formData, service: value })}
                  >
                    <SelectTrigger className={errors.service ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.service && <p className="text-sm text-destructive">{errors.service}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date">Preferred Date *</Label>
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
                    <Label htmlFor="time">Preferred Time *</Label>
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
                  <Label htmlFor="message">Additional Notes</Label>
                  <Textarea
                    id="message"
                    placeholder="Any specific concerns or requests..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
              </div>

              {/* Submit & Cancel */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="xl"
                  className="flex-1"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="cta" size="xl" className="flex-[2]" disabled={isLoading}>
                  <Calendar className="w-5 h-5 mr-2" />
                  {isLoading ? "Submitting..." : "Book Now"}
                </Button>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                By submitting this form, you agree to be contacted regarding your appointment request.
              </p>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BookAppointment;
