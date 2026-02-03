import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import DoctorsPreview from "@/components/home/DoctorsPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import BeforeAfterPreview from "@/components/home/BeforeAfterPreview";
import LocationSection from "@/components/home/LocationSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <WhyChooseUs />
      <ServicesSection />
      <DoctorsPreview />
      <BeforeAfterPreview />
      <TestimonialsSection />
      <LocationSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
