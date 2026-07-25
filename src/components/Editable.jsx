import React, { useState, useEffect, useRef } from 'react';
import { uploadMedia } from '../data/propertiesManager';

// EditableText Component for inline edits
export function EditableText({ value, onChange, className, isTextArea = false, tagName: Tag = 'div', editorMode, placeholder = "Enter text..." }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  // Sync value if changed from outside
  useEffect(() => {
    setTempValue(value);
  }, [value]);

  if (editorMode !== 'edit') {
    return <Tag className={className}>{value}</Tag>;
  }

  if (isEditing) {
    return (
      <div className="relative w-full z-30" onClick={(e) => e.stopPropagation()}>
        {isTextArea ? (
          <textarea
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="w-full bg-surface border-2 border-primary rounded-xl p-3 text-on-surface focus:outline-none font-body-md"
            rows="3"
            placeholder={placeholder}
            autoFocus
          />
        ) : (
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="w-full bg-surface border-2 border-primary rounded-lg px-3 py-1.5 text-on-surface focus:outline-none font-body-md"
            placeholder={placeholder}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onChange(tempValue);
                setIsEditing(false);
              } else if (e.key === 'Escape') {
                setTempValue(value);
                setIsEditing(false);
              }
            }}
          />
        )}
        <div className="flex justify-end gap-1.5 mt-1.5">
          <button
            onClick={() => {
              onChange(tempValue);
              setIsEditing(false);
            }}
            className="bg-primary text-on-primary p-1.5 rounded-md hover:bg-primary/95 shadow flex items-center justify-center cursor-pointer"
            title="Save"
          >
            <span className="material-symbols-outlined text-[16px]">check</span>
          </button>
          <button
            onClick={() => {
              setTempValue(value);
              setIsEditing(false);
            }}
            className="bg-surface-variant text-on-surface-variant border border-outline-variant p-1.5 rounded-md hover:bg-surface-container shadow flex items-center justify-center cursor-pointer"
            title="Cancel"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group/edit border border-dashed border-transparent hover:border-primary/40 hover:bg-primary/5 rounded-lg transition-all p-1">
      <Tag className={className}>{value || <span className="text-outline italic">{placeholder}</span>}</Tag>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
        className="opacity-0 group-hover/edit:opacity-100 transition-opacity absolute right-1 top-1 bg-primary text-on-primary p-1.5 rounded-full shadow-md z-20 cursor-pointer flex items-center justify-center"
        title="Edit Text"
      >
        <span className="material-symbols-outlined text-[14px]">edit</span>
      </button>
    </div>
  );
}

// EditableImage Component for drag/drop and click file picker.
// `floatingButton` renders an "Edit Image" button pinned to the top-right that
// only appears while hovering the surrounding `group`, layered in front of any
// content sitting on top of the image — for hero-style sections.
export function EditableImage({ src, onChange, className, alt, editorMode, aspectClass = '', floatingButton = false }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleImageFile = async (file) => {
    if (file && file.type.startsWith('image/')) {
      setUploading(true);
      try {
        const publicUrl = await uploadMedia(file);
        onChange(publicUrl);
      } catch (err) {
        console.error("Failed to upload image:", err);
        alert("Failed to upload image: " + err.message);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImageFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  if (editorMode !== 'edit') {
    return <img src={src} className={className} alt={alt} />;
  }

  if (floatingButton) {
    return (
      <div
        className={`relative overflow-hidden group/floating ${aspectClass}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <img src={src} className={className} alt={alt} />
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 pointer-events-none z-10 ${uploading ? 'opacity-100' : 'opacity-0 group-hover/floating:opacity-100'}`}
        ></div>
        <div
          className={`absolute top-5 right-5 z-30 flex flex-col items-center gap-1.5 transition-opacity duration-300 ${uploading ? 'opacity-100' : 'opacity-0 pointer-events-none group-hover/floating:opacity-100 group-hover/floating:pointer-events-auto'}`}
        >
          <button
            onClick={() => !uploading && fileInputRef.current.click()}
            disabled={uploading}
            className="bg-primary text-on-primary px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider cursor-pointer hover:bg-primary/90"
          >
            {uploading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                <span>Edit Image</span>
              </>
            )}
          </button>
          {!uploading && (
            <span className="block text-center text-[10px] text-white/80 drop-shadow ">Drag and drop or click</span>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleImageFile(e.target.files[0])}
          className="hidden"
          accept="image/*"
          disabled={uploading}
        />
      </div>
      
    );
  }

  return (
    <div
      className={`relative group/image overflow-hidden rounded-xl border border-dashed border-transparent hover:border-primary transition-all ${aspectClass}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <img src={src} className={className} alt={alt} />

      {/* Edit Image Hover Overlay */}
      <div
        onClick={() => !uploading && fileInputRef.current.click()}
        className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex flex-col items-center justify-center text-white z-20 cursor-pointer text-center"
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-[10px] uppercase font-bold tracking-wider">Uploading...</span>
          </div>
        ) : (
          <>
            <div className="bg-primary text-on-primary px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
              <span>Edit Image</span>
            </div>
            <span className="text-[10px] text-white/80 mt-1">Drag and drop or click</span>
          </>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleImageFile(e.target.files[0])}
        className="hidden"
        accept="image/*"
        disabled={uploading}
      />
    </div>
  );
}

// Set a value at a dot-separated path inside a nested object/array structure.
// Returns a structural clone with the value applied — safe for React state updates.
export function setDeep(obj, path, value) {
  const next = structuredClone(obj);
  const keys = path.split('.');
  let current = next;
  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
  return next;
}
