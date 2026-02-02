import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Save, Phone, Mail, MapPin, MessageCircle } from "lucide-react";

interface ClinicSetting {
  id: string;
  key: string;
  value: string | null;
}

const AdminSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Record<string, string>>({
    accepting_appointments: "true",
    phone: "",
    email: "",
    address: "",
    whatsapp: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from("clinic_settings").select("*");

      if (error) throw error;

      const settingsMap: Record<string, string> = { ...settings };
      data?.forEach((setting: ClinicSetting) => {
        settingsMap[setting.key] = setting.value || "";
      });
      setSettings(settingsMap);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);

    try {
      for (const [key, value] of Object.entries(settings)) {
        const { error } = await supabase
          .from("clinic_settings")
          .upsert({ key, value }, { onConflict: "key" });

        if (error) throw error;
      }

      toast({
        title: "Settings saved",
        description: "Your clinic settings have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 bg-card rounded-xl w-1/3"></div>
        <div className="h-96 bg-card rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your clinic settings</p>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft space-y-8">
        {/* Appointments Toggle */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
          <div>
            <h3 className="font-semibold text-foreground">Accept Appointments</h3>
            <p className="text-sm text-muted-foreground">
              Toggle to enable or disable appointment bookings
            </p>
          </div>
          <Switch
            checked={settings.accepting_appointments === "true"}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, accepting_appointments: checked ? "true" : "false" })
            }
          />
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <h3 className="font-display text-lg font-semibold text-foreground">
            Contact Information
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                placeholder="(123) 456-7890"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                WhatsApp Number
              </Label>
              <Input
                id="whatsapp"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                placeholder="1234567890 (numbers only)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                placeholder="info@dentalcare.com"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Clinic Address
              </Label>
              <Input
                id="address"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                placeholder="123 Dental Street, Medical District, City 12345"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-border">
          <Button variant="cta" onClick={saveSettings} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
