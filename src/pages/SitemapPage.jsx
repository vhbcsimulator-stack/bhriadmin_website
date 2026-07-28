import PageEditorShell from '../components/PageEditorShell';
import LegalPageEditor from '../components/LegalPageEditor';

export default function SitemapPage() {
  return (
    <PageEditorShell pageId="sitemap" title="Sitemap Page">
      {({ content, editorMode, update, addItem, removeItem }) => (
        <LegalPageEditor {...{ content, editorMode, update, addItem, removeItem }} />
      )}
    </PageEditorShell>
  );
}
