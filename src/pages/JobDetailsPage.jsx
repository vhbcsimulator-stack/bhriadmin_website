import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { EditableText } from '../components/Editable';
import { getCareerContent, saveCareerContent } from '../data/careerContentManager';

export default function JobDetailsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [career, setCareer] = useState(null);
  const [roleIndex, setRoleIndex] = useState(-1);
  const [editorMode, setEditorMode] = useState('edit');
  const [saveState, setSaveState] = useState('idle'); // 'idle' | 'saving' | 'saved'

  useEffect(() => {
    getCareerContent().then((data) => {
      const idx = data.roles.items.findIndex((r) => r.id === jobId);
      if (idx === -1) {
        navigate('/careers');
        return;
      }
      setCareer(data);
      setRoleIndex(idx);
    }).catch((e) => console.error("Failed to load job details:", e));
  }, [jobId, navigate]);

  if (!career || roleIndex === -1) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const role = career.roles.items[roleIndex];

  const updateRole = (field, value) => {
    setCareer((prev) => {
      const next = structuredClone(prev);
      next.roles.items[roleIndex][field] = value;
      return next;
    });
  };

  const updateListItem = (field, index, value) => {
    setCareer((prev) => {
      const next = structuredClone(prev);
      next.roles.items[roleIndex][field][index] = value;
      return next;
    });
  };

  const addListItem = (field) => {
    setCareer((prev) => {
      const next = structuredClone(prev);
      if (!next.roles.items[roleIndex][field]) next.roles.items[roleIndex][field] = [];
      next.roles.items[roleIndex][field].push('New item');
      return next;
    });
  };

  const removeListItem = (field, index) => {
    setCareer((prev) => {
      const next = structuredClone(prev);
      next.roles.items[roleIndex][field].splice(index, 1);
      return next;
    });
  };

  const handleSave = async () => {
    setSaveState('saving');
    try {
      await saveCareerContent(career);
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2000);
    } catch (err) {
      setSaveState('idle');
      alert("Failed to save changes: " + err.message);
    }
  };

  const renderList = (label, field, icon) => (
    <div>
      <div className="flex items-center justify-between mb-stack-sm">
        <h2 className="font-headline-md text-headline-md text-primary">{label}</h2>
        {editorMode === 'edit' && (
          <button
            onClick={() => addListItem(field)}
            className="bg-primary text-on-primary px-3 py-1.5 rounded-lg font-subhead-sm hover:bg-primary/90 transition-all cursor-pointer inline-flex items-center gap-1.5 text-xs"
          >
            <span className="material-symbols-outlined text-[16px]">add</span> Add
          </button>
        )}
      </div>
      <ul className="space-y-3">
        {(role[field] || []).map((item, idx) => (
          <li key={idx} className={`flex items-start gap-3 ${editorMode === 'edit' ? 'pr-10 relative' : ''}`}>
            <span className="material-symbols-outlined text-primary text-[20px] mt-0.5 shrink-0">{icon}</span>
            <div className="w-full">
              <EditableText
                value={item}
                onChange={(val) => updateListItem(field, idx, val)}
                tagName="span"
                className="font-body-md text-body-md text-on-surface-variant leading-relaxed block"
                isTextArea={true}
                editorMode={editorMode}
                placeholder="Item text"
              />
            </div>
            {editorMode === 'edit' && (
              <button
                onClick={() => removeListItem(field, idx)}
                className="absolute right-0 top-0 bg-surface border border-outline-variant text-error w-7 h-7 rounded-full shadow-sm hover:bg-error hover:text-on-error hover:border-error cursor-pointer flex items-center justify-center"
                title="Delete Item"
              >
                <span className="material-symbols-outlined text-[14px]">delete</span>
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md antialiased flex flex-col">
      <Navbar />

      {/* Editor Toolbar */}
      <div className="bg-surface border-b border-outline-variant/60 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-margin-page py-3.5 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/careers')}
              className="text-primary hover:text-primary-container p-1.5 rounded-full hover:bg-surface-container transition-colors cursor-pointer"
              title="Back to Careers"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <span className="bg-primary text-on-primary px-2.5 py-1 rounded font-mono text-xs uppercase shrink-0">
              Editing Job: {role.id}
            </span>
            <span className="font-headline-md text-xl text-primary font-bold tracking-tight line-clamp-1">
              {role.title}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-surface-container border border-outline-variant rounded-lg p-0.5 flex">
              <button
                onClick={() => setEditorMode('edit')}
                className={`px-3 py-1.5 rounded-md font-subhead-sm text-xs cursor-pointer transition-all ${editorMode === 'edit' ? 'bg-white text-primary shadow-sm font-bold' : 'text-on-surface-variant hover:text-primary'}`}
              >
                Edit Layout
              </button>
              <button
                onClick={() => setEditorMode('preview')}
                className={`px-3 py-1.5 rounded-md font-subhead-sm text-xs cursor-pointer transition-all ${editorMode === 'preview' ? 'bg-white text-primary shadow-sm font-bold' : 'text-on-surface-variant hover:text-primary'}`}
              >
                Preview Mode
              </button>
            </div>

            <button
              onClick={handleSave}
              disabled={saveState === 'saving'}
              className="bg-primary text-on-primary px-7 py-1.5 rounded-lg font-subhead-sm hover:bg-primary-container hover:text-on-primary-container transition-all cursor-pointer font-bold shadow-sm text-xs disabled:opacity-60 inline-flex items-center gap-1.5"
            >
              {saveState === 'saved' ? (
                <>
                  <span className="material-symbols-outlined text-[14px]">check</span> Saved
                </>
              ) : saveState === 'saving' ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      <main className="w-full flex-grow">
        {/* Header */}
        <section className="w-full bg-[#E8F5F0] py-section-gap relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-margin-page relative z-10">
            <div className="max-w-3xl space-y-stack-sm">
              <EditableText
                value={role.jobCategory}
                onChange={(val) => updateRole('jobCategory', val)}
                tagName="span"
                className="inline-block font-label-caps text-label-caps text-primary uppercase tracking-widest"
                editorMode={editorMode}
                placeholder="Job Category"
              />
              <EditableText
                value={role.title}
                onChange={(val) => updateRole('title', val)}
                tagName="h1"
                className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary leading-tight"
                editorMode={editorMode}
                placeholder="Job Title"
              />

              {editorMode === 'edit' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 max-w-xl">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-outline mb-1">Location</label>
                    <EditableText
                      value={role.location}
                      onChange={(val) => updateRole('location', val)}
                      tagName="span"
                      className="font-body-sm text-body-sm text-on-surface-variant"
                      editorMode={editorMode}
                      placeholder="Location"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-outline mb-1">Job Type</label>
                    <EditableText
                      value={role.jobType}
                      onChange={(val) => updateRole('jobType', val)}
                      tagName="span"
                      className="font-body-sm text-body-sm text-on-surface-variant"
                      editorMode={editorMode}
                      placeholder="Job Type"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-outline mb-1">Summary</label>
                    <EditableText
                      value={role.description}
                      onChange={(val) => updateRole('description', val)}
                      tagName="span"
                      className="font-body-sm text-body-sm text-on-surface-variant"
                      isTextArea={true}
                      editorMode={editorMode}
                      placeholder="Short summary shown in listings"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3 pt-2">
                  <span className="inline-flex items-center gap-1.5 bg-surface px-3.5 py-1.5 rounded-full font-body-sm text-body-sm text-on-surface-variant border border-outline-variant/40">
                    <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                    {role.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-surface px-3.5 py-1.5 rounded-full font-body-sm text-body-sm text-on-surface-variant border border-outline-variant/40">
                    <span className="material-symbols-outlined text-[16px] text-primary">work</span>
                    {role.jobType}
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-7xl mx-auto px-margin-page py-section-gap">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            <div className="lg:col-span-8 space-y-stack-lg">
              <div>
                <h2 className="font-headline-md text-headline-md text-primary mb-stack-sm">Overview</h2>
                <EditableText
                  value={role.overview || ''}
                  onChange={(val) => updateRole('overview', val)}
                  tagName="p"
                  className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed"
                  isTextArea={true}
                  editorMode={editorMode}
                  placeholder="Full job overview paragraph"
                />
              </div>

              {renderList('Responsibilities', 'responsibilities', 'check_circle')}
              {renderList('Qualifications', 'qualifications', 'task_alt')}
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-24 bg-deep-emerald rounded-2xl p-8 text-white shadow-xl opacity-90">
                <span className="material-symbols-outlined text-secondary-container text-4xl mb-4">work_history</span>
                <h3 className="font-headline-md text-2xl mb-3">Ready to Apply?</h3>
                <p className="font-body-md text-white/80 mb-6 leading-relaxed">
                  This panel is a live preview — the "Apply Now" button links to the Contact page on the public site.
                </p>
                <div className="block text-center w-full bg-primary/70 text-on-primary py-3.5 rounded-lg font-subhead-lg cursor-not-allowed">
                  Apply Now
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
