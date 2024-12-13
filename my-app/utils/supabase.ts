import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://drfxmtsencrfeeunknik.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZnhtdHNlbmNyZmVldW5rbmlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk2MjM4NDYsImV4cCI6MjA0NTE5OTg0Nn0.OFWyOlrErqeDjyWb9_9quk2WUjEwfS9pCRjteOFgW6E";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
