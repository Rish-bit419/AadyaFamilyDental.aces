import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, ArrowLeftRight, ImageIcon } from "lucide-react";
import { SkeletonCard } from "@/components/ui/skeleton-cards";

interface BeforeAfterImage {
  id: string;
  title: string;
  description: string | null;
  before_image_url: string;
  after_image_url: string;
  treatment_type: string | null;
}

const BeforeAfterPreview = () => {
  const [images, setImages] = useState<BeforeAfterImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSliders, setActiveSliders] = useState<Record<string, number>>({});
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from("before_after_images")
        .select("*")
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("display_order", { ascending: true })
        .limit(3);

      if (!error && data) {
        setImages(data);
        const initialSliders: Record<string, number> = {};
        data.forEach((img) => {
          initialSliders[img.id] = 50;
        });
        setActiveSliders(initialSliders);
      }
      setIsLoading(false);
    };

    fetchImages();
  }, []);

  const handleSliderChange = (id: string, value: number) => {
    setActiveSliders((prev) => ({ ...prev, [id]: value }));
  };

  if (isLoading) {
    return (
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              Transformations
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Before & After Results
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} showImage lines={2} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              Transformations
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              See the Difference
            </h2>
            <p className="text-lg text-muted-foreground">
              Witness amazing smile transformations from our satisfied patients.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-teal-light to-secondary flex items-center justify-center animate-slide-up interactive-card"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-center p-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-float">
                    <ImageIcon className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-muted-foreground">Coming Soon</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Transformations
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Before & After Results
          </h2>
          <p className="text-lg text-muted-foreground">
            See the remarkable transformations we've achieved for our patients. 
            Slide to compare before and after results.
          </p>
        </div>

        {/* Gallery */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="group bg-card rounded-2xl overflow-hidden border border-border/50 shadow-soft hover:shadow-lg transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoveredImage(image.id)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              {/* Image Comparison Slider */}
              <div className="aspect-[4/3] relative overflow-hidden">
                {/* After Image (Background) */}
                <img
                  src={image.after_image_url}
                  alt={`${image.title} - After`}
                  loading="lazy"
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${hoveredImage === image.id ? 'scale-105' : ''}`}
                />
                
                {/* Before Image (Overlay with clip) */}
                <div
                  className="absolute inset-0 overflow-hidden transition-all duration-300"
                  style={{ clipPath: `inset(0 ${100 - activeSliders[image.id]}% 0 0)` }}
                >
                  <img
                    src={image.before_image_url}
                    alt={`${image.title} - Before`}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-transform duration-700 ${hoveredImage === image.id ? 'scale-105' : ''}`}
                  />
                </div>

                {/* Slider Handle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-primary-foreground shadow-lg cursor-ew-resize transition-all duration-150"
                  style={{ left: `${activeSliders[image.id]}%`, transform: "translateX(-50%)" }}
                >
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary-foreground shadow-lg flex items-center justify-center transition-transform duration-300 ${hoveredImage === image.id ? 'scale-110' : ''}`}>
                    <ArrowLeftRight className="w-5 h-5 text-primary" />
                  </div>
                </div>

                {/* Slider Input */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={activeSliders[image.id]}
                  onChange={(e) => handleSliderChange(image.id, Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                />

                {/* Labels */}
                <div className="absolute bottom-4 left-4 bg-foreground/80 backdrop-blur-sm text-primary-foreground px-3 py-1.5 rounded-full text-xs font-semibold transition-transform hover:scale-105">
                  Before
                </div>
                <div className="absolute bottom-4 right-4 bg-primary backdrop-blur-sm text-primary-foreground px-3 py-1.5 rounded-full text-xs font-semibold transition-transform hover:scale-105">
                  After
                </div>

                {/* Hover hint */}
                <div className={`absolute inset-0 flex items-center justify-center bg-foreground/20 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-none ${hoveredImage === image.id ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
                  <div className="bg-card/90 px-4 py-2 rounded-full text-sm font-medium text-foreground shadow-lg">
                    Drag to compare
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {image.title}
                </h3>
                {image.treatment_type && (
                  <span className="inline-block text-xs font-medium text-primary bg-teal-light px-3 py-1 rounded-full">
                    {image.treatment_type}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
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
