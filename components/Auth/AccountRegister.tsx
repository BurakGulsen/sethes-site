import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { AuthLayout } from './AuthLayout';
import { COUNTRIES } from '../../lib/countries';

const inputClass = 'p-4 bg-stone-50 border border-stone-200 text-stone-900 rounded-full focus:outline-none focus:border-stone-900';

export const AccountRegister: React.FC = () => {
  const { t } = useLanguage();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/2d-3d';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [country, setCountry] = useState('Türkiye');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!acceptTerms) {
      setError(t('auth.termsRequiredError'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('auth.passwordsDontMatch'));
      return;
    }

    setSubmitting(true);
    const { error, needsEmailConfirmation } = await signUp(email, password, {
      firstName,
      lastName,
      company,
      jobRole,
      country,
      phone,
      marketingConsent: acceptMarketing,
    });
    setSubmitting(false);

    if (error) {
      setError(error);
      return;
    }

    if (needsEmailConfirmation) {
      setNeedsConfirmation(true);
    } else {
      navigate(redirectTo);
    }
  };

  if (needsConfirmation) {
    return (
      <AuthLayout title={t('auth.checkEmailTitle')}>
        <p className="text-stone-600 text-sm text-center leading-relaxed">{t('auth.checkEmailMessage')}</p>
        <Link
          to="/account/login"
          className="block text-center bg-stone-900 text-white font-bold p-4 rounded-full hover:bg-stone-700 transition-colors uppercase tracking-wider text-sm mt-6"
        >
          {t('auth.loginLink')}
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={t('auth.registerTitle')}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input required placeholder={t('auth.firstName')} value={firstName}
          onChange={(e) => setFirstName(e.target.value)} onMouseDown={(e) => e.stopPropagation()} className={inputClass} />
        <input required placeholder={t('auth.lastName')} value={lastName}
          onChange={(e) => setLastName(e.target.value)} onMouseDown={(e) => e.stopPropagation()} className={inputClass} />
        <select value={country} onChange={(e) => setCountry(e.target.value)} onMouseDown={(e) => e.stopPropagation()} className={inputClass}>
          {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input placeholder={t('auth.company')} value={company}
          onChange={(e) => setCompany(e.target.value)} onMouseDown={(e) => e.stopPropagation()} className={inputClass} />
        <input placeholder={t('auth.jobRole')} value={jobRole}
          onChange={(e) => setJobRole(e.target.value)} onMouseDown={(e) => e.stopPropagation()} className={inputClass} />
        <input type="tel" placeholder={t('auth.phone')} value={phone}
          onChange={(e) => setPhone(e.target.value)} onMouseDown={(e) => e.stopPropagation()} className={inputClass} />
        <input type="email" required placeholder={t('auth.email')} value={email}
          onChange={(e) => setEmail(e.target.value)} onMouseDown={(e) => e.stopPropagation()} className={inputClass} />
        <input type="password" required minLength={6} placeholder={t('auth.password')} value={password}
          onChange={(e) => setPassword(e.target.value)} onMouseDown={(e) => e.stopPropagation()} className={inputClass} />
        <input type="password" required minLength={6} placeholder={t('auth.confirmPassword')} value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)} onMouseDown={(e) => e.stopPropagation()} className={inputClass} />

        <label className="flex items-start gap-2 text-xs text-stone-600 px-2">
          <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)}
            onMouseDown={(e) => e.stopPropagation()} className="mt-0.5" />
          <span>
            {t('auth.acceptTermsPrefix')}{t('auth.acceptTermsPrefix') ? ' ' : ''}
            <a href="/legal/terms" target="_blank" rel="noopener noreferrer" className="underline font-bold text-stone-900">
              {t('auth.acceptTermsLink')}
            </a>
            {t('auth.acceptTermsSuffix') ? ' ' + t('auth.acceptTermsSuffix') : ''} *
          </span>
        </label>

        <label className="flex items-start gap-2 text-xs text-stone-600 px-2">
          <input type="checkbox" checked={acceptMarketing} onChange={(e) => setAcceptMarketing(e.target.checked)}
            onMouseDown={(e) => e.stopPropagation()} className="mt-0.5" />
          <span>
            {t('auth.acceptMarketing')} (<a href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="underline">{t('legal.privacyTitle')}</a>)
          </span>
        </label>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !acceptTerms}
          className={`bg-stone-900 text-white font-bold p-4 rounded-full hover:bg-stone-700 transition-colors uppercase tracking-wider text-sm mt-2 ${(submitting || !acceptTerms) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {submitting ? t('auth.processing') : t('auth.registerButton')}
        </button>

        <p className="text-sm text-stone-500 text-center mt-2">
          {t('auth.alreadyAMember')}{' '}
          <Link to={`/account/login?redirect=${encodeURIComponent(redirectTo)}`} className="text-stone-900 font-bold hover:underline">
            {t('auth.loginLink')}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
