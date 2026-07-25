import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { setDeep } from './Editable';

const getDeep = (obj, path) => path.split('.').reduce((cur, key) => cur[key], obj);

// Shared shell for the website page editors (Home / About / Contact).
// Loads the page content via the page's own manager (getContent/saveContent),
// provides update/addItem/removeItem helpers and a sticky toolbar with
// Edit/Preview toggle and Save.
export default function PageEditorShell({ pageId, title, getContent, saveContent, children }) {
  const [content, setContent] = useState(null);
  const [editorMode, setEditorMode] = useState('edit');
  const [saveState, setSaveState] = useState('idle'); // 'idle' | 'saving' | 'saved'

  useEffect(() => {
    getContent()
      .then(setContent)
      .catch((e) => console.error(`Failed to load "${pageId}" content:`, e));
  }, [pageId]);

  const update = (path, value) => {
    setContent((prev) => setDeep(prev, path, value));
  };

  const addItem = (path, template, { prepend = false } = {}) => {
    setContent((prev) => {
      const next = structuredClone(prev);
      const arr = getDeep(next, path);
      if (prepend) {
        arr.unshift(structuredClone(template));
      } else {
        arr.push(structuredClone(template));
      }
      return next;
    });
  };

  const removeItem = (path, index) => {
    setContent((prev) => {
      const next = structuredClone(prev);
      const arr = getDeep(next, path);
      arr.splice(index, 1);
      return next;
    });
  };

  const handleSave = async () => {
    setSaveState('saving');
    try {
      await saveContent(content);
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2000);
      return true;
    } catch (err) {
      setSaveState('idle');
      alert("Failed to save changes: " + err.message);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md antialiased flex flex-col">
      <Navbar />

      {/* Editor Toolbar */}
      <div className="bg-surface border-b border-outline-variant/60 sticky top-[81px] z-40 shadow-md ">
        <div className="max-w-7xl mx-auto px-margin-page py-3.5 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="bg-primary text-on-primary px-2.5 py-1 rounded font-mono text-xs uppercase shrink-0">
              Editing: {pageId}
            </span>
            <span className="font-headline-md text-xl text-primary font-bold tracking-tight">{title}</span>
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
              disabled={saveState === 'saving' || !content}
              className="bg-primary text-on-primary px-7 py-1.5 rounded-lg font-subhead-sm hover:bg-primary-container hover:text-on-primary-container transition-all cursor-pointer font-bold shadow-sm text-xs disabled:opacity-60 inline-flex items-center gap-1.5"
            >
              {saveState === 'saving' && (
                <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              )}
              {saveState === 'saved' ? (
                <>
                  <span className="material-symbols-outlined text-[14px]">check</span> Saved
                </>
              ) : saveState === 'saving' ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-grow w-full">
        {content ? (
          children({ content, editorMode, update, addItem, removeItem, handleSave, saveState })
        ) : (
          <div className="flex items-center justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

// Small helper button for adding items to editable lists
export function AddItemButton({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="bg-primary text-on-primary px-4 py-2 rounded-lg font-subhead-sm hover:bg-primary/90 transition-all cursor-pointer inline-flex items-center gap-1.5 text-sm"
    >
      <span className="material-symbols-outlined text-[16px]">add</span> {label}
    </button>
  );
}

// Compact delete button for editable list items. Sits inside the item's
// top-right corner, offset from the per-field edit buttons by the pr-12
// inset the item containers apply in edit mode.
export function ItemActionsMenu({ onDelete, className = 'absolute top-2 right-2' }) {
  return (
    <div className={`${className} z-30`} onClick={(e) => e.stopPropagation()}>
      <button
        onClick={onDelete}
        className="bg-surface/95 border border-outline-variant text-error w-7 h-7 rounded-full shadow-md hover:bg-error hover:text-on-error hover:border-error cursor-pointer flex items-center justify-center"
        title="Delete Item"
      >
        <span className="material-symbols-outlined text-[16px]">delete</span>
      </button>
    </div>
  );
}
