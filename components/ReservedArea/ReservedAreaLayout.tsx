import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ChevronLeft, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useLocalizedSiteData } from '../../context/SiteContext';

export const ReservedAreaLayout: React.FC = () => {
  const { session, loading, signOut } = useAuth();
  const { t } = useLanguage();
  const { getSetting } = useLocalizedSiteData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      navigate('/account/login?redirect=' + encodeURIComponent('/2d-3d'));
    }
  }, [loading, session, navigate]);

  if (loading || !session) {
    return <div className="min-h-screen bg-stone-100" />;
  }

  const firstName = session.user.user_metadata?.firstName || session.user.email?.split('@')[0] || '';

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-stone-100 text-[#171719]">
      <header className="flex items-center justify-between px-6 md:px-10 py-6 border-b border-stone-300/70">
        <div className="flex items-center gap-6">
          <div className="font-sans text-lg tracking-[0.2em] font-bold uppercase">
            {getSetting('logo_text') || 'SETHES'}
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ChevronLeft size={16} /> {t('auth.backToWebsite')}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-stone-700">
            {t('reservedArea.greeting')} <strong className="font-bold text-stone-900">{firstName}</strong>
          </span>
          <button
            onClick={handleLogout}
            title={t('reservedArea.logout')}
            aria-label={t('reservedArea.logout')}
            className="w-9 h-9 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-200 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <Outlet />
    </div>
  );
};
