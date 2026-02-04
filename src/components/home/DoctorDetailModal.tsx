import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  GraduationCap, 
  Clock, 
  User, 
  ImageIcon, 
  Star, 
  Phone, 
  Calendar,
  MapPin,
  Briefcase,
  Heart,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import { Link } from "react-router-dom";

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

interface DoctorDetailModalProps {
  doctor: Doctor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DoctorDetailModal = ({ doctor, open, onOpenChange }: DoctorDetailModalProps) => {
  const [activeTab, setActiveTab] = useState<"about" | "education" | "awards" | "gallery">("about");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  if (!doctor) return null;

  const tabs = [
    { id: "about", label: "About", icon: User },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "awards", label: "Awards", icon: Award },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
  ] as const;

  const handlePrevImage = () => {
    if (selectedImage !== null && doctor.gallery_images) {
      setSelectedImage(selectedImage === 0 ? doctor.gallery_images.length - 1 : selectedImage - 1);
    }
  };

  const handleNextImage = () => {
    if (selectedImage !== null && doctor.gallery_images) {
      setSelectedImage(selectedImage === doctor.gallery_images.length - 1 ? 0 : selectedImage + 1);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden p-0 gap-0">
          {/* Hero Header */}
          <div className="relative bg-gradient-to-br from-primary via-primary/90 to-teal-dark overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative p-6 md:p-8 flex flex-col md:flex-row gap-6">
              {/* Doctor Image */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-white/20 backdrop-blur-sm overflow-hidden ring-4 ring-white/30 shadow-xl">
                  {doctor.image_url ? (
                    <img
                      src={doctor.image_url}
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/10">
                      <User className="w-16 h-16 text-white/80" />
                    </div>
                  )}
                </div>
              </div>

              {/* Doctor Info */}
              <div className="flex-1 text-center md:text-left text-white">
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">{doctor.name}</h2>
                <p className="text-white/90 font-medium text-lg mb-1">{doctor.specialization}</p>
                <p className="text-white/70 text-sm mb-4">{doctor.qualification}</p>

                {/* Quick Stats */}
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  {doctor.experience_years && (
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">{doctor.experience_years}+ Years</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">4.9 Rating</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm font-medium">500+ Patients</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-border bg-card/50 px-4 overflow-x-auto">
            <div className="flex gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 overflow-y-auto max-h-[50vh]">
            {/* About Tab */}
            {activeTab === "about" && (
              <div className="space-y-6 animate-fade-in">
                {/* Bio */}
                {doctor.bio && (
                  <div className="space-y-3">
                    <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      About Dr. {doctor.name.split(" ")[1] || doctor.name}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{doctor.bio}</p>
                  </div>
                )}

                {/* Expertise Areas */}
                <div className="space-y-3">
                  <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Areas of Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {["Dental Implants", "Cosmetic Dentistry", "Root Canal", "Teeth Whitening", "Orthodontics"].map((area, index) => (
                      <Badge key={index} variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-3 py-1.5">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Working Hours */}
                <div className="space-y-3">
                  <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Consultation Hours
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { day: "Monday - Friday", time: "9:00 AM - 6:00 PM" },
                      { day: "Saturday", time: "10:00 AM - 4:00 PM" },
                      { day: "Sunday", time: "Closed" },
                    ].map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center bg-secondary/50 rounded-xl p-3">
                        <span className="text-foreground font-medium">{schedule.day}</span>
                        <span className="text-muted-foreground text-sm">{schedule.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-gradient-to-r from-primary/5 to-teal-light/50 rounded-2xl p-5 space-y-4">
                  <h3 className="font-display text-lg font-semibold text-foreground">Get in Touch</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-foreground font-medium">+91 98765 43210</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="text-foreground font-medium">Main Clinic, Floor 2</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Education Tab */}
            {activeTab === "education" && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Educational Background
                </h3>
                
                {doctor.education && doctor.education.length > 0 ? (
                  <div className="space-y-4">
                    {doctor.education.map((edu, index) => (
                      <div key={index} className="relative pl-8 pb-6 border-l-2 border-primary/20 last:pb-0">
                        <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-primary -translate-x-[9px] ring-4 ring-background" />
                        <div className="bg-secondary/50 rounded-xl p-4 hover:bg-secondary/80 transition-colors">
                          <p className="text-foreground font-medium">{edu}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No education details available</p>
                  </div>
                )}

                {/* Certifications */}
                <div className="mt-8 space-y-3">
                  <h3 className="font-display text-lg font-semibold text-foreground">Professional Certifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {["Board Certified Dentist", "Advanced Implantology", "Laser Dentistry Certified", "Invisalign Provider"].map((cert, index) => (
                      <div key={index} className="flex items-center gap-3 bg-secondary/50 rounded-xl p-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Award className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-foreground text-sm">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Awards Tab */}
            {activeTab === "awards" && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Awards & Achievements
                </h3>
                
                {doctor.awards && doctor.awards.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {doctor.awards.map((award, index) => (
                      <div 
                        key={index} 
                        className="group bg-gradient-to-br from-primary/5 to-secondary rounded-2xl p-5 border border-primary/10 hover:border-primary/30 hover:shadow-soft transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Award className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="text-foreground font-medium">{award}</p>
                            <p className="text-muted-foreground text-sm mt-1">Excellence Award</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No awards listed yet</p>
                  </div>
                )}

                {/* Achievements Stats */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                  {[
                    { label: "Successful Procedures", value: "2,000+" },
                    { label: "Years of Excellence", value: doctor.experience_years ? `${doctor.experience_years}+` : "10+" },
                    { label: "Happy Patients", value: "500+" },
                  ].map((stat, index) => (
                    <div key={index} className="text-center bg-secondary/50 rounded-xl p-4">
                      <p className="text-2xl font-bold text-primary">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery Tab */}
            {activeTab === "gallery" && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  Photo Gallery
                </h3>
                
                {doctor.gallery_images && doctor.gallery_images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {doctor.gallery_images.map((img, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-2xl overflow-hidden bg-secondary cursor-pointer group"
                        onClick={() => setSelectedImage(index)}
                      >
                        <img
                          src={img}
                          alt={`${doctor.name} gallery ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No gallery images available</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-border bg-card/50 p-4 flex flex-col sm:flex-row gap-3">
            <Link to="/book-appointment" className="flex-1">
              <Button variant="cta" size="lg" className="w-full gap-2">
                <Calendar className="w-4 h-4" />
                Book Appointment
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="gap-2">
              <Phone className="w-4 h-4" />
              Call Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Lightbox */}
      {selectedImage !== null && doctor.gallery_images && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <button
            onClick={handlePrevImage}
            className="absolute left-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <img
            src={doctor.gallery_images[selectedImage]}
            alt={`Gallery ${selectedImage + 1}`}
            className="max-w-full max-h-[80vh] rounded-xl object-contain"
          />

          <button
            onClick={handleNextImage}
            className="absolute right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {selectedImage + 1} / {doctor.gallery_images.length}
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorDetailModal;
