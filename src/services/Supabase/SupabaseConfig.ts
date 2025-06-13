import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bnmfdyivzrqzfdebnljj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJubWZkeWl2enJxemZkZWJubGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3ODI0NDQsImV4cCI6MjA2NTM1ODQ0NH0.wZXTN-4vnuPfDqKlC7ZcppegMbcew_UOn3o8NwFEbN4";  

export const supabase = createClient(supabaseUrl, supabaseKey);
