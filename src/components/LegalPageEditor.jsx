import { AddItemButton, ItemActionsMenu } from './PageEditorShell';
import { EditableText } from './Editable';

const getParagraphs = (section) => {
  if (Array.isArray(section.paragraphs) && section.paragraphs.length > 0) {
    return section.paragraphs;
  }

  return String(section.body || '')
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
};

export default function LegalPageEditor({
  content,
  editorMode,
  update,
  addItem,
  removeItem,
}) {
  const heroParagraphs = Array.isArray(content.hero.paragraphs) ? content.hero.paragraphs : [];
  const heroBullets = Array.isArray(content.hero.bullets) ? content.hero.bullets : [];

  return (
    <main className="w-full">
      <section className="w-full bg-[#E8F5F0] py-section-gap">
        <div className="max-w-7xl mx-auto px-margin-page">
          <div className="max-w-3xl space-y-stack-md">
            <EditableText
              value={content.hero.title}
              onChange={(value) => update('hero.title', value)}
              tagName="h1"
              className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary leading-tight"
              editorMode={editorMode}
              placeholder="Hero Title"
            />
            <EditableText
              value={content.hero.subtitle}
              onChange={(value) => update('hero.subtitle', value)}
              tagName="p"
              className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl"
              isTextArea
              editorMode={editorMode}
              placeholder="Hero Subtitle"
            />
            <EditableText
              value={content.updatedAt}
              onChange={(value) => update('updatedAt', value)}
              tagName="p"
              className="font-body-sm text-body-sm text-on-surface-variant"
              editorMode={editorMode}
              placeholder="Last Updated Date"
            />

            {heroParagraphs.length > 0 && (
              <div className="space-y-4 pt-2">
                {heroParagraphs.map((paragraph, paragraphIndex) => (
                  <div
                    key={paragraphIndex}
                    className={`relative ${editorMode === 'edit' ? 'pr-10' : ''}`}
                  >
                    <EditableText
                      value={paragraph}
                      onChange={(value) => update(`hero.paragraphs.${paragraphIndex}`, value)}
                      tagName="p"
                      className="font-body-md text-body-md text-on-surface-variant leading-relaxed max-w-2xl"
                      isTextArea
                      editorMode={editorMode}
                      placeholder={`Hero Paragraph ${paragraphIndex + 1}`}
                    />
                    {editorMode === 'edit' && (
                      <ItemActionsMenu
                        className="absolute top-2 right-0"
                        onDelete={() => removeItem('hero.paragraphs', paragraphIndex)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {heroBullets.length > 0 && (
              <ul className="list-disc pl-6 space-y-2 text-on-surface-variant max-w-2xl">
                {heroBullets.map((bullet, bulletIndex) => (
                  <li
                    key={bulletIndex}
                    className={`relative ${editorMode === 'edit' ? 'pr-10' : ''}`}
                  >
                    <EditableText
                      value={bullet}
                      onChange={(value) => update(`hero.bullets.${bulletIndex}`, value)}
                      tagName="span"
                      className="font-body-md text-body-md leading-relaxed"
                      isTextArea
                      editorMode={editorMode}
                      placeholder={`Hero Bullet ${bulletIndex + 1}`}
                    />
                    {editorMode === 'edit' && (
                      <ItemActionsMenu
                        className="absolute top-1 right-0"
                        onDelete={() => removeItem('hero.bullets', bulletIndex)}
                      />
                    )}
                  </li>
                ))}
              </ul>
            )}

            {editorMode === 'edit' && (
              <div className="flex flex-wrap gap-2 pt-2">
                <AddItemButton
                  label="Add Hero Paragraph"
                  onClick={() => update('hero.paragraphs', [
                    ...heroParagraphs,
                    'New hero paragraph text.',
                  ])}
                />
                <AddItemButton
                  label="Add Hero Bullet"
                  onClick={() => update('hero.bullets', [
                    ...heroBullets,
                    'New hero bullet point.',
                  ])}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-margin-page py-section-gap space-y-stack-lg">
        {content.sections.map((section, sectionIndex) => {
          const paragraphs = getParagraphs(section);
          const bullets = Array.isArray(section.bullets) ? section.bullets : [];

          return (
            <div
              key={sectionIndex}
              className={`relative space-y-stack-sm ${editorMode === 'edit' ? 'pr-12' : ''}`}
            >
              <EditableText
                value={section.heading}
                onChange={(value) => update(`sections.${sectionIndex}.heading`, value)}
                tagName="h2"
                className="font-headline-md text-headline-md text-primary"
                editorMode={editorMode}
                placeholder="Section Heading"
              />

              <div className="space-y-4">
                {paragraphs.map((paragraph, paragraphIndex) => (
                  <div
                    key={paragraphIndex}
                    className={`relative ${editorMode === 'edit' ? 'pr-10' : ''}`}
                  >
                    <EditableText
                      value={paragraph}
                      onChange={(value) => {
                        const next = [...paragraphs];
                        next[paragraphIndex] = value;
                        update(`sections.${sectionIndex}.paragraphs`, next);
                      }}
                      tagName="p"
                      className="font-body-md text-body-md text-on-surface-variant leading-relaxed"
                      isTextArea
                      editorMode={editorMode}
                      placeholder={`Paragraph ${paragraphIndex + 1}`}
                    />
                    {editorMode === 'edit' && paragraphs.length > 1 && (
                      <ItemActionsMenu
                        className="absolute top-2 right-0"
                        onDelete={() => {
                          const next = paragraphs.filter((_, index) => index !== paragraphIndex);
                          update(`sections.${sectionIndex}.paragraphs`, next);
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {bullets.length > 0 && (
                <ul className="list-disc pl-6 space-y-2 text-on-surface-variant">
                  {bullets.map((bullet, bulletIndex) => (
                    <li
                      key={bulletIndex}
                      className={`relative ${editorMode === 'edit' ? 'pr-10' : ''}`}
                    >
                      <EditableText
                        value={bullet}
                        onChange={(value) => update(`sections.${sectionIndex}.bullets.${bulletIndex}`, value)}
                        tagName="span"
                        className="font-body-md text-body-md leading-relaxed"
                        isTextArea
                        editorMode={editorMode}
                        placeholder={`Bullet ${bulletIndex + 1}`}
                      />
                      {editorMode === 'edit' && (
                        <ItemActionsMenu
                          className="absolute top-1 right-0"
                          onDelete={() => removeItem(`sections.${sectionIndex}.bullets`, bulletIndex)}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {editorMode === 'edit' && (
                <div className="flex flex-wrap gap-2 pt-2">
                  <AddItemButton
                    label="Add Paragraph"
                    onClick={() => update(
                      `sections.${sectionIndex}.paragraphs`,
                      [...paragraphs, 'New paragraph text.'],
                    )}
                  />
                  <AddItemButton
                    label="Add Bullet"
                    onClick={() => update(
                      `sections.${sectionIndex}.bullets`,
                      [...bullets, 'New bullet point.'],
                    )}
                  />
                </div>
              )}

              {editorMode === 'edit' && (
                <ItemActionsMenu onDelete={() => removeItem('sections', sectionIndex)} />
              )}
            </div>
          );
        })}

        {editorMode === 'edit' && (
          <AddItemButton
            label="Add Section"
            onClick={() => addItem('sections', {
              heading: 'New Section',
              paragraphs: ['Section paragraph text.'],
              bullets: [],
            })}
          />
        )}
      </section>
    </main>
  );
}
