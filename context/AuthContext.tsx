import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

export interface CustomerRegistrationProfile {
  firstName: string;
  lastName: string;
  company: string;
  jobRole: string;
  country: string;
  phone: string;
  marketingConsent: boolean;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, profile: CustomerRegistrationProfile) => Promise<{ error: string | null; needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Creates the customer_profiles row from the auth user's own metadata once a
// real session exists — this runs regardless of whether email confirmation
// was required, since user_metadata is attached at signUp() time either way,
// while writing to customer_profiles requires an authenticated session (RLS).
const ensureCustomerProfile = async (session: Session) => {
  const meta = session.user.user_metadata;
  if (meta?.role !== 'customer' || !meta?.firstName) return;

  await supabase.from('customer_profiles').upsert(
    {
      id: session.user.id,
      first_name: meta.firstName,
      last_name: meta.lastName,
      company: meta.company || null,
      job_role: meta.jobRole || null,
      country: meta.country || null,
      phone: meta.phone || null,
      marketing_consent: !!meta.marketingConsent,
    },
    { onConflict: 'id', ignoreDuplicates: true }
  );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session) ensureCustomerProfile(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) ensureCustomerProfile(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? error.message : null };
  };

  const signUp = async (email: string, password: string, profile: CustomerRegistrationProfile) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role: 'customer', ...profile } },
    });
    return { error: error ? error.message : null, needsEmailConfirmation: !error && !data.session };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account/reset-password`,
    });
    return { error: error ? error.message : null };
  };

  const isAdmin = session?.user?.user_metadata?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, loading, isAdmin, signIn, signUp, signOut, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
