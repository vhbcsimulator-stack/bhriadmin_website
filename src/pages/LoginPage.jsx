import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const loginEmail = email.trim().toLowerCase() === 'admin' ? 'admin@bhri.com' : email.trim();

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: password
      });

      if (authError) {
        // Check offline credentials as fallback
        const isOfflineAdmin = (email.trim().toLowerCase() === 'admin' || email.trim().toLowerCase() === 'admin@bhri.com') && password === 'BHRI@2026';
        if (isOfflineAdmin) {
          sessionStorage.setItem('bhri_admin_logged_in', 'true');
          window.location.reload();
        } else {
          setError(authError.message);
          setLoading(false);
        }
      } else {
        // App.jsx auth listener will update state and handle redirect
      }
    } catch (err) {
      console.error(err);
      const isOfflineAdmin = (email.trim().toLowerCase() === 'admin' || email.trim().toLowerCase() === 'admin@bhri.com') && password === 'BHRI@2026';
      if (isOfflineAdmin) {
        sessionStorage.setItem('bhri_admin_logged_in', 'true');
        window.location.reload();
      } else {
        setError('An unexpected error occurred. Please try again.');
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-slate-900 overflow-hidden font-body-md antialiased select-none">
      {/* Background Image with Premium Overlays */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYIzXNL0I0CC9R96cf-qKacfjTTxiy83hD_WAzdulDrG-4EUDHyKMHK02rlVw1EkzHoxN-Cdiu17cmlDypvf9OxGVSS06_cFjPWD6FVjFxKTIwlFrJdaqkmt3_nMiqWz4izKvPacItjxZSiFhicfHyM8K9wgYfH4pNgLY0Gdr4pASgEIOkcJyIvOnpD-3qzVUY9ItE6440PnQ-8YAgV6BZxJYtJdb798CBr5jNEopdNsO_4rnvZ8ByCx2BH-n4Z1uklCeSOQ_izFs" 
          alt="Luxury Estate Background" 
          className="w-full h-full object-cover scale-105 filter brightness-[0.4] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-deep-emerald/75 via-black/45 to-transparent"></div>
      </div>

      {/* Main Glassmorphic Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl animate-scaleUp">
        
        {/* Logo and Headings */}
        <div className="text-center mb-8">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTojLhFLUZDV1OSo4DJrSjAE4z5BcbscWu3FCQNoIXOQXtB5wRmDF_RZGAGWkFK8TdbYs6dwute_Sb-wOqI9_wihyICja8m-lIC-Hh06kSBWxE9G0_oxbmOCn07VH6TyyYtlM1pXbPgpbziJLGoIfbgyw2wsrrd9DAvUTVvCkU9MCdOzLAtFFpismYXRHUEkO8Y9pvMk_WMgRdNbP9R6nXqw3VNsmR-Qy-0iRVxLL4DTTsZT9re8dSkB1vxWNqRiVS63oOw-ZWo-s" 
            alt="Bright Hermosa Logo" 
            className="h-14 mx-auto mb-4 object-contain brightness-0 invert"
          />
          <h1 className="font-headline-md text-headline-md text-white font-bold leading-tight">Admin Portal</h1>
          <p className="font-body-md text-white/70 mt-1.5">Manage your luxury estate portfolios</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-error/20 border border-error text-white text-body-sm font-semibold px-4 py-3 rounded-xl flex items-center gap-2 animate-fadeIn">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold tracking-widest text-white/80 uppercase mb-1.5">Email Address / Username</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3.5 text-white/50 text-[20px]">mail</span>
              <input 
                type="text" 
                required 
                placeholder="admin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-secondary-fixed focus:bg-white/20 transition-all font-body-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-widest text-white/80 uppercase mb-1.5">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3.5 text-white/50 text-[20px]">lock</span>
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-secondary-fixed focus:bg-white/20 transition-all font-body-md"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary py-3.5 rounded-xl font-subhead-lg hover:bg-secondary hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer font-bold text-sm uppercase tracking-wider mt-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In to Admin</span>
            )}
          </button>
        </form>

        {/* Credentials Helper Panel */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <div className="inline-block bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block mb-1">Demo Credentials</span>
            <div className="text-xs text-white/80 font-mono flex items-center gap-1.5 justify-center">
              <span>admin</span>
              <span className="text-white/30">|</span>
              <span>BHRI@2026</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
