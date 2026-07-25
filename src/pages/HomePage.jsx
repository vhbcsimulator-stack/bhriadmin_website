import React from 'react';
import PageEditorShell, { AddItemButton, ItemActionsMenu } from '../components/PageEditorShell';
import { EditableText, EditableImage } from '../components/Editable';
import IconSourceHint from '../components/IconSourceHint';
import { resolveImage } from '../data/staticImages';
import { getHomeContent, saveHomeContent } from '../data/homeContentManager';

export default function HomePage() {
  return (
    <PageEditorShell pageId="home" title="Home Page" getContent={getHomeContent} saveContent={saveHomeContent}>
      {({ content, editorMode, update, addItem, removeItem }) => (
        <>
          {/* Hero Section */}
          <header className="group relative w-full min-h-[500px] flex items-center justify-center overflow-hidden">
            {/* z-0 is dropped in edit mode so the floating Edit Image button (z-30)
                can layer in front of the hero contents (z-10) */}
            <div className={`absolute inset-0 bg-slate-900 ${editorMode === 'edit' ? '' : 'z-0'}`}>
              <EditableImage
                src={resolveImage(content.hero)}
                onChange={(url) => update('hero.image', url)}
                className="w-full h-full object-cover brightness-[0.55]"
                alt="Home hero background"
                editorMode={editorMode}
                aspectClass="h-full w-full"
                floatingButton
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-emerald/90 via-transparent to-transparent pointer-events-none"></div>
            </div>

            <div className={`relative z-10 text-center px-margin-page max-w-4xl mx-auto py-24 w-full ${editorMode === 'edit' ? 'transition-opacity duration-300 group-hover:opacity-40 hover:!opacity-100' : ''}`}>
              <EditableText
                value={content.hero.title}
                onChange={(val) => update('hero.title', val)}
                tagName="h1"
                className="font-display-lg text-display-lg md:text-[56px] text-on-primary mb-stack-md drop-shadow-md leading-tight"
                editorMode={editorMode}
                placeholder="Hero Title"
              />
              <EditableText
                value={content.hero.subtitle}
                onChange={(val) => update('hero.subtitle', val)}
                tagName="p"
                className="font-body-lg text-body-lg text-tertiary-fixed mb-stack-lg max-w-2xl mx-auto opacity-95"
                isTextArea={true}
                editorMode={editorMode}
                placeholder="Hero Subtitle"
              />
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="bg-on-primary text-primary px-8 py-4 rounded-lg font-subhead-lg shadow-lg inline-block min-w-[180px]">
                  <EditableText
                    value={content.hero.primaryCta}
                    onChange={(val) => update('hero.primaryCta', val)}
                    tagName="span"
                    editorMode={editorMode}
                    placeholder="Primary Button"
                  />
                </div>
                <div className="bg-transparent border border-on-primary text-on-primary px-8 py-4 rounded-lg font-subhead-lg inline-block min-w-[180px]">
                  <EditableText
                    value={content.hero.secondaryCta}
                    onChange={(val) => update('hero.secondaryCta', val)}
                    tagName="span"
                    editorMode={editorMode}
                    placeholder="Secondary Button"
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Featured Properties heading */}
          <section className="py-section-gap px-margin-page w-full max-w-7xl mx-auto">
            <div className="mb-stack-lg text-left max-w-xl">
              <EditableText
                value={content.featured.label}
                onChange={(val) => update('featured.label', val)}
                tagName="span"
                className="font-label-caps text-label-caps text-primary uppercase tracking-widest"
                editorMode={editorMode}
                placeholder="Section Label"
              />
              <EditableText
                value={content.featured.title}
                onChange={(val) => update('featured.title', val)}
                tagName="h2"
                className="font-headline-md text-headline-md text-slate-text mt-2"
                editorMode={editorMode}
                placeholder="Section Title"
              />
            </div>
            <div className="border border-dashed border-outline-variant rounded-xl p-10 text-center text-on-surface-variant bg-surface-container-lowest">
              <span className="material-symbols-outlined text-4xl text-outline">home_work</span>
              <p className="font-body-md mt-2">
                The featured property cards are pulled automatically from the Properties dashboard.
              </p>
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="bg-surface-container-low py-section-gap">
            <div className="px-margin-page max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-section-gap items-center">
                <div className="lg:w-1/2 w-full">
                  <EditableText
                    value={content.whyChooseUs.label}
                    onChange={(val) => update('whyChooseUs.label', val)}
                    tagName="span"
                    className="font-label-caps text-label-caps text-primary uppercase tracking-widest"
                    editorMode={editorMode}
                    placeholder="Section Label"
                  />
                  <EditableText
                    value={content.whyChooseUs.title}
                    onChange={(val) => update('whyChooseUs.title', val)}
                    tagName="h2"
                    className="font-headline-md text-headline-md text-slate-text mt-2 mb-stack-md"
                    editorMode={editorMode}
                    placeholder="Section Title"
                  />
                  <EditableText
                    value={content.whyChooseUs.description}
                    onChange={(val) => update('whyChooseUs.description', val)}
                    tagName="p"
                    className="font-body-lg text-body-lg text-on-surface-variant mb-stack-lg"
                    isTextArea={true}
                    editorMode={editorMode}
                    placeholder="Section Description"
                  />

                  <div className="space-y-stack-md">
                    {content.whyChooseUs.features.map((feature, index) => (
                      <div key={index} className={`relative flex gap-4 items-start bg-surface/60 rounded-xl p-2 ${editorMode === 'edit' ? 'pr-12' : ''}`}>
                        <div className="bg-primary-fixed text-on-primary-fixed p-3 rounded-lg shrink-0">
                          <span className="material-symbols-outlined fill-icon">{feature.icon}</span>
                        </div>
                        <div className="w-full">
                          {editorMode === 'edit' && (
                            <div className="mb-2">
                              <div className="flex items-center gap-1.5">
                                <span className="text-body-sm text-outline uppercase font-semibold text-[10px]">Icon:</span>
                                <input
                                  type="text"
                                  value={feature.icon}
                                  onChange={(e) => update(`whyChooseUs.features.${index}.icon`, e.target.value)}
                                  className="border border-outline-variant rounded bg-surface py-0.5 px-2 font-mono text-xs w-36"
                                  placeholder="material icon name"
                                />
                              </div>
                              <IconSourceHint />
                            </div>
                          )}
                          <EditableText
                            value={feature.title}
                            onChange={(val) => update(`whyChooseUs.features.${index}.title`, val)}
                            tagName="h4"
                            className="font-subhead-lg text-subhead-lg text-slate-text"
                            editorMode={editorMode}
                            placeholder="Feature Title"
                          />
                          <EditableText
                            value={feature.desc}
                            onChange={(val) => update(`whyChooseUs.features.${index}.desc`, val)}
                            tagName="p"
                            className="font-body-md text-on-surface-variant mt-1"
                            isTextArea={true}
                            editorMode={editorMode}
                            placeholder="Feature Description"
                          />
                        </div>
                        {editorMode === 'edit' && (
                          <ItemActionsMenu onDelete={() => removeItem('whyChooseUs.features', index)} />
                        )}
                      </div>
                    ))}
                  </div>
                  {editorMode === 'edit' && (
                    <div className="mt-4">
                      <AddItemButton
                        label="Add Feature"
                        onClick={() => addItem('whyChooseUs.features', { icon: 'star', title: 'New Feature', desc: 'Feature description' })}
                      />
                    </div>
                  )}
                </div>

                <div className="lg:w-1/2 w-full relative mt-8 lg:mt-0">
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-lg border border-outline-variant relative">
                    <EditableImage
                      src={content.whyChooseUs.image}   
                      onChange={(url) => update('whyChooseUs.image', url)}
                      className="w-full h-full object-cover"
                      alt="Why choose us illustration"
                      editorMode={editorMode}
                      aspectClass="h-full w-full"
                    />
                  </div>

                  <div className="bg-surface p-6 rounded-xl shadow-md border border-outline-variant mt-4 md:absolute md:-bottom-8 md:-left-8 md:mt-0 z-40">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-on-primary shrink-0">
                        <span className="material-symbols-outlined">psychiatry</span>
                      </div>
                      <div className="w-full">
                        <EditableText
                          value={content.whyChooseUs.card.title}
                          onChange={(val) => update('whyChooseUs.card.title', val)}
                          tagName="p"
                          className="font-subhead-lg text-slate-text"
                          editorMode={editorMode}
                          placeholder="Card Title"
                        />
                        <EditableText
                          value={content.whyChooseUs.card.subtitle}
                          onChange={(val) => update('whyChooseUs.card.subtitle', val)}
                          tagName="p"
                          className="font-body-sm text-on-surface-variant"
                          editorMode={editorMode}
                          placeholder="Card Subtitle"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="py-section-gap px-margin-page max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-gutter">
              <div className="bg-surface p-8 md:p-12 rounded-2xl border border-outline-variant shadow-sm">
                <span className="material-symbols-outlined text-primary text-4xl mb-4">flag</span>
                <EditableText
                  value={content.mission.title}
                  onChange={(val) => update('mission.title', val)}
                  tagName="h3"
                  className="font-headline-md text-headline-md text-slate-text mb-4"
                  editorMode={editorMode}
                  placeholder="Mission Title"
                />
                <EditableText
                  value={content.mission.text}
                  onChange={(val) => update('mission.text', val)}
                  tagName="p"
                  className="font-body-lg text-body-lg text-on-surface-variant mb-6"
                  isTextArea={true}
                  editorMode={editorMode}
                  placeholder="Mission Text"
                />
                <div className="pt-6 border-t border-outline-variant">
                  <EditableText
                    value={content.mission.direction}
                    onChange={(val) => update('mission.direction', val)}
                    tagName="p"
                    className="font-label-caps text-label-caps text-primary"
                    editorMode={editorMode}
                    placeholder="Direction Tagline"
                  />
                </div>
              </div>

              <div className="bg-surface p-8 md:p-12 rounded-2xl border border-outline-variant shadow-sm">
                <span className="material-symbols-outlined text-primary text-4xl mb-4">visibility</span>
                <EditableText
                  value={content.vision.title}
                  onChange={(val) => update('vision.title', val)}
                  tagName="h3"
                  className="font-headline-md text-headline-md text-slate-text mb-4"
                  editorMode={editorMode}
                  placeholder="Vision Title"
                />
                <EditableText
                  value={content.vision.text}
                  onChange={(val) => update('vision.text', val)}
                  tagName="p"
                  className="font-body-lg text-body-lg text-on-surface-variant mb-6"
                  isTextArea={true}
                  editorMode={editorMode}
                  placeholder="Vision Text"
                />
                <div className="pt-6 border-t border-outline-variant">
                  <EditableText
                    value={content.vision.direction}
                    onChange={(val) => update('vision.direction', val)}
                    tagName="p"
                    className="font-label-caps text-label-caps text-primary"
                    editorMode={editorMode}
                    placeholder="Direction Tagline"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-primary text-on-primary py-section-gap text-center px-margin-page">
            <div className="max-w-3xl mx-auto">
              <EditableText
                value={content.cta.title}
                onChange={(val) => update('cta.title', val)}
                tagName="h2"
                className="font-headline-md text-headline-md mb-stack-md"
                editorMode={editorMode}
                placeholder="CTA Title"
              />
              <EditableText
                value={content.cta.text}
                onChange={(val) => update('cta.text', val)}
                tagName="p"
                className="font-body-lg text-body-lg text-tertiary-fixed mb-stack-lg"
                isTextArea={true}
                editorMode={editorMode}
                placeholder="CTA Text"
              />
              <div className="bg-on-primary text-primary px-8 py-4 rounded-lg font-subhead-lg shadow-sm inline-block min-w-[220px]">
                <EditableText
                  value={content.cta.button}
                  onChange={(val) => update('cta.button', val)}
                  tagName="span"
                  editorMode={editorMode}
                  placeholder="CTA Button"
                />
              </div>
            </div>
          </section>
        </>
      )}
    </PageEditorShell>
  );
}
