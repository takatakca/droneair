-- =========================================================
-- Shared updated_at trigger function
-- =========================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================================================
-- Roles
-- =========================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'client');
  END IF;
END
$$;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- =========================================================
-- Profiles
-- =========================================================
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  email text,
  preferred_language text NOT NULL DEFAULT 'fr',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email, preferred_language)
  VALUES (
    NEW.id,
    NULLIF(NEW.raw_user_meta_data ->> 'first_name', ''),
    NULLIF(NEW.raw_user_meta_data ->> 'last_name', ''),
    NEW.email,
    COALESCE(NULLIF(NEW.raw_user_meta_data ->> 'preferred_language', ''), 'fr')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================
-- Clients + memberships
-- =========================================================
CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.client_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  membership_role text NOT NULL DEFAULT 'member',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (client_id, user_id)
);

GRANT SELECT ON public.client_memberships TO authenticated;
GRANT ALL ON public.client_memberships TO service_role;

ALTER TABLE public.client_memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own memberships"
  ON public.client_memberships FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.is_client_member(_user_id uuid, _client_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.client_memberships
    WHERE user_id = _user_id AND client_id = _client_id
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_client_member(uuid, uuid) TO authenticated, service_role;

CREATE POLICY "Members can read their own client"
  ON public.clients FOR SELECT TO authenticated
  USING (public.is_client_member(auth.uid(), id));

CREATE TRIGGER clients_set_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- Client projects
-- =========================================================
CREATE TABLE public.client_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  mission_request_id uuid REFERENCES public.mission_requests(id) ON DELETE SET NULL,
  title text NOT NULL,
  project_reference text,
  location text,
  service_type text,
  status text NOT NULL DEFAULT 'planning',
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

GRANT SELECT ON public.client_projects TO authenticated;
GRANT ALL ON public.client_projects TO service_role;

ALTER TABLE public.client_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read their client projects"
  ON public.client_projects FOR SELECT TO authenticated
  USING (public.is_client_member(auth.uid(), client_id));

CREATE TRIGGER client_projects_set_updated_at
  BEFORE UPDATE ON public.client_projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX client_projects_client_id_idx ON public.client_projects (client_id);

-- =========================================================
-- Client files
-- =========================================================
CREATE TABLE public.client_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  project_id uuid REFERENCES public.client_projects(id) ON DELETE SET NULL,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  storage_path text NOT NULL UNIQUE,
  display_name text NOT NULL,
  original_filename text,
  mime_type text,
  size_bytes bigint,
  category text NOT NULL DEFAULT 'deliverable',
  description text,
  version integer NOT NULL DEFAULT 1,
  is_visible_to_client boolean NOT NULL DEFAULT false,
  is_archived boolean NOT NULL DEFAULT false,
  upload_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.client_files TO authenticated;
GRANT ALL ON public.client_files TO service_role;

ALTER TABLE public.client_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read published files for their client"
  ON public.client_files FOR SELECT TO authenticated
  USING (
    public.is_client_member(auth.uid(), client_id)
    AND is_visible_to_client = true
    AND is_archived = false
    AND upload_verified = true
  );

CREATE TRIGGER client_files_set_updated_at
  BEFORE UPDATE ON public.client_files
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX client_files_client_id_idx ON public.client_files (client_id);
CREATE INDEX client_files_project_id_idx ON public.client_files (project_id);

-- =========================================================
-- Client file events
-- =========================================================
CREATE TABLE public.client_file_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_file_id uuid NOT NULL REFERENCES public.client_files(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.client_file_events TO authenticated;
GRANT ALL ON public.client_file_events TO service_role;

ALTER TABLE public.client_file_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own file events"
  ON public.client_file_events FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE INDEX client_file_events_file_idx ON public.client_file_events (client_file_id);