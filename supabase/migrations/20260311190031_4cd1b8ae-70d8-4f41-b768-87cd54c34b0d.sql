DROP FUNCTION IF EXISTS public.assign_admin_role(uuid);

CREATE OR REPLACE FUNCTION public.validate_admin_signup(_signup_code text)
RETURNS TABLE (is_valid boolean, message text, available_slots integer)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_count integer;
  max_total_admins constant integer := 7; -- owner + 6 additional admins
BEGIN
  SELECT COUNT(*) INTO admin_count
  FROM public.user_roles
  WHERE role = 'admin';

  IF _signup_code IS NULL OR btrim(_signup_code) = '' THEN
    RETURN QUERY
    SELECT false, 'Signup code is required.', GREATEST(max_total_admins - admin_count, 0);
    RETURN;
  END IF;

  IF _signup_code <> 'Rishi@123' THEN
    RETURN QUERY
    SELECT false, 'Invalid signup code.', GREATEST(max_total_admins - admin_count, 0);
    RETURN;
  END IF;

  IF admin_count >= max_total_admins THEN
    RETURN QUERY
    SELECT false, 'Admin limit reached. Only 6 additional admins are allowed.', 0;
    RETURN;
  END IF;

  RETURN QUERY
  SELECT true, 'Signup code accepted.', (max_total_admins - admin_count);
END;
$$;

CREATE OR REPLACE FUNCTION public.assign_admin_role(_user_id uuid, _signup_code text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_count integer;
  max_total_admins constant integer := 7; -- owner + 6 additional admins
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF auth.uid() <> _user_id THEN
    RAISE EXCEPTION 'You can only assign admin role to your own account.';
  END IF;

  IF _signup_code IS NULL OR btrim(_signup_code) = '' OR _signup_code <> 'Rishi@123' THEN
    RAISE EXCEPTION 'Invalid signup code.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  ) THEN
    RETURN;
  END IF;

  SELECT COUNT(*) INTO admin_count
  FROM public.user_roles
  WHERE role = 'admin';

  IF admin_count >= max_total_admins THEN
    RAISE EXCEPTION 'Admin limit reached. Only 6 additional admins are allowed.';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

REVOKE ALL ON FUNCTION public.validate_admin_signup(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_admin_signup(text) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.assign_admin_role(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.assign_admin_role(uuid, text) TO authenticated;