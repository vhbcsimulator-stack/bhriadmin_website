import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const MAIN_WEBSITE_URL = import.meta.env.VITE_MAIN_WEBSITE_URL || 'http://localhost:5173';

const LEGAL_LINKS = [
  { path: '/privacy', label: 'Privacy Policy' },
  { path: '/terms', label: 'Terms of Service' },
  { path: '/cookies', label: 'Cookie Policy' },
  { path: '/sitemap', label: 'Sitemap' },
];

export default function Navbar({ onAddNewProject }) {
  const location = useLocation();
  const [legalOpen, setLegalOpen] = useState(false);
  const legalRef = useRef(null);

  const isActive = (path) => location.pathname === path;
  const isLegalActive = LEGAL_LINKS.some((link) => isActive(link.path));

  const linkClass = (path) =>
    `font-subhead-lg text-subhead-lg transition-colors duration-200 ${
      isActive(path)
        ? 'text-primary border-b-2 border-primary pb-1'
        : 'text-on-surface-variant hover:text-primary'
    }`;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (legalRef.current && !legalRef.current.contains(e.target)) {
        setLegalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setLegalOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    sessionStorage.removeItem('bhri_admin_logged_in');
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Supabase signOut error:", err);
    }
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-50 bg-surface border-b border-outline-variant">
      <div className="flex justify-between items-center w-full px-margin-page py-4 max-w-7xl mx-auto">
        <Link className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2" to="/">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTojLhFLUZDV1OSo4DJrSjAE4z5BcbscWu3FCQNoIXOQXtB5wRmDF_RZGAGWkFK8TdbYs6dwute_Sb-wOqI9_wihyICja8m-lIC-Hh06kSBWxE9G0_oxbmOCn07VH6TyyYtlM1pXbPgpbziJLGoIfbgyw2wsrrd9DAvUTVvCkU9MCdOzLAtFFpismYXRHUEkO8Y9pvMk_WMgRdNbP9R6nXqw3VNsmR-Qy-0iRVxLL4DTTsZT9re8dSkB1vxWNqRiVS63oOw-ZWo-s"
            alt="Bright Hermosa Logo"
            className="h-12 w-auto object-contain bg-transparent animate-fadeIn"
          />
        </Link>

        <div className="hidden md:flex items-center gap-gutter flex-wrap">
          <Link className={linkClass('/')} to="/">Home</Link>
          <Link className={linkClass('/properties')} to="/properties">Properties</Link>
          <Link className={linkClass('/about')} to="/about">About Us</Link>
          <Link className={linkClass('/careers')} to="/careers">Careers</Link>
          <Link className={linkClass('/applicants')} to="/applicants">Applicants</Link>
          <Link className={linkClass('/contact')} to="/contact">Contact Us</Link>

          <div className="relative" ref={legalRef}>
            <button
              onClick={() => setLegalOpen((prev) => !prev)}
              className={`font-subhead-lg text-subhead-lg transition-colors duration-200 inline-flex items-center gap-1 cursor-pointer ${
                isLegalActive
                  ? 'text-primary border-b-2 border-primary pb-1'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Legal
              <span className={`material-symbols-outlined text-[18px] transition-transform ${legalOpen ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>

            {legalOpen && (
              <div className="absolute left-0 top-full mt-2 w-48 bg-surface border border-outline-variant rounded-lg shadow-lg py-1.5 z-50">
                {LEGAL_LINKS.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-4 py-2 font-body-md text-body-md transition-colors duration-200 ${
                      isActive(link.path)
                        ? 'text-primary font-bold bg-primary/5'
                        : 'text-on-surface-variant hover:text-primary hover:bg-surface-variant/20'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a href={`${MAIN_WEBSITE_URL}/properties`} className="font-subhead-lg text-subhead-lg text-on-surface-variant hover:text-primary transition-colors">
            View Catalog
          </a>
          {onAddNewProject && (
            <button
              onClick={onAddNewProject}
              className="bg-primary text-on-primary px-6 py-3 rounded-lg font-subhead-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm cursor-pointer"
            >
              Add New Project
            </button>
          )}
          <button
            onClick={handleLogout}
            className="border border-outline-variant text-on-surface-variant px-5 py-3 rounded-lg font-subhead-lg hover:bg-surface-variant/20 hover:text-primary transition-colors shadow-sm cursor-pointer inline-flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
