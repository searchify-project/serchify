import { createClient } from '@supabase/supabase-js'

// Temporary direct check to see if env variables are failing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://whpoflyfqcnssynertzu.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndocG9mbHlmcWNuc3N5bmVydHp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNjcxOTEsImV4cCI6MjEwNDk0MzE5MX0.eQBMKbRoLy_1uy8UmkVmyQ3_scHAvkAFkne98GsbHZI";

console.log("Supabase URL Check:", supabaseUrl); // Yeh browser console me dikhega

export const supabase = createClient(supabaseUrl, supabaseKey);