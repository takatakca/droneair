ALTER TABLE public.mission_requests
  ADD COLUMN IF NOT EXISTS lead_priority TEXT NOT NULL DEFAULT 'normal' CHECK (lead_priority IN ('low','normal','high')),
  ADD COLUMN IF NOT EXISTS lead_type TEXT NOT NULL DEFAULT 'other' CHECK (lead_type IN ('inspection','waypoint','mapping','construction','agriculture','aerial_media','data_extraction','thermal_interest','other')),
  ADD COLUMN IF NOT EXISTS ai_summary TEXT,
  ADD COLUMN IF NOT EXISTS ai_follow_up_questions TEXT[],
  ADD COLUMN IF NOT EXISTS ai_response_status TEXT NOT NULL DEFAULT 'pending' CHECK (ai_response_status IN ('pending','sent','human_review','failed')),
  ADD COLUMN IF NOT EXISTS email_notification_status TEXT NOT NULL DEFAULT 'pending' CHECK (email_notification_status IN ('pending','sent','failed')),
  ADD COLUMN IF NOT EXISTS customer_ack_status TEXT NOT NULL DEFAULT 'pending' CHECK (customer_ack_status IN ('pending','sent','failed')),
  ADD COLUMN IF NOT EXISTS ai_draft_reply TEXT,
  ADD COLUMN IF NOT EXISTS ai_draft_created_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS human_review_required BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS email_thread_id TEXT,
  ADD COLUMN IF NOT EXISTS reply_received_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS email_attempts INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.mission_email_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mission_request_id UUID NOT NULL REFERENCES public.mission_requests(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  event_type TEXT NOT NULL CHECK (event_type IN ('internal_notification','customer_acknowledgment','customer_reply','ai_draft','manual_reply')),
  recipient TEXT,
  provider TEXT,
  provider_message_id TEXT,
  status TEXT NOT NULL,
  error_code TEXT,
  error_summary TEXT
);

GRANT ALL ON public.mission_email_events TO service_role;
ALTER TABLE public.mission_email_events ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS mission_email_events_mission_idx ON public.mission_email_events(mission_request_id, created_at DESC);