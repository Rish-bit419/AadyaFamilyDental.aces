import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import QuickActions from "@/components/home/QuickActions";
import StatsCounter from "@/components/home/StatsCounter";
import ServicesSection from "@/components/home/ServicesSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import DoctorsPreview from "@/components/home/DoctorsPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import BeforeAfterPreview from "@/components/home/BeforeAfterPreview";
import LocationSection from "@/components/home/LocationSection";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <QuickActions />
      <StatsCounter />
      <WhyChooseUs />
      <ServicesSection />
      <DoctorsPreview />
      <BeforeAfterPreview />
      <TestimonialsSection />
      <FAQSection />
      <LocationSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
