 import { useState, useRef } from "react";
 import Layout from "@/components/layout/Layout";
 import { Button } from "@/components/ui/button";
 import { Slider } from "@/components/ui/slider";
 import { Upload, Sparkles, RotateCcw, Download, Camera, Info, Calendar } from "lucide-react";
 import { Link } from "react-router-dom";
 
 const SmileSimulator = () => {
   const [uploadedImage, setUploadedImage] = useState<string | null>(null);
   const [brightness, setBrightness] = useState([100]);
   const [whiteness, setWhiteness] = useState([0]);
   const [isProcessing, setIsProcessing] = useState(false);
   const fileInputRef = useRef<HTMLInputElement>(null);
   const canvasRef = useRef<HTMLCanvasElement>(null);
 
   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (file) {
       const reader = new FileReader();
       reader.onload = (e) => {
         setUploadedImage(e.target?.result as string);
       };
       reader.readAsDataURL(file);
     }
   };
 
   const resetFilters = () => {
     setBrightness([100]);
     setWhiteness([0]);
   };
 
   const handleDownload = () => {
     const canvas = canvasRef.current;
     if (canvas && uploadedImage) {
       const img = new Image();
       img.crossOrigin = "anonymous";
       img.onload = () => {
         canvas.width = img.width;
         canvas.height = img.height;
         const ctx = canvas.getContext("2d");
         if (ctx) {
           ctx.filter = `brightness(${brightness[0]}%) saturate(${100 - whiteness[0] * 0.5}%)`;
           ctx.drawImage(img, 0, 0);
           
           const link = document.createElement("a");
           link.download = "my-new-smile.png";
           link.href = canvas.toDataURL("image/png");
           link.click();
         }
       };
       img.src = uploadedImage;
     }
   };
 
   const treatments = [
     { name: "Teeth Whitening", effect: "Brighten your smile up to 8 shades" },
     { name: "Veneers", effect: "Perfect shape and alignment" },
     { name: "Invisalign", effect: "Straighten teeth discreetly" },
   ];
 
   return (
     <Layout>
       <section className="section-padding bg-gradient-to-b from-secondary to-background">
         <div className="container-custom">
           <div className="max-w-5xl mx-auto">
             <div className="text-center mb-12 animate-slide-up">
               <div className="inline-flex items-center gap-2 bg-accent/10 rounded-full px-4 py-2 mb-4">
                 <Sparkles className="w-4 h-4 text-accent" />
                 <span className="text-sm font-semibold text-accent">Preview Your New Smile</span>
               </div>
               <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                 Smile Simulator
               </h1>
               <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                 Upload a photo and see how teeth whitening and other treatments could transform your smile.
               </p>
             </div>
 
             <div className="grid lg:grid-cols-3 gap-8">
               {/* Main Preview */}
               <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                 <div className="bg-card rounded-2xl p-6 border border-border/50">
                   {uploadedImage ? (
                     <div className="space-y-6">
                       {/* Image Preview */}
                       <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                         <img
                           src={uploadedImage}
                           alt="Your smile preview"
                           className="w-full h-full object-cover"
                           style={{
                             filter: `brightness(${brightness[0]}%) saturate(${100 - whiteness[0] * 0.5}%)`,
                           }}
                         />
                         <div className="absolute top-4 right-4 flex gap-2">
                           <button
                             onClick={resetFilters}
                             className="p-2 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-background transition-colors"
                             title="Reset filters"
                           >
                             <RotateCcw className="w-5 h-5" />
                           </button>
                           <button
                             onClick={handleDownload}
                             className="p-2 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-background transition-colors"
                             title="Download image"
                           >
                             <Download className="w-5 h-5" />
                           </button>
                         </div>
                       </div>
 
                       {/* Adjustment Controls */}
                       <div className="space-y-6">
                         <div className="space-y-3">
                           <div className="flex justify-between items-center">
                             <label className="text-sm font-medium text-foreground">
                               Teeth Whitening Effect
                             </label>
                             <span className="text-sm text-muted-foreground">{whiteness[0]}%</span>
                           </div>
                           <Slider
                             value={whiteness}
                             onValueChange={setWhiteness}
                             max={50}
                             step={1}
                             className="w-full"
                           />
                         </div>
 
                         <div className="space-y-3">
                           <div className="flex justify-between items-center">
                             <label className="text-sm font-medium text-foreground">
                               Brightness
                             </label>
                             <span className="text-sm text-muted-foreground">{brightness[0]}%</span>
                           </div>
                           <Slider
                             value={brightness}
                             onValueChange={setBrightness}
                             min={80}
                             max={120}
                             step={1}
                             className="w-full"
                           />
                         </div>
                       </div>
 
                       {/* Change Photo Button */}
                       <Button
                         variant="outline"
                         onClick={() => fileInputRef.current?.click()}
                         className="w-full gap-2"
                       >
                         <Camera className="w-4 h-4" />
                         Upload Different Photo
                       </Button>
                     </div>
                   ) : (
                     <div
                       className="aspect-[4/3] rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                       onClick={() => fileInputRef.current?.click()}
                     >
                       <div className="text-center p-8">
                         <div className="w-20 h-20 rounded-full bg-teal-light flex items-center justify-center mx-auto mb-4">
                           <Upload className="w-10 h-10 text-primary" />
                         </div>
                         <h3 className="font-semibold text-foreground mb-2">
                           Upload Your Photo
                         </h3>
                         <p className="text-sm text-muted-foreground mb-4">
                           Take a selfie showing your teeth or upload an existing photo
                         </p>
                         <Button>Choose Photo</Button>
                       </div>
                     </div>
                   )}
                 </div>
 
                 <input
                   ref={fileInputRef}
                   type="file"
                   accept="image/*"
                   onChange={handleFileUpload}
                   className="hidden"
                 />
                 <canvas ref={canvasRef} className="hidden" />
               </div>
 
               {/* Sidebar */}
               <div className="space-y-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                 {/* Info Card */}
                 <div className="bg-card rounded-2xl p-6 border border-border/50">
                   <div className="flex items-start gap-3 mb-4">
                     <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                     <div>
                       <h3 className="font-semibold text-foreground mb-1">How It Works</h3>
                       <p className="text-sm text-muted-foreground">
                         This simulator provides a preview of potential results. Actual outcomes may vary based on your unique dental characteristics.
                       </p>
                     </div>
                   </div>
                 </div>
 
                 {/* Treatments */}
                 <div className="bg-card rounded-2xl p-6 border border-border/50">
                   <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                     <Sparkles className="w-5 h-5 text-primary" />
                     Popular Treatments
                   </h3>
                   <div className="space-y-3">
                     {treatments.map((treatment, i) => (
                       <div key={i} className="p-3 rounded-xl bg-secondary">
                         <h4 className="font-medium text-foreground text-sm">{treatment.name}</h4>
                         <p className="text-xs text-muted-foreground">{treatment.effect}</p>
                       </div>
                     ))}
                   </div>
                 </div>
 
                 {/* CTA */}
                 <div className="bg-gradient-to-br from-primary to-teal-dark rounded-2xl p-6 text-white">
                   <Calendar className="w-8 h-8 mb-3" />
                   <h3 className="font-semibold mb-2">Ready for Your Transformation?</h3>
                   <p className="text-sm opacity-90 mb-4">
                     Book a consultation to discuss your treatment options with our experts.
                   </p>
                   <Link to="/book-appointment">
                     <Button variant="hero" size="sm" className="w-full">
                       Book Consultation
                     </Button>
                   </Link>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </section>
     </Layout>
   );
 };
 
 export default SmileSimulator;