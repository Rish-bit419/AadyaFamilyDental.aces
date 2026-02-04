import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Award, GraduationCap, Clock, User, ImageIcon } from "lucide-react";

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
  if (!doctor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">{doctor.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with Image and Basic Info */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Doctor Image */}
            <div className="w-full md:w-1/3 flex-shrink-0">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-teal-light to-secondary overflow-hidden">
                {doctor.image_url ? (
                  <img
                    src={doctor.image_url}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-primary" />
                  </div>
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-primary font-semibold text-lg">{doctor.specialization}</p>
                <p className="text-muted-foreground">{doctor.qualification}</p>
              </div>

              {doctor.experience_years && (
                <div className="flex items-center gap-2 text-foreground">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-medium">{doctor.experience_years}+ Years of Experience</span>
                </div>
              )}

              {doctor.bio && (
                <p className="text-muted-foreground leading-relaxed">{doctor.bio}</p>
              )}
            </div>
          </div>

          {/* Education Section */}
          {doctor.education && doctor.education.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                <h3 className="font-display text-lg font-semibold text-foreground">Education</h3>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
                {doctor.education.map((edu, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-foreground">{edu}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Awards Section */}
          {doctor.awards && doctor.awards.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <h3 className="font-display text-lg font-semibold text-foreground">Awards & Achievements</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {doctor.awards.map((award, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20 px-3 py-1.5"
                  >
                    <Award className="w-3.5 h-3.5 mr-1.5" />
                    {award}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Section */}
          {doctor.gallery_images && doctor.gallery_images.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                <h3 className="font-display text-lg font-semibold text-foreground">Gallery</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {doctor.gallery_images.map((img, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-xl overflow-hidden bg-secondary"
                  >
                    <img
                      src={img}
                      alt={`${doctor.name} gallery ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorDetailModal;
