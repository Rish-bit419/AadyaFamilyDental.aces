import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
  lines?: number;
  showImage?: boolean;
  showAvatar?: boolean;
}

export const SkeletonCard = ({ 
  className, 
  lines = 3, 
  showImage = false,
  showAvatar = false 
}: SkeletonCardProps) => {
  return (
    <div className={cn("bg-card rounded-2xl border border-border/50 overflow-hidden", className)}>
      {showImage && (
        <div className="aspect-video bg-gradient-to-r from-muted via-muted/70 to-muted animate-shimmer" />
      )}
      <div className="p-6 space-y-4">
        {showAvatar && (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-muted via-muted/70 to-muted animate-shimmer" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-24 rounded bg-gradient-to-r from-muted via-muted/70 to-muted animate-shimmer" />
              <div className="h-3 w-16 rounded bg-gradient-to-r from-muted via-muted/70 to-muted animate-shimmer" />
            </div>
          </div>
        )}
        {Array.from({ length: lines }).map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "h-4 rounded bg-gradient-to-r from-muted via-muted/70 to-muted animate-shimmer",
              i === lines - 1 ? "w-3/4" : "w-full"
            )}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
};

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export const SkeletonText = ({ lines = 3, className }: SkeletonTextProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "h-4 rounded bg-gradient-to-r from-muted via-muted/70 to-muted animate-shimmer",
            i === lines - 1 ? "w-2/3" : "w-full"
          )}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
};

interface SkeletonServiceCardProps {
  className?: string;
}

export const SkeletonServiceCard = ({ className }: SkeletonServiceCardProps) => {
  return (
    <div className={cn("bg-card rounded-2xl border border-border/50 p-8", className)}>
      <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-muted via-muted/70 to-muted animate-shimmer mb-6" />
      <div className="h-6 w-3/4 rounded bg-gradient-to-r from-muted via-muted/70 to-muted animate-shimmer mb-3" />
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-gradient-to-r from-muted via-muted/70 to-muted animate-shimmer" />
        <div className="h-4 w-5/6 rounded bg-gradient-to-r from-muted via-muted/70 to-muted animate-shimmer" />
      </div>
    </div>
  );
};

interface SkeletonDoctorCardProps {
  className?: string;
}

export const SkeletonDoctorCard = ({ className }: SkeletonDoctorCardProps) => {
  return (
    <div className={cn("bg-card rounded-3xl border border-border/50 overflow-hidden", className)}>
      <div className="aspect-[4/3] bg-gradient-to-r from-muted via-muted/70 to-muted animate-shimmer" />
      <div className="p-6 space-y-3">
        <div className="h-6 w-3/4 rounded bg-gradient-to-r from-muted via-muted/70 to-muted animate-shimmer" />
        <div className="h-4 w-1/2 rounded bg-gradient-to-r from-muted via-muted/70 to-muted animate-shimmer" />
        <div className="h-4 w-2/3 rounded bg-gradient-to-r from-muted via-muted/70 to-muted animate-shimmer" />
      </div>
    </div>
  );
};

interface SkeletonTestimonialCardProps {
  className?: string;
}

export const SkeletonTestimonialCard = ({ className }: SkeletonTestimonialCardProps) => {
  return (
    <div className={cn("bg-card rounded-3xl border border-border/50 p-8", className)}>
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-5 h-5 rounded bg-gradient-to-r from-muted via-muted/70 to-muted animate-shimmer" />
        ))}
      </div>
      <div className="space-y-2 mb-6">
        <div className="h-4 w-full rounded bg-gradient-to-r from-muted via-muted/70 to-muted animate-shimmer" />
        <div className="h-4 w-full rounded bg-gradient-to-r from-muted via-muted/70 to-muted animate-shimmer" />
        <div className="h-4 w-3/4 rounded bg-gradient-to-r from-muted via-muted/70 to-muted animate-shimmer" />
      </div>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-muted via-muted/70 to-muted animate-shimmer" />
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-gradient-to-r from-muted via-muted/70 to-muted animate-shimmer" />
          <div className="h-3 w-16 rounded bg-gradient-to-r from-muted via-muted/70 to-muted animate-shimmer" />
        </div>
      </div>
    </div>
  );
};
