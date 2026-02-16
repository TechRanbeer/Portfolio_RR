import { createClient } from '@supabase/supabase-js';
import { getEnv } from './env';

const SUPABASE_URL = getEnv('VITE_SUPABASE_URL');
const SUPABASE_KEY = getEnv('VITE_SUPABASE_ANON_KEY');

const supabase = (SUPABASE_URL && SUPABASE_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

export const authService = {
  isAuthenticated: async (): Promise<boolean> => {
    if (!supabase) return false;
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  login: async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) return { success: false, error: "Supabase connection not established." };
    
    try {
      if (password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { success: false, error: error.message };
      } else {
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  logout: async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    window.location.href = '/';
  },

  isAdmin: async (): Promise<boolean> => {
    return await authService.isAuthenticated();
  },

  getUser: async () => {
    if (!supabase) return undefined;
    const { data: { user } } = await supabase.auth.getUser();
    return user ? {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || "Ranbeer Raja"
    } : undefined;
  }
};