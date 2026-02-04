-- Add education, awards, and gallery fields to doctors table
ALTER TABLE public.doctors
ADD COLUMN IF NOT EXISTS education TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS awards TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}';