import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, KeyRound, UserPlus } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  signupCode: z.string().min(1, "Signup code is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    signupCode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;

    const verifyExistingSession = async (session: { user: { id: string } } | null) => {
      if (!isMounted) return;

      if (!session?.user) {
        setIsCheckingSession(false);
        return;
      }

      const { data: hasAdmin, error } = await supabase.rpc("has_role", {
        _user_id: session.user.id,
        _role: "admin" as const,
      });

      if (!isMounted) return;

      if (!error && hasAdmin) {
        navigate("/admin/dashboard", { replace: true });
        return;
      }

      setIsCheckingSession(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      void verifyExistingSession(session as { user: { id: string } } | null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      void verifyExistingSession(session as { user: { id: string } } | null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogin = async () => {
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        fieldErrors[error.path[0] as string] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Login failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      if (data.session) {
        toast({
          title: "Welcome back!",
          description: "Signed in successfully.",
        });
        navigate("/admin/dashboard", { replace: true });
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    const result = signupSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        fieldErrors[error.path[0] as string] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const { data: validationRows, error: validationError } = await supabase.rpc("validate_admin_signup", {
        _signup_code: formData.signupCode,
      });

      const validation = validationRows?.[0];

      if (validationError || !validation?.is_valid) {
        const message = validationError?.message || validation?.message || "Invalid signup code.";
        setErrors({ signupCode: message });
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "Account exists",
            description: "This email is already registered. Please sign in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Signup failed",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      if (!data.user) {
        throw new Error("Could not create account.");
      }

      if (!data.session) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) throw signInError;
      }

      const { error: roleError } = await supabase.rpc("assign_admin_role", {
        _user_id: data.user.id,
        _signup_code: formData.signupCode,
      });

      if (roleError) {
        await supabase.auth.signOut();
        toast({
          title: "Signup failed",
          description: roleError.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Account created!",
        description: "Your admin access is active. You are now signed in.",
      });

      navigate("/admin/dashboard", { replace: true });
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (isSignup) {
      await handleSignup();
    } else {
      await handleLogin();
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-teal-light/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to website
        </Link>

        {/* Login Card */}
        <div className="bg-card rounded-3xl p-8 shadow-medium border border-border/50 animate-scale-in">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-teal-dark flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-primary-foreground font-display font-bold text-2xl">D</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {isSignup ? "Create Admin Account" : "Admin Login"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isSignup ? "Enter the signup code to register" : "Sign in to manage your dental clinic"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@dentalcare.com"
                  className={`pl-10 h-12 ${errors.email ? "border-destructive" : ""}`}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`pl-10 pr-10 h-12 ${errors.password ? "border-destructive" : ""}`}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Signup Only Fields */}
            {isSignup && (
              <>
                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`pl-10 h-12 ${errors.confirmPassword ? "border-destructive" : ""}`}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Signup Code */}
                <div className="space-y-2">
                  <Label htmlFor="signupCode">Signup Code</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="signupCode"
                      type="text"
                      placeholder="Enter your signup code"
                      className={`pl-10 h-12 ${errors.signupCode ? "border-destructive" : ""}`}
                      value={formData.signupCode}
                      onChange={(e) => setFormData({ ...formData, signupCode: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.signupCode && (
                    <p className="text-sm text-destructive">{errors.signupCode}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Contact the administrator to get your signup code
                  </p>
                </div>
              </>
            )}

            {/* Submit */}
            <Button type="submit" variant="cta" size="lg" className="w-full h-12" disabled={isLoading}>
              {isLoading ? (
                isSignup ? "Creating account..." : "Signing in..."
              ) : (
                <>
                  {isSignup ? (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create Account
                    </>
                  ) : (
                    "Sign In"
                  )}
                </>
              )}
            </Button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setErrors({});
                setFormData({ email: "", password: "", confirmPassword: "", signupCode: "" });
              }}
              className="text-sm text-primary hover:underline"
            >
              {isSignup ? "Already have an account? Sign in" : "Need an account? Sign up with code"}
            </button>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Admin access only. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
