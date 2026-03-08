import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Calendar, Award, Sparkles, CheckCircle, Star, Users, Clock } from "lucide-react";


const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary via-teal-dark to-primary overflow-hidden min-h-screen">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-foreground/10 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary-foreground/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <div className="min-h-screen flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 py-24 lg:py-32 px-4 md:px-8">
          {/* Content */}
          <div className="flex-1 text-center lg:text-left space-y-6 lg:space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/15 backdrop-blur-sm rounded-full px-5 py-2.5 border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-colors cursor-default">
              <Sparkles className="w-4 h-4 text-primary-foreground animate-pulse-soft" />
              <span className="text-sm font-semibold text-primary-foreground">Premium Dental Care</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground leading-[1.1]">
              Transform Your
              <span className="block bg-gradient-to-r from-primary-foreground via-primary-foreground/90 to-primary-foreground bg-clip-text mt-2">
                Smile Today
              </span>
            </h1>

            <p className="text-base md:text-lg lg:text-xl text-primary-foreground/85 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Experience world-class dental treatments with our team of specialists. 
              We combine cutting-edge technology with compassionate care.
            </p>

            {/* Trust Points */}
            <div className="flex flex-wrap gap-4 items-center justify-center lg:justify-start text-primary-foreground/80">
              <div className="flex items-center gap-2 group cursor-default bg-primary-foreground/10 rounded-full px-4 py-2 hover:bg-primary-foreground/15 transition-colors">
                <CheckCircle className="w-4 h-4 group-hover:scale-110 transition-transform text-primary-foreground" />
                <span className="text-sm font-medium">15+ Years</span>
              </div>
              <div className="flex items-center gap-2 group cursor-default bg-primary-foreground/10 rounded-full px-4 py-2 hover:bg-primary-foreground/15 transition-colors">
                <Users className="w-4 h-4 group-hover:scale-110 transition-transform text-primary-foreground" />
                <span className="text-sm font-medium">10,000+ Patients</span>
              </div>
              <div className="flex items-center gap-2 group cursor-default bg-primary-foreground/10 rounded-full px-4 py-2 hover:bg-primary-foreground/15 transition-colors">
                <Star className="w-4 h-4 group-hover:scale-110 transition-transform text-primary-foreground" />
                <span className="text-sm font-medium">4.9★ Rating</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link to="/book-appointment">
                <Button variant="hero" size="xl" className="w-full sm:w-auto group shadow-lg hover:shadow-xl transition-all">
                  <Calendar className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Book Appointment
                </Button>
              </Link>
              <a href="tel:+919876543210">
                <Button variant="hero-outline" size="xl" className="w-full sm:w-auto group">
                  <Phone className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Call Now
                </Button>
              </a>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="flex-1 relative animate-fade-in w-full max-w-2xl" style={{ animationDelay: "0.3s" }}>
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-2xl border-4 border-primary-foreground/20 group">
                <div className="aspect-[4/3] lg:aspect-[16/10]">
                  <img 
                    src="/hero-dental.jpg"
                    alt="Happy patient with beautiful smile at our modern dental clinic"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    fetchPriority="high"
                  />
                </div>
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
              </div>

              {/* Floating Stats Card - Bottom Left */}
              <div className="absolute -bottom-4 -left-4 lg:-bottom-6 lg:-left-6 glass-effect rounded-2xl p-4 lg:p-5 shadow-xl border border-border/50 animate-slide-up hover:scale-105 transition-transform cursor-default z-10" style={{ animationDelay: "0.5s" }}>
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg animate-pulse-soft">
                    <Star className="w-6 h-6 lg:w-7 lg:h-7 text-white fill-white" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-lg lg:text-xl">4.9/5 Rating</p>
                    <p className="text-xs lg:text-sm text-muted-foreground">500+ Google Reviews</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge - Top Right */}
              <div className="absolute -top-4 -right-4 lg:-top-6 lg:-right-6 glass-effect rounded-2xl p-3 lg:p-4 shadow-xl border border-border/50 animate-slide-up hover:scale-105 transition-transform cursor-default z-10" style={{ animationDelay: "0.6s" }}>
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-primary flex items-center justify-center animate-float">
                    <Award className="w-5 h-5 lg:w-6 lg:h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm lg:text-base">Award Winning</p>
                    <p className="text-xs text-muted-foreground">Dental Clinic</p>
                  </div>
                </div>
              </div>

              {/* New Floating Badge - Center Right */}
              <div className="absolute top-1/2 -right-2 lg:-right-8 -translate-y-1/2 glass-effect rounded-xl p-3 shadow-lg border border-border/50 animate-slide-up transition-transform cursor-default z-10 hidden md:block" style={{ animationDelay: "0.7s" }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                    <Clock className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-xs">Same Day</p>
                    <p className="text-[10px] text-muted-foreground">Appointments</p>
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
