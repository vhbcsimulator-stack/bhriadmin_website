import React from 'react';
import PageEditorShell, { AddItemButton, ItemActionsMenu } from '../components/PageEditorShell';
import { EditableText, EditableImage } from '../components/Editable';
import IconSourceHint from '../components/IconSourceHint';
import { resolveImage } from '../data/staticImages';
import { getAboutContent, saveAboutContent } from '../data/aboutContentManager';

// Reusable side-by-side editable section: title + paragraphs + image
function TextImageSection({ basePath, section, editorMode, update, addItem, removeItem, reverse = false, className = '' }) {
  return (
    <section className={`px-margin-page py-section-gap max-w-7xl mx-auto flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-stack-lg ${className}`}>
      <div className="w-full md:w-1/2 space-y-stack-md">
        <EditableText
          value={section.title}
          onChange={(val) => update(`${basePath}.title`, val)}
          tagName="h2"
          className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary leading-tight"
          editorMode={editorMode}
          placeholder="Section Title"
        />
        {section.paragraphs.map((paragraph, index) => (
          <div key={index} className={`relative ${editorMode === 'edit' ? 'pr-12' : ''}`}>
            <EditableText
              value={paragraph}
              onChange={(val) => update(`${basePath}.paragraphs.${index}`, val)}
              tagName="p"
              className="font-body-lg text-body-lg text-on-surface-variant"
              isTextArea={true}
              editorMode={editorMode}
              placeholder={`Paragraph ${index + 1}`}
            />
            {editorMode === 'edit' && section.paragraphs.length > 1 && (
              <ItemActionsMenu onDelete={() => removeItem(`${basePath}.paragraphs`, index)} />
            )}
          </div>
        ))}
        {editorMode === 'edit' && (
          <AddItemButton label="Add Paragraph" onClick={() => addItem(`${basePath}.paragraphs`, 'New paragraph text...')} />
        )}
      </div>
      <div className="w-full md:w-1/2 overflow-hidden rounded-xl">
        <EditableImage
          src={section.image}
          onChange={(url) => update(`${basePath}.image`, url)}
          className="w-full h-auto rounded-xl object-cover shadow-sm border border-outline-variant/30"
          alt={section.title}
          editorMode={editorMode}
        />
      </div>
    </section>
  );
}

// Stateful Company Departments editor section using the overlapping visual deck
function DepartmentsSection({ content, editorMode, update, addItem, removeItem }) {
  const [activeDept, setActiveDept] = React.useState(1);
  const departments = content.departments?.items || [];

  return (
    <section className="bg-surface py-section-gap overflow-hidden border-t border-b border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-margin-page">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-stack-sm">
          <EditableText
            value={content.departments?.title || 'Company Departments'}
            onChange={(val) => update('departments.title', val)}
            tagName="h2"
            className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary"
            editorMode={editorMode}
            placeholder="Departments Title"
          />
          <EditableText
            value={content.departments?.subtitle}
            onChange={(val) => update('departments.subtitle', val)}
            tagName="p"
            className="font-body-lg text-body-lg text-on-surface-variant"
            isTextArea={true}
            editorMode={editorMode}
            placeholder="Departments Subtitle"
          />
          {editorMode === 'edit' && (
            <div className="pt-2">
              <AddItemButton
                label="Add Department"
                onClick={() =>
                  addItem('departments.items', {
                    name: 'New Department',
                    desc: 'Description of the new department...',
                    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80'
                  })
                }
              />
            </div>
          )}
        </div>

        {/* 3D Overlapping Card Container */}
        <div className="relative w-full h-[450px] flex items-center justify-center select-none overflow-visible">
          <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
            {departments.map((dept, index) => {
              const diff = index - activeDept;
              const isActive = diff === 0;

              // Compute dynamic transform and z-index offsets
              let zIndex = 0;
              let scale = 0.8;
              let translatePercent = -50;
              let opacity = 0;
              let pointerEvents = 'none';

              if (diff === 0) {
                zIndex = 30;
                scale = 1.08;
                translatePercent = -50;
                opacity = 1;
                pointerEvents = 'auto';
              } else if (diff === -1) {
                zIndex = 20;
                scale = 0.9;
                translatePercent = -120;
                opacity = 0.75;
                pointerEvents = 'auto';
              } else if (diff === 1) {
                zIndex = 20;
                scale = 0.9;
                translatePercent = 20;
                opacity = 0.75;
                pointerEvents = 'auto';
              } else if (diff === -2) {
                zIndex = 10;
                scale = 0.78;
                translatePercent = -180;
                opacity = 0.35;
                pointerEvents = 'auto';
              } else if (diff === 2) {
                zIndex = 10;
                scale = 0.78;
                translatePercent = 80;
                opacity = 0.35;
                pointerEvents = 'auto';
              }

              return (
                <div
                  key={index}
                  onClick={() => setActiveDept(index)}
                  className={`absolute left-1/2 top-4 w-60 sm:w-64 md:w-72 h-[380px] rounded-2xl overflow-hidden shadow-lg border border-outline-variant/30 transition-all duration-500 ease-out cursor-pointer ${isActive ? 'shadow-2xl border-primary/20 ring-1 ring-primary/10' : 'hover:opacity-90'
                    }`}
                  style={{
                    transform: `translateX(${translatePercent}%) scale(${scale})`,
                    zIndex,
                    opacity,
                    pointerEvents
                  }}
                >
                  <EditableImage
                    src={dept.image}
                    onChange={(url) => update(`departments.items.${index}.image`, url)}
                    className="w-full h-full object-cover"
                    alt={dept.name}
                    editorMode={editorMode}
                    aspectClass="w-full h-full"
                  />

                  {/* Smooth text overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-6 text-white transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}
                  >
                    <div className="space-y-1">
                      <EditableText
                        value={dept.name}
                        onChange={(val) => update(`departments.items.${index}.name`, val)}
                        tagName="h3"
                        className="font-headline-md text-xl font-bold leading-tight text-white border-b border-transparent hover:border-white/30"
                        editorMode={editorMode}
                        placeholder="Department Name"
                      />
                      <EditableText
                        value={dept.desc}
                        onChange={(val) => update(`departments.items.${index}.desc`, val)}
                        tagName="p"
                        className="font-body-sm text-xs text-white/90 leading-relaxed font-light border-b border-transparent hover:border-white/20"
                        isTextArea={true}
                        editorMode={editorMode}
                        placeholder="Department Description"
                      />
                    </div>
                  </div>

                  {editorMode === 'edit' && (
                    <ItemActionsMenu onDelete={() => {
                      removeItem('departments.items', index);
                      // Adjust active index if out of bounds after deletion
                      if (activeDept >= departments.length - 1 && activeDept > 0) {
                        setActiveDept(activeDept - 1);
                      }
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Structured Form Editor for Departments (Only visible in Edit Mode) */}
        {editorMode === 'edit' && departments.length > 0 && (
          <div className="max-w-4xl mx-auto mt-12 bg-surface-container-low border border-outline-variant/60 p-6 sm:p-8 rounded-2xl space-y-6">
            <div className="border-b border-outline-variant/60 pb-3">
              <h3 className="font-headline-md text-xl text-primary font-bold">Edit Departments</h3>
              <p className="font-body-sm text-xs text-on-surface-variant">Update names, descriptions, and images directly in the list below.</p>
            </div>

            <div className="space-y-4">
              {departments.map((dept, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-6 p-5 bg-surface border border-outline-variant rounded-xl relative group">
                  {/* Department Image editor */}
                  <div className="w-full md:w-[160px] h-32 shrink-0">
                    <EditableImage
                      src={dept.image}
                      onChange={(url) => update(`departments.items.${index}.image`, url)}
                      className="w-full h-full object-cover rounded-lg"
                      alt={dept.name}
                      editorMode={editorMode}
                      aspectClass="w-full h-full"
                    />
                  </div>

                  {/* Name and Description editor */}
                  <div className="flex-grow space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">Department Name</label>
                      <EditableText
                        value={dept.name}
                        onChange={(val) => update(`departments.items.${index}.name`, val)}
                        tagName="h4"
                        className="font-subhead-lg text-primary font-bold text-base"
                        editorMode={editorMode}
                        placeholder="Department Name"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">Description</label>
                      <EditableText
                        value={dept.desc}
                        onChange={(val) => update(`departments.items.${index}.desc`, val)}
                        tagName="p"
                        className="font-body-md text-sm text-on-surface-variant"
                        isTextArea={true}
                        editorMode={editorMode}
                        placeholder="Department Description"
                      />
                    </div>
                  </div>

                  {/* Delete button */}
                  <ItemActionsMenu
                    onDelete={() => {
                      removeItem('departments.items', index);
                      if (activeDept >= departments.length - 1 && activeDept > 0) {
                        setActiveDept(activeDept - 1);
                      }
                    }}
                    className="absolute top-4 right-4"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <PageEditorShell pageId="about" title="About Us Page" getContent={getAboutContent} saveContent={saveAboutContent}>
      {({ content, editorMode, update, addItem, removeItem }) => (
        <main className="flex-grow">
          {/* About Us intro */}
          <TextImageSection
            basePath="aboutIntro"
            section={content.aboutIntro}
            editorMode={editorMode}
            update={update}
            addItem={addItem}
            removeItem={removeItem}
            reverse
          />

          {/* Hero Section */}
          <section className="px-margin-page py-section-gap max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-stack-lg">
            <div className="w-full md:w-1/2 space-y-stack-md">
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
                className="font-body-lg text-body-lg text-on-surface-variant"
                isTextArea={true}
                editorMode={editorMode}
                placeholder="Hero Text"
              />
            </div>
            <div className="w-full md:w-1/2 overflow-hidden rounded-xl">
              <EditableImage
                src={content.hero.image}
                onChange={(url) => update('hero.image', url)}
                className="w-full h-auto rounded-xl object-cover shadow-sm border border-outline-variant/30"
                alt="About hero"
                editorMode={editorMode}
              />
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="bg-surface-container py-section-gap">
            <div className="px-margin-page max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div className="bg-primary text-on-primary p-12 rounded-xl flex flex-col justify-center space-y-stack-md min-h-[300px] shadow-sm">
                <EditableText
                  value={content.mission.title}
                  onChange={(val) => update('mission.title', val)}
                  tagName="h2"
                  className="font-headline-md text-headline-md"
                  editorMode={editorMode}
                  placeholder="Mission Title"
                />
                <EditableText
                  value={content.mission.text}
                  onChange={(val) => update('mission.text', val)}
                  tagName="p"
                  className="font-body-lg text-body-lg opacity-90 leading-relaxed"
                  isTextArea={true}
                  editorMode={editorMode}
                  placeholder="Mission Text"
                />
                <div className="pt-stack-md border-t border-on-primary/30 mt-auto">
                  <EditableText
                    value={content.mission.tagline}
                    onChange={(val) => update('mission.tagline', val)}
                    tagName="span"
                    className="font-label-caps text-label-caps text-secondary-fixed"
                    editorMode={editorMode}
                    placeholder="Mission Tagline"
                  />
                </div>
              </div>

              <div className="bg-surface-container-low border border-outline-variant p-12 rounded-xl flex flex-col justify-center space-y-stack-md min-h-[300px] shadow-sm">
                <EditableText
                  value={content.vision.title}
                  onChange={(val) => update('vision.title', val)}
                  tagName="h2"
                  className="font-headline-md text-headline-md text-primary"
                  editorMode={editorMode}
                  placeholder="Vision Title"
                />
                <EditableText
                  value={content.vision.text}
                  onChange={(val) => update('vision.text', val)}
                  tagName="p"
                  className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed"
                  isTextArea={true}
                  editorMode={editorMode}
                  placeholder="Vision Text"
                />
                <div className="pt-stack-md border-t border-outline-variant mt-auto">
                  <EditableText
                    value={content.vision.tagline}
                    onChange={(val) => update('vision.tagline', val)}
                    tagName="span"
                    className="font-label-caps text-label-caps text-primary"
                    editorMode={editorMode}
                    placeholder="Vision Tagline"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Core Narrative */}
          <TextImageSection
            basePath="coreNarrative"
            section={content.coreNarrative}
            editorMode={editorMode}
            update={update}
            addItem={addItem}
            removeItem={removeItem}
            reverse
          />

          {/* Core Commitment */}
          <TextImageSection
            basePath="coreCommitment"
            section={content.coreCommitment}
            editorMode={editorMode}
            update={update}
            addItem={addItem}
            removeItem={removeItem}
            className="bg-surface"
          />

          {/* Board of Directors */}
          <section className="bg-surface-container py-section-gap">
            <div className="px-margin-page max-w-7xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-stack-lg space-y-stack-sm">
                <EditableText
                  value={content.board.title}
                  onChange={(val) => update('board.title', val)}
                  tagName="h2"
                  className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary"
                  editorMode={editorMode}
                  placeholder="Board Section Title"
                />
                <EditableText
                  value={content.board.subtitle}
                  onChange={(val) => update('board.subtitle', val)}
                  tagName="p"
                  className="font-body-lg text-body-lg text-on-surface-variant"
                  isTextArea={true}
                  editorMode={editorMode}
                  placeholder="Board Section Subtitle"
                />
                {editorMode === 'edit' && (
                  <AddItemButton
                    label="Add Board Member"
                    onClick={() => addItem('board.members', { image: '', imageKey: '', name: 'New Member', position: 'Position', desc: 'Short biography...' })}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                {content.board.members.map((member, index) => (
                  <div key={index} className="relative bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                    <div className="relative w-full h-80 overflow-hidden bg-surface-container-low">
                      <EditableImage
                        src={resolveImage(member)}
                        onChange={(url) => update(`board.members.${index}.image`, url)}
                        className="h-full w-full object-contain object-bottom px-4 pt-4"
                        alt={member.name}
                        editorMode={editorMode}
                        aspectClass="h-full w-full"
                      />
                    </div>
                    <div className="p-6 space-y-2">
                      <EditableText
                        value={member.name}
                        onChange={(val) => update(`board.members.${index}.name`, val)}
                        tagName="h3"
                        className="font-subhead-lg text-subhead-lg text-primary"
                        editorMode={editorMode}
                        placeholder="Member Name"
                      />
                      <EditableText
                        value={member.position}
                        onChange={(val) => update(`board.members.${index}.position`, val)}
                        tagName="p"
                        className="font-label-caps text-label-caps text-secondary uppercase tracking-wide"
                        editorMode={editorMode}
                        placeholder="Member Position"
                      />
                      <EditableText
                        value={member.desc}
                        onChange={(val) => update(`board.members.${index}.desc`, val)}
                        tagName="p"
                        className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed"
                        isTextArea={true}
                        editorMode={editorMode}
                        placeholder="Member Biography"
                      />
                    </div>
                    {editorMode === 'edit' && (
                      <ItemActionsMenu onDelete={() => removeItem('board.members', index)} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Company Departments Section */}
          <DepartmentsSection
            content={content}
            editorMode={editorMode}
            update={update}
            addItem={addItem}
            removeItem={removeItem}
          />

          {/* Our Offices */}
          <section className="px-margin-page py-section-gap max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-stack-lg space-y-stack-sm">
              <EditableText
                value={content.offices.title}
                onChange={(val) => update('offices.title', val)}
                tagName="h2"
                className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary"
                editorMode={editorMode}
                placeholder="Offices Section Title"
              />
              <EditableText
                value={content.offices.subtitle}
                onChange={(val) => update('offices.subtitle', val)}
                tagName="p"
                className="font-body-lg text-body-lg text-on-surface-variant"
                isTextArea={true}
                editorMode={editorMode}
                placeholder="Offices Section Subtitle"
              />
              {editorMode === 'edit' && (
                <AddItemButton
                  label="Add Office"
                  onClick={() => addItem('offices.items', { image: '', imageKey: '', name: 'New Office', address: 'Office address', contact: '+63 900 000 0000', mapUrl: '' })}
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {content.offices.items.map((office, index) => (
                <div key={index} className="relative flex flex-col sm:flex-row bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                  <div className="sm:w-2/5 h-48 sm:h-auto overflow-hidden">
                    <EditableImage
                      src={resolveImage(office)}
                      onChange={(url) => update(`offices.items.${index}.image`, url)}
                      className="w-full h-full object-cover"
                      alt={office.name}
                      editorMode={editorMode}
                      aspectClass="h-full w-full"
                    />
                  </div>
                  <div className={`flex-1 p-6 space-y-3 ${editorMode === 'edit' ? 'pr-12' : ''}`}>
                    <EditableText
                      value={office.name}
                      onChange={(val) => update(`offices.items.${index}.name`, val)}
                      tagName="h3"
                      className="font-subhead-lg font-bold text-lg text-primary"
                      editorMode={editorMode}
                      placeholder="Office Name"
                    />
                    <div className="flex gap-3 items-start">
                      <span className="material-symbols-outlined text-primary text-xl shrink-0">location_on</span>
                      <div className="w-full">
                        <EditableText
                          value={office.address}
                          onChange={(val) => update(`offices.items.${index}.address`, val)}
                          tagName="p"
                          className="font-body-sm text-body-sm text-sm leading-relaxed"
                          isTextArea={true}
                          editorMode={editorMode}
                          placeholder="Office Address"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <span className="material-symbols-outlined text-primary text-xl shrink-0">call</span>
                      <div className="w-full">
                        <EditableText
                          value={office.contact}
                          onChange={(val) => update(`offices.items.${index}.contact`, val)}
                          tagName="p"
                          className="font-body-sm text-body-sm text-sm"
                          editorMode={editorMode}
                          placeholder="Contact Number"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <span className="material-symbols-outlined text-primary text-xl shrink-0">map</span>
                      <div className="w-full">
                        <EditableText
                          value={office.mapUrl || ''}
                          onChange={(val) => update(`offices.items.${index}.mapUrl`, val)}
                          tagName="p"
                          className="font-body-sm text-body-sm text-sm break-all"
                          editorMode={editorMode}
                          placeholder="Google Maps Link (e.g. https://maps.app.goo.gl/...)"
                        />
                      </div>
                    </div>
                  </div>
                  {editorMode === 'edit' && (
                    <ItemActionsMenu onDelete={() => removeItem('offices.items', index)} />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Company Events */}
          <section className="bg-surface-container-low py-section-gap">
            <div className="px-margin-page max-w-7xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-stack-lg space-y-stack-sm">
                <EditableText
                  value={content.events.title}
                  onChange={(val) => update('events.title', val)}
                  tagName="h2"
                  className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary"
                  editorMode={editorMode}
                  placeholder="Events Section Title"
                />
                <EditableText
                  value={content.events.subtitle}
                  onChange={(val) => update('events.subtitle', val)}
                  tagName="p"
                  className="font-body-lg text-body-lg text-on-surface-variant"
                  isTextArea={true}
                  editorMode={editorMode}
                  placeholder="Events Section Subtitle"
                />
                {editorMode === 'edit' && (
                  <AddItemButton
                    label="Add Event Photo"
                    onClick={() => addItem('events.items', { image: '', imageKey: '' })}
                  />
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {content.events.items.map((event, index) => (
                  <div key={index} className="relative rounded-md border border-outline-variant shadow-sm overflow-hidden h-40 sm:h-48 md:h-56 bg-surface-container">
                    <EditableImage
                      src={resolveImage(event)}
                      onChange={(url) => update(`events.items.${index}.image`, url)}
                      className="w-full h-full object-cover"
                      alt={`Company event ${index + 1}`}
                      editorMode={editorMode}
                      aspectClass="h-full w-full"
                    />
                    {editorMode === 'edit' && (
                      <ItemActionsMenu onDelete={() => removeItem('events.items', index)} />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-body-sm text-outline text-center mt-4">
                On the website these photos are shown in an interactive bento gallery (first 4 visible, the rest behind "View More").
              </p>
            </div>
          </section>

          {/* Core Values */}
          <section className="px-margin-page py-section-gap max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-stack-lg space-y-stack-sm">
              <EditableText
                value={content.coreValues.title}
                onChange={(val) => update('coreValues.title', val)}
                tagName="h2"
                className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary"
                editorMode={editorMode}
                placeholder="Core Values Title"
              />
              <EditableText
                value={content.coreValues.subtitle}
                onChange={(val) => update('coreValues.subtitle', val)}
                tagName="p"
                className="font-body-lg text-body-lg text-on-surface-variant"
                isTextArea={true}
                editorMode={editorMode}
                placeholder="Core Values Subtitle"
              />
              {editorMode === 'edit' && (
                <AddItemButton
                  label="Add Core Value"
                  onClick={() => addItem('coreValues.items', { icon: 'star', title: 'New Value', desc: 'Value description...' })}
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-gutter">
              {content.coreValues.items.map((value, index) => (
                <div key={index} className={`relative bg-surface border border-outline-variant rounded-xl p-8 ${editorMode === 'edit' ? 'pr-12' : ''}`}>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-stack-md">
                    <span className="material-symbols-outlined text-primary">{value.icon}</span>
                  </div>
                  {editorMode === 'edit' && (
                    <div className="mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-body-sm text-outline uppercase font-semibold text-[10px]">Icon:</span>
                        <input
                          type="text"
                          value={value.icon}
                          onChange={(e) => update(`coreValues.items.${index}.icon`, e.target.value)}
                          className="border border-outline-variant rounded bg-surface py-0.5 px-2 font-mono text-xs w-full"
                          placeholder="material icon name"
                        />
                      </div>
                      <IconSourceHint />
                    </div>
                  )}
                  <EditableText
                    value={value.title}
                    onChange={(val) => update(`coreValues.items.${index}.title`, val)}
                    tagName="h3"
                    className="font-subhead-lg text-subhead-lg text-primary mb-2"
                    editorMode={editorMode}
                    placeholder="Value Title"
                  />
                  <EditableText
                    value={value.desc}
                    onChange={(val) => update(`coreValues.items.${index}.desc`, val)}
                    tagName="p"
                    className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed"
                    isTextArea={true}
                    editorMode={editorMode}
                    placeholder="Value Description"
                  />
                  {editorMode === 'edit' && (
                    <ItemActionsMenu onDelete={() => removeItem('coreValues.items', index)} />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="bg-surface-container-low py-section-gap">
            <div className="px-margin-page max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row gap-stack-lg items-start">
                <div className="w-full md:w-1/3 space-y-4">
                  <EditableText
                    value={content.whyChooseUs.title}
                    onChange={(val) => update('whyChooseUs.title', val)}
                    tagName="h2"
                    className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary leading-tight"
                    editorMode={editorMode}
                    placeholder="Why Choose Us Title"
                  />
                  <EditableText
                    value={content.whyChooseUs.subtitle}
                    onChange={(val) => update('whyChooseUs.subtitle', val)}
                    tagName="p"
                    className="font-body-lg text-body-lg text-on-surface-variant"
                    isTextArea={true}
                    editorMode={editorMode}
                    placeholder="Why Choose Us Subtitle"
                  />
                  {editorMode === 'edit' && (
                    <AddItemButton
                      label="Add Reason"
                      onClick={() => addItem('whyChooseUs.reasons', 'New reason to choose us.')}
                    />
                  )}
                </div>
                <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-gutter">
                  {content.whyChooseUs.reasons.map((reason, index) => (
                    <div key={index} className={`relative flex gap-4 items-start bg-surface/60 rounded-lg p-2 ${editorMode === 'edit' ? 'pr-12' : ''}`}>
                      <span className="material-symbols-outlined text-primary shrink-0">check_circle</span>
                      <div className="w-full">
                        <EditableText
                          value={reason}
                          onChange={(val) => update(`whyChooseUs.reasons.${index}`, val)}
                          tagName="p"
                          className="font-body-md text-on-surface leading-relaxed"
                          isTextArea={true}
                          editorMode={editorMode}
                          placeholder="Reason"
                        />
                      </div>
                      {editorMode === 'edit' && (
                        <ItemActionsMenu onDelete={() => removeItem('whyChooseUs.reasons', index)} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Sustainability */}
          <section className="py-section-gap px-margin-page max-w-7xl mx-auto">
            <div className="relative w-full rounded-2xl overflow-hidden shadow-md">
              <div className="relative h-64">
                <EditableImage
                  src={content.sustainability.image}
                  onChange={(url) => update('sustainability.image', url)}
                  className="w-full h-full object-cover"
                  alt="Sustainability background"
                  editorMode={editorMode}
                  aspectClass="h-full w-full"
                />
              </div>
              <div className="bg-deep-emerald py-10 px-6 md:px-16 flex flex-col items-center text-center space-y-stack-sm text-on-primary">
                <EditableText
                  value={content.sustainability.title}
                  onChange={(val) => update('sustainability.title', val)}
                  tagName="h2"
                  className="font-display-lg text-2xl sm:text-display-lg-mobile md:text-display-lg leading-tight"
                  editorMode={editorMode}
                  placeholder="Sustainability Title"
                />
                {content.sustainability.paragraphs.map((paragraph, index) => (
                  <div key={index} className={`relative w-full max-w-3xl ${editorMode === 'edit' ? 'pr-12' : ''}`}>
                    <EditableText
                      value={paragraph}
                      onChange={(val) => update(`sustainability.paragraphs.${index}`, val)}
                      tagName="p"
                      className="font-body-lg text-base sm:text-body-lg text-tertiary-fixed-dim opacity-95"
                      isTextArea={true}
                      editorMode={editorMode}
                      placeholder={`Paragraph ${index + 1}`}
                    />
                    {editorMode === 'edit' && content.sustainability.paragraphs.length > 1 && (
                      <ItemActionsMenu onDelete={() => removeItem('sustainability.paragraphs', index)} />
                    )}
                  </div>
                ))}
                {editorMode === 'edit' && (
                  <AddItemButton
                    label="Add Paragraph"
                    onClick={() => addItem('sustainability.paragraphs', 'New paragraph text...')}
                  />
                )}
              </div>
            </div>
          </section>
        </main>
      )}
    </PageEditorShell>
  );
}
