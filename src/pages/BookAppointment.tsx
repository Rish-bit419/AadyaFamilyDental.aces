import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, Phone, Mail, MessageCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.phone || !formData.service || !formData.date || !formData.time) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Simulate form submission
    setIsSubmitted(true);
    
    // Create WhatsApp message
    const whatsappMessage = encodeURIComponent(
      `Hello! I'd like to book an appointment.\n\nName: ${formData.name}\nPhone: ${formData.phone}\nService: ${formData.service}\nDate: ${formData.date}\nTime: ${formData.time}\n${formData.message ? `Message: ${formData.message}` : ""}`
    );
    
    // Open WhatsApp after a short delay
    setTimeout(() => {
      window.open(`https://wa.me/1234567890?text=${whatsappMessage}`, "_blank");
    }, 2000);
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
                Thank you for booking with us. We're redirecting you to WhatsApp to confirm your appointment details. Our team will get back to you within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="default" onClick={() => setIsSubmitted(false)}>
                  Book Another Appointment
                </Button>
                <a href="tel:+1234567890">
                  <Button variant="outline">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Us Instead
                  </Button>
                </a>
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
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(123) 456-7890"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
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
                    <SelectTrigger>
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
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Preferred Time *</Label>
                    <Select
                      value={formData.time}
                      onValueChange={(value) => setFormData({ ...formData, time: value })}
                    >
                      <SelectTrigger>
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

              {/* Submit */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button type="submit" variant="cta" size="xl" className="flex-1">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Book via WhatsApp
                </Button>
                <a href="tel:+1234567890" className="flex-1">
                  <Button type="button" variant="outline" size="xl" className="w-full">
                    <Phone className="w-5 h-5 mr-2" />
                    Call to Book
                  </Button>
                </a>
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
