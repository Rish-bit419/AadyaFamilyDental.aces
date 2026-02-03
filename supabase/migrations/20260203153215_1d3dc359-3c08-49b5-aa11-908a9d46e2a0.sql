-- Create blog_posts table for dental tips and articles
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  category TEXT,
  author_name TEXT DEFAULT 'Dental Care Team',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can view published posts
CREATE POLICY "Published posts are viewable by everyone"
ON public.blog_posts
FOR SELECT
USING (is_published = true);

-- Admins can manage all posts
CREATE POLICY "Admins can manage blog posts"
ON public.blog_posts
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Add updated_at trigger
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample blog posts
INSERT INTO public.blog_posts (title, slug, excerpt, content, category, is_published, published_at) VALUES
('5 Tips for Maintaining Healthy Teeth', 'tips-healthy-teeth', 'Discover the essential daily habits that keep your smile bright and healthy.', 'Maintaining healthy teeth is crucial for your overall well-being. Here are five essential tips:\n\n## 1. Brush Twice Daily\nBrush your teeth for at least two minutes, twice a day using fluoride toothpaste.\n\n## 2. Floss Daily\nFlossing removes plaque and food particles from between teeth where your toothbrush can''t reach.\n\n## 3. Limit Sugary Foods\nSugar feeds harmful bacteria that cause tooth decay. Limit sugary snacks and drinks.\n\n## 4. Visit Your Dentist Regularly\nSchedule dental checkups every six months for professional cleaning and early problem detection.\n\n## 5. Stay Hydrated\nDrinking water helps wash away food particles and keeps your mouth moist.', 'Dental Tips', true, now()),
('Understanding Dental Implants: A Complete Guide', 'understanding-dental-implants', 'Everything you need to know about dental implants and how they can restore your smile.', 'Dental implants have revolutionized tooth replacement. Here''s what you need to know:\n\n## What Are Dental Implants?\nDental implants are titanium posts surgically placed into the jawbone to replace missing tooth roots.\n\n## Benefits of Dental Implants\n- Look and feel like natural teeth\n- Permanent solution\n- Preserve facial structure\n- Don''t affect adjacent teeth\n\n## The Procedure\nThe process typically takes 3-6 months and involves:\n1. Initial consultation\n2. Implant placement\n3. Healing period\n4. Crown attachment\n\n## Are You a Candidate?\nMost adults with good oral health are candidates for dental implants.', 'Treatments', true, now()),
('The Truth About Teeth Whitening', 'truth-about-teeth-whitening', 'Separate fact from fiction when it comes to achieving a brighter smile.', 'Teeth whitening is one of the most popular cosmetic dental procedures. Let''s explore the facts:\n\n## Professional vs At-Home Whitening\nProfessional whitening is faster and more effective, but at-home options can work for mild staining.\n\n## What Causes Tooth Discoloration?\n- Coffee and tea\n- Red wine\n- Tobacco use\n- Aging\n- Certain medications\n\n## Is Whitening Safe?\nWhen done correctly, teeth whitening is safe. Always consult your dentist first.\n\n## How Long Do Results Last?\nResults can last 6 months to 2 years depending on your habits and maintenance.', 'Cosmetic Dentistry', true, now());

-- Insert sample doctors
INSERT INTO public.doctors (name, qualification, specialization, bio, experience_years, display_order, is_active) VALUES
('Dr. Sarah Johnson', 'DDS, FICOI', 'Implant Dentistry', 'Dr. Sarah Johnson is a highly skilled implant specialist with over 15 years of experience. She has placed thousands of dental implants and is known for her gentle approach and exceptional results.', 15, 1, true),
('Dr. Michael Chen', 'DMD, MS', 'Orthodontics', 'Dr. Michael Chen specializes in orthodontic treatments including traditional braces and Invisalign. He is passionate about creating beautiful, healthy smiles for patients of all ages.', 12, 2, true),
('Dr. Emily Williams', 'DDS, FAGD', 'Cosmetic Dentistry', 'Dr. Emily Williams is an expert in cosmetic dentistry, offering treatments from teeth whitening to complete smile makeovers. Her artistic eye and technical skill deliver stunning results.', 10, 3, true);

-- Insert sample testimonials
INSERT INTO public.testimonials (patient_name, review_text, rating, treatment_type, is_featured, is_active) VALUES
('Jennifer M.', 'I was terrified of getting dental implants, but Dr. Johnson made the entire process comfortable and painless. My new smile looks completely natural!', 5, 'Dental Implants', true, true),
('Robert K.', 'The best dental experience I''ve ever had. The staff is incredibly friendly and professional. My Invisalign treatment was completed faster than expected!', 5, 'Invisalign', true, true),
('Maria S.', 'I can''t stop smiling after my teeth whitening treatment! Dr. Williams explained everything clearly and the results exceeded my expectations.', 5, 'Teeth Whitening', true, true),
('David L.', 'After years of avoiding the dentist, I finally found a place where I feel comfortable. The entire team goes above and beyond for their patients.', 5, 'General Checkup', false, true),
('Amanda P.', 'My kids actually look forward to their dental visits now! The pediatric care here is exceptional. Highly recommend for families.', 5, 'Pediatric Dentistry', false, true);

-- Insert sample before/after images (placeholder URLs)
INSERT INTO public.before_after_images (title, description, treatment_type, is_featured, display_order, before_image_url, after_image_url, is_active) VALUES
('Smile Makeover - Case 1', 'Complete smile transformation with veneers and whitening', 'Cosmetic Dentistry', true, 1, '/placeholder.svg', '/placeholder.svg', true),
('Dental Implants - Case 1', 'Full mouth restoration with dental implants', 'Dental Implants', true, 2, '/placeholder.svg', '/placeholder.svg', true),
('Invisalign Treatment', 'Teeth alignment correction over 12 months', 'Orthodontics', true, 3, '/placeholder.svg', '/placeholder.svg', true);