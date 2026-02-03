import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Quote, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Testimonial {
  id: string;
  patient_name: string;
  patient_image_url: string | null;
  rating: number | null;
  review_text: string;
  treatment_type: string | null;
  is_featured: boolean | null;
  is_active: boolean | null;
}

const AdminTestimonials = () => {
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    patient_name: "",
    patient_image_url: "",
    rating: "5",
    review_text: "",
    treatment_type: "",
    is_featured: false,
    is_active: true,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to fetch testimonials", variant: "destructive" });
    } else {
      setTestimonials(data || []);
    }
    setIsLoading(false);
  };

  const handleOpenDialog = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        patient_name: testimonial.patient_name,
        patient_image_url: testimonial.patient_image_url || "",
        rating: testimonial.rating?.toString() || "5",
        review_text: testimonial.review_text,
        treatment_type: testimonial.treatment_type || "",
        is_featured: testimonial.is_featured ?? false,
        is_active: testimonial.is_active ?? true,
      });
    } else {
      setEditingTestimonial(null);
      setFormData({
        patient_name: "",
        patient_image_url: "",
        rating: "5",
        review_text: "",
        treatment_type: "",
        is_featured: false,
        is_active: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const testimonialData = {
      patient_name: formData.patient_name,
      patient_image_url: formData.patient_image_url || null,
      rating: parseInt(formData.rating),
      review_text: formData.review_text,
      treatment_type: formData.treatment_type || null,
      is_featured: formData.is_featured,
      is_active: formData.is_active,
    };

    let error;
    if (editingTestimonial) {
      const { error: updateError } = await supabase
        .from("testimonials")
        .update(testimonialData)
        .eq("id", editingTestimonial.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from("testimonials").insert(testimonialData);
      error = insertError;
    }

    if (error) {
      toast({ title: "Error", description: "Failed to save testimonial", variant: "destructive" });
    } else {
      toast({ title: "Success", description: `Testimonial ${editingTestimonial ? "updated" : "added"} successfully` });
      setIsDialogOpen(false);
      fetchTestimonials();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    const { error } = await supabase.from("testimonials").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete testimonial", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Testimonial deleted successfully" });
      fetchTestimonials();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 bg-card rounded-xl w-1/3" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-card rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Testimonials</h1>
          <p className="text-muted-foreground mt-1">Manage patient reviews and testimonials</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Testimonial
        </Button>
      </div>

      {/* Testimonials List */}
      <div className="grid gap-4">
        {testimonials.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border/50 p-12 text-center">
            <Quote className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No testimonials added yet</p>
            <Button onClick={() => handleOpenDialog()} className="mt-4">
              Add Your First Testimonial
            </Button>
          </div>
        ) : (
          testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-card rounded-2xl border border-border/50 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-foreground">{testimonial.patient_name}</h3>
                    {testimonial.is_featured && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        Featured
                      </span>
                    )}
                    {!testimonial.is_active && (
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
                    "{testimonial.review_text}"
                  </p>
                  
                  {testimonial.treatment_type && (
                    <span className="text-xs bg-teal-light text-primary px-2 py-1 rounded-full">
                      {testimonial.treatment_type}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleOpenDialog(testimonial)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(testimonial.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Patient Name *</Label>
                <Input
                  id="name"
                  value={formData.patient_name}
                  onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="treatment">Treatment Type</Label>
                <Input
                  id="treatment"
                  value={formData.treatment_type}
                  onChange={(e) => setFormData({ ...formData, treatment_type: e.target.value })}
                  placeholder="e.g., Dental Implants"
                />
              </div>
              <div>
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="image">Patient Image URL</Label>
                <Input
                  id="image"
                  value={formData.patient_image_url}
                  onChange={(e) => setFormData({ ...formData, patient_image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="review">Review Text *</Label>
                <Textarea
                  id="review"
                  value={formData.review_text}
                  onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
              <div className="flex items-center gap-2">
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
              <Button type="submit">{editingTestimonial ? "Update" : "Add"} Testimonial</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTestimonials;
