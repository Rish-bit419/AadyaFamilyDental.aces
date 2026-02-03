-- Create doctors table
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  qualification TEXT NOT NULL,
  specialization TEXT,
  experience_years INTEGER DEFAULT 0,
  bio TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  patient_image_url TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  treatment_type TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create before_after_images table
CREATE TABLE public.before_after_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  before_image_url TEXT NOT NULL,
  after_image_url TEXT NOT NULL,
  treatment_type TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.before_after_images ENABLE ROW LEVEL SECURITY;

-- Doctors policies
CREATE POLICY "Doctors are viewable by everyone" 
ON public.doctors FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage doctors" 
ON public.doctors FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Testimonials policies
CREATE POLICY "Testimonials are viewable by everyone" 
ON public.testimonials FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage testimonials" 
ON public.testimonials FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Before/After policies
CREATE POLICY "Before after images are viewable by everyone" 
ON public.before_after_images FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage before after images" 
ON public.before_after_images FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_doctors_updated_at
BEFORE UPDATE ON public.doctors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_before_after_images_updated_at
BEFORE UPDATE ON public.before_after_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for clinic images
INSERT INTO storage.buckets (id, name, public) VALUES ('clinic-images', 'clinic-images', true);

-- Storage policies for clinic images
CREATE POLICY "Clinic images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'clinic-images');

CREATE POLICY "Admins can upload clinic images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'clinic-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update clinic images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'clinic-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete clinic images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'clinic-images' AND has_role(auth.uid(), 'admin'::app_role));

-- Insert sample doctors data
INSERT INTO public.doctors (name, qualification, specialization, experience_years, bio, display_order) VALUES
('Dr. James Mitchell', 'BDS, MDS - Prosthodontics', 'Dental Implants & Cosmetic Dentistry', 15, 'Dr. Mitchell is a renowned dental surgeon with over 15 years of experience in advanced dental procedures. He specializes in dental implants and full mouth rehabilitation.', 1),
('Dr. Sarah Williams', 'BDS, MDS - Orthodontics', 'Braces & Clear Aligners', 12, 'Dr. Williams is an expert orthodontist known for her gentle approach and expertise in invisible braces and smile makeovers.', 2),
('Dr. Michael Chen', 'BDS, MDS - Endodontics', 'Root Canal & Laser Dentistry', 10, 'Dr. Chen specializes in painless root canal treatments using the latest laser technology and microscopic dentistry.', 3);

-- Insert sample testimonials
INSERT INTO public.testimonials (patient_name, rating, review_text, treatment_type, is_featured) VALUES
('Emily Johnson', 5, 'Amazing experience! The team made me feel so comfortable during my dental implant procedure. The results exceeded my expectations.', 'Dental Implants', true),
('Robert Davis', 5, 'I was terrified of dentists until I came here. Dr. Williams is so gentle and patient. My smile transformation with Invisalign is incredible!', 'Orthodontics', true),
('Maria Garcia', 5, 'The best dental clinic I''ve ever visited. Professional staff, modern equipment, and excellent results. Highly recommend!', 'Cosmetic Dentistry', true),
('James Wilson', 5, 'Had a root canal here and it was completely painless. Dr. Chen is a miracle worker!', 'Root Canal', false);

-- Update services table with more details
UPDATE public.services SET features = ARRAY['Comprehensive Exam', 'Digital X-rays', 'Professional Cleaning', 'Oral Cancer Screening', 'Personalized Treatment Plan'] WHERE name = 'General Dentistry';
UPDATE public.services SET features = ARRAY['In-Office Whitening', 'Take-Home Kits', 'Laser Whitening', 'Long-lasting Results'] WHERE name = 'Teeth Whitening';
UPDATE public.services SET features = ARRAY['Single Tooth Implants', 'Full Arch Restoration', 'Bone Grafting', 'Same-Day Implants', 'Lifetime Warranty'] WHERE name = 'Dental Implants';
UPDATE public.services SET features = ARRAY['Traditional Braces', 'Clear Aligners', 'Invisalign', 'Lingual Braces', 'Retainers'] WHERE name = 'Orthodontics';