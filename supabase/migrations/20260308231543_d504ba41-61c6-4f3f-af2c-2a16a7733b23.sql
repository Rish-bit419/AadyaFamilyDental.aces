
-- Fix restrictive SELECT policies to permissive on all public-facing tables

-- services
DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;
CREATE POLICY "Services are viewable by everyone" ON public.services FOR SELECT USING (true);

-- testimonials
DROP POLICY IF EXISTS "Testimonials are viewable by everyone" ON public.testimonials;
CREATE POLICY "Testimonials are viewable by everyone" ON public.testimonials FOR SELECT USING (true);

-- locations
DROP POLICY IF EXISTS "Locations are viewable by everyone" ON public.locations;
CREATE POLICY "Locations are viewable by everyone" ON public.locations FOR SELECT USING (true);

-- faqs
DROP POLICY IF EXISTS "FAQs are viewable by everyone" ON public.faqs;
CREATE POLICY "FAQs are viewable by everyone" ON public.faqs FOR SELECT USING ((is_active = true));

-- before_after_images
DROP POLICY IF EXISTS "Before after images are viewable by everyone" ON public.before_after_images;
CREATE POLICY "Before after images are viewable by everyone" ON public.before_after_images FOR SELECT USING (true);

-- clinic_settings
DROP POLICY IF EXISTS "Clinic settings are viewable by everyone" ON public.clinic_settings;
CREATE POLICY "Clinic settings are viewable by everyone" ON public.clinic_settings FOR SELECT USING (true);

-- blog_posts
DROP POLICY IF EXISTS "Published posts are viewable by everyone" ON public.blog_posts;
CREATE POLICY "Published posts are viewable by everyone" ON public.blog_posts FOR SELECT USING ((is_published = true));

-- patient_reviews
DROP POLICY IF EXISTS "Approved reviews are viewable by everyone" ON public.patient_reviews;
CREATE POLICY "Approved reviews are viewable by everyone" ON public.patient_reviews FOR SELECT USING ((is_approved = true));

-- appointments (insert)
DROP POLICY IF EXISTS "Anyone can create appointments" ON public.appointments;
CREATE POLICY "Anyone can create appointments" ON public.appointments FOR INSERT WITH CHECK (true);

-- cost_estimates (insert)
DROP POLICY IF EXISTS "Anyone can create estimates" ON public.cost_estimates;
CREATE POLICY "Anyone can create estimates" ON public.cost_estimates FOR INSERT WITH CHECK (true);

-- patient_reviews (insert)
DROP POLICY IF EXISTS "Anyone can submit reviews" ON public.patient_reviews;
CREATE POLICY "Anyone can submit reviews" ON public.patient_reviews FOR INSERT WITH CHECK (true);

-- virtual_consultations (insert)
DROP POLICY IF EXISTS "Anyone can book virtual consultations" ON public.virtual_consultations;
CREATE POLICY "Anyone can book virtual consultations" ON public.virtual_consultations FOR INSERT WITH CHECK (true);
