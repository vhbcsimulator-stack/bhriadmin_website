import { AddItemButton, ItemActionsMenu } from './PageEditorShell';
import { EditableText } from './Editable';

const getBlocks = (content, includeLegacyBody = false) => {
  if (Array.isArray(content.blocks)) return content.blocks;

  const paragraphs = Array.isArray(content.paragraphs)
    ? content.paragraphs
    : includeLegacyBody
      ? String(content.body || '')
        .split(/\n\s*\n/)
        .map((text) => text.trim())
        .filter(Boolean)
      : [];
  const bullets = Array.isArray(content.bullets) ? content.bullets : [];

  return [
    ...paragraphs.map((text) => ({ type: 'paragraph', text })),
    ...bullets.map((text) => ({ type: 'bullet', text })),
  ];
};

function OrderedContentBlocks({
  blocks,
  basePath,
  editorMode,
  update,
  paragraphClassName = '',
}) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <div
          key={index}
          className={`relative ${editorMode === 'edit' ? 'pr-10' : ''}`}
        >
          {block.type === 'bullet' ? (
            <ul className="list-disc pl-6 text-on-surface-variant">
              <li>
                <EditableText
                  value={block.text}
                  onChange={(value) => update(
                    `${basePath}.blocks`,
                    blocks.map((item, blockIndex) => (
                      blockIndex === index ? { ...item, text: value } : item
                    )),
                  )}
                  tagName="span"
                  className="font-body-md text-body-md leading-relaxed"
                  isTextArea
                  editorMode={editorMode}
                  placeholder="Bullet point"
                />
              </li>
            </ul>
          ) : (
            <EditableText
              value={block.text}
              onChange={(value) => update(
                `${basePath}.blocks`,
                blocks.map((item, blockIndex) => (
                  blockIndex === index ? { ...item, text: value } : item
                )),
              )}
              tagName="p"
              className={`font-body-md text-body-md text-on-surface-variant leading-relaxed ${paragraphClassName}`}
              isTextArea
              editorMode={editorMode}
              placeholder="Paragraph"
            />
          )}

          {editorMode === 'edit' && (
            <ItemActionsMenu
              className="absolute top-1 right-0"
              onDelete={() => update(
                `${basePath}.blocks`,
                blocks.filter((_, blockIndex) => blockIndex !== index),
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function BlockAddButtons({ blocks, basePath, labelPrefix = '', update }) {
  const prefix = labelPrefix ? `${labelPrefix} ` : '';
  const placeholderPrefix = labelPrefix ? `New ${labelPrefix.toLowerCase()}` : 'New';

  return (
    <div className="flex flex-wrap gap-2 pt-2">
      <AddItemButton
        label={`Add ${prefix}Paragraph`}
        onClick={() => update(`${basePath}.blocks`, [
          ...blocks,
          { type: 'paragraph', text: `${placeholderPrefix} paragraph text.` },
        ])}
      />
      <AddItemButton
        label={`Add ${prefix}Bullet`}
        onClick={() => update(`${basePath}.blocks`, [
          ...blocks,
          { type: 'bullet', text: `${placeholderPrefix} bullet point.` },
        ])}
      />
    </div>
  );
}

export default function LegalPageEditor({
  content,
  editorMode,
  update,
  addItem,
  removeItem,
}) {
  const heroBlocks = getBlocks(content.hero);

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

            {heroBlocks.length > 0 && (
              <OrderedContentBlocks
                blocks={heroBlocks}
                basePath="hero"
                editorMode={editorMode}
                update={update}
                paragraphClassName="max-w-2xl"
              />
            )}

            {editorMode === 'edit' && (
              <BlockAddButtons
                blocks={heroBlocks}
                basePath="hero"
                labelPrefix="Hero"
                update={update}
              />
            )}

            <EditableText
              value={content.updatedAt}
              onChange={(value) => update('updatedAt', value)}
              tagName="p"
              className="font-body-sm text-body-sm text-on-surface-variant pt-2"
              editorMode={editorMode}
              placeholder="Last Updated Date"
            />
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-margin-page py-section-gap space-y-stack-lg">
        {content.sections.map((section, sectionIndex) => {
          const blocks = getBlocks(section, true);
          const basePath = `sections.${sectionIndex}`;

          return (
            <div
              key={sectionIndex}
              className={`relative space-y-stack-sm ${editorMode === 'edit' ? 'pr-12' : ''}`}
            >
              <EditableText
                value={section.heading}
                onChange={(value) => update(`${basePath}.heading`, value)}
                tagName="h2"
                className="font-headline-md text-headline-md text-primary"
                editorMode={editorMode}
                placeholder="Section Heading"
              />

              {blocks.length > 0 && (
                <OrderedContentBlocks
                  blocks={blocks}
                  basePath={basePath}
                  editorMode={editorMode}
                  update={update}
                />
              )}

              {editorMode === 'edit' && (
                <BlockAddButtons
                  blocks={blocks}
                  basePath={basePath}
                  update={update}
                />
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
              blocks: [{ type: 'paragraph', text: 'Section paragraph text.' }],
            })}
          />
        )}
      </section>
    </main>
  );
}
