
DROP POLICY IF EXISTS "Patients can view own appointments by email" ON public.appointments;

CREATE POLICY "Patients can view own appointments by email"
ON public.appointments
FOR SELECT
TO authenticated
USING (patient_email = auth.email());
