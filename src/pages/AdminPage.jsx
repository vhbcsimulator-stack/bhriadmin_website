import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { EditableText, EditableImage } from '../components/Editable';
import {
  getAllProperties,
  saveProperty,
  deleteProperty,
  createDefaultPropertyTemplate
} from '../data/propertiesManager';
import { propertiesData } from '../data/propertiesData';


export default function AdminPage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'editor'
  const [editingProperty, setEditingProperty] = useState(null);
  const [editorMode, setEditorMode] = useState('edit'); // 'edit' | 'preview'
  const [activeTab, setActiveTab] = useState('overview');
  
  // Modal for new project creation
  const [newProjectModal, setNewProjectModal] = useState(false);
  const [newProjectData, setNewProjectData] = useState({ id: '', title: '', location: 'Cavite' });
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRefs = useRef({});

  useEffect(() => {
    async function load() {
      const list = await getAllProperties();
      setProperties(list);

      // Auto-migrate database records to Bento layout if old list-mv style is detected
      const mvProperty = list.find(p => p.id === 'mountain-view');
      if (mvProperty && mvProperty.investment && mvProperty.investment.style === 'list-mv') {
        console.log("Stale Mountain View investment layout detected in Supabase. Auto-updating to Bento grid...");
        const latestMv = propertiesData.find(p => p.id === 'mountain-view');
        if (latestMv) {
          const updatedMv = { ...mvProperty, investment: latestMv.investment };
          try {
            await saveProperty(updatedMv);
            const newList = await getAllProperties();
            setProperties(newList);
            console.log("Supabase successfully migrated Mountain View to Bento investment layout.");
          } catch (err) {
            console.error("Failed to auto-migrate database record:", err);
          }
        }
      }
    }
    load();
  }, []);

  const handleEditClick = (property) => {
    // Clone property to avoid directly modifying state before saving
    setEditingProperty(JSON.parse(JSON.stringify(property)));
    setView('editor');
    setEditorMode('edit');
    setActiveTab('overview');
  };

  const handleDeleteClick = async (id) => {
    const shouldDelete = window.bypassConfirm || 
                         new URLSearchParams(window.location.search).get('bypassConfirm') === 'true' ||
                         window.confirm("Are you sure you want to delete this leisure community? This action cannot be undone.");
    if (shouldDelete) {
      try {
        await deleteProperty(id);
        const list = await getAllProperties();
        setProperties(list);
      } catch (err) {
        alert("Failed to delete property: " + err.message);
      }
    }
  };

  const handleCreateProjectSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    const formattedId = newProjectData.id.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    if (!formattedId) {
      setErrorMessage('Please enter a valid Project URL ID.');
      return;
    }

    const existing = properties.find(p => p.id === formattedId);
    if (existing) {
      setErrorMessage('A project with this ID already exists. Please choose a unique URL ID.');
      return;
    }

    const newProject = createDefaultPropertyTemplate(
      formattedId, 
      newProjectData.title.trim(), 
      newProjectData.location
    );

    try {
      await saveProperty(newProject);
      const list = await getAllProperties();
      setProperties(list);
      
      // Auto-open in editor
      setEditingProperty(newProject);
      setView('editor');
      setEditorMode('edit');
      setActiveTab('overview');
      
      // Reset modal state
      setNewProjectModal(false);
      setNewProjectData({ id: '', title: '', location: 'Cavite' });
    } catch (err) {
      setErrorMessage("Failed to initialize property: " + err.message);
    }
  };

  const handleSaveEditor = async () => {
    if (!editingProperty.title.trim()) {
      alert("Project Title cannot be empty.");
      return;
    }
    try {
      await saveProperty(editingProperty);
      const list = await getAllProperties();
      setProperties(list);
      setView('dashboard');
      setEditingProperty(null);
    } catch (err) {
      alert("Failed to save changes: " + err.message);
    }
  };

  const handleCancelEditor = () => {
    const shouldCancel = window.bypassConfirm || 
                         new URLSearchParams(window.location.search).get('bypassConfirm') === 'true' ||
                         window.confirm("Discard unsaved changes?");
    if (shouldCancel) {
      setView('dashboard');
      setEditingProperty(null);
    }
  };

  // Bento Box Item Addition / Deletion Handlers
  const handleAddFacilityItem = () => {
    setEditingProperty(prev => {
      const updated = { ...prev };
      const newItem = {
        id: `facility-${Date.now()}`,
        title: "New Facility Item",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYIzXNL0I0CC9R96cf-qKacfjTTxiy83hD_WAzdulDrG-4EUDHyKMHK02rlVw1EkzHoxN-Cdiu17cmlDypvf9OxGVSS06_cFjPWD6FVjFxKTIwlFrJdaqkmt3_nMiqWz4izKvPacItjxZSiFhicfHyM8K9wgYfH4pNgLY0Gdr4pASgEIOkcJyIvOnpD-3qzVUY9ItE6440PnQ-8YAgV6BZxJYtJdb798CBr5jNEopdNsO_4rnvZ8ByCx2BH-n4Z1uklCeSOQ_izFs"
      };
      if (updated.facilities.style === 'bento-mv') {
        newItem.description = "New facility description";
      }
      updated.facilities.items = [...updated.facilities.items, newItem];
      return updated;
    });
  };

  const handleDeleteFacilityItem = (index) => {
    setEditingProperty(prev => {
      const updated = { ...prev };
      updated.facilities.items = updated.facilities.items.filter((_, idx) => idx !== index);
      return updated;
    });
  };

  const handleAddDevelopmentItem = () => {
    setEditingProperty(prev => {
      const updated = { ...prev };
      const newItem = {
        id: `dev-${Date.now()}`,
        title: "New Development Milestone",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYIzXNL0I0CC9R96cf-qKacfjTTxiy83hD_WAzdulDrG-4EUDHyKMHK02rlVw1EkzHoxN-Cdiu17cmlDypvf9OxGVSS06_cFjPWD6FVjFxKTIwlFrJdaqkmt3_nMiqWz4izKvPacItjxZSiFhicfHyM8K9wgYfH4pNgLY0Gdr4pASgEIOkcJyIvOnpD-3qzVUY9ItE6440PnQ-8YAgV6BZxJYtJdb798CBr5jNEopdNsO_4rnvZ8ByCx2BH-n4Z1uklCeSOQ_izFs"
      };
      updated.developments.items = [...(updated.developments.items || []), newItem];
      return updated;
    });
  };

  const handleDeleteDevelopmentItem = (index) => {
    setEditingProperty(prev => {
      const updated = { ...prev };
      updated.developments.items = updated.developments.items.filter((_, idx) => idx !== index);
      return updated;
    });
  };

  // Image upload handler via FileReader
  const handleImageFile = (file, callback) => {
    if (file && file.type.startsWith('image/')) {
      // Limit size to ~1.5MB to prevent localstorage overflow
      if (file.size > 1500000) {
        alert("Image file size is too large (should be under 1.5MB to preserve local storage limits).");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        callback(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = (inputKey) => {
    if (fileInputRefs.current[inputKey]) {
      fileInputRefs.current[inputKey].click();
    }
  };

  // Drag and Drop Events
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, callback) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImageFile(file, callback);
  };

  const handleScrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 90; // Header offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Helper for inline text editor
  const handleTextChange = (path, value) => {
    setEditingProperty(prev => {
      const updated = { ...prev };
      const keys = path.split('.');
      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  // Helper to edit array items (stats, text arrays, items inside nested objects)
  const handleArrayTextChange = (path, index, value) => {
    setEditingProperty(prev => {
      const updated = { ...prev };
      const keys = path.split('.');
      let current = updated;
      for (let i = 0; i < keys.length; i++) {
        current = current[keys[i]];
      }
      current[index] = value;
      return updated;
    });
  };

  const handleNestedArrayTextChange = (path, index, itemKey, value) => {
    setEditingProperty(prev => {
      const updated = { ...prev };
      const keys = path.split('.');
      let current = updated;
      for (let i = 0; i < keys.length; i++) {
        current = current[keys[i]];
      }
      current[index] = { ...current[index], [itemKey]: value };
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md antialiased flex flex-col">
      
      {/* ==================== DASHBOARD VIEW ==================== */}
      {view === 'dashboard' && (
        <>
          <Navbar onAddNewProject={() => setNewProjectModal(true)} />

          <main className="max-w-7xl mx-auto px-margin-page py-section-gap flex-grow w-full">
            <div className="mb-stack-lg">
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest">Admin Workspace</span>
              <h1 className="font-headline-md text-headline-md text-slate-text mt-1">Project Portfolio Management</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-xl">
                Create new communities, edit content structures dynamically, configure bento elements, or delete properties from the public listings.
              </p>
            </div>

            <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/60 text-slate-text font-subhead-lg">
                    <th className="p-5 font-semibold">Project Cover</th>
                    <th className="p-5 font-semibold">Community Details</th>
                    <th className="p-5 font-semibold">Status/Location</th>
                    <th className="p-5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="p-5">
                        <div className="w-28 h-20 rounded-lg overflow-hidden border border-outline-variant bg-surface-container">
                          <img 
                            src={property.cardImage} 
                            alt={property.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="font-headline-md text-lg text-primary font-bold">{property.title}</div>
                        <div className="text-body-sm text-outline font-mono mt-1">/{property.id}</div>
                        <div className="text-body-sm text-on-surface-variant line-clamp-1 mt-1.5 max-w-md">{property.description}</div>
                      </td>
                      <td className="p-5">
                        <span className="inline-block bg-[#E8F5F0] text-primary text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase">
                          {property.badgeStatus}
                        </span>
                        <div className="text-body-sm text-on-surface-variant font-bold mt-1.5">
                          {property.locationFull}
                        </div>
                      </td>
                      <td className="p-5 text-right space-x-2">
                        <button 
                          onClick={() => handleEditClick(property)}
                          className="border border-primary text-primary px-4 py-2 rounded-lg font-subhead-sm hover:bg-primary hover:text-on-primary transition-all cursor-pointer inline-flex items-center gap-1.5 text-sm"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span> Edit Details
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(property.id)}
                          className="border border-error text-error px-4 py-2 rounded-lg font-subhead-sm hover:bg-error hover:text-on-error transition-all cursor-pointer inline-flex items-center gap-1.5 text-sm"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {properties.length === 0 && (
                <div className="text-center py-20 bg-surface">
                  <span className="material-symbols-outlined text-outline text-6xl">home_work</span>
                  <h3 className="font-headline-md text-2xl text-slate-text mt-4">No Projects Available</h3>
                  <p className="font-body-md text-on-surface-variant mt-2">Click "Add New Project" to initialize your portfolio.</p>
                </div>
              )}
            </div>
          </main>

          <Footer />

          {/* Create Project Modal */}
          {newProjectModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
              <div 
                className="relative bg-surface w-full max-w-md p-8 rounded-2xl border border-outline-variant shadow-2xl animate-scaleUp"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => setNewProjectModal(false)}
                  className="absolute top-4 right-4 text-on-surface-variant hover:text-primary p-2"
                >
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>

                <h3 className="font-headline-md text-2xl text-primary mb-2">Create New Project</h3>
                <p className="font-body-md text-on-surface-variant mb-6">Initialize a new leisure community project details template.</p>
                
                {errorMessage && (
                  <div className="bg-error-container text-on-error-container p-3.5 rounded-lg text-body-sm font-bold mb-4">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleCreateProjectSubmit} className="space-y-4">
                  <div>
                    <label className="block font-subhead-sm text-slate-text mb-1">Project Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={newProjectData.title}
                      onChange={(e) => setNewProjectData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full border border-outline-variant rounded-lg px-4 py-2.5 bg-surface text-on-surface focus:outline-none focus:border-primary font-body-md"
                      placeholder="e.g. East West Breeze"
                    />
                  </div>

                  <div>
                    <label className="block font-subhead-sm text-slate-text mb-1">URL Route ID *</label>
                    <input 
                      type="text" 
                      required 
                      value={newProjectData.id}
                      onChange={(e) => setNewProjectData(prev => ({ ...prev, id: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-') }))}
                      className="w-full border border-outline-variant rounded-lg px-4 py-2.5 bg-surface text-on-surface font-mono text-sm focus:outline-none focus:border-primary"
                      placeholder="e.g. east-west-breeze"
                    />
                    <p className="text-[10px] text-outline mt-1 font-mono uppercase">Route: /properties/{newProjectData.id || ':id'}</p>
                  </div>

                  <div>
                    <label className="block font-subhead-sm text-slate-text mb-1">Location Zone</label>
                    <select
                      value={newProjectData.location}
                      onChange={(e) => setNewProjectData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full border border-outline-variant rounded-lg px-4 py-2.5 bg-surface text-on-surface focus:outline-none focus:border-primary font-body-md"
                    >
                      <option value="Cavite">Indang, Cavite</option>
                      <option value="Batangas">Nasugbu, Batangas</option>
                    </select>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-primary text-on-primary py-3.5 rounded-lg font-subhead-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-md mt-4 cursor-pointer"
                  >
                    Initialize Template
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* ==================== EDITOR WORKSPACE VIEW ==================== */}
      {view === 'editor' && editingProperty && (
        <div className="flex-grow flex flex-col">
          
          {/* Top Admin Editor Toolbar */}
          <div className="bg-surface border-b border-outline-variant/60 sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-margin-page py-3.5 flex flex-wrap gap-4 justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="bg-primary text-on-primary px-2.5 py-1 rounded font-mono text-xs uppercase shrink-0">
                  Editing: /{editingProperty.id}
                </span>
                
                {editorMode === 'edit' ? (
                  <input 
                    type="text"
                    value={editingProperty.title}
                    onChange={(e) => handleTextChange('title', e.target.value)}
                    className="border-b border-outline-variant bg-transparent px-2 py-0.5 text-primary font-headline-md text-xl focus:outline-none font-bold max-w-xs md:max-w-md"
                    placeholder="Project Title"
                  />
                ) : (
                  <span className="font-headline-md text-xl text-primary font-bold tracking-tight">
                    {editingProperty.title}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Editor Settings (Only visible in edit mode) */}
                {editorMode === 'edit' && (
                  <div className="hidden lg:flex items-center gap-3 border-r border-outline-variant/60 pr-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-body-sm text-outline uppercase font-semibold text-xs">Location:</span>
                      <select 
                        value={editingProperty.location}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditingProperty(prev => ({
                            ...prev,
                            location: val,
                            locationFull: `${val === 'Cavite' ? 'Indang, Cavite' : 'Nasugbu, Batangas'}`,
                            badgeLocation: `${val.toUpperCase()} PHILIPPINES`
                          }));
                        }}
                        className="border border-outline-variant rounded bg-surface py-1 px-2 font-body-sm text-xs text-on-surface"
                      >
                        <option value="Cavite">Cavite</option>
                        <option value="Batangas">Batangas</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-body-sm text-outline uppercase font-semibold text-xs">Status:</span>
                      <input 
                        type="text"
                        value={editingProperty.badgeStatus}
                        onChange={(e) => handleTextChange('badgeStatus', e.target.value.toUpperCase())}
                        className="border border-outline-variant rounded bg-surface py-1 px-2 font-mono text-xs w-28 text-center"
                        placeholder="Status Badge"
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-body-sm text-outline uppercase font-semibold text-xs">Facilities Style:</span>
                      <select 
                        value={editingProperty.facilities.style}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditingProperty(prev => {
                            const updated = { ...prev };
                            updated.facilities.style = val;
                            return updated;
                          });
                        }}
                        className="border border-outline-variant rounded bg-surface py-1 px-2 font-body-sm text-xs text-on-surface"
                      >
                        <option value="bento-ewb">EWB style</option>
                        <option value="bento-mv">Mountain View style</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-body-sm text-outline uppercase font-semibold text-xs">Developments Style:</span>
                      <select 
                        value={editingProperty.developments?.style || 'bento-ewb'}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditingProperty(prev => {
                            const updated = { ...prev };
                            if (!updated.developments) {
                              updated.developments = { title: "Project Developments", items: [], style: "bento-ewb" };
                            }
                            updated.developments.style = val;
                            return updated;
                          });
                        }}
                        className="border border-outline-variant rounded bg-surface py-1 px-2 font-body-sm text-xs text-on-surface"
                      >
                        <option value="bento-ewb">EWB style</option>
                        <option value="bento-mv">Mountain View style</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Editor Mode Selector */}
                <div className="bg-surface-container border border-outline-variant rounded-lg p-0.5 flex">
                  <button 
                    onClick={() => setEditorMode('edit')}
                    className={`px-3 py-1.5 rounded-md font-subhead-sm text-xs cursor-pointer transition-all ${editorMode === 'edit' ? 'bg-white text-primary shadow-sm font-bold' : 'text-on-surface-variant hover:text-primary'}`}
                  >
                    Edit Layout
                  </button>
                  <button 
                    onClick={() => setEditorMode('preview')}
                    className={`px-3 py-1.5 rounded-md font-subhead-sm text-xs cursor-pointer transition-all ${editorMode === 'preview' ? 'bg-white text-primary shadow-sm font-bold' : 'text-on-surface-variant hover:text-primary'}`}
                  >
                    Preview Mode
                  </button>
                </div>

                <button 
                  onClick={handleSaveEditor}
                  className="bg-primary text-on-primary px-7 py-1.5 rounded-lg font-subhead-sm hover:bg-primary-container hover:text-on-primary-container transition-all cursor-pointer font-bold shadow-sm text-xs"
                >
                  Save
                </button>
                
                <button 
                  onClick={handleCancelEditor}
                  className=" text-on-surface-variant border border-outline-variant/65 px-5 py-1.5 rounded-lg font-subhead-sm hover:bg-surface-container transition-all cursor-pointer text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Sticky Project Sub-Navbar (Rendered exactly like ProjectDetailsPage inside Editor) */}
          <div className="sticky top-[58px] z-40 bg-surface/95 backdrop-blur-md border-b border-outline-variant/40 w-full shadow-sm">
            <div className="max-w-7xl mx-auto px-margin-page py-3.5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-primary p-1 rounded-full bg-surface-container shrink-0 flex items-center justify-center opacity-50 cursor-not-allowed">
                  <span className="material-symbols-outlined text-2xl font-bold">arrow_back</span>
                </span>
                <span className="font-headline-md text-xl md:text-2xl text-primary font-bold tracking-tight line-clamp-1">
                  {editingProperty.title}
                </span>
              </div>
              
              <div className="hidden md:flex gap-6 items-center">
                <button 
                  onClick={() => handleScrollToSection('overview')} 
                  className={`font-body-md text-body-md pb-1 transition-colors border-b-2 hover:text-primary ${activeTab === 'overview' ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant'}`}
                >
                  Overview
                </button>
                <button 
                  onClick={() => handleScrollToSection('facilities')} 
                  className={`font-body-md text-body-md pb-1 transition-colors border-b-2 hover:text-primary ${activeTab === 'facilities' ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant'}`}
                >
                  Facilities
                </button>
                <button 
                  onClick={() => handleScrollToSection('developments')} 
                  className={`font-body-md text-body-md pb-1 transition-colors border-b-2 hover:text-primary ${activeTab === 'developments' ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant'}`}
                >
                  Developments
                </button>
                <button 
                  onClick={() => handleScrollToSection('invest')} 
                  className={`font-body-md text-body-md pb-1 transition-colors border-b-2 hover:text-primary ${activeTab === 'invest' ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant'}`}
                >
                  Investment
                </button>
                <button 
                  onClick={() => handleScrollToSection('inquire')} 
                  className="bg-primary text-on-primary px-5 py-2 rounded-lg font-subhead-lg hover:bg-on-primary-fixed-variant transition-colors shadow-sm cursor-pointer"
                >
                  Inquire Now
                </button>
              </div>

              <div className="md:hidden">
                <button 
                  onClick={() => handleScrollToSection('inquire')} 
                  className="bg-primary text-on-primary px-4 py-2 rounded-lg font-subhead-sm hover:bg-on-primary-fixed-variant transition-colors shadow-sm text-sm"
                >
                  Inquire
                </button>
              </div>
            </div>
          </div>

          {/* EDITOR CANVAS AREA */}
          <div className="w-full flex-grow relative">
            
            {/* HERO SECTION */}
            <section 
              className="relative h-[80vh] min-h-[500px] flex items-center overflow-hidden transition-all"
            >
              <div className="absolute inset-0 z-0 bg-slate-900">
                <EditableImage
                  src={editingProperty.heroImage}
                  onChange={(res) => handleTextChange('heroImage', res)}
                  className="w-full h-full object-cover brightness-[0.7] opacity-80"
                  alt={editingProperty.title}
                  editorMode={editorMode}
                  aspectClass="h-full w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-deep-emerald/75 via-black/30 to-transparent pointer-events-none"></div>
              </div>

              <div className="relative z-10 px-margin-page max-w-7xl mx-auto w-full text-white">
                <div className="max-w-3xl">
                  <EditableText
                    value={editingProperty.intro.tag}
                    onChange={(val) => handleTextChange('intro.tag', val)}
                    tagName="span"
                    className="inline-block mb-4 px-4 py-1 rounded-full bg-secondary-container/20 border border-secondary-container/40 font-subhead-sm text-secondary-container uppercase tracking-widest"
                    editorMode={editorMode}
                    placeholder="Tag Badge"
                  />
                  <EditableText
                    value={editingProperty.title}
                    onChange={(val) => handleTextChange('title', val)}
                    tagName="h1"
                    className="font-display-lg text-display-lg-mobile md:text-display-lg mb-6 leading-tight drop-shadow-md"
                    editorMode={editorMode}
                    placeholder="Project Title"
                  />
                  <EditableText
                    value={editingProperty.subtitle}
                    onChange={(val) => handleTextChange('subtitle', val)}
                    tagName="p"
                    className="font-body-lg text-body-lg text-white/90 mb-10 max-w-xl drop-shadow-sm leading-relaxed"
                    isTextArea={true}
                    editorMode={editorMode}
                    placeholder="Hero Subtitle Tagline text..."
                  />
                  
                  <div className="flex flex-wrap gap-4 mt-8">
                    <button className="bg-primary hover:bg-secondary text-on-primary px-8 py-4 rounded-xl font-subhead-lg cursor-not-allowed opacity-80 shadow-md">
                      Schedule a Private Tour
                    </button>
                    <button className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-xl font-subhead-lg cursor-not-allowed opacity-80">
                      Explore Features
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* OVERVIEW SECTION */}
            <section id="overview" className="py-section-gap px-margin-page bg-surface-container-lowest scroll-mt-24 relative">
              <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 items-center">
                <div className="md:col-span-7 space-y-6">
                  <EditableText
                    value={editingProperty.intro.title}
                    onChange={(val) => handleTextChange('intro.title', val)}
                    tagName="h2"
                    className="font-headline-md text-headline-md text-primary"
                    editorMode={editorMode}
                    placeholder="Overview Section Title"
                  />
                  <div className="space-y-4 text-on-surface-variant font-body-lg leading-relaxed">
                    {editingProperty.intro.text.map((paragraph, index) => (
                      <EditableText
                        key={index}
                        value={paragraph}
                        onChange={(val) => handleArrayTextChange('intro.text', index, val)}
                        tagName="p"
                        className={index === 1 && editingProperty.id === 'east-west-breeze' ? 'font-bold text-primary italic' : ''}
                        isTextArea={true}
                        editorMode={editorMode}
                        placeholder={`Paragraph ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Intro Stats */}
                  <div className="grid grid-cols-2 gap-8 border-t border-outline-variant pt-8 mt-8">
                    {editingProperty.intro.stats.map((stat, idx) => (
                      <div key={idx} className="space-y-1">
                        <EditableText
                          value={stat.value}
                          onChange={(val) => handleNestedArrayTextChange('intro.stats', idx, 'value', val)}
                          tagName="div"
                          className="text-primary font-display-lg text-4xl font-bold"
                          editorMode={editorMode}
                          placeholder="Stat Value"
                        />
                        <EditableText
                          value={stat.label}
                          onChange={(val) => handleNestedArrayTextChange('intro.stats', idx, 'label', val)}
                          tagName="div"
                          className="font-subhead-sm text-outline uppercase tracking-wider"
                          editorMode={editorMode}
                          placeholder="Stat Label"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Overview Image */}
                <div className="md:col-span-5 relative mt-8 md:mt-0">
                  <div className="absolute -inset-4 bg-primary-fixed-dim/20 rounded-2xl -z-10 transition-all"></div>
                  <EditableImage
                    src={editingProperty.intro.image}
                    onChange={(val) => handleTextChange('intro.image', val)}
                    className="rounded-xl shadow-2xl w-full aspect-[4/3] object-cover relative z-10"
                    alt="Overview Illustration"
                    editorMode={editorMode}
                  />
                </div>
              </div>
            </section>

            {/* FACILITIES SECTION */}
            <section id="facilities" className="py-section-gap px-margin-page bg-surface scroll-mt-24">
              <div className="max-w-3xl mx-auto mb-12 text-center">
                <EditableText
                  value={editingProperty.facilities.title}
                  onChange={(val) => handleTextChange('facilities.title', val)}
                  tagName="h2"
                  className="font-headline-md text-headline-md text-primary mb-4"
                  editorMode={editorMode}
                  placeholder="Facilities Title"
                />
                <EditableText
                  value={editingProperty.facilities.subtitle}
                  onChange={(val) => handleTextChange('facilities.subtitle', val)}
                  tagName="p"
                  className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-6"
                  isTextArea={true}
                  editorMode={editorMode}
                  placeholder="Facilities Subtitle"
                />
                {editorMode === 'edit' && (
                  <button
                    onClick={handleAddFacilityItem}
                    className="bg-primary text-on-primary px-4 py-2 rounded-lg font-subhead-sm hover:bg-primary/90 transition-all cursor-pointer inline-flex items-center gap-1.5 text-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span> Add Facility Item
                  </button>
                )}
              </div>

              {/* Bento Grid layout */}
              {editingProperty.facilities.style === 'bento-ewb' ? (
                /* EWB layout */
                <div className="max-w-7xl mx-auto grid grid-rows-2 grid-flow-col auto-cols-[250px] md:auto-cols-[290px] gap-4 h-[450px] md:h-[600px] overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                  {editingProperty.facilities.items.map((facility, index) => {
                    const classes = index === 0 
                      ? 'row-span-2 col-span-2' 
                      : 'row-span-1 col-span-1';
                    
                    return (
                      <div 
                        key={facility.id || index}
                        className={`${classes} relative group overflow-hidden rounded-2xl shadow-lg h-full`}
                      >
                        <EditableImage
                          src={facility.image}
                          onChange={(val) => handleNestedArrayTextChange('facilities.items', index, 'image', val)}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          alt={facility.title}
                          editorMode={editorMode}
                          aspectClass="h-full w-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 pointer-events-none z-20">
                          <div className="w-full pointer-events-auto">
                            <EditableText
                              value={facility.title}
                              onChange={(val) => handleNestedArrayTextChange('facilities.items', index, 'title', val)}
                              tagName="h3"
                              className="font-headline-md text-white text-xl md:text-2xl"
                              editorMode={editorMode}
                              placeholder="Facility Title"
                            />
                          </div>
                        </div>
                        {editorMode === 'edit' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFacilityItem(index);
                            }}
                            className="absolute top-2 right-2 bg-error text-on-error p-1.5 rounded-full shadow-md z-30 cursor-pointer hover:bg-error/90 flex items-center justify-center"
                            title="Delete Item"
                          >
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Mountain View layout */
                <div className="max-w-7xl mx-auto grid grid-rows-2 grid-flow-col auto-cols-[250px] md:auto-cols-[290px] gap-4 h-[450px] md:h-[600px] overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                  {editingProperty.facilities.items.map((facility, index) => {
                    let classes = 'row-span-1 col-span-1';
                    if (index === 0) classes = 'row-span-2 col-span-2';
                    else if (index === 3) classes = 'row-span-1 col-span-2';
                    
                    return (
                      <div 
                        key={facility.id || index}
                        className={`${classes} relative overflow-hidden rounded-2xl group shadow-md h-full`}
                      >
                        <EditableImage
                          src={facility.image}
                          onChange={(val) => handleNestedArrayTextChange('facilities.items', index, 'image', val)}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          alt={facility.title}
                          editorMode={editorMode}
                          aspectClass="h-full w-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 pointer-events-none z-20">
                          <div className="w-full pointer-events-auto">
                            <EditableText
                              value={facility.title}
                              onChange={(val) => handleNestedArrayTextChange('facilities.items', index, 'title', val)}
                              tagName="h3"
                              className="font-headline-md text-white text-xl md:text-2xl"
                              editorMode={editorMode}
                              placeholder="Facility Title"
                            />
                          </div>
                        </div>
                        {editorMode === 'edit' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFacilityItem(index);
                            }}
                            className="absolute top-2 right-2 bg-error text-on-error p-1.5 rounded-full shadow-md z-30 cursor-pointer hover:bg-error/90 flex items-center justify-center"
                            title="Delete Item"
                          >
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* DEVELOPMENTS BENTO SECTION */}
            <section id="developments" className="py-section-gap px-margin-page bg-surface-container-low scroll-mt-24">
              <div className="max-w-7xl mx-auto text-center mb-16">
                <EditableText
                  value={editingProperty.developments.title}
                  onChange={(val) => handleTextChange('developments.title', val)}
                  tagName="h2"
                  className="font-headline-md text-headline-md text-primary mb-4"
                  editorMode={editorMode}
                  placeholder="Developments Title"
                />
                <EditableText
                  value={editingProperty.developments.subtitle}
                  onChange={(val) => handleTextChange('developments.subtitle', val)}
                  tagName="p"
                  className="font-body-lg text-on-surface-variant max-w-2xl mx-auto mb-6"
                  isTextArea={true}
                  editorMode={editorMode}
                  placeholder="Developments Subtitle"
                />
                {editorMode === 'edit' && (
                  <button
                    onClick={handleAddDevelopmentItem}
                    className="bg-primary text-on-primary px-4 py-2 rounded-lg font-subhead-sm hover:bg-primary/90 transition-all cursor-pointer inline-flex items-center gap-1.5 text-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span> Add Development Item
                  </button>
                )}
              </div>

              {editingProperty.developments?.style === 'bento-mv' ? (
                /* Mountain View Bento Developments Layout */
                <div className="max-w-7xl mx-auto grid grid-rows-2 grid-flow-col auto-cols-[250px] md:auto-cols-[290px] gap-4 h-[450px] md:h-[600px] overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                  {(editingProperty.developments.items || []).map((dev, index) => {
                    let classes = 'row-span-1 col-span-1';
                    if (index === 0) classes = 'row-span-2 col-span-2';
                    else if (index === 3) classes = 'row-span-1 col-span-2';
                    
                    return (
                      <div 
                        key={dev.id || index}
                        className={`${classes} relative group overflow-hidden rounded-2xl shadow-lg h-full`}
                      >
                        <EditableImage
                          src={dev.image}
                          onChange={(val) => handleNestedArrayTextChange('developments.items', index, 'image', val)}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          alt={dev.title}
                          editorMode={editorMode}
                          aspectClass="h-full w-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 pointer-events-none z-20">
                          <div className="w-full pointer-events-auto">
                            <EditableText
                              value={dev.title}
                              onChange={(val) => handleNestedArrayTextChange('developments.items', index, 'title', val)}
                              tagName="h3"
                              className="font-headline-md text-white text-xl md:text-2xl"
                              editorMode={editorMode}
                              placeholder="Development Title"
                            />
                          </div>
                        </div>
                        {editorMode === 'edit' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDevelopmentItem(index);
                            }}
                            className="absolute top-2 right-2 bg-error text-on-error p-1.5 rounded-full shadow-md z-30 cursor-pointer hover:bg-error/90 flex items-center justify-center"
                            title="Delete Item"
                          >
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* EWB Bento Developments Layout */
                <div className="max-w-7xl mx-auto grid grid-rows-2 grid-flow-col auto-cols-[250px] md:auto-cols-[290px] gap-4 h-[450px] md:h-[600px] overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                  {(editingProperty.developments?.items || []).map((dev, index) => {
                    const classes = index === 0 
                      ? 'row-span-2 col-span-2' 
                      : 'row-span-1 col-span-1';
                    
                    return (
                      <div 
                        key={dev.id || index}
                        className={`${classes} relative group overflow-hidden rounded-2xl shadow-lg h-full`}
                      >
                        <EditableImage
                          src={dev.image}
                          onChange={(val) => handleNestedArrayTextChange('developments.items', index, 'image', val)}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          alt={dev.title}
                          editorMode={editorMode}
                          aspectClass="h-full w-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 pointer-events-none z-20">
                          <div className="w-full pointer-events-auto">
                            <EditableText
                              value={dev.title}
                              onChange={(val) => handleNestedArrayTextChange('developments.items', index, 'title', val)}
                              tagName="h3"
                              className="font-headline-md text-white text-xl md:text-2xl"
                              editorMode={editorMode}
                              placeholder="Development Title"
                            />
                          </div>
                        </div>
                        {editorMode === 'edit' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDevelopmentItem(index);
                            }}
                            className="absolute top-2 right-2 bg-error text-on-error p-1.5 rounded-full shadow-md z-30 cursor-pointer hover:bg-error/90 flex items-center justify-center"
                            title="Delete Item"
                          >
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* INVESTMENT SECTION */}
            <section id="invest" className="py-section-gap px-margin-page bg-surface scroll-mt-24">
              {editingProperty.investment.style === 'bento-ewb-inv' ? (
                /* EWB bento investment format */
                <div className="max-w-7xl mx-auto">
                  <EditableText
                    value={editingProperty.investment.title}
                    onChange={(val) => handleTextChange('investment.title', val)}
                    tagName="h2"
                    className="font-headline-md text-headline-md text-primary mb-12 text-center"
                    editorMode={editorMode}
                    placeholder="Investment Title"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Large Item */}
                    <div className="col-span-12 md:col-span-8 bg-primary rounded-3xl p-8 md:p-12 text-on-primary relative overflow-hidden flex flex-col justify-between min-h-[350px]">
                      <div className="relative z-10 w-full">
                        <span className="material-symbols-outlined text-secondary-container text-5xl mb-6">
                          {editingProperty.investment.items[0].icon}
                        </span>
                        <EditableText
                          value={editingProperty.investment.items[0].title}
                          onChange={(val) => handleNestedArrayTextChange('investment.items', 0, 'title', val)}
                          tagName="h3"
                          className="font-headline-md text-3xl mb-4"
                          editorMode={editorMode}
                          placeholder="Investment Title"
                        />
                        <EditableText
                          value={editingProperty.investment.items[0].description}
                          onChange={(val) => handleNestedArrayTextChange('investment.items', 0, 'description', val)}
                          tagName="p"
                          className="font-body-lg opacity-85 max-w-lg leading-relaxed"
                          isTextArea={true}
                          editorMode={editorMode}
                          placeholder="Investment Description"
                        />
                      </div>
                      <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10 select-none pointer-events-none">
                        <span className="material-symbols-outlined text-[300px]">finance_chip</span>
                      </div>
                    </div>

                    {/* Small Item 1 */}
                    <div className="col-span-12 md:col-span-4 bg-tertiary rounded-3xl p-8 text-on-tertiary flex flex-col justify-center min-h-[250px]">
                      <EditableText
                        value={editingProperty.investment.items[1].title}
                        onChange={(val) => handleNestedArrayTextChange('investment.items', 1, 'title', val)}
                        tagName="h3"
                        className="font-headline-md text-2xl mb-4"
                        editorMode={editorMode}
                        placeholder="Investment Title"
                      />
                      <EditableText
                        value={editingProperty.investment.items[1].description}
                        onChange={(val) => handleNestedArrayTextChange('investment.items', 1, 'description', val)}
                        tagName="p"
                        className="font-body-md opacity-85 leading-relaxed"
                        isTextArea={true}
                        editorMode={editorMode}
                        placeholder="Investment Description"
                      />
                    </div>

                    {/* Small Item 2 */}
                    <div className="col-span-12 md:col-span-4 bg-surface-container-high border border-outline-variant/40 rounded-3xl p-8 flex flex-col justify-between min-h-[250px]">
                      <div>
                        <span className="material-symbols-outlined text-primary text-4xl mb-4">
                          {editingProperty.investment.items[2].icon}
                        </span>
                        <EditableText
                          value={editingProperty.investment.items[2].title}
                          onChange={(val) => handleNestedArrayTextChange('investment.items', 2, 'title', val)}
                          tagName="h3"
                          className="font-subhead-lg text-primary uppercase tracking-wider mb-2"
                          editorMode={editorMode}
                          placeholder="Investment Title"
                        />
                        <EditableText
                          value={editingProperty.investment.items[2].description}
                          onChange={(val) => handleNestedArrayTextChange('investment.items', 2, 'description', val)}
                          tagName="p"
                          className="text-on-surface-variant font-body-md leading-relaxed"
                          isTextArea={true}
                          editorMode={editorMode}
                          placeholder="Investment Description"
                        />
                      </div>
                    </div>

                    {/* Medium Item */}
                    <div className="col-span-12 md:col-span-8 bg-secondary-container rounded-3xl p-8 md:p-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-10 min-h-[250px]">
                      <div className="hidden sm:flex w-24 h-24 bg-white/40 rounded-full flex-shrink-0 items-center justify-center text-on-secondary-container pointer-events-none">
                        <span className="material-symbols-outlined text-5xl">
                          {editingProperty.investment.items[3].icon}
                        </span>
                      </div>
                      <div className="w-full">
                        <EditableText
                          value={editingProperty.investment.items[3].title}
                          onChange={(val) => handleNestedArrayTextChange('investment.items', 3, 'title', val)}
                          tagName="h3"
                          className="font-headline-md text-on-secondary-container text-2xl mb-3"
                          editorMode={editorMode}
                          placeholder="Investment Title"
                        />
                        <EditableText
                          value={editingProperty.investment.items[3].description}
                          onChange={(val) => handleNestedArrayTextChange('investment.items', 3, 'description', val)}
                          tagName="p"
                          className="text-on-secondary-container/85 font-body-md leading-relaxed"
                          isTextArea={true}
                          editorMode={editorMode}
                          placeholder="Investment Description"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Mountain View asymmetric images format */
                <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-16 items-center">
                  <div className="md:col-span-6 space-y-8">
                    <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest">Investment</span>
                    
                    <EditableText
                      value={editingProperty.investment.title}
                      onChange={(val) => handleTextChange('investment.title', val)}
                      tagName="h2"
                      className="font-headline-md text-headline-md text-primary leading-tight"
                      editorMode={editorMode}
                      placeholder="Investment Title"
                    />
                    <EditableText
                      value={editingProperty.investment.description}
                      onChange={(val) => handleTextChange('investment.description', val)}
                      tagName="p"
                      className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed"
                      isTextArea={true}
                      editorMode={editorMode}
                      placeholder="Investment Description"
                    />
                    
                    <ul className="space-y-6">
                      {editingProperty.investment.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-4">
                          <span className="material-symbols-outlined text-primary bg-[#E8F5F0] p-2.5 rounded-lg shrink-0">
                            {item.icon}
                          </span>
                          <div className="w-full">
                            <EditableText
                              value={item.title}
                              onChange={(val) => handleNestedArrayTextChange('investment.items', idx, 'title', val)}
                              tagName="span"
                              className="font-subhead-lg text-subhead-lg text-slate-text block mb-1"
                              editorMode={editorMode}
                              placeholder="Item Title"
                            />
                            <EditableText
                              value={item.description}
                              onChange={(val) => handleNestedArrayTextChange('investment.items', idx, 'description', val)}
                              tagName="span"
                              className="font-body-md text-body-md text-on-surface-variant leading-relaxed block"
                              isTextArea={true}
                              editorMode={editorMode}
                              placeholder="Item Description"
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Asymmetric 4 images */}
                  <div className="md:col-span-6 grid grid-cols-2 gap-4">
                    {editingProperty.investment.images.map((imgUrl, idx) => {
                      const divClasses = idx === 2 || idx === 3 ? 'pt-12' : '';
                      const imgRatio = idx === 0 || idx === 3 ? 'aspect-square' : 'aspect-[3/4]';
                      
                      return (
                        <div 
                          key={idx}
                          className={`${divClasses} relative overflow-hidden rounded-xl shadow-xl hover:scale-[1.01] transition-transform duration-300`}
                        >
                          <EditableImage
                            src={imgUrl}
                            onChange={(res) => handleArrayTextChange('investment.images', idx, res)}
                            className={`w-full ${imgRatio} object-cover`}
                            alt={`Grid Item ${idx + 1}`}
                            editorMode={editorMode}
                            aspectClass="h-full w-full"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>

            {/* INQUIRY SECTION (Read-only mockup in editor) */}
            <section id="inquire" className="py-section-gap px-margin-page bg-surface-container-lowest scroll-mt-24">
              <div className="max-w-7xl mx-auto opacity-75">
                <div className="bg-deep-emerald rounded-3xl overflow-hidden flex flex-col lg:flex-row shadow-2xl">
                  <div className="lg:w-1/2 p-12 md:p-20 text-white flex flex-col justify-between">
                    <div>
                      <span className="inline-block mb-4 px-3 py-1 rounded-full bg-secondary-container/10 border border-secondary-container/20 font-label-caps text-secondary-container uppercase tracking-widest text-[10px]">
                        trippings & price list
                      </span>
                      <h2 className="font-display-lg text-4xl md:text-5xl mb-6 leading-tight">
                        Begin Your Journey Today
                      </h2>
                      <p className="font-body-lg text-white/70 mb-10 leading-relaxed max-w-md">
                        Our dedicated property consultants are ready to help you find the perfect lot.
                      </p>
                    </div>
                  </div>
                  <div className="lg:w-1/2 bg-white p-12 md:p-20 flex items-center justify-center font-bold text-primary">
                    [Inquiry Form Mockup - Active in User View]
                  </div>
                </div>
              </div>
            </section>
          </div>

          <Footer />
        </div>
      )}
    </div>
  );
}
