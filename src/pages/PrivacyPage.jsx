import PageEditorShell from '../components/PageEditorShell';
import LegalPageEditor from '../components/LegalPageEditor';

export default function PrivacyPage() {
  return (
    <PageEditorShell pageId="privacy" title="Privacy Policy Page">
      {({ content, editorMode, update, addItem, removeItem }) => (
        <LegalPageEditor {...{ content, editorMode, update, addItem, removeItem }} />
      )}
    </PageEditorShell>
  );
}
