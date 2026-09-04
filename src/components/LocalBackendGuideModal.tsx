import React, { useState, useEffect } from 'react';
import { 
  X, 
  Terminal, 
  Database, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Copy, 
  Check, 
  Sparkles, 
  Server,
  Zap,
  Code
} from 'lucide-react';

interface LocalBackendGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocalBackendGuideModal: React.FC<LocalBackendGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'tester' | 'stack' | 'files'>('guide');
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [backendData, setBackendData] = useState<any>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Live test state
  const [testQuery, setTestQuery] = useState('Hidden waterfalls near Valparai');
  const [testResponse, setTestResponse] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  const checkHealth = async () => {
    setBackendStatus('checking');
    try {
      const res = await fetch('http://localhost:8000/api/health', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        setBackendData(data);
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
        setBackendData(null);
      }
    } catch {
      setBackendStatus('offline');
      setBackendData(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkHealth();
    }
  }, [isOpen]);

  const runLiveTest = async () => {
    setIsTesting(true);
    setTestResponse(null);
    try {
      const res = await fetch('http://localhost:8000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: testQuery })
      });
      if (res.ok) {
        const data = await res.json();
        setTestResponse(data);
      } else {
        setTestResponse({ error: `Server returned status ${res.status}` });
      }
    } catch (e: any) {
      setTestResponse({
        error: 'Cannot connect to http://localhost:8000. Please start your FastAPI backend using run.sh or run.bat!',
        details: e.message
      });
    } finally {
      setIsTesting(false);
    }
  };

  const copyCode = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-2xl text-white shadow-md shadow-blue-500/20">
              <Server className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                  Local Python FastAPI Backend Guide
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  FastAPI • Supabase • ChromaDB • LLaMA
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Run ExploreX AI on your local computer with zero coding required
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Server Connection Indicator Bar */}
        <div className="px-6 py-2.5 bg-slate-900 text-white flex items-center justify-between text-xs border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">http://localhost:8000:</span>
            {backendStatus === 'checking' && (
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Checking server status...
              </span>
            )}
            {backendStatus === 'online' && (
              <span className="flex items-center gap-1.5 text-emerald-400 font-extrabold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ONLINE & READY (FastAPI + ChromaDB + LLaMA)
              </span>
            )}
            {backendStatus === 'offline' && (
              <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                OFFLINE (Run 'run.bat' or './run.sh' locally)
              </span>
            )}
          </div>

          <button
            onClick={checkHealth}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] flex items-center gap-1 transition cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Test Ping</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50/50 dark:bg-slate-800/40 overflow-x-auto">
          {[
            { id: 'guide', label: '1. Setup Instructions', icon: Terminal },
            { id: 'tester', label: '2. Live API Tester', icon: Zap },
            { id: 'stack', label: '3. Architecture & Tech', icon: Layers },
            { id: 'files', label: '4. File Structure', icon: Code },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 font-extrabold text-xs flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: Setup Guide */}
          {activeTab === 'guide' && (
            <div className="space-y-5 text-xs">
              <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 space-y-1">
                <p className="font-extrabold text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Your Python FastAPI Backend is completely built!</span>
                </p>
                <p className="text-blue-800 dark:text-blue-300 font-medium leading-relaxed">
                  All backend files (FastAPI server, Supabase PostgreSQL connector, ChromaDB vector store, and Ollama LLaMA RAG service) have been generated in the <strong className="font-bold">/backend</strong> folder. Follow these 3 simple steps to run it locally on your machine.
                </p>
              </div>

              {/* Step 1 */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
                    <span>Install Ollama & Pull LLaMA 3.2 Model</span>
                  </span>
                  <a
                    href="https://ollama.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    Download Ollama →
                  </a>
                </div>
                <p className="text-slate-600 dark:text-slate-300">Download Ollama from ollama.com, open your Terminal or Command Prompt, and run:</p>
                <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-xs flex items-center justify-between">
                  <span>ollama pull llama3.2</span>
                  <button
                    onClick={() => copyCode('ollama pull llama3.2', 1)}
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer"
                  >
                    {copiedIndex === 1 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
                    <span>Configure Supabase PostgreSQL (Optional)</span>
                  </span>
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    Supabase.com →
                  </a>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  Create a free project on Supabase. Copy your Project URL & Anon Key into <code className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded font-mono">/backend/.env</code>.
                  <span className="text-slate-500 dark:text-slate-400 italic block mt-0.5">*If skipped, the backend automatically uses built-in local offline storage!</span>
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-2xs">
                <span className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">3</span>
                  <span>Run One-Click Launch Script</span>
                </span>
                <p className="text-slate-600 dark:text-slate-300">Open your terminal in the <code className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded font-mono">backend</code> folder and run:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-xs space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-sans font-bold block">Windows:</span>
                    <div className="flex items-center justify-between">
                      <span>run.bat</span>
                      <button
                        onClick={() => copyCode('run.bat', 2)}
                        className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer"
                      >
                        {copiedIndex === 2 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-xs space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-sans font-bold block">Mac / Linux:</span>
                    <div className="flex items-center justify-between">
                      <span>chmod +x run.sh && ./run.sh</span>
                      <button
                        onClick={() => copyCode('chmod +x run.sh && ./run.sh', 3)}
                        className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer"
                      >
                        {copiedIndex === 3 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Live API Tester */}
          {activeTab === 'tester' && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-3">
                <label className="font-extrabold text-xs text-slate-800 dark:text-slate-200 block">
                  Test RAG & LLaMA FastAPI Endpoint (POST http://localhost:8000/api/ai/chat)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testQuery}
                    onChange={(e) => setTestQuery(e.target.value)}
                    placeholder="Ask travel question..."
                    className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={runLiveTest}
                    disabled={isTesting}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-2 rounded-xl flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
                  >
                    {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    <span>{isTesting ? 'Querying LLaMA...' : 'Send Request'}</span>
                  </button>
                </div>
              </div>

              {testResponse && (
                <div className="space-y-2">
                  <span className="font-bold text-xs text-slate-700 dark:text-slate-300 block">FastAPI Server JSON Response:</span>
                  <pre className="bg-slate-900 text-emerald-400 p-4 rounded-2xl font-mono text-xs max-h-72 overflow-y-auto leading-relaxed border border-slate-800">
                    {JSON.stringify(testResponse, null, 2)}
                  </pre>
                </div>
              )}

              {backendData && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-2">
                  <span className="font-bold text-xs block text-emerald-800 dark:text-emerald-300">Live Health Diagnostic Data:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
                    <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">STATUS</span>
                      <span className="text-emerald-700 dark:text-emerald-400">{backendData.status}</span>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">DATABASE</span>
                      <span className="text-slate-800 dark:text-slate-200">{backendData.database}</span>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">VECTOR STORE</span>
                      <span className="text-slate-800 dark:text-slate-200">{backendData.vector_db}</span>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">LLM ENGINE</span>
                      <span className="text-blue-700 dark:text-blue-400">{backendData.llm_engine}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Tech Architecture */}
          {activeTab === 'stack' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-2xs">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">FastAPI Backend</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">Python 3.10+ High Performance API</p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Asynchronous Python server powering travel recommendations, RAG queries, trip CRUD operations, and budget analytics.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-2xs">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Supabase PostgreSQL</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">Relational Database</p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Stores user profiles, saved trips, hidden places, and activity logs with instant cloud sync and client safety.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-2xs">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">ChromaDB Vector Store</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">Vector Search Database</p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Stores embeddings for travel places, hidden gems, and blogs to allow high-accuracy semantic RAG document retrieval.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-2xs">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">LLaMA 3.2 via Ollama</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">Local Privacy-First LLM</p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Generates natural language travel plans, answers queries, and synthesizes ChromaDB vector contexts locally without API costs.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: File Structure */}
          {activeTab === 'files' && (
            <div className="space-y-3 text-xs">
              <span className="font-extrabold text-slate-800 dark:text-slate-200 block">Generated Backend Code Tree:</span>
              <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-xs leading-relaxed space-y-1">
                <p className="text-blue-400 font-bold">backend/</p>
                <p className="pl-4">├── <span className="text-emerald-400">main.py</span> <span className="text-slate-500">(FastAPI server entry point & CORS)</span></p>
                <p className="pl-4">├── <span className="text-emerald-400">database.py</span> <span className="text-slate-500">(Supabase PostgreSQL connection)</span></p>
                <p className="pl-4">├── <span className="text-emerald-400">rag_service.py</span> <span className="text-slate-500">(ChromaDB vector store + Ollama LLaMA engine)</span></p>
                <p className="pl-4">├── <span className="text-emerald-400">requirements.txt</span> <span className="text-slate-500">(Python package dependencies)</span></p>
                <p className="pl-4">├── <span className="text-emerald-400">.env.example</span> <span className="text-slate-500">(Supabase & Ollama config keys)</span></p>
                <p className="pl-4">├── <span className="text-amber-300">run.sh</span> <span className="text-slate-500">(One-click Linux/Mac launcher)</span></p>
                <p className="pl-4">├── <span className="text-amber-300">run.bat</span> <span className="text-slate-500">(One-click Windows launcher)</span></p>
                <p className="pl-4">└── <span className="text-blue-400">routers/</span></p>
                <p className="pl-8">├── ai_planner.py <span className="text-slate-500">(LLaMA itinerary generator)</span></p>
                <p className="pl-8">├── rag.py <span className="text-slate-500">(ChromaDB vector search API)</span></p>
                <p className="pl-8">├── places.py <span className="text-slate-500">(Locations CRUD API)</span></p>
                <p className="pl-8">├── trips.py <span className="text-slate-500">(Saved trips API)</span></p>
                <p className="pl-8">└── budget.py <span className="text-slate-500">(Destination budget calculator)</span></p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            Read <strong className="font-bold text-slate-800 dark:text-slate-200">/BACKEND_SETUP_GUIDE.md</strong> in project root for full documentation.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white font-extrabold transition shadow-xs cursor-pointer"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
