import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Award, GraduationCap, Heart, Users, CheckCircle } from "lucide-react";

const team = [
  {
    name: "Dr. James Smith",
    role: "Lead Dentist & Founder",
    experience: "20+ years experience",
    avatar: "JS",
  },
  {
    name: "Dr. Emily Chen",
    role: "Orthodontist",
    experience: "12+ years experience",
    avatar: "EC",
  },
  {
    name: "Dr. Michael Brown",
    role: "Cosmetic Dentist",
    experience: "15+ years experience",
    avatar: "MB",
  },
];

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
  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              About Us
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Your Trusted Partner in Dental Health
            </h1>
            <p className="text-lg text-muted-foreground">
              For over 15 years, DentalCare has been providing exceptional dental services to our community, helping thousands of patients achieve healthy, beautiful smiles.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 animate-slide-up">
              <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider">
                Our Story
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                A Legacy of Excellence in Dental Care
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Founded in 2009 by Dr. James Smith, DentalCare started with a simple mission: to provide compassionate, high-quality dental care in a comfortable environment. What began as a small practice has grown into a comprehensive dental center serving over 10,000 patients.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our commitment to excellence, combined with investment in cutting-edge technology and continuous education, has made us a trusted name in dental care. We believe that everyone deserves a healthy smile, and we work tirelessly to make that a reality.
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
              <div className="aspect-[4/3] rounded-3xl bg-teal-light flex items-center justify-center overflow-hidden">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <Award className="w-10 h-10 text-primary" />
                  </div>
                  <p className="text-foreground font-display text-xl font-semibold">15+ Years of Excellence</p>
                  <p className="text-muted-foreground mt-2">Serving our community since 2009</p>
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
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 rounded-2xl bg-teal-light flex items-center justify-center mx-auto mb-4">
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

      {/* Team Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-slide-up">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              Our Team
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet Our Experts
            </h2>
            <p className="text-muted-foreground">
              Our team of experienced professionals is dedicated to providing you with the best possible care.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div
                key={member.name}
                className="card-elevated card-hover rounded-2xl p-8 text-center border border-border/50 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-4">
                  {member.avatar}
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-primary font-medium mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.experience}</p>
              </div>
            ))}
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
