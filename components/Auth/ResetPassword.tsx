import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { AuthLayout } from './AuthLayout';

export const ResetPassword: React.FC = () => {
  const { t } = useLanguage();
  const { session, resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Clicking the emailed recovery link lands here with a recovery session
  // already established by Supabase — in that case show the new-password form.
  if (session) {
    const handleUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setSubmitting(true);
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      setSubmitting(false);
      if (error) {
        setError(error.message);
        return;
      }
      setDone(true);
    };

    if (done) {
      return (
        <AuthLayout title={t('auth.resetPasswordTitle')}>
          <p className="text-stone-600 text-sm text-center leading-relaxed">{t('auth.passwordUpdated')}</p>
        </AuthLayout>
      );
    }

    return (
      <AuthLayout title={t('auth.resetPasswordTitle')}>
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <input
            type="password"
            required
            minLength={6}
            placeholder={t('auth.newPassword')}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
            className="p-4 bg-stone-50 border border-stone-200 text-stone-900 rounded-full focus:outline-none focus:border-stone-900"
          />
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className={`bg-stone-900 text-white font-bold p-4 rounded-full hover:bg-stone-700 transition-colors uppercase tracking-wider text-sm mt-2 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {submitting ? t('auth.processing') : t('auth.updatePassword')}
          </button>
        </form>
      </AuthLayout>
    );
  }

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const { error } = await resetPassword(email);
    setSubmitting(false);
    if (error) {
      setError(error);
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <AuthLayout title={t('auth.resetPasswordTitle')}>
        <p className="text-stone-600 text-sm text-center leading-relaxed">{t('auth.resetPasswordSent')}</p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={t('auth.resetPasswordTitle')}>
      <form onSubmit={handleRequest} className="flex flex-col gap-4">
        <input
          type="email"
          required
          placeholder={t('auth.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
          className="p-4 bg-stone-50 border border-stone-200 text-stone-900 rounded-full focus:outline-none focus:border-stone-900"
        />
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className={`bg-stone-900 text-white font-bold p-4 rounded-full hover:bg-stone-700 transition-colors uppercase tracking-wider text-sm mt-2 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {submitting ? t('auth.processing') : t('auth.resetPasswordTitle')}
        </button>
      </form>
    </AuthLayout>
  );
};
