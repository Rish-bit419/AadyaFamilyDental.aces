import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Phone, MessageCircle, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="section-padding hero-gradient relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-20 w-64 h-64 bg-primary-foreground rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-primary-foreground rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative">
        <div className="max-w-3xl mx-auto text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/15 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-primary-foreground animate-pulse-soft" />
            <span className="text-sm font-medium text-primary-foreground">Limited Time Offer: Free Consultation</span>
          </div>
          
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready for Your Best Smile?
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10">
            Schedule your appointment today and take the first step towards a healthier, more beautiful smile. We're here to help you every step of the way.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/book-appointment">
              <Button variant="hero" size="xl" className="w-full sm:w-auto group shadow-lg hover:shadow-xl transition-shadow">
                <Calendar className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Book Appointment
              </Button>
            </Link>
            <a href="https://wa.me/916366360115" target="_blank" rel="noopener noreferrer">
              <Button variant="hero-outline" size="xl" className="w-full sm:w-auto group">
                <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                WhatsApp Us
              </Button>
            </a>
          </div>

          {/* Contact Options */}
          <div className="flex flex-wrap justify-center gap-8">
            <a href="tel:+1234567890" className="flex items-center gap-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors group">
              <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">(123) 456-7890</span>
            </a>
            <span className="text-primary-foreground/50 hidden sm:inline">•</span>
            <span className="text-primary-foreground/80">
              Mon - Fri: 9AM - 6PM | Sat: 9AM - 2PM
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
