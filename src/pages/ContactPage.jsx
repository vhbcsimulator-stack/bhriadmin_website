import React from 'react';
import PageEditorShell, { AddItemButton, ItemActionsMenu } from '../components/PageEditorShell';
import { EditableText, EditableImage } from '../components/Editable';
import { getContactContent, saveContactContent } from '../data/contactContentManager';

export default function ContactPage() {
  return (
    <PageEditorShell pageId="contact" title="Contact Us Page" getContent={getContactContent} saveContent={saveContactContent}>
      {({ content, editorMode, update, addItem, removeItem }) => (
        <main className="w-full">
          {/* Hero Section */}
          <section className="w-full bg-[#E8F5F0] py-section-gap relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-margin-page relative z-10">
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
                  value={content.hero.text}
                  onChange={(val) => update('hero.text', val)}
                  tagName="p"
                  className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl"
                  isTextArea={true}
                  editorMode={editorMode}
                  placeholder="Hero Text"
                />
              </div>
            </div>
          </section>

          {/* Contact Info Cards */}
          <section className="max-w-7xl mx-auto px-margin-page py-section-gap">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
              <div className="lg:col-span-4 flex flex-col gap-gutter">
                {/* Address */}
                <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/50 shadow-sm">
                  <div className="w-12 h-12 bg-[#E8F5F0] rounded-full flex items-center justify-center mb-stack-md">
                    <span className="material-symbols-outlined text-primary text-2xl">location_on</span>
                  </div>
                  <EditableText
                    value={content.headOffice.title}
                    onChange={(val) => update('headOffice.title', val)}
                    tagName="h3"
                    className="font-subhead-lg text-subhead-lg text-primary mb-stack-sm"
                    editorMode={editorMode}
                    placeholder="Card Title"
                  />
                  <EditableText
                    value={content.headOffice.address}
                    onChange={(val) => update('headOffice.address', val)}
                    tagName="p"
                    className="font-body-md text-body-md text-on-surface-variant leading-relaxed whitespace-pre-line"
                    isTextArea={true}
                    editorMode={editorMode}
                    placeholder="Office Address (one line per row)"
                  />
                </div>

                {/* Direct Line */}
                <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/50 shadow-sm">
                  <div className="w-12 h-12 bg-[#E8F5F0] rounded-full flex items-center justify-center mb-stack-md">
                    <span className="material-symbols-outlined text-primary text-2xl">phone_in_talk</span>
                  </div>
                  <EditableText
                    value={content.directLine.title}
                    onChange={(val) => update('directLine.title', val)}
                    tagName="h3"
                    className="font-subhead-lg text-subhead-lg text-primary mb-stack-sm"
                    editorMode={editorMode}
                    placeholder="Card Title"
                  />
                  <EditableText
                    value={content.directLine.phone}
                    onChange={(val) => update('directLine.phone', val)}
                    tagName="span"
                    className="font-headline-md text-headline-md text-primary font-bold block mt-1"
                    editorMode={editorMode}
                    placeholder="Phone Number"
                  />
                  <EditableText
                    value={content.directLine.note}
                    onChange={(val) => update('directLine.note', val)}
                    tagName="p"
                    className="font-body-sm text-body-sm text-on-surface-variant mt-2"
                    editorMode={editorMode}
                    placeholder="Availability Note"
                  />
                </div>
              </div>

              {/* Inquiry Form heading (form fields are fixed on the website) */}
              <div className="lg:col-span-8 bg-surface-container-lowest p-8 md:p-12 rounded-xl border border-outline-variant/50 shadow-sm">
                <EditableText
                  value={content.form.title}
                  onChange={(val) => update('form.title', val)}
                  tagName="h2"
                  className="font-headline-md text-headline-md text-primary mb-stack-sm"
                  editorMode={editorMode}
                  placeholder="Form Title"
                />
                <EditableText
                  value={content.form.subtitle}
                  onChange={(val) => update('form.subtitle', val)}
                  tagName="p"
                  className="font-body-md text-body-md text-on-surface-variant mb-stack-lg"
                  isTextArea={true}
                  editorMode={editorMode}
                  placeholder="Form Subtitle"
                />
                <div className="border border-dashed border-outline-variant rounded-xl p-10 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl text-outline">contact_mail</span>
                  <p className="font-body-md mt-2">
                    [Inquiry form fields — active on the public website]
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Map Section */}
          <section className="w-full border-t border-b border-outline-variant/30">
            <div className="w-full h-96 relative overflow-hidden">
              <iframe
                src={content.map.embedUrl}
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Location map preview"
              ></iframe>
            </div>
            {editorMode === 'edit' && (
              <div className="max-w-7xl mx-auto px-margin-page py-4 bg-surface-container-lowest">
                <label className="block font-subhead-sm text-slate-text mb-1">
                  Google Maps Embed
                </label>
                <textarea
                  value={content.map.embedUrl}
                  onChange={(e) => {
                    const value = e.target.value;
                    const srcMatch = value.match(/src="([^"]+)"/);
                    update('map.embedUrl', srcMatch ? srcMatch[1] : value.trim());
                  }}
                  rows="3"
                  className="w-full border border-outline-variant rounded-lg px-4 py-2.5 bg-surface text-on-surface font-mono text-xs focus:outline-none focus:border-primary resize-none"
                  placeholder='Paste the embed code from Google Maps (Share > Embed a map > Copy HTML), e.g. <iframe src="https://www.google.com/maps/embed?..."></iframe>'
                />
                <p className="text-[10px] text-outline mt-1">
                  Paste the full &lt;iframe&gt; code copied from Google Maps — the map link is extracted automatically. The preview above updates instantly.
                </p>
              </div>
            )}
          </section>

          {/* FAQ Section */}
          <section className="max-w-7xl mx-auto px-margin-page py-section-gap">
            <div className="text-center max-w-3xl mx-auto mb-stack-lg space-y-2">
              <EditableText
                value={content.faq.label}
                onChange={(val) => update('faq.label', val)}
                tagName="span"
                className="font-label-caps text-label-caps text-primary uppercase tracking-wider block"
                editorMode={editorMode}
                placeholder="FAQ Label"
              />
              <EditableText
                value={content.faq.title}
                onChange={(val) => update('faq.title', val)}
                tagName="h2"
                className="font-headline-md text-headline-md text-primary"
                editorMode={editorMode}
                placeholder="FAQ Title"
              />
              <EditableText
                value={content.faq.subtitle}
                onChange={(val) => update('faq.subtitle', val)}
                tagName="p"
                className="font-body-md text-body-md text-on-surface-variant"
                isTextArea={true}
                editorMode={editorMode}
                placeholder="FAQ Subtitle"
              />
              {editorMode === 'edit' && (
                <div className="pt-2">
                  <AddItemButton
                    label="Add FAQ"
                    onClick={() => addItem('faq.items', { q: 'New question?', a: 'Answer to the question.' })}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter max-w-5xl mx-auto">
              {content.faq.items.map((item, idx) => (
                <div
                  key={idx}
                  className={`relative bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 flex flex-col ${editorMode === 'edit' ? 'pr-12' : ''}`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary-container mt-1 text-[20px]">help</span>
                    <div className="w-full">
                      <EditableText
                        value={item.q}
                        onChange={(val) => update(`faq.items.${idx}.q`, val)}
                        tagName="h3"
                        className="font-subhead-lg text-subhead-lg text-primary"
                        isTextArea={true}
                        editorMode={editorMode}
                        placeholder="Question"
                      />
                    </div>
                  </div>
                  <div className="ml-7 border-t border-outline-variant/10 pt-2">
                    <EditableText
                      value={item.a}
                      onChange={(val) => update(`faq.items.${idx}.a`, val)}
                      tagName="p"
                      className="font-body-md text-body-md text-on-surface-variant leading-relaxed"
                      isTextArea={true}
                      editorMode={editorMode}
                      placeholder="Answer"
                    />
                  </div>
                  {editorMode === 'edit' && (
                    <ItemActionsMenu onDelete={() => removeItem('faq.items', idx)} />
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>
      )}
    </PageEditorShell>
  );
}
