import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

export const ProtectedRoute = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-condensed tracking-widest">DOĞRULANIYOR...</div>;

  // Redirect to home silently if not authenticated OR not an admin —
  // required now that ordinary visitors can also self-register and hold an
  // authenticated Supabase session (see AccountRegister.tsx, role: 'customer').
  if (!session || session.user?.user_metadata?.role !== 'admin') {
      return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
