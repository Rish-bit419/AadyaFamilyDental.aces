import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, ArrowLeftRight } from "lucide-react";
import { SkeletonCard } from "@/components/ui/skeleton-cards";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { withTimeout } from "@/lib/with-timeout";
import implantsImage from "@/assets/before-after-implants.jpg";
import invisalignImage from "@/assets/before-after-invisalign.jpg";
import whiteningImage from "@/assets/before-after-whitening.jpg";

interface BeforeAfterImage {
  id: string;
  title: string;
  description: string | null;
  before_image_url: string;
  after_image_url: string;
  treatment_type: string | null;
}

const fallbackImages: BeforeAfterImage[] = [
  {
    id: "fallback-1",
    title: "Implant Transformation",
    description: null,
    before_image_url: implantsImage,
    after_image_url: implantsImage,
    treatment_type: "Dental Implants",
  },
  {
    id: "fallback-2",
    title: "Aligner Progress",
    description: null,
    before_image_url: invisalignImage,
    after_image_url: invisalignImage,
    treatment_type: "Orthodontics",
  },
  {
    id: "fallback-3",
    title: "Whitening Result",
    description: null,
    before_image_url: whiteningImage,
    after_image_url: whiteningImage,
    treatment_type: "Teeth Whitening",
  },
];

const BeforeAfterPreview = () => {
  const [activeSliders, setActiveSliders] = useState<Record<string, number>>({});
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  const { data: images = fallbackImages, isLoading } = useQuery({
    queryKey: ["before-after-preview"],
    queryFn: async () => {
      try {
        const { data, error } = await withTimeout(
          supabase
            .from("before_after_images")
            .select("*")
            .eq("is_active", true)
            .eq("is_featured", true)
            .order("display_order", { ascending: true })
            .limit(3),
          4000,
          "Before & after request timed out"
        );

        if (error || !data?.length) return fallbackImages;
        return data as BeforeAfterImage[];
      } catch {
        return fallbackImages;
      }
    },
  });

  useEffect(() => {
    setActiveSliders((prev) => {
      const next = { ...prev };
      images.forEach((img) => {
        if (typeof next[img.id] !== "number") next[img.id] = 50;
      });
      return next;
    });
  }, [images]);

  const handleSliderChange = (id: string, value: number) => {
    setActiveSliders((prev) => ({ ...prev, [id]: value }));
  };

  if (isLoading) {
    return (
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">Transformations</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">Before & After Results</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} showImage lines={2} />)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">Transformations</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">Before & After Results</h2>
          <p className="text-lg text-muted-foreground">See the remarkable transformations we've achieved. Slide to compare.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="group bg-card rounded-2xl overflow-hidden border border-border/50 shadow-soft hover:shadow-lg transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoveredImage(image.id)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img src={image.after_image_url} alt={`${image.title} - After`} loading="lazy" className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${hoveredImage === image.id ? "scale-105" : ""}`} />
                <div className="absolute inset-0 overflow-hidden transition-all duration-300" style={{ clipPath: `inset(0 ${100 - (activeSliders[image.id] || 50)}% 0 0)` }}>
                  <img src={image.before_image_url} alt={`${image.title} - Before`} loading="lazy" className={`w-full h-full object-cover transition-transform duration-700 ${hoveredImage === image.id ? "scale-105" : ""}`} />
                </div>
                <div className="absolute top-0 bottom-0 w-1 bg-primary-foreground shadow-lg cursor-ew-resize" style={{ left: `${activeSliders[image.id] || 50}%`, transform: "translateX(-50%)" }}>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary-foreground shadow-lg flex items-center justify-center">
                    <ArrowLeftRight className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <input type="range" min="0" max="100" value={activeSliders[image.id] || 50} onChange={(e) => handleSliderChange(image.id, Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize" />
                <div className="absolute bottom-4 left-4 bg-foreground/80 backdrop-blur-sm text-primary-foreground px-3 py-1.5 rounded-full text-xs font-semibold">Before</div>
                <div className="absolute bottom-4 right-4 bg-primary backdrop-blur-sm text-primary-foreground px-3 py-1.5 rounded-full text-xs font-semibold">After</div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{image.title}</h3>
                {image.treatment_type && <span className="inline-block text-xs font-medium text-primary bg-teal-light px-3 py-1 rounded-full">{image.treatment_type}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 animate-slide-up">
          <Link to="/gallery">
            <Button variant="outline" size="lg" className="group">
              View Full Gallery
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterPreview;
