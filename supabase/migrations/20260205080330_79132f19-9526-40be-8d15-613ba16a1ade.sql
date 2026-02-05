-- Create patient reviews table for custom review form
CREATE TABLE public.patient_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  patient_email TEXT,
  patient_phone TEXT,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  treatment_type TEXT,
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.patient_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a review
CREATE POLICY "Anyone can submit reviews"
ON public.patient_reviews
FOR INSERT
WITH CHECK (true);

-- Only approved reviews are publicly viewable
CREATE POLICY "Approved reviews are viewable by everyone"
ON public.patient_reviews
FOR SELECT
USING (is_approved = true);

-- Admins can manage all reviews
CREATE POLICY "Admins can manage reviews"
ON public.patient_reviews
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create virtual consultations table
CREATE TABLE public.virtual_consultations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  patient_email TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  consultation_type TEXT NOT NULL DEFAULT 'general',
  concern_description TEXT,
  status TEXT DEFAULT 'pending',
  meeting_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.virtual_consultations ENABLE ROW LEVEL SECURITY;

-- Anyone can book a virtual consultation
CREATE POLICY "Anyone can book virtual consultations"
ON public.virtual_consultations
FOR INSERT
WITH CHECK (true);

-- Admins can manage consultations
CREATE POLICY "Admins can manage virtual consultations"
ON public.virtual_consultations
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create cost estimates table
CREATE TABLE public.cost_estimates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT,
  patient_email TEXT,
  patient_phone TEXT,
  selected_services JSONB NOT NULL,
  total_estimate NUMERIC NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cost_estimates ENABLE ROW LEVEL SECURITY;

-- Anyone can save a cost estimate
CREATE POLICY "Anyone can create estimates"
ON public.cost_estimates
FOR INSERT
WITH CHECK (true);

-- Admins can view all estimates
CREATE POLICY "Admins can view estimates"
ON public.cost_estimates
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create FAQs table
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- FAQs are viewable by everyone
CREATE POLICY "FAQs are viewable by everyone"
ON public.faqs
FOR SELECT
USING (is_active = true);

-- Admins can manage FAQs
CREATE POLICY "Admins can manage FAQs"
ON public.faqs
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_patient_reviews_updated_at
  BEFORE UPDATE ON public.patient_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_virtual_consultations_updated_at
  BEFORE UPDATE ON public.virtual_consultations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample FAQs
INSERT INTO public.faqs (question, answer, category, display_order) VALUES
('How often should I visit the dentist?', 'We recommend visiting the dentist every 6 months for regular check-ups and cleanings. However, if you have specific dental concerns, more frequent visits may be necessary.', 'general', 1),
('Does teeth whitening damage enamel?', 'Professional teeth whitening, when done correctly, does not damage tooth enamel. Our whitening treatments use safe, clinically-tested formulas that are gentle on your teeth.', 'cosmetic', 2),
('How long do dental implants last?', 'With proper care and maintenance, dental implants can last a lifetime. They are designed to be a permanent solution for missing teeth.', 'implants', 3),
('Is Invisalign as effective as traditional braces?', 'Yes, Invisalign is equally effective for most orthodontic cases. It offers the added benefits of being virtually invisible and removable for eating and cleaning.', 'orthodontics', 4),
('What should I do in a dental emergency?', 'Contact our clinic immediately. We offer same-day emergency appointments. For severe pain or bleeding, describe your symptoms and we will guide you on immediate steps.', 'emergency', 5),
('Do you offer payment plans?', 'Yes, we offer flexible payment plans and accept most dental insurance. Our team can help you understand your coverage and financing options.', 'financial', 6);