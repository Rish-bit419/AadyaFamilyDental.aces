import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, Save, X, Stethoscope } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number | null;
  price: number | null;
  is_active: boolean | null;
  icon: string | null;
  features: string[] | null;
}

const AdminServices = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration_minutes: 30,
    price: 0,
    is_active: true,
    features: "",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("name");

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description || "",
        duration_minutes: service.duration_minutes || 30,
        price: service.price || 0,
        is_active: service.is_active ?? true,
        features: service.features?.join(", ") || "",
      });
    } else {
      setEditingService(null);
      setFormData({
        name: "",
        description: "",
        duration_minutes: 30,
        price: 0,
        is_active: true,
        features: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const featuresArray = formData.features
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f);

    const serviceData = {
      name: formData.name,
      description: formData.description || null,
      duration_minutes: formData.duration_minutes,
      price: formData.price,
      is_active: formData.is_active,
      features: featuresArray.length > 0 ? featuresArray : null,
    };

    try {
      if (editingService) {
        const { error } = await supabase
          .from("services")
          .update(serviceData)
          .eq("id", editingService.id);

        if (error) throw error;

        setServices((prev) =>
          prev.map((s) =>
            s.id === editingService.id ? { ...s, ...serviceData } : s
          )
        );

        toast({ title: "Service updated successfully" });
      } else {
        const { data, error } = await supabase
          .from("services")
          .insert(serviceData)
          .select()
          .single();

        if (error) throw error;

        setServices((prev) => [...prev, data]);
        toast({ title: "Service created successfully" });
      }

      setIsModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save service",
        variant: "destructive",
      });
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const { error } = await supabase.from("services").delete().eq("id", id);

      if (error) throw error;

      setServices((prev) => prev.filter((s) => s.id !== id));
      toast({ title: "Service deleted" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("services")
        .update({ is_active: isActive })
        .eq("id", id);

      if (error) throw error;

      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_active: isActive } : s))
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update service",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 bg-card rounded-xl w-1/3"></div>
        <div className="grid gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-card rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Services</h1>
          <p className="text-muted-foreground mt-1">Manage your dental services</p>
        </div>
        <Button variant="cta" onClick={() => openModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className={`bg-card rounded-2xl p-6 border border-border/50 shadow-soft ${
              !service.is_active ? "opacity-60" : ""
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-light flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg text-foreground">{service.name}</h3>
                    {!service.is_active && (
                      <span className="px-2 py-0.5 bg-muted rounded text-xs text-muted-foreground">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {service.description}
                  </p>
                  {service.features && service.features.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {service.features.slice(0, 3).map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-0.5 bg-muted rounded-full text-xs text-muted-foreground"
                        >
                          {feature}
                        </span>
                      ))}
                      {service.features.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{service.features.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Active</span>
                  <Switch
                    checked={service.is_active ?? true}
                    onCheckedChange={(checked) => toggleActive(service.id, checked)}
                  />
                </div>
                <Button size="sm" variant="ghost" onClick={() => openModal(service)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => deleteService(service.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingService ? "Edit Service" : "Add New Service"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={0}
                  value={formData.duration_minutes}
                  onChange={(e) =>
                    setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Features (comma-separated)</Label>
              <Input
                id="features"
                placeholder="Feature 1, Feature 2, Feature 3"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Service is active</Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" variant="cta" className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Save Service
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminServices;
