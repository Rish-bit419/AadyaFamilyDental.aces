import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";

const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const BookAppointment = lazy(() => import("./pages/BookAppointment"));
const Contact = lazy(() => import("./pages/Contact"));
const PatientAuth = lazy(() => import("./pages/PatientAuth"));
const PatientDashboard = lazy(() => import("./pages/PatientDashboard"));
const VirtualConsultation = lazy(() => import("./pages/VirtualConsultation"));
const SubmitReview = lazy(() => import("./pages/SubmitReview"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminAppointments = lazy(() => import("./pages/admin/AdminAppointments"));
const AdminServices = lazy(() => import("./pages/admin/AdminServices"));
const AdminDoctors = lazy(() => import("./pages/admin/AdminDoctors"));
const AdminGallery = lazy(() => import("./pages/admin/AdminGallery"));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminLocations = lazy(() => import("./pages/admin/AdminLocations"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const AppFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="animate-pulse text-muted-foreground">Loading...</div>
  </div>
);

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<AppFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:id" element={<ServiceDetail />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/book-appointment" element={<BookAppointment />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/patient/auth" element={<PatientAuth />} />
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              <Route path="/virtual-consultation" element={<VirtualConsultation />} />
              <Route path="/submit-review" element={<SubmitReview />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="appointments" element={<AdminAppointments />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="doctors" element={<AdminDoctors />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="blog" element={<AdminBlog />} />
                <Route path="locations" element={<AdminLocations />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
