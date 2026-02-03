import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeftRight, X, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeAfterImage {
  id: string;
  title: string;
  description: string | null;
  before_image_url: string;
  after_image_url: string;
  treatment_type: string | null;
}

const Gallery = () => {
  const [images, setImages] = useState<BeforeAfterImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<BeforeAfterImage | null>(null);
  const [sliderPositions, setSliderPositions] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from("before_after_images")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!error && data) {
        setImages(data);
        const positions: Record<string, number> = {};
        data.forEach((img) => {
          positions[img.id] = 50;
        });
        setSliderPositions(positions);
      }
      setIsLoading(false);
    };

    fetchImages();
  }, []);

  const treatmentTypes = ["all", ...new Set(images.map((img) => img.treatment_type).filter(Boolean))];
  
  const filteredImages = filter === "all" 
    ? images 
    : images.filter((img) => img.treatment_type === filter);

  const handleSliderChange = (id: string, value: number) => {
    setSliderPositions((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-secondary to-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              Our Work
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Before & After Gallery
            </h1>
            <p className="text-lg text-muted-foreground">
              See the remarkable smile transformations we've achieved for our patients. 
              Slide to compare the before and after results.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      {treatmentTypes.length > 1 && (
        <section className="py-6 bg-background sticky top-0 z-20 border-b border-border/50">
          <div className="container-custom">
            <div className="flex flex-wrap gap-2 justify-center">
              {treatmentTypes.map((type) => (
                <Button
                  key={type}
                  variant={filter === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(type as string)}
                  className="capitalize"
                >
                  {type === "all" ? "All Treatments" : type}
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[4/3] bg-muted rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No Images Yet
              </h3>
              <p className="text-muted-foreground">
                Before & after images will be added soon.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredImages.map((image, index) => (
                <div
                  key={image.id}
                  className="group bg-card rounded-2xl overflow-hidden border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => setSelectedImage(image)}
                >
                  {/* Image Comparison */}
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={image.after_image_url}
                      alt={`${image.title} - After`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ clipPath: `inset(0 ${100 - sliderPositions[image.id]}% 0 0)` }}
                    >
                      <img
                        src={image.before_image_url}
                        alt={`${image.title} - Before`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-primary-foreground shadow-lg"
                      style={{ left: `${sliderPositions[image.id]}%`, transform: "translateX(-50%)" }}
                    >
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary-foreground shadow-lg flex items-center justify-center">
                        <ArrowLeftRight className="w-4 h-4 text-primary" />
                      </div>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderPositions[image.id]}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSliderChange(image.id, Number(e.target.value));
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                    />

                    <div className="absolute bottom-3 left-3 bg-foreground/80 backdrop-blur-sm text-primary-foreground px-2.5 py-1 rounded-full text-xs font-semibold">
                      Before
                    </div>
                    <div className="absolute bottom-3 right-3 bg-primary backdrop-blur-sm text-primary-foreground px-2.5 py-1 rounded-full text-xs font-semibold">
                      After
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      {image.title}
                    </h3>
                    {image.treatment_type && (
                      <span className="inline-block text-xs font-medium text-primary bg-teal-light px-2.5 py-1 rounded-full">
                        {image.treatment_type}
                      </span>
                    )}
                    {image.description && (
                      <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                        {image.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-foreground/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/30 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full">
            <div className="bg-card rounded-3xl overflow-hidden shadow-2xl">
              <div className="aspect-[16/10] relative overflow-hidden">
                <img
                  src={selectedImage.after_image_url}
                  alt={`${selectedImage.title} - After`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - (sliderPositions[selectedImage.id] || 50)}% 0 0)` }}
                >
                  <img
                    src={selectedImage.before_image_url}
                    alt={`${selectedImage.title} - Before`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div
                  className="absolute top-0 bottom-0 w-1 bg-primary-foreground shadow-lg"
                  style={{ left: `${sliderPositions[selectedImage.id] || 50}%`, transform: "translateX(-50%)" }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary-foreground shadow-lg flex items-center justify-center">
                    <ArrowLeftRight className="w-6 h-6 text-primary" />
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPositions[selectedImage.id] || 50}
                  onChange={(e) => handleSliderChange(selectedImage.id, Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                />

                <div className="absolute bottom-4 left-4 bg-foreground/80 backdrop-blur-sm text-primary-foreground px-3 py-1.5 rounded-full text-sm font-semibold">
                  Before
                </div>
                <div className="absolute bottom-4 right-4 bg-primary backdrop-blur-sm text-primary-foreground px-3 py-1.5 rounded-full text-sm font-semibold">
                  After
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                  {selectedImage.title}
                </h3>
                {selectedImage.treatment_type && (
                  <span className="inline-block text-sm font-medium text-primary bg-teal-light px-3 py-1 rounded-full mb-3">
                    {selectedImage.treatment_type}
                  </span>
                )}
                {selectedImage.description && (
                  <p className="text-muted-foreground mt-3">
                    {selectedImage.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Gallery;
