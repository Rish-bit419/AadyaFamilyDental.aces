import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Calendar, Award, CheckCircle, Star, Users, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";

const slides = [
  {
    image: heroSlide1,
    title: "Transform Your",
    highlight: "Smile Today",
    description: "Experience world-class dental treatments with our team of specialists. We combine cutting-edge technology with compassionate care.",
  },
  {
    image: heroSlide2,
    title: "Family Dental",
    highlight: "Care Experts",
    description: "From kids to grandparents — comprehensive dental care for every member of your family under one roof.",
  },
  {
    image: heroSlide3,
    title: "Advanced",
    highlight: "Treatments",
    description: "State-of-the-art technology meets personalized care. Painless procedures with lasting results you'll love.",
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Slideshow Background */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: current === i ? 1 : 0, zIndex: current === i ? 1 : 0 }}
        >
          <img
            src={slide.image}
            alt={`${slide.title} ${slide.highlight}`}
            className="w-full h-full object-cover"
            fetchPriority={i === 0 ? "high" : "low"}
            loading={i === 0 ? "eager" : "lazy"}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
          <div className="absolute inset-0 bg-primary/30 mix-blend-multiply" />
        </div>
      ))}

      {/* Content */}
      <div className="container-custom relative z-10">
        <div className="min-h-screen flex items-center py-24 lg:py-32 px-4 md:px-8">
          <div className="max-w-2xl space-y-6 lg:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary-foreground/15 backdrop-blur-md rounded-full px-5 py-2.5 border border-primary-foreground/20">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="text-sm font-semibold text-primary-foreground">Premium Dental Care</span>
            </div>

            {/* Title with slide transition */}
            <div className="relative h-[160px] md:h-[180px] lg:h-[200px]">
              {slides.map((slide, i) => (
                <h1
                  key={i}
                  className="absolute inset-0 font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground leading-[1.1] transition-all duration-700"
                  style={{
                    opacity: current === i ? 1 : 0,
                    transform: current === i ? "translateY(0)" : "translateY(20px)",
                  }}
                >
                  {slide.title}
                  <span className="block mt-2 text-accent">{slide.highlight}</span>
                </h1>
              ))}
            </div>

            {/* Description with slide transition */}
            <div className="relative h-[72px] md:h-[56px]">
              {slides.map((slide, i) => (
                <p
                  key={i}
                  className="absolute inset-0 text-base md:text-lg text-primary-foreground/85 leading-relaxed transition-all duration-700 delay-100"
                  style={{
                    opacity: current === i ? 1 : 0,
                    transform: current === i ? "translateY(0)" : "translateY(10px)",
                  }}
                >
                  {slide.description}
                </p>
              ))}
            </div>

            {/* Trust Points */}
            <div className="flex flex-wrap gap-3 items-center">
              {[
                { icon: CheckCircle, text: "15+ Years" },
                { icon: Users, text: "10,000+ Patients" },
                { icon: Star, text: "4.9★ Rating" },
                { icon: Clock, text: "Same Day Appointments" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 border border-primary-foreground/10">
                  <Icon className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs md:text-sm font-medium text-primary-foreground">{text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link to="/book-appointment">
                <Button variant="cta" size="xl" className="w-full sm:w-auto group">
                  <Calendar className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Book Appointment
                </Button>
              </Link>
              <a href="tel:+916366360115">
                <Button variant="hero-outline" size="xl" className="w-full sm:w-auto group">
                  <Phone className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Call Now
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Navigation */}
      <div className="absolute bottom-8 left-0 right-0 z-10 flex items-center justify-center gap-6">
        <button
          onClick={prev}
          className="w-10 h-10 rounded-full bg-primary-foreground/20 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/30 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-500 ${
                current === i ? "w-8 bg-accent" : "w-2 bg-primary-foreground/40 hover:bg-primary-foreground/60"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-10 h-10 rounded-full bg-primary-foreground/20 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/30 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Floating Card - Rating */}
      <div className="absolute bottom-24 right-8 lg:right-16 z-10 glass-effect rounded-2xl p-4 shadow-xl border border-border/50 animate-slide-up hidden md:block" style={{ animationDelay: "0.5s" }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shadow-lg">
            <Star className="w-6 h-6 text-accent-foreground fill-accent-foreground" />
          </div>
          <div>
            <p className="font-bold text-foreground text-lg">4.9/5 Rating</p>
            <p className="text-xs text-muted-foreground">500+ Google Reviews</p>
          </div>
        </div>
      </div>

      {/* Floating Card - Award */}
      <div className="absolute top-28 right-8 lg:right-16 z-10 glass-effect rounded-2xl p-3 shadow-xl border border-border/50 animate-slide-up hidden lg:block" style={{ animationDelay: "0.7s" }}>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Award className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">Award Winning</p>
            <p className="text-xs text-muted-foreground">Dental Clinic</p>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80L48 73C96 67 192 53 288 47C384 40 480 40 576 43C672 47 768 53 864 57C960 60 1056 60 1152 57C1248 53 1344 47 1392 43L1440 40V80H0Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
