-- DRONE AIR: additive least-privilege update for customer identity fields.
-- Target database migration only; no application secret or environment values.
-- Existing row policies still restrict updates to auth.uid() = profiles.id.

REVOKE UPDATE ON TABLE public.profiles FROM PUBLIC, anon, authenticated;
GRANT UPDATE (first_name, last_name, preferred_language)
  ON TABLE public.profiles TO authenticated;

-- Keep the profile email a projection of the canonical Auth user email.
-- A browser cannot update email directly through the Data API.
CREATE OR REPLACE FUNCTION public.sync_auth_email_to_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.profiles SET email = NEW.email WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.sync_auth_email_to_profile()
  FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_email_updated ON auth.users;
CREATE TRIGGER on_auth_user_email_updated
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW
  WHEN (OLD.email IS DISTINCT FROM NEW.email)
  EXECUTE FUNCTION public.sync_auth_email_to_profile();

-- A user must not be able to query whether an arbitrary OTHER user belongs
-- to a client through the SECURITY DEFINER member lookup RPC.
CREATE OR REPLACE FUNCTION public.is_client_member(_user_id uuid, _client_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT _user_id = (select auth.uid()) AND EXISTS (
    SELECT 1 FROM public.client_memberships
    WHERE user_id = _user_id AND client_id = _client_id
  );
$$;

REVOKE ALL ON FUNCTION public.is_client_member(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_client_member(uuid, uuid)
  TO authenticated, service_role;
