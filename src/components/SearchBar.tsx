import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { searchSongs } from '../services/musicApi';
import { Song } from '../data/songs';

interface SearchBarProps {
  onSearchSuccess: (songs: Song[]) => void;
}

export const SearchBar = ({ onSearchSuccess }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Song[]>([]); // 👈 Autocomplete State

  // 🟢 Effect for Live Suggestions (Debounced search)
  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      // 🚀 Fetch suggestions on pause
      performSearch(query, true); // True means fetching suggestions
    }, 400); // 400ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const performSearch = async (searchQuery: string, isSuggestion: boolean = false) => {
    setLoading(true);
    const results = await searchSongs(searchQuery);
    setLoading(false);

    if (results.length > 0) {
      if (isSuggestion) {
        setSuggestions(results.slice(0, 5)); // Show only top 5 suggestions
      } else {
        // Full Search (on click/enter)
        onSearchSuccess(results);
        setQuery('');
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
      if (!isSuggestion) {
        alert("No songs found! Try searching for a different artist/song.");
      }
    }
  };

  // 🖱️ When user clicks a suggestion
  const handleSuggestionClick = (song: Song) => {
    onSearchSuccess([song]); // Play the song immediately
    setQuery('');
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') performSearch(query);
  };

  return (
    <div className="fixed top-6 left-6 z-50 w-80 font-sans">
      <div className="relative group flex items-center">
        <input
          type="text"
          className="w-full pl-4 pr-12 py-3 bg-black/80 backdrop-blur-xl border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-xl transition-all"
          placeholder="Type to search (e.g., Galat)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)} // OnChange triggers the Effect
          onKeyDown={handleKeyDown}
          disabled={loading}
        />

        <button 
          onClick={() => performSearch(query)}
          disabled={loading || query.length < 3}
          className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 rounded-full text-white transition-colors"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* 💡 Autocomplete Suggestions List */}
      {suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-black/90 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl overflow-hidden">
          {suggestions.map((song) => (
            <button
              key={song.id}
              onClick={() => handleSuggestionClick(song)}
              className="w-full text-left p-3 flex items-center gap-3 hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0"
            >
              <img src={song.image} alt="" className="w-8 h-8 rounded object-cover" />
              <div className="min-w-0">
                <div className="text-white text-sm truncate">{song.title}</div>
                <div className="text-gray-400 text-xs truncate">{song.artist}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};