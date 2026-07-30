// Shown when the admin tries to leave an editor with unsaved changes.
export default function UnsavedChangesModal({
  open,
  onSave,
  onDiscard,
  onCancel,
  saving = false,
  message = 'You have unsaved changes on this page. Save them before leaving, or discard them to continue.',
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative bg-surface w-full max-w-md p-8 rounded-2xl border border-outline-variant shadow-2xl animate-scaleUp"
        role="dialog"
        aria-modal="true"
        aria-labelledby="unsaved-changes-title"
      >
        <div className="flex items-start gap-3 mb-2">
          <span className="material-symbols-outlined text-error text-3xl shrink-0">warning</span>
          <h3 id="unsaved-changes-title" className="font-headline-md text-2xl text-primary">
            Unsaved changes
          </h3>
        </div>

        <p className="font-body-md text-body-md text-on-surface-variant mb-7 leading-relaxed">
          {message}
        </p>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
          <button
            onClick={onCancel}
            disabled={saving}
            className="text-on-surface-variant border border-outline-variant/65 px-5 py-2.5 rounded-lg font-subhead-sm hover:bg-surface-container transition-all cursor-pointer text-sm disabled:opacity-60"
          >
            Keep editing
          </button>
          <button
            onClick={onDiscard}
            disabled={saving}
            className="border border-error text-error px-5 py-2.5 rounded-lg font-subhead-sm hover:bg-error hover:text-on-error transition-all cursor-pointer text-sm disabled:opacity-60"
          >
            Discard changes
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-subhead-sm hover:bg-primary-container hover:text-on-primary-container transition-all cursor-pointer font-bold shadow-sm text-sm disabled:opacity-60 inline-flex items-center justify-center gap-1.5"
          >
            {saving && (
              <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            )}
            {saving ? 'Saving...' : 'Save & continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
