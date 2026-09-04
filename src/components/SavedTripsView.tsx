import React, { useState } from 'react';
import { 
  BookmarkCheck, 
  Bookmark, 
  Calendar, 
  Wallet, 
  Copy, 
  Download, 
  Trash2, 
  ArrowRight,
  Plus,
  Sparkles,
  Star
} from 'lucide-react';
import { Trip, Place } from '../types';

interface SavedTripsViewProps {
  trips: Trip[];
  bookmarkedPlaces: Place[];
  onSelectTrip: (trip: Trip) => void;
  onSelectPlace: (place: Place) => void;
  onDuplicateTrip: (trip: Trip) => void;
  onRemoveTrip: (tripId: string) => void;
  onOpenNewTrip?: () => void;
  onAddToItinerary?: (place: Place) => void;
  onToggleBookmark?: (placeId: string) => void;
}

export const SavedTripsView: React.FC<SavedTripsViewProps> = ({
  trips,
  bookmarkedPlaces,
  onSelectTrip,
  onSelectPlace,
  onDuplicateTrip,
  onRemoveTrip,
  onOpenNewTrip,
  onAddToItinerary,
  onToggleBookmark,
}) => {
  const [activeTab, setActiveTab] = useState<'itineraries' | 'bookmarks'>('itineraries');

  return (
    <div className="space-y-6 pb-12 font-sans max-w-6xl mx-auto text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Saved Trips & Bookmarks</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 font-medium">
            Manage your saved itineraries, duplicate trip plans, and bookmarked spots.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onOpenNewTrip && (
            <button
              onClick={onOpenNewTrip}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ New Trip</span>
            </button>
          )}

          <div className="flex flex-wrap sm:flex-nowrap bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('itineraries')}
              className={`flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 rounded-lg font-bold transition text-center ${
                activeTab === 'itineraries' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Saved Itineraries ({trips.length})
            </button>
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 rounded-lg font-bold transition text-center ${
                activeTab === 'bookmarks' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Bookmarked Spots ({bookmarkedPlaces.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'itineraries' ? (
        <div className="space-y-4">
          {trips.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-10 text-center space-y-4 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto font-bold">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">No Saved Itineraries Yet</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium max-w-sm mx-auto">
                  Your account currently has no saved trip itineraries. Generate your first custom itinerary using our AI Travel Planner!
                </p>
              </div>
              {onOpenNewTrip && (
                <button
                  onClick={onOpenNewTrip}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-2 transition shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Create Your First AI Trip</span>
                </button>
              )}
            </div>
          ) : (
            trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-500 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 transition duration-200 flex flex-col md:flex-row justify-between gap-6 shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={trip.coverImage}
                    alt={trip.title}
                    className="w-full sm:w-44 h-36 rounded-2xl object-cover shrink-0 bg-slate-100 dark:bg-slate-800"
                  />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {trip.durationDays} Days • {trip.transportMode}
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">{trip.region}</span>
                    </div>

                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">{trip.title}</h3>
                    <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed max-w-xl font-medium">
                      {trip.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 font-semibold pt-1">
                      <span className="flex items-center gap-1">
                        <Wallet className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> ₹{trip.budgetTotal.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" /> {trip.startDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex md:flex-col justify-between md:justify-center items-end gap-2 border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-3 md:pt-0">
                  <button
                    onClick={() => onSelectTrip(trip)}
                    className="w-full md:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition shadow-xs cursor-pointer"
                  >
                    <span>Open Itinerary</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onDuplicateTrip(trip)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-700 cursor-pointer"
                      title="Duplicate Trip"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-700 cursor-pointer"
                      title="Export PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onRemoveTrip(trip.id)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-500 hover:text-red-600 dark:hover:text-red-400 text-xs border border-slate-200 dark:border-slate-700 cursor-pointer"
                      title="Delete Trip"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarkedPlaces.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-600 dark:text-slate-400 text-xs space-y-2 shadow-2xs">
              <Bookmark className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="font-semibold">No bookmarked places yet. Explore spots and click the bookmark icon!</p>
            </div>
          ) : (
            bookmarkedPlaces.map((place) => (
              <div
                key={place.id}
                onClick={() => onSelectPlace(place)}
                className="bg-white dark:bg-slate-900 hover:border-blue-500 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 cursor-pointer transition space-y-3 shadow-2xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative h-32 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden">
                    <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover" />
                    {onToggleBookmark && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(place.id);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-blue-600 text-white shadow-xs hover:bg-blue-700 transition"
                        title="Remove Bookmark"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{place.name}</h4>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-bold">{place.crowdLevel}% Crowd Traffic • {place.region}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 font-medium">{place.description}</p>
                  </div>
                </div>

                {onAddToItinerary && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToItinerary(place);
                      }}
                      className="w-full py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-extrabold text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Add to Active Itinerary</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
