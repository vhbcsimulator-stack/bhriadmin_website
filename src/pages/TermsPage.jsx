import PageEditorShell from '../components/PageEditorShell';
import LegalPageEditor from '../components/LegalPageEditor';

export default function TermsPage() {
  return (
    <PageEditorShell pageId="terms" title="Terms of Service Page">
      {({ content, editorMode, update, addItem, removeItem }) => (
        <LegalPageEditor {...{ content, editorMode, update, addItem, removeItem }} />
      )}
    </PageEditorShell>
  );
}
