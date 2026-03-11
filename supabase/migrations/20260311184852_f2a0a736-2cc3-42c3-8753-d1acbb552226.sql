
CREATE POLICY "Patients can view own appointments by email"
ON public.appointments
FOR SELECT
TO authenticated
USING (patient_email = (SELECT email FROM auth.users WHERE id = auth.uid()));
