const buttonClass =
  'w-8 h-8 rounded-md flex items-center justify-center transition-all text-on-surface-variant ' +
  'hover:text-primary hover:bg-surface-container-high cursor-pointer ' +
  'disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:text-on-surface-variant disabled:hover:bg-transparent';

// Undo/redo pair for the editor toolbars. Mirrors the Ctrl+Z / Ctrl+Shift+Z
// shortcuts wired up in useEditorDraft.
export default function UndoRedoButtons({ onUndo, onRedo, canUndo, canRedo }) {
  return (
    <div className="bg-surface-container border border-outline-variant rounded-lg p-0.5 flex items-center gap-0.5">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
        aria-label="Undo"
        className={buttonClass}
      >
        <span className="material-symbols-outlined text-[18px]">undo</span>
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo (Ctrl+Shift+Z)"
        aria-label="Redo"
        className={buttonClass}
      >
        <span className="material-symbols-outlined text-[18px]">redo</span>
      </button>
    </div>
  );
}
