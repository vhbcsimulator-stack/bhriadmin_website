import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import ApplicantsPage from './pages/ApplicantsPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CareerPage from './pages/CareerPage';
import JobDetailsPage from './pages/JobDetailsPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import CookiesPage from './pages/CookiesPage';
import SitemapPage from './pages/SitemapPage';
import { supabase } from './supabaseClient';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Session fallback for offline/demo testing
    const offlineSession = sessionStorage.getItem('bhri_admin_logged_in') === 'true';
    if (offlineSession) {
      setSession({ user: { email: 'admin@bhri.com' } });
      setLoading(false);
      return;
    }

    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
      }
      setLoading(false);
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={session ? <Navigate to="/" replace /> : <LoginPage />} 
        />
        <Route
          path="/"
          element={session ? <HomePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/properties"
          element={session ? <AdminPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/about"
          element={session ? <AboutPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/contact"
          element={session ? <ContactPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/careers"
          element={session ? <CareerPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/careers/:jobId"
          element={session ? <JobDetailsPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/applicants"
          element={session ? <ApplicantsPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/privacy"
          element={session ? <PrivacyPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/terms"
          element={session ? <TermsPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/cookies"
          element={session ? <CookiesPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/sitemap"
          element={session ? <SitemapPage /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
