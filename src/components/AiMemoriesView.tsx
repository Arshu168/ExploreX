import React, { useState, useRef } from 'react';
import { 
  BookOpen, 
  Copy, 
  Check, 
  FileText, 
  PenTool, 
  Plus, 
  Sparkles, 
  X,
  Image as ImageIcon,
  UploadCloud,
  Trash2,
  Edit3,
  Save,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Calendar,
  Wand2,
  Link as LinkIcon,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { Memory, Trip } from '../types';

interface AiMemoriesViewProps {
  memories: Memory[];
  trips?: Trip[];
  activeTrip?: Trip | null;
  onUpdateMemory: (updatedMemory: Memory) => void;
  onGenerateNewMemory: (tripTitle: string, tripId?: string, photos?: string[], initialDiary?: string) => void;
  onDeleteMemory?: (memoryId: string) => void;
}

export const AiMemoriesView: React.FC<AiMemoriesViewProps> = ({
  memories,
  trips = [],
  activeTrip,
  onUpdateMemory,
  onGenerateNewMemory,
  onDeleteMemory,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedMemoryId, setSelectedMemoryId] = useState<string>(memories[0]?.id || '');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTripTitleInput, setNewTripTitleInput] = useState('');
  const [newTripIdInput, setNewTripIdInput] = useState(activeTrip?.id || '');
  const [newTripPhotosInput, setNewTripPhotosInput] = useState<string[]>([]);
  
  // Diary editing state
  const [isEditingDiary, setIsEditingDiary] = useState(false);
  const [editedDiaryText, setEditedDiaryText] = useState('');
  const [diarySaveFeedback, setDiarySaveFeedback] = useState(false);

  // Blog article editing state
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [editedBlogText, setEditedBlogText] = useState('');
  const [blogSaveFeedback, setBlogSaveFeedback] = useState(false);

  // Photo upload & Lightbox states
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isDraggingPhotos, setIsDraggingPhotos] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Find currently selected memory or default to first
  const selectedMemory = memories.find(m => m.id === selectedMemoryId) || memories[0];

  // Helper to ensure photo list exists
  const currentPhotos: string[] = selectedMemory?.photos && selectedMemory.photos.length > 0 
    ? selectedMemory.photos 
    : (selectedMemory?.highlightPhoto ? [selectedMemory.highlightPhoto] : []);

  // Update selected memory ID when memories change if current is deleted/not found
  React.useEffect(() => {
    if (selectedMemoryId && !memories.some(m => m.id === selectedMemoryId)) {
      setSelectedMemoryId(memories[0]?.id || '');
    } else if (!selectedMemoryId && memories.length > 0) {
      setSelectedMemoryId(memories[0].id);
    }
  }, [memories, selectedMemoryId]);

  // Sync edit buffers when memory changes
  React.useEffect(() => {
    if (selectedMemory) {
      setEditedDiaryText(selectedMemory.diaryEntry);
      setEditedBlogText(selectedMemory.blogPost);
      setIsEditingDiary(false);
      setIsEditingBlog(false);
    }
  }, [selectedMemory?.id]);

  const handleCopyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleStartEditDiary = () => {
    if (!selectedMemory) return;
    setEditedDiaryText(selectedMemory.diaryEntry);
    setIsEditingDiary(true);
  };

  const handleSaveDiary = () => {
    if (!selectedMemory) return;
    const updated: Memory = {
      ...selectedMemory,
      diaryEntry: editedDiaryText.trim() || selectedMemory.diaryEntry
    };
    onUpdateMemory(updated);
    setIsEditingDiary(false);
    setDiarySaveFeedback(true);
    setTimeout(() => setDiarySaveFeedback(false), 2500);
  };

  const handleAiPolishDiary = () => {
    if (!editedDiaryText) return;
    // Enhance the travel diary with richer sensory prose & reflections
    const polished = `${editedDiaryText.trim()}\n\nReflecting back on the quiet trails and golden afternoon light, every small discovery reminded us why we travel — not just for the destinations, but for the untamed rhythm of the journey itself.`;
    setEditedDiaryText(polished);
  };

  const handleStartEditBlog = () => {
    if (!selectedMemory) return;
    setEditedBlogText(selectedMemory.blogPost);
    setIsEditingBlog(true);
  };

  const handleSaveBlog = () => {
    if (!selectedMemory) return;
    const updated: Memory = {
      ...selectedMemory,
      blogPost: editedBlogText.trim() || selectedMemory.blogPost
    };
    onUpdateMemory(updated);
    setIsEditingBlog(false);
    setBlogSaveFeedback(true);
    setTimeout(() => setBlogSaveFeedback(false), 2500);
  };

  // Handle uploading multiple files
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0 || !selectedMemory) return;

    const fileArray = Array.from(files);
    const readers = fileArray.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            resolve(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(newImages => {
      if (newImages.length === 0) return;
      const existing = selectedMemory.photos || (selectedMemory.highlightPhoto ? [selectedMemory.highlightPhoto] : []);
      const updatedPhotos = [...existing, ...newImages];
      
      const updated: Memory = {
        ...selectedMemory,
        photos: updatedPhotos,
        highlightPhoto: selectedMemory.highlightPhoto || newImages[0]
      };
      onUpdateMemory(updated);
      setShowAddPhotoModal(false);
    });
  };

  // Handle adding photo via URL
  const handleAddPhotoByUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim() || !selectedMemory) return;

    const existing = selectedMemory.photos || (selectedMemory.highlightPhoto ? [selectedMemory.highlightPhoto] : []);
    const updatedPhotos = [...existing, newPhotoUrl.trim()];
    
    const updated: Memory = {
      ...selectedMemory,
      photos: updatedPhotos,
      highlightPhoto: selectedMemory.highlightPhoto || newPhotoUrl.trim()
    };
    onUpdateMemory(updated);
    setNewPhotoUrl('');
    setShowAddPhotoModal(false);
  };

  // Preset sample photo add
  const handleAddPresetPhoto = (url: string) => {
    if (!selectedMemory) return;
    const existing = selectedMemory.photos || (selectedMemory.highlightPhoto ? [selectedMemory.highlightPhoto] : []);
    if (existing.includes(url)) return;
    const updatedPhotos = [...existing, url];
    
    const updated: Memory = {
      ...selectedMemory,
      photos: updatedPhotos,
      highlightPhoto: selectedMemory.highlightPhoto || url
    };
    onUpdateMemory(updated);
  };

  // Delete photo from memory
  const handleDeletePhoto = (photoIndex: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!selectedMemory) return;

    const existing = [...currentPhotos];
    const removedPhoto = existing[photoIndex];
    existing.splice(photoIndex, 1);

    let newHighlight = selectedMemory.highlightPhoto;
    if (newHighlight === removedPhoto) {
      newHighlight = existing.length > 0 ? existing[0] : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';
    }

    const updated: Memory = {
      ...selectedMemory,
      photos: existing,
      highlightPhoto: newHighlight
    };
    onUpdateMemory(updated);

    if (lightboxIndex !== null) {
      if (existing.length === 0) {
        setLightboxIndex(null);
      } else if (lightboxIndex >= existing.length) {
        setLightboxIndex(existing.length - 1);
      }
    }
  };

  // Set photo as highlight cover
  const handleSetHighlight = (photoUrl: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!selectedMemory) return;

    const updated: Memory = {
      ...selectedMemory,
      highlightPhoto: photoUrl
    };
    onUpdateMemory(updated);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTripTitleInput.trim()) return;

    onGenerateNewMemory(
      newTripTitleInput.trim(), 
      newTripIdInput || undefined,
      newTripPhotosInput.length > 0 ? newTripPhotosInput : undefined
    );
    setNewTripTitleInput('');
    setNewTripPhotosInput([]);
    setShowCreateModal(false);
  };

  // Preset photo suggestions for easy one-click add
  const SAMPLE_PRESETS = [
    { name: 'Misty Mountains', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
    { name: 'Emerald Valleys', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80' },
    { name: 'Heritage Trail', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80' },
    { name: 'Secret Waterfall', url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80' },
    { name: 'Sunset Horizon', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80' },
    { name: 'Forest Path', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80' },
  ];

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto font-sans">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">AI Trip Memories & Travel Journal</h1>
            <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Trip Album & Diary
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-medium">
            Capture multiple trip photos, write & edit personal travel diaries, and auto-generate blog articles with social captions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Story</span>
          </button>
        </div>
      </div>

      {/* Memory Switcher & Trip Filter */}
      {memories.length > 0 ? (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {memories.map(m => {
            const isSelected = selectedMemory?.id === m.id;
            const photoCount = m.photos?.length || (m.highlightPhoto ? 1 : 0);
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMemoryId(m.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <BookOpen className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                <span className="max-w-[200px] truncate">{m.tripTitle}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                  📸 {photoCount}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-10 text-center space-y-4 shadow-2xs max-w-lg mx-auto">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">No Trip Memories Yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Start by generating a travel diary and photo album for your upcoming or completed trips.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-xs transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create First Trip Memory</span>
          </button>
        </div>
      )}

      {selectedMemory && (
        <div className="space-y-6">
          {/* Cover Hero Banner with Trip Details */}
          <div className="relative rounded-3xl overflow-hidden h-64 border border-slate-200/80 shadow-2xs group">
            <img 
              src={selectedMemory.highlightPhoto || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'} 
              alt={selectedMemory.tripTitle} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent" />
            
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={() => setShowAddPhotoModal(true)}
                className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-xs hover:bg-white text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
                <span>Add Photos</span>
              </button>
              {onDeleteMemory && memories.length > 1 && (
                <button
                  onClick={() => {
                    if (window.confirm(`Delete the memories for "${selectedMemory.tripTitle}"?`)) {
                      onDeleteMemory(selectedMemory.id);
                    }
                  }}
                  className="p-1.5 rounded-xl bg-red-600/80 backdrop-blur-xs hover:bg-red-600 text-white text-xs font-bold transition"
                  title="Delete memory"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-white flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-blue-300 font-bold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{selectedMemory.tripTitle}</span>
                  <span>•</span>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{selectedMemory.date}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{selectedMemory.tripTitle}</h2>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-white border border-white/20">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{currentPhotos.length} {currentPhotos.length === 1 ? 'Photo' : 'Photos'} in Album</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION: TRIP PHOTO GALLERY (ONE OR MULTIPLE IMAGES) */}
          {/* ========================================================================= */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Trip Photo Album</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold">
                    {currentPhotos.length} {currentPhotos.length === 1 ? 'Photo' : 'Photos'}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Upload multiple photos from your trip. Click any photo to enlarge or set as cover.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddPhotoModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Photos</span>
                </button>
              </div>
            </div>

            {/* Photos Grid */}
            {currentPhotos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {currentPhotos.map((photo, idx) => {
                  const isCover = photo === selectedMemory.highlightPhoto;
                  return (
                    <div 
                      key={idx}
                      onClick={() => setLightboxIndex(idx)}
                      className="group relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer shadow-2xs hover:shadow-md transition"
                    >
                      <img 
                        src={photo} 
                        alt={`Trip Photo ${idx + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      
                      {/* Cover Badge */}
                      {isCover && (
                        <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-0.5 rounded-lg text-[10px] font-extrabold flex items-center gap-1 shadow-xs">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>Cover</span>
                        </div>
                      )}

                      {/* Hover Overlay Controls */}
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxIndex(idx);
                          }}
                          className="p-1.5 rounded-lg bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 hover:bg-white dark:hover:bg-slate-800 transition"
                          title="View larger"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                        
                        {!isCover && (
                          <button
                            onClick={(e) => handleSetHighlight(photo, e)}
                            className="p-1.5 rounded-lg bg-white/90 dark:bg-slate-900/90 text-amber-600 dark:text-amber-400 hover:bg-white dark:hover:bg-slate-800 transition"
                            title="Set as Cover Photo"
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={(e) => handleDeletePhoto(idx, e)}
                          className="p-1.5 rounded-lg bg-white/90 dark:bg-slate-900/90 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Quick Add Card Slot */}
                <div 
                  onClick={() => setShowAddPhotoModal(true)}
                  className="aspect-4/3 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 flex flex-col items-center justify-center cursor-pointer transition p-3 text-center"
                >
                  <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-blue-500 mb-1" />
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">+ Add More</span>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => setShowAddPhotoModal(true)}
                className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 rounded-2xl p-8 text-center cursor-pointer bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50/30 transition space-y-2"
              >
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mx-auto">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">No photos added to this trip memory yet</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Click to upload photos or select from presets</p>
              </div>
            )}

            {/* Preset quick pills */}
            <div className="pt-2 flex flex-wrap items-center gap-1.5 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> Quick Add Scenic Presets:
              </span>
              {SAMPLE_PRESETS.map((preset, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => handleAddPresetPhoto(preset.url)}
                  className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/60 hover:text-blue-600 dark:hover:text-blue-300 text-slate-700 dark:text-slate-300 transition"
                >
                  + {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION: PERSONAL TRAVEL DIARY (WITH EDITING CAPABILITIES) */}
          {/* ========================================================================= */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Personal Travel Diary</h3>
                {diarySaveFeedback && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Saved!
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {!isEditingDiary ? (
                  <>
                    <button
                      onClick={() => handleCopyText(selectedMemory.diaryEntry, 99)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      {copiedIndex === 99 ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIndex === 99 ? "Copied!" : "Copy"}</span>
                    </button>
                    <button
                      onClick={handleStartEditDiary}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/80 text-blue-600 dark:text-blue-300 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Diary</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditedDiaryText(selectedMemory.diaryEntry);
                        setIsEditingDiary(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAiPolishDiary}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/80 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 transition"
                      title="Add poetic sensory reflections"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>✨ AI Enhance</span>
                    </button>
                    <button
                      onClick={handleSaveDiary}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Diary</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Diary Content or Editable Textarea */}
            {!isEditingDiary ? (
              <div 
                onClick={handleStartEditDiary}
                className="group relative cursor-pointer"
                title="Click to edit diary entry"
              >
                <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed italic font-serif bg-slate-50/80 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 group-hover:border-blue-300 dark:group-hover:border-blue-600 transition">
                  "{selectedMemory.diaryEntry}"
                </p>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-2 py-1 rounded-lg text-[10px] font-bold text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 flex items-center gap-1 shadow-2xs">
                  <Edit3 className="w-3 h-3" />
                  <span>Click to Edit</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={editedDiaryText}
                  onChange={(e) => setEditedDiaryText(e.target.value)}
                  rows={6}
                  placeholder="Write your personal reflections, emotions, memorable moments, and sensory details..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-blue-400 dark:border-blue-500 rounded-2xl p-4 text-slate-800 dark:text-slate-100 text-sm leading-relaxed font-serif focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                  autoFocus
                />
                <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 px-1">
                  <span>{editedDiaryText.length} characters • {editedDiaryText.split(/\s+/).filter(Boolean).length} words</span>
                  <span className="italic">Pro-tip: Click "✨ AI Enhance" to enrich with vivid sensory details.</span>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* SECTION: AI GENERATED BLOG ARTICLE (WITH EDITING CAPABILITIES) */}
          {/* ========================================================================= */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">AI Generated Blog Article</h3>
                {blogSaveFeedback && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Saved!
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {!isEditingBlog ? (
                  <>
                    <button
                      onClick={() => handleCopyText(selectedMemory.blogPost, 88)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      {copiedIndex === 88 ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIndex === 88 ? "Copied!" : "Copy Post"}</span>
                    </button>
                    <button
                      onClick={handleStartEditBlog}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/80 text-blue-600 dark:text-blue-300 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Article</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditedBlogText(selectedMemory.blogPost);
                        setIsEditingBlog(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveBlog}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Article</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {!isEditingBlog ? (
              <pre className="text-slate-800 dark:text-slate-200 text-xs leading-relaxed font-mono bg-slate-50 dark:bg-slate-800/70 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 whitespace-pre-wrap overflow-x-auto max-h-96">
                {selectedMemory.blogPost}
              </pre>
            ) : (
              <textarea
                value={editedBlogText}
                onChange={(e) => setEditedBlogText(e.target.value)}
                rows={12}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-blue-400 dark:border-blue-500 rounded-2xl p-4 text-slate-800 dark:text-slate-100 text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
              />
            )}
          </div>

          {/* ========================================================================= */}
          {/* SECTION: SOCIAL MEDIA CAPTIONS */}
          {/* ========================================================================= */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xs">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Social Media Captions & Hashtags</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedMemory.socialCaptions.map((sc, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 p-4 rounded-2xl space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="font-extrabold text-xs text-blue-600 dark:text-blue-400 block">{sc.platform}</span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug font-medium">"{sc.text}"</p>
                    <div className="flex flex-wrap gap-1">
                      {sc.hashtags.map((ht, hIdx) => (
                        <span key={hIdx} className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-bold">
                          {ht}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyText(`${sc.text}\n\n${sc.hashtags.join(' ')}`, idx)}
                    className="w-full mt-2 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition shadow-2xs"
                  >
                    {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIndex === idx ? "Copied!" : "Copy Caption"}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD PHOTOS (SINGLE OR MULTIPLE / DRAG & DROP / URL) */}
      {/* ========================================================================= */}
      {showAddPhotoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-xl text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Add Trip Photos</h3>
              </div>
              <button 
                onClick={() => setShowAddPhotoModal(false)} 
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />

            {/* Drag & drop / upload zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingPhotos(true);
              }}
              onDragLeave={() => setIsDraggingPhotos(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingPhotos(false);
                handleFileUpload(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition space-y-2 ${
                isDraggingPhotos 
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40' 
                  : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50/20'
              }`}
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  Click to browse or drag & drop one or multiple images
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Supports JPG, PNG, WEBP (Batch selection enabled)
                </p>
              </div>
            </div>

            {/* Or Paste URL Form */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Or add via Image Link / URL</span>
              </label>
              <form onSubmit={handleAddPhotoByUrl} className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 font-medium text-slate-800 dark:text-slate-100"
                />
                <button
                  type="submit"
                  disabled={!newPhotoUrl.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-2xs transition"
                >
                  Add
                </button>
              </form>
            </div>

            {/* Presets */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">Sample High-Resolution Presets:</span>
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_PRESETS.slice(0, 3).map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      handleAddPresetPhoto(preset.url);
                      setShowAddPhotoModal(false);
                    }}
                    className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-800 text-left transition group"
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-12 object-cover rounded-lg mb-1" />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddPhotoModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PHOTO LIGHTBOX (FULL-SCREEN PREVIEW) */}
      {/* ========================================================================= */}
      {lightboxIndex !== null && currentPhotos[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 text-white animate-in fade-in">
          {/* Lightbox Topbar */}
          <div className="w-full max-w-5xl flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-300">
                Photo {lightboxIndex + 1} of {currentPhotos.length}
              </span>
              {currentPhotos[lightboxIndex] === selectedMemory?.highlightPhoto && (
                <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-current" /> Cover Photo
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSetHighlight(currentPhotos[lightboxIndex])}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span>Set as Cover</span>
              </button>
              <button
                onClick={() => handleDeletePhoto(lightboxIndex)}
                className="px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
              <button
                onClick={() => setLightboxIndex(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Main Image & Navigation Arrows */}
          <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center py-4">
            {currentPhotos.length > 1 && (
              <button
                onClick={() => setLightboxIndex((lightboxIndex - 1 + currentPhotos.length) % currentPhotos.length)}
                className="absolute left-2 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white transition backdrop-blur-xs z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img
              src={currentPhotos[lightboxIndex]}
              alt={`Trip memory view ${lightboxIndex + 1}`}
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />

            {currentPhotos.length > 1 && (
              <button
                onClick={() => setLightboxIndex((lightboxIndex + 1) % currentPhotos.length)}
                className="absolute right-2 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white transition backdrop-blur-xs z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Lightbox Thumbnails Strip */}
          {currentPhotos.length > 1 && (
            <div className="w-full max-w-2xl flex items-center justify-center gap-2 overflow-x-auto py-2">
              {currentPhotos.map((p, idx) => (
                <img
                  key={idx}
                  src={p}
                  alt="Thumb"
                  onClick={() => setLightboxIndex(idx)}
                  className={`w-12 h-12 object-cover rounded-xl cursor-pointer border-2 transition ${
                    idx === lightboxIndex ? 'border-blue-500 scale-105' : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: GENERATE NEW MEMORY */}
      {/* ========================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Generate Trip Story & Diary</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs font-medium">
              {/* Trip Selector if trips available */}
              {trips.length > 0 && (
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Select from Your Trips</label>
                  <select
                    value={newTripIdInput}
                    onChange={(e) => {
                      const tId = e.target.value;
                      setNewTripIdInput(tId);
                      const tObj = trips.find(t => t.id === tId);
                      if (tObj) {
                        setNewTripTitleInput(tObj.title);
                      }
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-100"
                  >
                    <option value="" className="dark:bg-slate-800">-- Choose a planned trip --</option>
                    {trips.map(t => (
                      <option key={t.id} value={t.id} className="dark:bg-slate-800">{t.title} ({t.region})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Trip Destination or Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kyoto Zen Gardens & Bamboo Groves"
                  value={newTripTitleInput}
                  onChange={(e) => setNewTripTitleInput(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 font-semibold text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800/70 text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                ✨ ExploreX AI will craft a personalized travel diary, blog article, and platform-specific social captions with hashtags.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs flex items-center gap-1.5 transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Story</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
