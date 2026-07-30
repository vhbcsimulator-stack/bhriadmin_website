import { useCallback, useEffect, useRef, useState } from 'react';
import { useBlocker } from 'react-router-dom';

// Holds back anything that would throw away unsaved editor changes.
//
// Covers three exits:
//  - in-app route changes (react-router's blocker — needs the data router in App.jsx)
//  - closing/reloading the tab (native beforeunload prompt)
//  - editor-local actions passed through `guard()` (e.g. the Cancel button)
//
// The caller renders <UnsavedChangesModal> while `isPrompting`, then calls
// `release()` once the draft has been saved or discarded, or `dismiss()` to
// stay put.
export default function useUnsavedChangesPrompt(isDirty) {
  const blocker = useBlocker(
    useCallback(
      ({ currentLocation, nextLocation }) =>
        isDirty && currentLocation.pathname !== nextLocation.pathname,
      [isDirty],
    ),
  );

  // Saving is async, so release()/dismiss() can run several renders after the
  // click handler closed over them. Both the blocker and the queued action are
  // read through refs so they always act on the current values.
  const blockerRef = useRef(blocker);
  useEffect(() => {
    blockerRef.current = blocker;
  }, [blocker]);

  const pendingActionRef = useRef(null);
  const [hasPendingAction, setHasPendingAction] = useState(false);

  useEffect(() => {
    if (!isDirty) return undefined;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Let the held-back exit through. Call only after saving or discarding.
  const release = useCallback(() => {
    const action = pendingActionRef.current;
    pendingActionRef.current = null;
    setHasPendingAction(false);

    if (action) action();
    if (blockerRef.current.state === 'blocked') blockerRef.current.proceed();
  }, []);

  // Stay on the page and keep the draft.
  const dismiss = useCallback(() => {
    pendingActionRef.current = null;
    setHasPendingAction(false);

    if (blockerRef.current.state === 'blocked') blockerRef.current.reset();
  }, []);

  // Run `action` now when clean, or prompt first when there are unsaved edits.
  const guard = useCallback((action) => {
    if (isDirty) {
      pendingActionRef.current = action;
      setHasPendingAction(true);
    } else {
      action();
    }
  }, [isDirty]);

  return {
    isPrompting: blocker.state === 'blocked' || hasPendingAction,
    release,
    dismiss,
    guard,
  };
}
