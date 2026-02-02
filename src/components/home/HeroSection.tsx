import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Calendar, Shield, Award } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative hero-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-foreground rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative">
        <div className="min-h-[90vh] flex flex-col lg:flex-row items-center justify-between gap-12 py-16 px-4 md:px-8">
          {/* Content */}
          <div className="flex-1 text-center lg:text-left space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Shield className="w-4 h-4 text-primary-foreground" />
              <span className="text-sm font-medium text-primary-foreground">Trusted by 10,000+ Patients</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
              Your Smile,<br />
              <span className="text-primary-foreground/90">Our Priority</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Experience exceptional dental care with our team of experts. We combine advanced technology with gentle care to give you the smile you deserve.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/book-appointment">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Appointment
                </Button>
              </Link>
              <a href="tel:+1234567890">
                <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </Button>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary-foreground/80" />
                <span className="text-sm text-primary-foreground/80">15+ Years Experience</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-foreground/80" />
                <span className="text-sm text-primary-foreground/80">Certified Specialists</span>
              </div>
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="flex-1 relative animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="relative w-full max-w-lg mx-auto">
              <div className="aspect-square rounded-3xl bg-primary-foreground/20 backdrop-blur-sm border border-primary-foreground/30 flex items-center justify-center overflow-hidden">
                <img 
                  src="/hero-dental.jpg" 
                  alt="Happy patient with beautiful smile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <div class="text-center p-8">
                        <div class="w-24 h-24 mx-auto mb-4 rounded-full bg-primary-foreground/30 flex items-center justify-center">
                          <svg class="w-12 h-12 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <p class="text-primary-foreground/80 text-lg font-medium">Your Perfect Smile Awaits</p>
                      </div>
                    `;
                  }}
                />
              </div>
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 glass-effect rounded-2xl p-4 shadow-medium animate-slide-up" style={{ animationDelay: "0.5s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">4.9/5 Rating</p>
                    <p className="text-sm text-muted-foreground">500+ Google Reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
