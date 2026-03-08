import { lazy, Suspense } from "react";
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import QuickActions from "@/components/home/QuickActions";

// Lazy load below-fold sections
const StatsCounter = lazy(() => import("@/components/home/StatsCounter"));
const WhyChooseUs = lazy(() => import("@/components/home/WhyChooseUs"));
const ServicesSection = lazy(() => import("@/components/home/ServicesSection"));
const DoctorsPreview = lazy(() => import("@/components/home/DoctorsPreview"));
const BeforeAfterPreview = lazy(() => import("@/components/home/BeforeAfterPreview"));
const TestimonialsSection = lazy(() => import("@/components/home/TestimonialsSection"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const LocationSection = lazy(() => import("@/components/home/LocationSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

const SectionFallback = () => (
  <div className="py-16 flex justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <QuickActions />
      <Suspense fallback={<SectionFallback />}>
        <StatsCounter />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <WhyChooseUs />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <ServicesSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <DoctorsPreview />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <BeforeAfterPreview />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <TestimonialsSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <FAQSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <LocationSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <CTASection />
      </Suspense>
    </Layout>
  );
};

export default Index;
