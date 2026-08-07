CREATE TABLE public.mission_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  company text,
  email text NOT NULL,
  telephone text NOT NULL,
  preferred_language text NOT NULL DEFAULT 'fr' CHECK (preferred_language IN ('fr','en')),
  project_location text NOT NULL,
  service_type text NOT NULL,
  approximate_area text,
  desired_date date,
  description text NOT NULL,
  attachment_url text,
  consent boolean NOT NULL DEFAULT false,
  submission_status text NOT NULL DEFAULT 'new' CHECK (submission_status IN ('new','contacted','reviewing','completed','spam')),
  source_page text,
  ip_hash text
);

GRANT ALL ON public.mission_requests TO service_role;

ALTER TABLE public.mission_requests ENABLE ROW LEVEL SECURITY;

CREATE INDEX mission_requests_created_at_idx ON public.mission_requests (created_at DESC);
CREATE INDEX mission_requests_ip_hash_idx ON public.mission_requests (ip_hash, created_at DESC);