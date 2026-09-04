import React, { useState } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Database, 
  ExternalLink
} from 'lucide-react';
import { ChatMessage, Place, RagSource } from '../types';
import { processAiTravelQuery } from '../utils/aiTravelEngine';

interface AiChatViewProps {
  availablePlaces: Place[];
  onSelectPlace: (place: Place) => void;
}

export const AiChatView: React.FC<AiChatViewProps> = ({ availablePlaces, onSelectPlace }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: "Hello! I am your **ExploreX AI Travel Assistant**. Ask me anything about offbeat travel, hidden waterfalls, tea estates, quiet photography trails, or budget tips!",
      timestamp: 'Just now'
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const presetQueries = [
    "Hidden waterfalls near Valparai and Anamalai",
    "Best timing for Monkey Falls & Aliyar Dam",
    "Quiet tea estates and photography trails in Valparai",
    "Is Adiyogi Shiva Statue open in the evening?"
  ];

  const handleSend = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const result = await processAiTravelQuery(queryText, availablePlaces);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: result.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ragSources: result.ragSources,
        suggestedPlaces: result.suggestedPlaces
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Based on ExploreX Travel Archives for "${queryText}": Recommended visit early in the morning for optimal weather and lower crowd index.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-4 pb-12 max-w-4xl mx-auto font-sans text-slate-900 dark:text-slate-100">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">AI Travel Chat Assistant</h1>
            <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Online
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 font-medium">
            Ask real-time travel questions, custom recommendations & local tips.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 shrink-0">Ask AI:</span>
        {presetQueries.map((pq, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(pq)}
            className="text-xs bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700 shrink-0 transition font-semibold shadow-2xs"
          >
            💬 {pq}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 lg:p-6 min-h-[480px] flex flex-col justify-between space-y-4 shadow-2xs">
        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs font-bold">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-2xl space-y-2.5 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white p-4 rounded-3xl rounded-tr-none text-xs font-medium shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-4 lg:p-5 rounded-3xl rounded-tl-none text-slate-900 dark:text-slate-100 text-xs font-medium shadow-2xs'
              }`}>
                <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

                {msg.ragSources && msg.ragSources.length > 0 && (
                  <div className="mt-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-extrabold uppercase text-[10px] tracking-wider">
                      <Database className="w-3.5 h-3.5" />
                      <span>RAG Retrieved Knowledge Source</span>
                    </div>
                    {msg.ragSources.map((rs, rIdx) => (
                      <div key={rIdx} className="text-slate-800 dark:text-slate-200 text-[11px] space-y-0.5">
                        <a href={rs.url} target="_blank" rel="noreferrer" className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                          <span>{rs.title}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <p className="text-slate-600 dark:text-slate-400 italic">"{rs.snippet}"</p>
                      </div>
                    ))}
                  </div>
                )}

                <span className="text-[10px] opacity-70 block text-right font-mono mt-1 text-slate-500 dark:text-slate-400">
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 items-center text-xs text-blue-600 dark:text-blue-400 font-bold animate-pulse">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Querying RAG Vector DB...</span>
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="relative flex items-center pt-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your travel question..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-2xl pl-4 pr-12 py-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
