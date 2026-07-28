import PageEditorShell from '../components/PageEditorShell';
import LegalPageEditor from '../components/LegalPageEditor';

export default function CookiesPage() {
  return (
    <PageEditorShell pageId="cookies" title="Cookie Policy Page">
      {({ content, editorMode, update, addItem, removeItem }) => (
        <LegalPageEditor {...{ content, editorMode, update, addItem, removeItem }} />
      )}
    </PageEditorShell>
  );
}
