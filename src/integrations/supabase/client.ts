// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vmrffmebmvyqesmpevnl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtcmZmbWVibXZ5cWVzbXBldm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5ODc0MTksImV4cCI6MjA1NzU2MzQxOX0.YNDPHNtxQNmZuV7ZAFbUtojENskPdqSH0lyaV5bDgUw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);