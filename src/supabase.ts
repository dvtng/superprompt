import { createClient } from "@supabase/supabase-js";

export const SUPABASE_BASE_URL = "https://leognougfqaiozsocadx.supabase.co";

export const supabase = createClient(
  SUPABASE_BASE_URL,
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxlb2dub3VnZnFhaW96c29jYWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk3OTczMzEsImV4cCI6MjAwNTM3MzMzMX0._H5pByfoBFutZanqf1T50KLsPMW9qLO61-UcoG6bRNk",
  {
    auth: {
      // TODO: figure out why supabase's detection causes initialization to
      // stall. For now, we'll just disable it, and do it ourselves.
      detectSessionInUrl: false,
    },
  }
);
