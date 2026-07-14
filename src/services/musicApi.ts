import { Song } from '../data/songs';

// Primary API (Working, good for Indian content)
const PRIMARY_API_BASE_URL = 'https://saavn.sumit.co/api'; 

async function fetchSongsFromApi(baseUrl: string, query: string): Promise<Song[]> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `${baseUrl}/search/songs?query=${encodedQuery}&page=1&limit=15`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn(`API fetch failed for ${baseUrl}: ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (!data.success || !data.data || !data.data.results) {
      return [];
    }

    return data.data.results.map((item: any) => {
      const imgs = item.image || [];
      const image = imgs[2]?.url || imgs[2]?.link || imgs[1]?.url || imgs[1]?.link || imgs[0]?.url || imgs[0]?.link || '';
      
      const urls = item.downloadUrl || [];
      let audio = '';
      if (Array.isArray(urls)) {
        // Prioritize 320kbps
        audio = urls.find((u: any) => u.quality === "320kbps")?.url || 
                urls.find((u: any) => u.quality === "160kbps")?.url ||
                urls[urls.length - 1]?.url || '';
      } else {
        audio = item.url || '';
      }

      return {
        id: item.id,
        title: item.name,
        artist: item.primaryArtists || item.artist || 'Unknown',
        year: parseInt(item.year) || 2024,
        era: 'modern',
        region: 'india',
        image: image,
        audioUrl: audio
      };
    });
  } catch (error) {
    console.error(`Error fetching from ${baseUrl}:`, error);
    return [];
  }
}

/**
 * Main search function: Queries the active JioSaavn wrapper API.
 */
export async function searchSongs(query: string): Promise<Song[]> {
  return fetchSongsFromApi(PRIMARY_API_BASE_URL, query);
}

/**
 * Clean artist name for lyrics.ovh matching
 */
function cleanArtist(artist: string): string {
  if (!artist) return '';
  const splitters = [',', ' and ', ' & ', ' feat.', ' featuring ', ' with '];
  let cleaned = artist;
  for (const s of splitters) {
    if (cleaned.includes(s)) {
      cleaned = cleaned.split(s)[0];
    }
  }
  return cleaned.trim();
}

/**
 * Clean song title for lyrics.ovh matching
 */
function cleanTitle(title: string): string {
  if (!title) return '';
  let cleaned = title.replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '');
  return cleaned.trim();
}

/**
 * Fetches lyrics with robust fallback search on lyrics.ovh
 */
export async function fetchLyrics(songId: string, title?: string, artist?: string): Promise<string> {
    // 1. Try JioSaavn API lyrics endpoint
    try {
        const lyricsUrl = `${PRIMARY_API_BASE_URL}/songs/lyrics?id=${songId}`;
        const response = await fetch(lyricsUrl);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.lyrics) {
            return data.data.lyrics.replace(/<br\s*\/?>/gi, '\n');
          }
        }
    } catch (error) {
        console.warn("JioSaavn lyrics fetch failed, trying fallback...", error);
    }

    // 2. Try JioSaavn API song details lyrics field if ids is used
    try {
        const detailsUrl = `${PRIMARY_API_BASE_URL}/songs?ids=${songId}`;
        const response = await fetch(detailsUrl);
        if (response.ok) {
          const data = await response.json();
          const lyrics = data.data?.[0]?.lyrics;
          if (lyrics) {
            return lyrics.replace(/<br\s*\/?>/gi, '\n');
          }
        }
    } catch (error) {
        console.warn("JioSaavn details lyrics lookup failed...", error);
    }

    // 3. Fallback to lyrics.ovh API
    if (title && artist) {
        try {
            const cleanedArtist = cleanArtist(artist);
            const cleanedTitle = cleanTitle(title);
            console.log(`Lyrics Fallback Search: artist="${cleanedArtist}", title="${cleanedTitle}"`);
            const ovhUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(cleanedArtist)}/${encodeURIComponent(cleanedTitle)}`;
            const response = await fetch(ovhUrl);
            if (response.ok) {
                const data = await response.json();
                if (data.lyrics) {
                    return data.lyrics;
                }
            }
        } catch (error) {
            console.warn("lyrics.ovh fallback fetch failed...", error);
        }
    }
    
    return "Lyrics not available for this song. Tune in and enjoy the vibes!";
}