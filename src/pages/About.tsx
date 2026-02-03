import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Award, GraduationCap, Heart, Users, CheckCircle, Clock, User } from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  qualification: string;
  specialization: string | null;
  experience_years: number | null;
  bio: string | null;
  image_url: string | null;
}

const values = [
  {
    icon: Heart,
    title: "Patient-Centered Care",
    description: "Your comfort and well-being are our top priorities in every treatment.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We strive for the highest standards in dental care and patient outcomes.",
  },
  {
    icon: GraduationCap,
    title: "Continuous Learning",
    description: "Our team stays updated with the latest advancements in dentistry.",
  },
  {
    icon: Users,
    title: "Community",
    description: "We're proud to serve and give back to our local community.",
  },
];

const About = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!error && data) {
        setDoctors(data);
      }
      setIsLoading(false);
    };

    fetchDoctors();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-secondary to-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              About Our Clinic
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Your Trusted Partner in Dental Health
            </h1>
            <p className="text-lg text-muted-foreground">
              For over 15 years, we've been providing exceptional dental services to our community, 
              helping thousands of patients achieve healthy, beautiful smiles through advanced care and compassion.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 animate-slide-up">
              <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider">
                Our Mission
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Committed to Excellence in Every Smile
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Our mission is to provide the highest quality dental care in a comfortable, 
                welcoming environment. We believe everyone deserves access to excellent 
                dental health, and we're dedicated to making that a reality through 
                cutting-edge technology and compassionate care.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Founded with a vision to transform dental care, our clinic has grown into 
                a comprehensive dental center serving over 10,000 patients. We invest 
                continuously in the latest technology and training to ensure you receive 
                the best possible care.
              </p>
              <ul className="space-y-3">
                {[
                  "State-of-the-art equipment and facilities",
                  "Highly trained and certified dental professionals",
                  "Personalized treatment plans for every patient",
                  "Comfortable, anxiety-free dental experience",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-medium">
                <img
                  src="/clinic-interior.jpg"
                  alt="Our modern dental clinic"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <div class="w-full h-full bg-gradient-to-br from-teal-light to-secondary flex items-center justify-center">
                        <div class="text-center p-8">
                          <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                            <svg class="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                          </div>
                          <p class="text-foreground font-display text-xl font-semibold">Our Modern Facility</p>
                        </div>
                      </div>
                    `;
                  }}
                />
              </div>
              
              {/* Stats Card */}
              <div className="absolute -bottom-8 -right-8 bg-card rounded-2xl p-6 shadow-medium border border-border/50">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <p className="font-display text-3xl font-bold text-primary">15+</p>
                    <p className="text-sm text-muted-foreground">Years Experience</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display text-3xl font-bold text-primary">10k+</p>
                    <p className="text-sm text-muted-foreground">Happy Patients</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-slide-up">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              Our Values
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              What Guides Us Every Day
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="bg-card rounded-2xl p-8 text-center border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-slide-up">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              Our Team
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet Our Expert Doctors
            </h2>
            <p className="text-muted-foreground">
              Our team of experienced professionals is dedicated to providing you with the best possible care.
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[420px] bg-muted rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Doctor profiles coming soon</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.map((doctor, index) => (
                <div
                  key={doctor.id}
                  className="group bg-card rounded-3xl overflow-hidden border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-teal-light to-secondary relative overflow-hidden">
                    {doctor.image_url ? (
                      <img
                        src={doctor.image_url}
                        alt={doctor.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="w-12 h-12 text-primary" />
                        </div>
                      </div>
                    )}
                    
                    {doctor.experience_years && (
                      <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-md">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">
                          {doctor.experience_years}+ Years
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-foreground mb-1">
                      {doctor.name}
                    </h3>
                    <p className="text-primary font-medium text-sm mb-2">
                      {doctor.specialization}
                    </p>
                    <p className="text-muted-foreground text-sm mb-4">
                      {doctor.qualification}
                    </p>
                    {doctor.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {doctor.bio}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center animate-slide-up">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              Our Philosophy
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Patient Care Is Our Priority
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              We believe that dental care should be accessible, comfortable, and personalized. 
              Every patient who walks through our doors is treated like family. We take the time 
              to listen to your concerns, explain treatment options clearly, and create a 
              customized plan that fits your needs and budget.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From routine check-ups to complex procedures, we're committed to making your 
              experience as pleasant as possible. Our modern facility is designed with your 
              comfort in mind, featuring relaxing amenities and the latest technology to 
              ensure efficient, effective treatment.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding hero-gradient">
        <div className="container-custom text-center animate-slide-up">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Experience the Difference?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join our family of satisfied patients and discover why we're the trusted choice for dental care.
          </p>
          <Link to="/book-appointment">
            <Button variant="hero" size="xl">
              Book Your Appointment
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default About;
