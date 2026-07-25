import React from 'react';
import PageEditorShell, { AddItemButton, ItemActionsMenu } from '../components/PageEditorShell';
import { EditableText } from '../components/Editable';
import { getPrivacyContent, savePrivacyContent } from '../data/privacyContentManager';

export default function PrivacyPage() {
  return (
    <PageEditorShell pageId="privacy" title="Privacy Policy Page" getContent={getPrivacyContent} saveContent={savePrivacyContent}>
      {({ content, editorMode, update, addItem, removeItem }) => (
        <main className="w-full">
          <section className="w-full bg-[#E8F5F0] py-section-gap">
            <div className="max-w-7xl mx-auto px-margin-page">
              <div className="max-w-3xl space-y-stack-md">
                <EditableText
                  value={content.hero.title}
                  onChange={(val) => update('hero.title', val)}
                  tagName="h1"
                  className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary leading-tight"
                  editorMode={editorMode}
                  placeholder="Hero Title"
                />
                <EditableText
                  value={content.hero.subtitle}
                  onChange={(val) => update('hero.subtitle', val)}
                  tagName="p"
                  className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl"
                  isTextArea={true}
                  editorMode={editorMode}
                  placeholder="Hero Subtitle"
                />
                <EditableText
                  value={content.updatedAt}
                  onChange={(val) => update('updatedAt', val)}
                  tagName="p"
                  className="font-body-sm text-body-sm text-on-surface-variant"
                  editorMode={editorMode}
                  placeholder="Last Updated Date"
                />
              </div>
            </div>
          </section>

          <section className="max-w-3xl mx-auto px-margin-page py-section-gap space-y-stack-lg">
            {content.sections.map((section, idx) => (
              <div key={idx} className={`relative space-y-stack-sm ${editorMode === 'edit' ? 'pr-12' : ''}`}>
                <EditableText
                  value={section.heading}
                  onChange={(val) => update(`sections.${idx}.heading`, val)}
                  tagName="h2"
                  className="font-headline-md text-headline-md text-primary"
                  editorMode={editorMode}
                  placeholder="Section Heading"
                />
                <EditableText
                  value={section.body}
                  onChange={(val) => update(`sections.${idx}.body`, val)}
                  tagName="p"
                  className="font-body-md text-body-md text-on-surface-variant leading-relaxed"
                  isTextArea={true}
                  editorMode={editorMode}
                  placeholder="Section Body"
                />
                {editorMode === 'edit' && (
                  <ItemActionsMenu onDelete={() => removeItem('sections', idx)} />
                )}
              </div>
            ))}
            {editorMode === 'edit' && (
              <AddItemButton
                label="Add Section"
                onClick={() => addItem('sections', { heading: 'New Section', body: 'Section body text.' })}
              />
            )}
          </section>
        </main>
      )}
    </PageEditorShell>
  );
}
