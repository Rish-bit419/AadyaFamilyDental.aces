import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, User } from "lucide-react";
import { SkeletonDoctorCard } from "@/components/ui/skeleton-cards";
import DoctorDetailModal from "./DoctorDetailModal";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import doctorSarah from "@/assets/doctor-sarah.jpg";
import doctorMichael from "@/assets/doctor-michael.jpg";
import doctorEmily from "@/assets/doctor-emily.jpg";

const localDoctorImages: Record<string, string> = {
  "doctor-sarah": doctorSarah,
  "doctor-michael": doctorMichael,
  "doctor-emily": doctorEmily,
};

interface Doctor {
  id: string;
  name: string;
  qualification: string;
  specialization: string | null;
  experience_years: number | null;
  bio: string | null;
  image_url: string | null;
  education: string[] | null;
  awards: string[] | null;
  gallery_images: string[] | null;
}

const DoctorsPreview = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ["doctors-preview"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .limit(3);
      if (error) throw error;
      return (data || []) as Doctor[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const handleDoctorClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">Our Specialists</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">Meet Our Expert Doctors</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => <SkeletonDoctorCard key={i} />)}
          </div>
        </div>
      </section>
    );
  }

  if (doctors.length === 0) return null;

  return (
    <section className="section-padding bg-secondary">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">Our Specialists</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">Meet Our Expert Doctors</h2>
          <p className="text-lg text-muted-foreground">Our team of highly qualified dental specialists is dedicated to providing you with the best possible care.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor, index) => (
            <div
              key={doctor.id}
              className="group bg-card rounded-3xl overflow-hidden border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 animate-slide-up cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleDoctorClick(doctor)}
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-teal-light to-secondary relative overflow-hidden">
                {doctor.image_url ? (
                  <img src={doctor.image_url} alt={doctor.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
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
                    <span className="text-sm font-semibold text-foreground">{doctor.experience_years}+ Years</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{doctor.name}</h3>
                <p className="text-primary font-medium text-sm mb-2">{doctor.specialization}</p>
                <p className="text-muted-foreground text-sm mb-4">{doctor.qualification}</p>
                {doctor.bio && <p className="text-sm text-muted-foreground line-clamp-2">{doctor.bio}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 animate-slide-up">
          <Link to="/about">
            <Button variant="outline" size="lg" className="group">
              Meet All Our Doctors
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <DoctorDetailModal doctor={selectedDoctor} open={isModalOpen} onOpenChange={setIsModalOpen} />
      </div>
    </section>
  );
};

export default DoctorsPreview;
