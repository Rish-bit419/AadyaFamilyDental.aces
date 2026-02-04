import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, User, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Doctor {
  id: string;
  name: string;
  qualification: string;
  specialization: string | null;
  experience_years: number | null;
  bio: string | null;
  image_url: string | null;
  display_order: number | null;
  is_active: boolean | null;
  education: string[] | null;
  awards: string[] | null;
  gallery_images: string[] | null;
}

const AdminDoctors = () => {
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    qualification: "",
    specialization: "",
    experience_years: "",
    bio: "",
    image_url: "",
    display_order: "0",
    is_active: true,
    education: "",
    awards: "",
    gallery_images: "",
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    const { data, error } = await supabase
      .from("doctors")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({ title: "Error", description: "Failed to fetch doctors", variant: "destructive" });
    } else {
      setDoctors(data || []);
    }
    setIsLoading(false);
  };

  const handleOpenDialog = (doctor?: Doctor) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData({
        name: doctor.name,
        qualification: doctor.qualification,
        specialization: doctor.specialization || "",
        experience_years: doctor.experience_years?.toString() || "",
        bio: doctor.bio || "",
        image_url: doctor.image_url || "",
        display_order: doctor.display_order?.toString() || "0",
        is_active: doctor.is_active ?? true,
        education: doctor.education?.join("\n") || "",
        awards: doctor.awards?.join("\n") || "",
        gallery_images: doctor.gallery_images?.join("\n") || "",
      });
    } else {
      setEditingDoctor(null);
      setFormData({
        name: "",
        qualification: "",
        specialization: "",
        experience_years: "",
        bio: "",
        image_url: "",
        display_order: "0",
        is_active: true,
        education: "",
        awards: "",
        gallery_images: "",
      });
    }
    setIsDialogOpen(true);
  };

  const parseMultilineToArray = (text: string): string[] => {
    return text.split("\n").map(s => s.trim()).filter(s => s.length > 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const doctorData = {
      name: formData.name,
      qualification: formData.qualification,
      specialization: formData.specialization || null,
      experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
      bio: formData.bio || null,
      image_url: formData.image_url || null,
      display_order: parseInt(formData.display_order) || 0,
      is_active: formData.is_active,
      education: parseMultilineToArray(formData.education),
      awards: parseMultilineToArray(formData.awards),
      gallery_images: parseMultilineToArray(formData.gallery_images),
    };

    let error;
    if (editingDoctor) {
      const { error: updateError } = await supabase
        .from("doctors")
        .update(doctorData)
        .eq("id", editingDoctor.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from("doctors").insert(doctorData);
      error = insertError;
    }

    if (error) {
      toast({ title: "Error", description: "Failed to save doctor", variant: "destructive" });
    } else {
      toast({ title: "Success", description: `Doctor ${editingDoctor ? "updated" : "added"} successfully` });
      setIsDialogOpen(false);
      fetchDoctors();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;

    const { error } = await supabase.from("doctors").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete doctor", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Doctor deleted successfully" });
      fetchDoctors();
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from("doctors")
      .update({ is_active: isActive })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    } else {
      fetchDoctors();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 bg-card rounded-xl w-1/3" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-card rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Doctors</h1>
          <p className="text-muted-foreground mt-1">Manage your clinic's doctors and specialists</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Doctor
        </Button>
      </div>

      {/* Doctors List */}
      <div className="grid gap-4">
        {doctors.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border/50 p-12 text-center">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No doctors added yet</p>
            <Button onClick={() => handleOpenDialog()} className="mt-4">
              Add Your First Doctor
            </Button>
          </div>
        ) : (
          doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-card rounded-2xl border border-border/50 p-6 flex items-center gap-6"
            >
              {/* Avatar */}
              <div className="w-20 h-20 rounded-xl bg-teal-light flex-shrink-0 overflow-hidden">
                {doctor.image_url ? (
                  <img
                    src={doctor.image_url}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                  {!doctor.is_active && (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-sm text-primary font-medium">{doctor.specialization}</p>
                <p className="text-sm text-muted-foreground">{doctor.qualification}</p>
                {doctor.experience_years && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {doctor.experience_years}+ years experience
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Switch
                  checked={doctor.is_active ?? true}
                  onCheckedChange={(checked) => handleToggleActive(doctor.id, checked)}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleOpenDialog(doctor)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(doctor.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDoctor ? "Edit Doctor" : "Add Doctor"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="qualification">Qualification *</Label>
                <Input
                  id="qualification"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  placeholder="e.g., BDS, MDS"
                  required
                />
              </div>
              <div>
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="e.g., Dental Implants"
                />
              </div>
              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  value={formData.experience_years}
                  onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="education">Education (one per line)</Label>
                <Textarea
                  id="education"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  rows={3}
                  placeholder="BDS - Delhi University, 2005&#10;MDS - AIIMS Delhi, 2008"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="awards">Awards & Achievements (one per line)</Label>
                <Textarea
                  id="awards"
                  value={formData.awards}
                  onChange={(e) => setFormData({ ...formData, awards: e.target.value })}
                  rows={3}
                  placeholder="Best Dentist Award 2020&#10;Excellence in Implantology"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="gallery">Gallery Images (one URL per line)</Label>
                <Textarea
                  id="gallery"
                  value={formData.gallery_images}
                  onChange={(e) => setFormData({ ...formData, gallery_images: e.target.value })}
                  rows={3}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <Switch
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingDoctor ? "Update" : "Add"} Doctor</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDoctors;
