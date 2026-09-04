import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  FileText, 
  Cpu, 
  ExternalLink,
  Plus,
  X
} from 'lucide-react';
import { RagDocument } from '../types';
import { indexDocumentInRag } from '../utils/apiClient';

interface RagVisualizerViewProps {
  documents: RagDocument[];
}

export const RagVisualizerView: React.FC<RagVisualizerViewProps> = ({ documents: initialDocs }) => {
  const [docList, setDocList] = useState<RagDocument[]>(initialDocs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<RagDocument>(initialDocs[0]);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(0);

  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSource, setNewSource] = useState('');
  const [newCategory, setNewCategory] = useState('Travel Archive');
  const [newContent, setNewContent] = useState('');

  const filteredDocs = docList.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDocSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const docId = `doc-${Date.now()}`;
    const newDoc: RagDocument = {
      id: docId,
      title: newTitle,
      source: newSource || 'Custom Vector Document',
      url: '#',
      category: newCategory,
      credibilityRating: 9.8,
      excerpt: newContent.slice(0, 100) + '...',
      content: newContent
    };

    setDocList([newDoc, ...docList]);
    setSelectedDoc(newDoc);
    setNewTitle('');
    setNewSource('');
    setNewContent('');
    setShowAddDocModal(false);

    // Call FastAPI backend to index in ChromaDB
    try {
      await indexDocumentInRag(docId, newTitle, newContent);
    } catch (err) {
      console.warn('Backend offline, document indexed locally in state:', err);
    }
  };

  const workflowSteps = [
    {
      step: 1,
      title: "User Prompt Input",
      desc: "User asks for hidden spots, luxury escapes, or photography trails.",
      icon: Search,
      color: "bg-blue-600 text-white"
    },
    {
      step: 2,
      title: "Vector Search Embedding",
      desc: "Prompt is embedded and matched against ChromaDB vector index.",
      icon: Database,
      color: "bg-purple-600 text-white"
    },
    {
      step: 3,
      title: "Curated Knowledge Retrieval",
      desc: "Top relevant travel archives & journal records retrieved.",
      icon: FileText,
      color: "bg-amber-600 text-white"
    },
    {
      step: 4,
      title: "Context Augmentation & LLM",
      desc: "Retrieved facts injected into Gemini context for hallucination-free generation.",
      icon: Cpu,
      color: "bg-emerald-600 text-white"
    }
  ];

  return (
    <div className="space-y-6 pb-12 font-sans max-w-6xl mx-auto text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">RAG Knowledge Engine</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 font-medium">
            Understand how ExploreX AI queries curated travel knowledge instead of relying solely on general LLM outputs.
          </p>
        </div>

        <button
          onClick={() => setShowAddDocModal(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Knowledge</span>
        </button>
      </div>

      {/* RAG Processing Pipeline */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xs">
        <h2 className="font-extrabold text-slate-900 dark:text-white text-lg">RAG Processing Pipeline</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {workflowSteps.map((ws, idx) => {
            const Icon = ws.icon;
            const isActive = activeWorkflowStep === idx;
            return (
              <div
                key={ws.step}
                onClick={() => setActiveWorkflowStep(idx)}
                className={`p-5 rounded-2xl border cursor-pointer transition space-y-3 ${
                  isActive
                    ? 'bg-blue-50/50 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl ${ws.color} flex items-center justify-center font-bold shadow-xs`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div>
                  <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Step 0{ws.step}</span>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">{ws.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-snug mt-1">{ws.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Curated Knowledge Base Browser */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-extrabold text-slate-900 dark:text-white text-lg">Indexed Knowledge Base Documents</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Verified travel archives, forestry protocols, and field notes</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search knowledge vectors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Document Selection List */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  selectedDoc?.id === doc.id
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-900 dark:text-blue-200 shadow-2xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400 mb-1">
                  <span className="font-extrabold uppercase text-blue-600 dark:text-blue-400">{doc.category}</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">★ {doc.credibilityRating}/10</span>
                </div>
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white line-clamp-1">{doc.title}</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium line-clamp-2 mt-1">{doc.excerpt}</p>
              </div>
            ))}

            {filteredDocs.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400 font-medium border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                No indexed documents match "{searchQuery}"
              </div>
            )}
          </div>

          {/* Selected Document Details Viewer */}
          {selectedDoc && (
            <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800">
                    {selectedDoc.category}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-1">{selectedDoc.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{selectedDoc.source}</p>
                </div>

                <a
                  href={selectedDoc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition shadow-2xs"
                >
                  <span>Source</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Excerpt & Vector Payload</span>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 font-mono whitespace-pre-wrap">
                  {selectedDoc.content}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Custom Knowledge Document Modal */}
      {showAddDocModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-xl text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Index Custom Knowledge Document</h3>
              <button onClick={() => setShowAddDocModal(false)} className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDocSubmit} className="space-y-3 text-xs font-medium">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kyoto Private Shrine Access Protocols"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Source Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Kyoto Cultural Heritage Bureau"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-bold"
                  >
                    <option value="Travel Archive">Travel Archive</option>
                    <option value="Forestry & Trails">Forestry & Trails</option>
                    <option value="Cultural Heritage">Cultural Heritage</option>
                    <option value="Culinary Review">Culinary Review</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Document Text Payload</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Paste travel guide facts, timing rules, or hidden trail notes here..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-mono text-xs leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDocModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Index Vector
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
