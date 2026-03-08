
-- Drop restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Doctors are viewable by everyone" ON public.doctors;
DROP POLICY IF EXISTS "Admins can manage doctors" ON public.doctors;

CREATE POLICY "Doctors are viewable by everyone"
ON public.doctors FOR SELECT
USING (true);

CREATE POLICY "Admins can manage doctors"
ON public.doctors FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
