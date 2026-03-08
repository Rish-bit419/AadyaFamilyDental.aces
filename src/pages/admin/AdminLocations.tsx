import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { MapPin, Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface Location {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  working_hours: string | null;
  map_embed_url: string | null;
  display_order: number | null;
  is_active: boolean | null;
}

const emptyForm = {
  name: "", address: "", phone: "", email: "", whatsapp: "",
  working_hours: "", map_embed_url: "", display_order: 0, is_active: true,
};

const AdminLocations = () => {
  const { toast } = useToast();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const fetchLocations = async () => {
    const { data } = await supabase.from("locations").select("*").order("display_order");
    if (data) setLocations(data);
    setIsLoading(false);
  };

  useEffect(() => { fetchLocations(); }, []);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (loc: Location) => {
    setEditingId(loc.id);
    setForm({
      name: loc.name,
      address: loc.address,
      phone: loc.phone || "",
      email: loc.email || "",
      whatsapp: loc.whatsapp || "",
      working_hours: loc.working_hours || "",
      map_embed_url: loc.map_embed_url || "",
      display_order: loc.display_order || 0,
      is_active: loc.is_active ?? true,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.address.trim()) {
      toast({ title: "Name and address are required", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        address: form.address.trim(),
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        whatsapp: form.whatsapp.trim() || null,
        working_hours: form.working_hours.trim() || null,
        map_embed_url: form.map_embed_url.trim() || null,
        display_order: form.display_order,
        is_active: form.is_active,
      };

      if (editingId) {
        const { error } = await supabase.from("locations").update(payload).eq("id", editingId);
        if (error) throw error;
        toast({ title: "Location updated!" });
      } else {
        const { error } = await supabase.from("locations").insert(payload);
        if (error) throw error;
        toast({ title: "Location added!" });
      }
      setDialogOpen(false);
      fetchLocations();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this location?")) return;
    const { error } = await supabase.from("locations").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Location deleted" });
      fetchLocations();
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Locations</h1>
          <p className="text-muted-foreground">Manage your clinic branches</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="gap-2">
              <Plus className="w-4 h-4" /> Add Location
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Location" : "Add New Location"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Clinic Name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Aadya Dental & Aesthetics" />
              </div>
              <div className="space-y-2">
                <Label>Address *</Label>
                <Textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Full address" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp</Label>
                  <Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="9876543210" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="info@clinic.in" />
              </div>
              <div className="space-y-2">
                <Label>Working Hours</Label>
                <Input value={form.working_hours} onChange={(e) => setForm({ ...form, working_hours: e.target.value })} placeholder="Mon - Sat: 10 AM - 8 PM" />
              </div>
              <div className="space-y-2">
                <Label>Google Maps Embed URL</Label>
                <Textarea value={form.map_embed_url} onChange={(e) => setForm({ ...form, map_embed_url: e.target.value })} placeholder="https://www.google.com/maps/embed?pb=..." rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Display Order</Label>
                  <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
                  <Label>Active</Label>
                </div>
              </div>
              <Button onClick={handleSave} disabled={isSaving} className="w-full">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editingId ? "Update Location" : "Add Location"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {locations.map((loc) => (
          <div key={loc.id} className="bg-card rounded-xl border border-border p-5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">{loc.name}</h3>
                {!loc.is_active && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Inactive</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{loc.address}</p>
              {loc.phone && <p className="text-sm text-muted-foreground mt-1">📞 {loc.phone}</p>}
              {loc.working_hours && <p className="text-sm text-muted-foreground">🕐 {loc.working_hours}</p>}
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="outline" onClick={() => openEdit(loc)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(loc.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {locations.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No locations added yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminLocations;
