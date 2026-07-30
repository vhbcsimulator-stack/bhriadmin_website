import React, { useState, useEffect, useMemo } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
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

// Route table. Built as a data router (createBrowserRouter) rather than
// <BrowserRouter>, because the editors' unsaved-changes guard relies on
// useBlocker, which only works inside a data router.
const buildRouter = (isAuthed) => {
  const guarded = (element) => (isAuthed ? element : <Navigate to="/login" replace />);

  return createBrowserRouter([
    { path: '/login', element: isAuthed ? <Navigate to="/" replace /> : <LoginPage /> },
    { path: '/', element: guarded(<HomePage />) },
    { path: '/properties', element: guarded(<AdminPage />) },
    { path: '/about', element: guarded(<AboutPage />) },
    { path: '/contact', element: guarded(<ContactPage />) },
    { path: '/careers', element: guarded(<CareerPage />) },
    { path: '/careers/:jobId', element: guarded(<JobDetailsPage />) },
    { path: '/applicants', element: guarded(<ApplicantsPage />) },
    { path: '/privacy', element: guarded(<PrivacyPage />) },
    { path: '/terms', element: guarded(<TermsPage />) },
    { path: '/cookies', element: guarded(<CookiesPage />) },
    { path: '/sitemap', element: guarded(<SitemapPage />) },
    { path: '*', element: <Navigate to="/" replace /> },
  ]);
};

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

  // Keyed on the boolean, not the session object: token refreshes hand back a
  // new session object, and rebuilding the router there would remount the
  // current editor and throw away the admin's unsaved draft.
  const isAuthed = !!session;
  const router = useMemo(() => buildRouter(isAuthed), [isAuthed]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default App;
