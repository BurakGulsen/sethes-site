import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { AuthLayout } from './AuthLayout';

export const AccountLogin: React.FC = () => {
  const { t } = useLanguage();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/2d-3d';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      setError(error);
      return;
    }
    navigate(redirectTo);
  };

  return (
    <AuthLayout title={t('auth.loginTitle')}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          required
          placeholder={t('auth.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
          className="p-4 bg-stone-50 border border-stone-200 text-stone-900 rounded-full focus:outline-none focus:border-stone-900"
        />
        <input
          type="password"
          required
          placeholder={t('auth.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
          className="p-4 bg-stone-50 border border-stone-200 text-stone-900 rounded-full focus:outline-none focus:border-stone-900"
        />

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <Link to="/account/reset-password" className="text-sm text-stone-500 hover:text-stone-900 text-center transition-colors">
          {t('auth.forgotPassword')}
        </Link>

        <button
          type="submit"
          disabled={submitting}
          className={`bg-stone-900 text-white font-bold p-4 rounded-full hover:bg-stone-700 transition-colors uppercase tracking-wider text-sm mt-2 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {submitting ? t('auth.processing') : t('auth.loginButton')}
        </button>

        <p className="text-sm text-stone-500 text-center mt-2">
          {t('auth.notAMember')}{' '}
          <Link to={`/account/register?redirect=${encodeURIComponent(redirectTo)}`} className="text-stone-900 font-bold hover:underline">
            {t('auth.registerLink')}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
