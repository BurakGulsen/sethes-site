import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SiteProvider } from './context/SiteContext';
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
import { 
  AllCollectionsWrapper, 
  ProductGridWrapper, 
  CategoryDetailWrapper, 
  ProductDetailWrapper, 
  MediaGalleryWrapper 
} from './components/RouteWrappers';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
            <Route path="contacts" element={<Contacts />} />
            <Route path="philosophy" element={<Philosophy />} />
          </Route>

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
    </BrowserRouter>
  );
}