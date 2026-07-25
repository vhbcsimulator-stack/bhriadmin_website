import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageEditorShell, { AddItemButton, ItemActionsMenu } from '../components/PageEditorShell';
import { EditableText, EditableImage } from '../components/Editable';
import IconSourceHint from '../components/IconSourceHint';
import { getCareerContent, saveCareerContent } from '../data/careerContentManager';

export default function CareerPage() {
  const navigate = useNavigate();

  return (
    <PageEditorShell pageId="career" title="Careers Page" getContent={getCareerContent} saveContent={saveCareerContent}>
      {({ content, editorMode, update, addItem, removeItem, handleSave }) => {
        const handleManageDetails = async (roleId) => {
          const saved = await handleSave();
          if (saved) navigate(`/careers/${roleId}`);
        };
        return (
        <main className="w-full">
          {/* Hero Section */}
          <section className="relative w-full py-section-gap overflow-hidden bg-deep-emerald group/hero">
            <div className="absolute inset-0 z-0">
              <EditableImage
                src={content.hero.image}
                onChange={(val) => update('hero.image', val)}
                className="w-full h-full object-cover opacity-60"
                alt="Careers hero"
                editorMode={editorMode}
                aspectClass="h-full w-full"
                floatingButton
              />
              <div className="absolute inset-0 bg-gradient-to-r from-deep-emerald/90 via-deep-emerald/75 to-deep-emerald/40 pointer-events-none"></div>
            </div>
            <div className="max-w-7xl mx-auto px-margin-page relative z-10">
              <div className="max-w-2xl space-y-stack-md text-white transition-opacity duration-300 group-hover/hero:opacity-30">
                <EditableText
                  value={content.hero.tag}
                  onChange={(val) => update('hero.tag', val)}
                  tagName="span"
                  className="inline-block font-label-caps text-label-caps text-secondary-fixed uppercase tracking-widest"
                  editorMode={editorMode}
                  placeholder="Hero Tag"
                />
                <EditableText
                  value={content.hero.title}
                  onChange={(val) => update('hero.title', val)}
                  tagName="h1"
                  className="font-display-lg text-display-lg-mobile md:text-display-lg leading-tight"
                  editorMode={editorMode}
                  placeholder="Hero Title"
                />
                <EditableText
                  value={content.hero.text}
                  onChange={(val) => update('hero.text', val)}
                  tagName="p"
                  className="font-body-lg text-body-lg text-white/85 max-w-xl"
                  isTextArea={true}
                  editorMode={editorMode}
                  placeholder="Hero Text"
                />
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="max-w-7xl mx-auto px-margin-page py-section-gap">
            <div className="max-w-3xl mb-stack-lg space-y-2">
              <EditableText
                value={content.benefits.label}
                onChange={(val) => update('benefits.label', val)}
                tagName="span"
                className="inline-block font-label-caps text-label-caps text-primary uppercase tracking-wider"
                editorMode={editorMode}
                placeholder="Benefits Label"
              />
              <EditableText
                value={content.benefits.title}
                onChange={(val) => update('benefits.title', val)}
                tagName="h2"
                className="font-headline-md text-headline-md text-primary"
                editorMode={editorMode}
                placeholder="Benefits Title"
              />
              <EditableText
                value={content.benefits.subtitle}
                onChange={(val) => update('benefits.subtitle', val)}
                tagName="p"
                className="font-body-md text-body-md text-on-surface-variant"
                isTextArea={true}
                editorMode={editorMode}
                placeholder="Benefits Subtitle"
              />
              {editorMode === 'edit' && (
                <div className="pt-2">
                  <AddItemButton
                    label="Add Benefit"
                    onClick={() => addItem('benefits.items', { icon: 'star', title: 'New Benefit', text: 'Describe this benefit.' })}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {content.benefits.items.map((item, idx) => (
                <div
                  key={idx}
                  className={`relative bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/40 flex items-start gap-4 ${editorMode === 'edit' ? 'pr-12' : ''}`}
                >
                  <div className="w-12 h-12 shrink-0 bg-[#E8F5F0] rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-2xl">{item.icon}</span>
                  </div>
                  <div className="w-full">
                    {editorMode === 'edit' && (
                      <div className="mb-2">
                        <EditableText
                          value={item.icon}
                          onChange={(val) => update(`benefits.items.${idx}.icon`, val)}
                          tagName="span"
                          className="block font-mono text-[10px] text-outline uppercase"
                          editorMode={editorMode}
                          placeholder="material icon name"
                        />
                        <IconSourceHint />
                      </div>
                    )}
                    <EditableText
                      value={item.title}
                      onChange={(val) => update(`benefits.items.${idx}.title`, val)}
                      tagName="h3"
                      className="font-subhead-lg text-subhead-lg text-primary mb-1"
                      editorMode={editorMode}
                      placeholder="Benefit Title"
                    />
                    <EditableText
                      value={item.text}
                      onChange={(val) => update(`benefits.items.${idx}.text`, val)}
                      tagName="p"
                      className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed"
                      isTextArea={true}
                      editorMode={editorMode}
                      placeholder="Benefit Description"
                    />
                  </div>
                  {editorMode === 'edit' && (
                    <ItemActionsMenu onDelete={() => removeItem('benefits.items', idx)} />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Open Roles Section */}
          <section className="w-full bg-surface-container-lowest border-t border-outline-variant/30 py-section-gap">
            <div className="max-w-7xl mx-auto px-margin-page">
              <div className="max-w-2xl mb-stack-lg space-y-2">
                <EditableText
                  value={content.roles.label}
                  onChange={(val) => update('roles.label', val)}
                  tagName="span"
                  className="inline-block font-label-caps text-label-caps text-primary uppercase tracking-wider"
                  editorMode={editorMode}
                  placeholder="Roles Label"
                />
                <EditableText
                  value={content.roles.title}
                  onChange={(val) => update('roles.title', val)}
                  tagName="h2"
                  className="font-headline-md text-headline-md text-primary"
                  editorMode={editorMode}
                  placeholder="Roles Title"
                />
                <EditableText
                  value={content.roles.subtitle}
                  onChange={(val) => update('roles.subtitle', val)}
                  tagName="p"
                  className="font-body-md text-body-md text-on-surface-variant"
                  isTextArea={true}
                  editorMode={editorMode}
                  placeholder="Roles Subtitle"
                />
                {editorMode === 'edit' && (
                  <div className="pt-2">
                    <AddItemButton
                      label="Add Open Role"
                      onClick={() => addItem('roles.items', {
                        id: `role-${Date.now()}`,
                        title: 'New Role',
                        location: 'Indang, Cavite',
                        jobType: 'Full-time',
                        jobCategory: 'General',
                        description: 'Describe the role responsibilities.',
                        overview: '',
                        responsibilities: [],
                        qualifications: []
                      }, { prepend: true })}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {content.roles.items.map((role, idx) => (
                  <div
                    key={role.id || idx}
                    className={`relative bg-surface p-6 rounded-xl border border-outline-variant/50 shadow-sm ${editorMode === 'edit' ? 'pr-12' : ''}`}
                  >
                    <EditableText
                      value={role.title}
                      onChange={(val) => update(`roles.items.${idx}.title`, val)}
                      tagName="h3"
                      className="font-subhead-lg text-subhead-lg text-primary mb-2"
                      editorMode={editorMode}
                      placeholder="Job Title"
                    />

                    {editorMode === 'edit' ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-outline mb-1">Location</label>
                          <EditableText
                            value={role.location}
                            onChange={(val) => update(`roles.items.${idx}.location`, val)}
                            tagName="span"
                            className="font-body-sm text-body-sm text-on-surface-variant"
                            editorMode={editorMode}
                            placeholder="Location"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-outline mb-1">Job Type</label>
                          <EditableText
                            value={role.jobType}
                            onChange={(val) => update(`roles.items.${idx}.jobType`, val)}
                            tagName="span"
                            className="font-body-sm text-body-sm text-on-surface-variant"
                            editorMode={editorMode}
                            placeholder="Job Type"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-outline mb-1">Job Category</label>
                          <EditableText
                            value={role.jobCategory}
                            onChange={(val) => update(`roles.items.${idx}.jobCategory`, val)}
                            tagName="span"
                            className="font-body-sm text-body-sm text-on-surface-variant"
                            editorMode={editorMode}
                            placeholder="Job Category"
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">
                        {role.location} &middot; {role.jobType} &middot; {role.jobCategory}
                      </p>
                    )}

                    <EditableText
                      value={role.description}
                      onChange={(val) => update(`roles.items.${idx}.description`, val)}
                      tagName="p"
                      className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed max-w-2xl"
                      isTextArea={true}
                      editorMode={editorMode}
                      placeholder="Role Description"
                    />

                    {editorMode === 'edit' && (
                      <button
                        type="button"
                        onClick={() => handleManageDetails(role.id)}
                        className="inline-flex items-center gap-1.5 mt-3 border border-primary text-primary px-4 py-2 rounded-lg font-subhead-sm hover:bg-primary hover:text-on-primary transition-all text-sm cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit_note</span>
                        Manage Full Details
                      </button>
                    )}

                    {editorMode === 'edit' && (
                      <ItemActionsMenu onDelete={() => removeItem('roles.items', idx)} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
        );
      }}
    </PageEditorShell>
  );
}
