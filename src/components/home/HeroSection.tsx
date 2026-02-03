import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Calendar, Award, Sparkles, CheckCircle, Settings } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary via-teal-dark to-primary overflow-hidden">
      {/* Admin Link - Top Right */}
      <Link 
        to="/admin/login" 
        className="absolute top-24 right-4 z-20 p-2.5 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/20 transition-all duration-300 group"
        title="Admin Panel"
      >
        <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
      </Link>

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-foreground/10 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-foreground/5 rounded-full blur-2xl animate-float" />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-primary-foreground/3 rounded-full blur-xl animate-pulse-soft" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container-custom relative z-10">
        <div className="min-h-[90vh] flex flex-col lg:flex-row items-center justify-between gap-12 py-20 px-4 md:px-8">
          {/* Content */}
          <div className="flex-1 text-center lg:text-left space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/15 backdrop-blur-sm rounded-full px-5 py-2.5 border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-colors cursor-default">
              <Sparkles className="w-4 h-4 text-primary-foreground animate-pulse-soft" />
              <span className="text-sm font-semibold text-primary-foreground">Premium Dental Care</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-primary-foreground leading-[1.1]">
              Advanced Dental Care
              <span className="block text-primary-foreground/90 mt-2">for Your Perfect Smile</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/85 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Experience world-class dental treatments with our team of specialists. 
              We combine cutting-edge technology with compassionate care to deliver 
              exceptional results.
            </p>

            {/* Trust Points */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start text-primary-foreground/80">
              <div className="flex items-center gap-2 group cursor-default">
                <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">15+ Years Experience</span>
              </div>
              <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-primary-foreground/50" />
              <div className="flex items-center gap-2 group cursor-default">
                <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">10,000+ Happy Patients</span>
              </div>
              <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-primary-foreground/50" />
              <div className="flex items-center gap-2 group cursor-default">
                <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Latest Technology</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link to="/book-appointment">
                <Button variant="hero" size="xl" className="w-full sm:w-auto group shadow-lg hover:shadow-xl transition-shadow">
                  <Calendar className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Book Appointment
                </Button>
              </Link>
              <a href="tel:+1234567890">
                <Button variant="hero-outline" size="xl" className="w-full sm:w-auto group">
                  <Phone className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Call Now
                </Button>
              </a>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="flex-1 relative animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="relative w-full max-w-lg mx-auto">
              {/* Main Image Container */}
              <div className="aspect-square rounded-[2.5rem] bg-gradient-to-br from-primary-foreground/20 to-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/20 overflow-hidden shadow-2xl group">
                <img 
                  src="/hero-dental.jpg" 
                  alt="Happy patient with beautiful smile"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>

              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 glass-effect rounded-2xl p-5 shadow-xl border border-border/30 animate-slide-up hover:scale-105 transition-transform cursor-default" style={{ animationDelay: "0.5s" }}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg animate-pulse-soft">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-xl">4.9/5 Rating</p>
                    <p className="text-sm text-muted-foreground">500+ Google Reviews</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 glass-effect rounded-2xl p-4 shadow-xl border border-border/30 animate-slide-up hover:scale-105 transition-transform cursor-default" style={{ animationDelay: "0.6s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center animate-float">
                    <Award className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Award Winning</p>
                    <p className="text-xs text-muted-foreground">Dental Clinic</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="hsl(var(--background))"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
