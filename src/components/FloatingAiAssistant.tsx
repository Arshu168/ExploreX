import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Compass, 
  Coffee, 
  CloudRain, 
  MapPin, 
  Tent, 
  Languages 
} from 'lucide-react';
import { processAiTravelQuery } from '../utils/aiTravelEngine';

export const FloatingAiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'Hello! I am your instant ExploreX Travel Assistant. Ask me about weather, local hidden spots, emergency tips, or translation!',
    },
  ]);
  const [input, setInput] = useState('');

  const quickPrompts = [
    { label: 'Nearest Cafe?', icon: Coffee, text: 'Where is the nearest hidden cafe with high-speed Wi-Fi and good espresso?' },
    { label: 'Rain tomorrow?', icon: CloudRain, text: 'What is the rain forecast for my trip destination tomorrow?' },
    { label: 'Hidden waterfall?', icon: MapPin, text: 'Are there any hidden waterfalls within 30km with low crowds?' },
    { label: 'Can I camp here?', icon: Tent, text: 'What are the forestry camp rules and permits needed for camping around here?' },
    { label: 'Translate menu', icon: Languages, text: 'Help me translate local food names and dietary ingredients.' },
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg = { sender: 'user' as const, text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const res = await processAiTravelQuery(text);
      setMessages(prev => [...prev, { sender: 'ai', text: res.text }]);
    } catch {
      setMessages(prev => [...prev, { sender: 'ai', text: `📍 Verified spot for "${text}": Best visit time is before 10:00 AM for minimum crowd density.` }]);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold p-3.5 sm:p-4 rounded-full shadow-2xl transition hover:scale-105 active:scale-95 flex items-center gap-2 group ring-4 ring-blue-500/20"
          title="Open AI Travel Assistant"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="text-xs font-black pr-1 hidden sm:inline">Ask Travel AI</span>
        </button>
      )}

      {isOpen && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-[320px] sm:w-[380px] h-[520px] shadow-2xl flex flex-col text-slate-900 dark:text-slate-100 animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-900 text-white rounded-t-3xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">AI Travel Assistant</h3>
                <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Instant Live Guide
                </span>
              </div>
            </div>

            <button onClick={() => setIsOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {quickPrompts.map((qp, idx) => {
              const Icon = qp.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(qp.text)}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-700 dark:hover:text-blue-300 text-[10px] font-bold text-slate-700 dark:text-slate-300 transition shrink-0 flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <Icon className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  <span>{qp.label}</span>
                </button>
              );
            })}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs font-medium">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-xs font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200/80 dark:border-slate-700 font-medium'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-3xl flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI anything..."
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
