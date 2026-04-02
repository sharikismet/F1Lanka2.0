import { createClient } from '@supabase/supabase-js@2';
import { projectId, publicAnonKey } from '../utils/supabase/info';

// Initialize Supabase client for auth
const supabaseUrl = `https://${projectId}.supabase.co`;
const supabase = createClient(supabaseUrl, publicAnonKey);

export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
  };
}

export interface AuthSession {
  access_token: string;
  user: User;
}

// Sign in with email and password
export async function signIn(email: string, password: string): Promise<{ session: AuthSession | null; error: string | null }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { session: null, error: error.message };
    }

    if (!data.session) {
      return { session: null, error: 'No session returned' };
    }

    return {
      session: {
        access_token: data.session.access_token,
        user: data.user as User,
      },
      error: null,
    };
  } catch (error) {
    return {
      session: null,
      error: error instanceof Error ? error.message : 'Failed to sign in',
    };
  }
}

// Sign up a new user
export async function signUp(email: string, password: string, name?: string): Promise<{ user: User | null; error: string | null }> {
  try {
    const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-a97df12b`;
    
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { user: null, error: errorData.error || 'Failed to sign up' };
    }

    const data = await response.json();
    return { user: data.user, error: null };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : 'Failed to sign up',
    };
  }
}

// Sign out
export async function signOut(): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to sign out',
    };
  }
}

// Get current session
export async function getSession(): Promise<{ session: AuthSession | null; error: string | null }> {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      return { session: null, error: error.message };
    }

    if (!data.session) {
      return { session: null, error: null };
    }

    return {
      session: {
        access_token: data.session.access_token,
        user: data.session.user as User,
      },
      error: null,
    };
  } catch (error) {
    return {
      session: null,
      error: error instanceof Error ? error.message : 'Failed to get session',
    };
  }
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const { session } = await getSession();
  return session !== null;
}

// Get current access token (fresh from Supabase)
export async function getAccessToken(): Promise<string | null> {
  // First try getting a fresh token from the Supabase client
  try {
    const { data, error } = await supabase.auth.getSession();
    if (!error && data.session?.access_token) {
      return data.session.access_token;
    }
  } catch (e) {
    console.log('Error getting session from Supabase client:', e);
  }
  
  // Fallback to localStorage
  try {
    const sessionStr = localStorage.getItem('session');
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      if (session?.access_token) {
        return session.access_token;
      }
    }
  } catch (e) {
    console.log('Error reading session from localStorage:', e);
  }
  
  return null;
}