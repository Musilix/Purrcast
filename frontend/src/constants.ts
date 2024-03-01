import { createClient } from '@supabase/supabase-js';

export const __supabase__ = createClient(
  'https://ftfnpcakwxryjnacwiid.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0Zm5wY2Frd3hyeWpuYWN3aWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIwNzQwMjEsImV4cCI6MjAxNzY1MDAyMX0.hqDbxDFgdqlow-ijuENEk9IXOypWDxRtpMTtW-7-fto',
);

export const __prod__ = import.meta.env.PROD;
