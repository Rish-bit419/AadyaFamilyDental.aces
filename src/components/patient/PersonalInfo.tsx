import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User as UserType } from "@supabase/supabase-js";
import {
  User, Camera, Lock, Eye, EyeOff, Save, Loader2, Trash2
} from "lucide-react";

interface PersonalInfoProps {
  user: UserType;
  onProfileUpdate: () => void;
}

const PersonalInfo = ({ user, onProfileUpdate }: PersonalInfoProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(user.user_metadata?.full_name || "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSavingName, setIsSavingName] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Load profile data
  useState(() => {
    const loadProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (data) {
        if (data.full_name) setFullName(data.full_name);
        if (data.avatar_url) setAvatarUrl(data.avatar_url);
      }
      setIsLoadingProfile(false);
    };
    loadProfile();
  });

  const handleSaveName = async () => {
    if (!fullName.trim()) {
      toast({ title: "Name cannot be empty", variant: "destructive" });
      return;
    }
    setIsSavingName(true);
    try {
      // Update auth metadata
      await supabase.auth.updateUser({ data: { full_name: fullName.trim() } });
      // Update profiles table
      await supabase.from("profiles").update({ full_name: fullName.trim() }).eq("id", user.id);
      toast({ title: "Name updated successfully!" });
      onProfileUpdate();
    } catch (error: any) {
      toast({ title: "Error updating name", description: error.message, variant: "destructive" });
    } finally {
      setIsSavingName(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (0.001 MB to 100 MB)
    const minSize = 0.001 * 1024 * 1024; // ~1KB
    const maxSize = 100 * 1024 * 1024;
    if (file.size < minSize) {
      toast({ title: "File too small", description: "Minimum size is 1KB", variant: "destructive" });
      return;
    }
    if (file.size > maxSize) {
      toast({ title: "File too large", description: "Maximum size is 100MB", variant: "destructive" });
      return;
    }

    // Validate type
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file", variant: "destructive" });
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const filePath = `${user.id}/avatar.${file.name.split(".").pop()}`;

      // Remove old avatar files in the folder
      const { data: existingFiles } = await supabase.storage.from("avatars").list(user.id);
      if (existingFiles?.length) {
        await supabase.storage.from("avatars").remove(existingFiles.map(f => `${user.id}/${f.name}`));
      }

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const newUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      await supabase.from("profiles").update({ avatar_url: newUrl }).eq("id", user.id);
      setAvatarUrl(newUrl);
      toast({ title: "Profile photo updated!" });
      onProfileUpdate();
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    setIsUploadingPhoto(true);
    try {
      const { data: existingFiles } = await supabase.storage.from("avatars").list(user.id);
      if (existingFiles?.length) {
        await supabase.storage.from("avatars").remove(existingFiles.map(f => `${user.id}/${f.name}`));
      }
      await supabase.from("profiles").update({ avatar_url: null }).eq("id", user.id);
      setAvatarUrl(null);
      toast({ title: "Profile photo removed" });
      onProfileUpdate();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }

    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: "Password changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error: any) {
      toast({ title: "Error changing password", description: error.message, variant: "destructive" });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Photo */}
      <div className="bg-card rounded-2xl p-6 border border-border/50">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">Profile Photo</h3>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-border">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingPhoto}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              {isUploadingPhoto ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-2">
              Upload a profile photo (optional). Accepts images from 1KB to 100MB.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
              >
                {isUploadingPhoto ? "Uploading..." : "Upload Photo"}
              </Button>
              {avatarUrl && (
                <Button size="sm" variant="ghost" onClick={handleRemovePhoto} disabled={isUploadingPhoto}>
                  <Trash2 className="w-4 h-4 mr-1" /> Remove
                </Button>
              )}
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </div>
      </div>

      {/* Name */}
      <div className="bg-card rounded-2xl p-6 border border-border/50">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">Full Name</h3>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="pl-10"
            />
          </div>
          <Button onClick={handleSaveName} disabled={isSavingName} className="gap-2">
            {isSavingName ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </Button>
        </div>
      </div>

      {/* Email (read-only) */}
      <div className="bg-card rounded-2xl p-6 border border-border/50">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">Email Address</h3>
        <Input value={user.email || ""} disabled className="bg-muted" />
        <p className="text-xs text-muted-foreground mt-2">Email cannot be changed from here.</p>
      </div>

      {/* Change Password */}
      <div className="bg-card rounded-2xl p-6 border border-border/50">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">Change Password</h3>
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label>New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="pl-10 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm new password"
                className="pl-10"
              />
            </div>
          </div>
          <Button onClick={handleChangePassword} disabled={isChangingPassword} className="gap-2">
            {isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            Change Password
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
