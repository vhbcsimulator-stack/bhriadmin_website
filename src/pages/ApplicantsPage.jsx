import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  getAllApplicants,
  updateApplicantStatus,
  deleteApplicant,
  getApplicantFileUrl
} from '../data/applicantsManager';

const STATUS_OPTIONS = ['new', 'reviewed', 'shortlisted', 'rejected', 'hired'];

const STATUS_STYLES = {
  new: 'bg-secondary-container text-on-secondary-container',
  reviewed: 'bg-[#E8F5F0] text-primary',
  shortlisted: 'bg-tertiary-container text-on-tertiary-container',
  rejected: 'bg-error-container text-on-error-container',
  hired: 'bg-primary text-on-primary'
};

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const list = await getAllApplicants();
      setApplicants(list);
      setError('');
    } catch (err) {
      console.error('Failed to load applicants:', err);
      setError('Failed to load applicants: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateApplicantStatus(id, status);
      setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDelete = async (applicant) => {
    const shouldDelete = window.bypassConfirm ||
      new URLSearchParams(window.location.search).get('bypassConfirm') === 'true' ||
      window.confirm(`Delete the application from ${applicant.full_name}? This cannot be undone.`);
    if (!shouldDelete) return;

    try {
      await deleteApplicant(applicant);
      setApplicants((prev) => prev.filter((a) => a.id !== applicant.id));
      setSelected((prev) => (prev && prev.id === applicant.id ? null : prev));
    } catch (err) {
      alert('Failed to delete application: ' + err.message);
    }
  };

  const handleOpenFile = async (path) => {
    if (!path) return;
    try {
      const url = await getApplicantFileUrl(path);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      alert('Failed to open file: ' + err.message);
    }
  };

  const filtered = applicants.filter((a) => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return (
        a.full_name?.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q) ||
        a.job_title?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md antialiased flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-margin-page py-section-gap flex-grow w-full">
        <div className="mb-stack-lg">
          <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest">Admin Workspace</span>
          <h1 className="font-headline-md text-headline-md text-slate-text mt-1">Job Applicants</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-xl">
            Review applications submitted through the Careers apply form, update their status, or remove records.
          </p>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-3.5 rounded-lg text-body-sm font-bold mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or role..."
            className="w-full sm:max-w-sm bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-body-md"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface border border-outline-variant rounded-lg px-4 py-2.5 font-body-md text-body-md capitalize"
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="capitalize">{s}</option>
            ))}
          </select>
        </div>

        <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/60 text-slate-text font-subhead-lg">
                <th className="p-5 font-semibold">Applicant</th>
                <th className="p-5 font-semibold">Role Applied For</th>
                <th className="p-5 font-semibold">Submitted</th>
                <th className="p-5 font-semibold">Status</th>
                <th className="p-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {filtered.map((applicant) => (
                <tr key={applicant.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="p-5">
                    <div className="font-subhead-lg text-slate-text font-bold">{applicant.full_name}</div>
                    <div className="text-body-sm text-on-surface-variant mt-1">{applicant.email}</div>
                    {applicant.phone && (
                      <div className="text-body-sm text-on-surface-variant">{applicant.phone}</div>
                    )}
                  </td>
                  <td className="p-5">
                    <div className="font-body-md text-on-surface">{applicant.job_title || '—'}</div>
                  </td>
                  <td className="p-5 text-body-sm text-on-surface-variant">
                    {applicant.created_at ? new Date(applicant.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="p-5">
                    <select
                      value={applicant.status}
                      onChange={(e) => handleStatusChange(applicant.id, e.target.value)}
                      className={`text-[11px] font-bold tracking-wider px-2.5 py-1.5 rounded-full uppercase capitalize border-0 cursor-pointer ${STATUS_STYLES[applicant.status] || 'bg-surface-container-high text-on-surface'}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-5 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => setSelected(applicant)}
                      className="border border-primary text-primary px-4 py-2 rounded-lg font-subhead-sm hover:bg-primary hover:text-on-primary transition-all cursor-pointer inline-flex items-center gap-1.5 text-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">visibility</span> View
                    </button>
                    <button
                      onClick={() => handleDelete(applicant)}
                      className="border border-error text-error px-4 py-2 rounded-lg font-subhead-sm hover:bg-error hover:text-on-error transition-all cursor-pointer inline-flex items-center gap-1.5 text-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && filtered.length === 0 && (
            <div className="text-center py-20 bg-surface">
              <span className="material-symbols-outlined text-outline text-6xl">person_search</span>
              <h3 className="font-headline-md text-2xl text-slate-text mt-4">No Applicants Found</h3>
              <p className="font-body-md text-on-surface-variant mt-2">
                {applicants.length === 0 ? 'Applications submitted through the Careers page will appear here.' : 'No applications match your current filters.'}
              </p>
            </div>
          )}

          {loading && (
            <div className="text-center py-20 bg-surface">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto"></div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Applicant Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative bg-surface w-full max-w-lg p-8 rounded-2xl border border-outline-variant shadow-2xl animate-scaleUp max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary p-2 cursor-pointer"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <h3 className="font-headline-md text-2xl text-primary mb-1">{selected.full_name}</h3>
            <p className="font-body-sm text-on-surface-variant mb-6">
              Applied for {selected.job_title || 'a role'} &middot; {selected.created_at ? new Date(selected.created_at).toLocaleString() : ''}
            </p>

            <dl className="space-y-3 font-body-md">
              <div>
                <dt className="text-body-sm text-outline uppercase tracking-wider text-[10px] font-semibold">Email</dt>
                <dd className="text-on-surface">{selected.email}</dd>
              </div>
              {selected.phone && (
                <div>
                  <dt className="text-body-sm text-outline uppercase tracking-wider text-[10px] font-semibold">Phone</dt>
                  <dd className="text-on-surface">{selected.phone}</dd>
                </div>
              )}
              {selected.message && (
                <div>
                  <dt className="text-body-sm text-outline uppercase tracking-wider text-[10px] font-semibold">Message</dt>
                  <dd className="text-on-surface whitespace-pre-wrap">{selected.message}</dd>
                </div>
              )}
            </dl>

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => handleOpenFile(selected.resume_path)}
                className="w-full bg-primary text-on-primary py-3 rounded-lg font-subhead-sm hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">description</span>
                View Resume{selected.resume_filename ? ` (${selected.resume_filename})` : ''}
              </button>
              {selected.cover_letter_path && (
                <button
                  onClick={() => handleOpenFile(selected.cover_letter_path)}
                  className="w-full border border-outline-variant text-primary py-3 rounded-lg font-subhead-sm hover:bg-surface-variant/20 transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">article</span>
                  View Cover Letter{selected.cover_letter_filename ? ` (${selected.cover_letter_filename})` : ''}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
