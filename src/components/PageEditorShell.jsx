import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import UndoRedoButtons from './UndoRedoButtons';
import UnsavedChangesModal from './UnsavedChangesModal';
import { setDeep } from './Editable';
import { usePageContent, useSavePageContent } from '../hooks/usePageContent';
import useEditorDraft from '../hooks/useEditorDraft';
import useUnsavedChangesPrompt from '../hooks/useUnsavedChangesPrompt';

const getDeep = (obj, path) => path.split('.').reduce((cur, key) => cur[key], obj);

// Shared shell for the website page editors (Home / About / Contact).
// Content comes from the shared site-content query; local edits are held in a
// draft that overrides the cached copy until it is saved or discarded.
// Provides update/addItem/removeItem helpers and a sticky toolbar with
// Edit/Preview toggle, undo/redo and Save. Leaving the page with an unsaved
// draft raises the save-or-discard modal.
export default function PageEditorShell({ pageId, title, children }) {
  const { data: savedContent, isPending, isError, error, refetch } = usePageContent(pageId);
  const saveMutation = useSavePageContent(pageId);

  const { draft, commit, undo, redo, reset, canUndo, canRedo, isDirty } = useEditorDraft(savedContent);
  const prompt = useUnsavedChangesPrompt(isDirty);

  const [editorMode, setEditorMode] = useState('edit');
  const [justSaved, setJustSaved] = useState(false);

  const content = draft ?? savedContent ?? null;
  const saveState = saveMutation.isPending ? 'saving' : justSaved ? 'saved' : 'idle';

  const update = (path, value) => {
    commit((current) => setDeep(current, path, value));
  };

  const addItem = (path, template, { prepend = false } = {}) => {
    commit((current) => {
      const next = structuredClone(current);
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
    commit((current) => {
      const next = structuredClone(current);
      const arr = getDeep(next, path);
      arr.splice(index, 1);
      return next;
    });
  };

  const handleSave = async () => {
    try {
      await saveMutation.mutateAsync(content);
      // The mutation pushed this content into the cache, so the draft and its
      // history can be dropped and the editor can read from the cache again.
      reset();
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
      return true;
    } catch (err) {
      alert("Failed to save changes: " + err.message);
      return false;
    }
  };

  const handleSaveAndLeave = async () => {
    if (await handleSave()) prompt.release();
  };

  const handleDiscardAndLeave = () => {
    reset();
    prompt.release();
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
            {isDirty && (
              <span className="inline-flex items-center gap-1 text-tertiary font-subhead-sm text-xs uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Unsaved
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <UndoRedoButtons onUndo={undo} onRedo={redo} canUndo={canUndo} canRedo={canRedo} />

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
        ) : isPending ? (
          <div className="flex items-center justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 px-margin-page text-center gap-3">
            <span className="material-symbols-outlined text-outline text-5xl">cloud_off</span>
            <h2 className="font-headline-md text-xl text-primary">
              {isError ? 'Could not load content' : `No content stored for "${pageId}"`}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              {isError
                ? error?.message || 'Supabase did not return the site content.'
                : `Supabase has no site_content row with id "${pageId}" yet. Add the row in Supabase to start editing this page.`}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-1 bg-primary text-on-primary px-6 py-2 rounded-lg font-subhead-sm hover:bg-primary-container hover:text-on-primary-container transition-colors cursor-pointer text-sm"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      <Footer />

      <UnsavedChangesModal
        open={prompt.isPrompting}
        saving={saveMutation.isPending}
        onSave={handleSaveAndLeave}
        onDiscard={handleDiscardAndLeave}
        onCancel={prompt.dismiss}
      />
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
