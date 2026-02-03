import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BeforeAfterImage {
  id: string;
  title: string;
  description: string | null;
  before_image_url: string;
  after_image_url: string;
  treatment_type: string | null;
  is_featured: boolean | null;
  is_active: boolean | null;
  display_order: number | null;
}

const AdminGallery = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<BeforeAfterImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<BeforeAfterImage | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    before_image_url: "",
    after_image_url: "",
    treatment_type: "",
    is_featured: false,
    is_active: true,
    display_order: "0",
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from("before_after_images")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({ title: "Error", description: "Failed to fetch images", variant: "destructive" });
    } else {
      setImages(data || []);
    }
    setIsLoading(false);
  };

  const handleOpenDialog = (image?: BeforeAfterImage) => {
    if (image) {
      setEditingImage(image);
      setFormData({
        title: image.title,
        description: image.description || "",
        before_image_url: image.before_image_url,
        after_image_url: image.after_image_url,
        treatment_type: image.treatment_type || "",
        is_featured: image.is_featured ?? false,
        is_active: image.is_active ?? true,
        display_order: image.display_order?.toString() || "0",
      });
    } else {
      setEditingImage(null);
      setFormData({
        title: "",
        description: "",
        before_image_url: "",
        after_image_url: "",
        treatment_type: "",
        is_featured: false,
        is_active: true,
        display_order: "0",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const imageData = {
      title: formData.title,
      description: formData.description || null,
      before_image_url: formData.before_image_url,
      after_image_url: formData.after_image_url,
      treatment_type: formData.treatment_type || null,
      is_featured: formData.is_featured,
      is_active: formData.is_active,
      display_order: parseInt(formData.display_order) || 0,
    };

    let error;
    if (editingImage) {
      const { error: updateError } = await supabase
        .from("before_after_images")
        .update(imageData)
        .eq("id", editingImage.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from("before_after_images").insert(imageData);
      error = insertError;
    }

    if (error) {
      toast({ title: "Error", description: "Failed to save image", variant: "destructive" });
    } else {
      toast({ title: "Success", description: `Image ${editingImage ? "updated" : "added"} successfully` });
      setIsDialogOpen(false);
      fetchImages();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    const { error } = await supabase.from("before_after_images").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete image", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Image deleted successfully" });
      fetchImages();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 bg-card rounded-xl w-1/3" />
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-card rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Before & After Gallery</h1>
          <p className="text-muted-foreground mt-1">Manage transformation images</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Images
        </Button>
      </div>

      {/* Images Grid */}
      {images.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border/50 p-12 text-center">
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No images added yet</p>
          <Button onClick={() => handleOpenDialog()} className="mt-4">
            Add Your First Images
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="bg-card rounded-2xl border border-border/50 overflow-hidden"
            >
              <div className="grid grid-cols-2">
                <div className="aspect-[4/3] relative">
                  <img
                    src={image.before_image_url}
                    alt="Before"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-foreground/80 text-primary-foreground text-xs px-2 py-1 rounded">
                    Before
                  </span>
                </div>
                <div className="aspect-[4/3] relative">
                  <img
                    src={image.after_image_url}
                    alt="After"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                    After
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{image.title}</h3>
                      {image.is_featured && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          Featured
                        </span>
                      )}
                      {!image.is_active && (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                          Hidden
                        </span>
                      )}
                    </div>
                    {image.treatment_type && (
                      <span className="text-xs text-primary">{image.treatment_type}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenDialog(image)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(image.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingImage ? "Edit Images" : "Add Before & After"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Smile Makeover"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="treatment">Treatment Type</Label>
                  <Input
                    id="treatment"
                    value={formData.treatment_type}
                    onChange={(e) => setFormData({ ...formData, treatment_type: e.target.value })}
                    placeholder="e.g., Veneers"
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
              </div>
              
              <div>
                <Label htmlFor="before">Before Image URL *</Label>
                <Input
                  id="before"
                  value={formData.before_image_url}
                  onChange={(e) => setFormData({ ...formData, before_image_url: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="after">After Image URL *</Label>
                <Input
                  id="after"
                  value={formData.after_image_url}
                  onChange={(e) => setFormData({ ...formData, after_image_url: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>
              
              <div className="flex gap-6">
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
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingImage ? "Update" : "Add"} Images</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGallery;
