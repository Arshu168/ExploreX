import React from 'react';
import { 
  X, 
  MapPin, 
  Bookmark, 
  Clock, 
  ExternalLink, 
  Check, 
  Sparkles,
  Database
} from 'lucide-react';
import { Place } from '../types';

interface PlaceDetailModalProps {
  place: Place | null;
  onClose: () => void;
  onToggleBookmark: (placeId: string) => void;
  onAddToItinerary: (place: Place) => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  place,
  onClose,
  onToggleBookmark,
  onAddToItinerary,
}) => {
  if (!place) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-auto shadow-2xl space-y-5 text-slate-900 dark:text-slate-100 transition-colors">
        {/* Cover Image */}
        <div className="relative h-64 bg-slate-100 dark:bg-slate-800">
          <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 transition shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-600 text-white shadow-2xs">
              {place.category.replace('_', ' ')}
            </span>
            <h2 className="text-2xl font-extrabold mt-1">{place.name}</h2>
            <p className="text-xs text-slate-200 flex items-center gap-1 mt-0.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>{place.region}</span>
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 pt-0 space-y-5">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80">
              <span className="text-slate-600 dark:text-slate-400 font-bold block">Crowd Traffic</span>
              <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">{place.crowdLevel}% Traffic</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80">
              <span className="text-slate-600 dark:text-slate-400 font-bold block">Difficulty</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{place.difficulty}</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80">
              <span className="text-slate-600 dark:text-slate-400 font-bold block">Est. Cost</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                {place.estimatedCost === 0 ? 'Free' : `₹${place.estimatedCost.toLocaleString()}`}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80">
              <span className="text-slate-600 dark:text-slate-400 font-bold block">Rating</span>
              <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">★ {place.rating} / 5</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">About Destination</h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{place.description}</p>
          </div>

          {/* Best Time */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center gap-3 text-xs">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <div>
              <span className="font-extrabold text-slate-900 dark:text-slate-200">Recommended Visit Time:</span>
              <span className="text-slate-700 dark:text-slate-300 font-semibold ml-1.5">{place.bestTime}</span>
            </div>
          </div>

          {/* Local Guide Tips */}
          {place.localTips && place.localTips.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Local Guide Tips</h3>
              <div className="space-y-1.5">
                {place.localTips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 font-medium">
                    <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RAG Sources */}
          {place.ragSources && place.ragSources.length > 0 && (
            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-extrabold uppercase text-[10px]">
                <Database className="w-3.5 h-3.5" />
                <span>Verified RAG Citation</span>
              </div>
              {place.ragSources.map((source, idx) => (
                <div key={idx} className="space-y-0.5">
                  <a href={source.url} target="_blank" rel="noreferrer" className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                    <span>{source.title}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <p className="text-slate-700 dark:text-slate-300 italic text-[11px]">"{source.snippet}"</p>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onToggleBookmark(place.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
                place.isBookmarked
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{place.isBookmarked ? "Bookmarked" : "Bookmark Spot"}</span>
            </button>

            <button
              onClick={() => {
                onAddToItinerary(place);
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Add to Active Itinerary</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
