import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SiteProvider } from './context/SiteContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { MainSite } from './components/MainSite';
import { Login } from './components/Admin/Login';
import { Dashboard } from './components/Admin/Dashboard';
import { ProtectedRoute } from './components/Admin/ProtectedRoute';
import { ScrollToTop } from './components/ScrollToTop';

// Page Components
import { Home } from './components/Home';
import { Designers } from './components/Designers';
import { Catalogues } from './components/Catalogues';
import { Contacts } from './components/Contacts';
import { Philosophy } from './components/Philosophy';
import { Materials } from './components/Materials';
import { News } from './components/News';
import { NewsDetail } from './components/NewsDetail';
import { ReservedAreaLayout } from './components/ReservedArea/ReservedAreaLayout';
import { ReservedAreaHome } from './components/ReservedArea/ReservedAreaHome';
import { ReservedAreaProducts } from './components/ReservedArea/ReservedAreaProducts';
import { AccountLogin } from './components/Auth/AccountLogin';
import { AccountRegister } from './components/Auth/AccountRegister';
import { ResetPassword } from './components/Auth/ResetPassword';
import { LegalPage } from './components/Legal/LegalPage';
import {
  AllCollectionsWrapper,
  ProductGridWrapper,
  CategoryDetailWrapper,
  ProductDetailWrapper,
  MediaGalleryWrapper,
  MaterialDetailWrapper
} from './components/RouteWrappers';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <LanguageProvider>
      <AuthProvider>
      <SiteProvider>
        <Routes>
          {/* Main Public Website */}
          <Route path="/" element={<MainSite />}>
            <Route index element={<Home />} />
            <Route path="collections" element={<AllCollectionsWrapper />} />
            <Route path="products" element={<ProductGridWrapper />} />
            <Route path="category/:id" element={<CategoryDetailWrapper />} />
            <Route path="product/:id" element={<ProductDetailWrapper />} />
            <Route path="designers" element={<Designers />} />
            <Route path="catalogues" element={<Catalogues />} />
            <Route path="media/:id" element={<MediaGalleryWrapper />} />
            <Route path="materials" element={<Materials />} />
            <Route path="materials/:id" element={<MaterialDetailWrapper />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="philosophy" element={<Philosophy />} />
            <Route path="news" element={<News />} />
            <Route path="news/:slug" element={<NewsDetail />} />
          </Route>

          {/* Reserved Area (login-gated 2D/3D downloads) */}
          <Route path="/2d-3d" element={<ReservedAreaLayout />}>
            <Route index element={<ReservedAreaHome />} />
            <Route path="products" element={<ReservedAreaProducts />} />
          </Route>

          {/* Customer Account (register/login gate for 2D/3D downloads) */}
          <Route path="/account/login" element={<AccountLogin />} />
          <Route path="/account/register" element={<AccountRegister />} />
          <Route path="/account/reset-password" element={<ResetPassword />} />
          <Route path="/legal/terms" element={<LegalPage variant="terms" />} />
          <Route path="/legal/privacy" element={<LegalPage variant="privacy" />} />

          {/* Admin Authentication */}
          <Route path="/yonetim-merkezi-x91/login" element={<Login />} />

          {/* Protected Admin Area */}
          <Route path="/yonetim-merkezi-x91" element={<ProtectedRoute />}>
            <Route index element={<Dashboard />} />
          </Route>

          {/* Catch-all redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SiteProvider>
      </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}