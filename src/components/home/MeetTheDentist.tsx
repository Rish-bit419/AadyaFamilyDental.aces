import { Award, GraduationCap, Users, Heart, CheckCircle } from "lucide-react";

const credentials = [
  "Doctor of Dental Surgery (DDS) - Columbia University",
  "Board Certified in General Dentistry",
  "Fellow of the Academy of General Dentistry",
  "Member of the American Dental Association",
  "Certified in Invisalign & Advanced Orthodontics",
  "Trained in Dental Implantology - NYU",
];

const stats = [
  { number: "20+", label: "Years Experience" },
  { number: "15K+", label: "Patients Treated" },
  { number: "98%", label: "Satisfaction Rate" },
  { number: "500+", label: "5-Star Reviews" },
];

const MeetTheDentist = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <div className="relative animate-slide-up">
            <div className="aspect-[3/4] rounded-3xl bg-gradient-to-br from-teal-light to-secondary overflow-hidden shadow-medium">
              <img
                src="/dentist-portrait.jpg"
                alt="Dr. James Smith - Lead Dentist"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-light to-secondary p-8">
                      <div class="text-center">
                        <div class="w-32 h-32 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <svg class="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                        </div>
                        <p class="text-foreground font-display text-xl font-semibold">Dr. James Smith</p>
                        <p class="text-muted-foreground mt-2">DDS, FAGD</p>
                      </div>
                    </div>
                  `;
                }}
              />
            </div>
            
            {/* Experience Badge */}
            <div className="absolute -bottom-6 -right-6 bg-card rounded-2xl p-6 shadow-medium border border-border/50 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                  <Award className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">20+</p>
                  <p className="text-sm text-muted-foreground">Years of Excellence</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-8">
            <div className="animate-slide-up">
              <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
                Meet Your Dentist
              </span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Dr. James Smith
              </h2>
              <p className="text-lg text-primary font-medium mb-4">
                DDS, FAGD - Lead Dentist & Founder
              </p>
              <p className="text-muted-foreground leading-relaxed">
                With over two decades of experience in comprehensive dental care, Dr. James Smith has dedicated his career to transforming smiles and improving lives. His passion for dentistry began at Columbia University, where he graduated with honors, and has only grown stronger through years of continuous learning and patient care.
              </p>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <p className="text-muted-foreground leading-relaxed">
                Dr. Smith believes that every patient deserves personalized attention and the highest quality of care. He combines cutting-edge technology with a gentle, patient-first approach to ensure comfortable and effective treatments. His expertise spans from preventive care to complex restorative procedures.
              </p>
            </div>

            {/* Philosophy Quote */}
            <blockquote className="border-l-4 border-primary pl-6 py-2 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <p className="text-foreground italic text-lg">
                "A healthy smile is more than just teeth – it's confidence, happiness, and the gateway to overall wellness. My mission is to help every patient achieve their best smile."
              </p>
              <cite className="text-muted-foreground mt-2 block">— Dr. James Smith</cite>
            </blockquote>

            {/* Credentials */}
            <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <h3 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                Credentials & Training
              </h3>
              <ul className="grid sm:grid-cols-2 gap-3">
                {credentials.map((credential) => (
                  <li key={credential} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{credential}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-border animate-slide-up" style={{ animationDelay: "0.4s" }}>
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-primary">{stat.number}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetTheDentist;
