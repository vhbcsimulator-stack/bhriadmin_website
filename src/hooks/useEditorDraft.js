import { useCallback, useEffect, useMemo, useState } from 'react';

const EMPTY_HISTORY = { past: [], present: null, future: [], mergeKey: null };

const isTypingTarget = (target) => {
  if (!target) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
};

// Unsaved draft state with undo/redo for the admin editors.
//
// `present === null` means "no local edits" and the caller falls back to the
// saved copy. The first commit pushes that null onto the past stack, so undoing
// all the way back lands on the saved content again and clears the dirty flag.
//
// Every commit is one history step. The inline editors only call onChange once
// the user confirms a field (check button / Enter), so steps line up with edits
// rather than keystrokes and no coalescing is needed.
export default function useEditorDraft(saved, { enableShortcuts = true } = {}) {
  const [history, setHistory] = useState(EMPTY_HISTORY);

  // Drop any pending history when the editor switches to a different record.
  const reset = useCallback(() => setHistory(EMPTY_HISTORY), []);

  // `producer` receives the current content and must return a new object.
  //
  // `mergeKey` folds consecutive edits to the same field into a single history
  // step — used by the raw <input>s that fire on every keystroke, so undo steps
  // back over a whole field rather than one character at a time.
  const commit = useCallback((producer, mergeKey = null) => {
    setHistory((prev) => {
      const base = prev.present ?? saved;
      if (base == null) return prev;

      const next = producer(base);
      if (next === base) return prev;

      const canMerge = mergeKey !== null && prev.mergeKey === mergeKey && prev.present !== null;

      return {
        past: canMerge ? prev.past : [...prev.past, prev.present],
        present: next,
        future: [],
        mergeKey,
      };
    });
  }, [saved]);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;
      return {
        past: prev.past.slice(0, -1),
        present: prev.past[prev.past.length - 1],
        future: [prev.present, ...prev.future],
        mergeKey: null,
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;
      const [next, ...rest] = prev.future;
      return { past: [...prev.past, prev.present], present: next, future: rest, mergeKey: null };
    });
  }, []);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;
  const isDirty = history.present !== null;

  useEffect(() => {
    if (!enableShortcuts) return undefined;

    const handleKeyDown = (e) => {
      if (!(e.ctrlKey || e.metaKey) || isTypingTarget(e.target)) return;

      const key = e.key.toLowerCase();
      if (key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((key === 'z' && e.shiftKey) || key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableShortcuts, undo, redo]);

  return useMemo(
    () => ({ draft: history.present, commit, undo, redo, reset, canUndo, canRedo, isDirty }),
    [history.present, commit, undo, redo, reset, canUndo, canRedo, isDirty],
  );
}
