export interface Song {
  id: string;
  title: string;
  artist: string;
  year: number;
  era: '90s' | '2000s' | 'modern';
  region?: string;
  audioUrl?: string;
  image?: string;
}

export const songs: Song[] = [
  {
    "id": "90s-1",
    "title": "Dil Se Re",
    "artist": "A.R. Rahman",
    "year": 1998,
    "era": "90s",
    "region": "india",
    "image": "https://c.saavncdn.com/942/A-R-Rahman-Forever-Hindi-2016-20260331205726-500x500.jpg",
    "audioUrl": "https://aac.saavncdn.com/942/fe5b69cfe146e13efa49c8409134509b_320.mp4"
  },
  {
    "id": "90s-2",
    "title": "Taal Se Taal Mila",
    "artist": "A.R. Rahman",
    "year": 1999,
    "era": "90s",
    "region": "india",
    "image": "https://c.saavncdn.com/128/Taal-Se-Taal-Instrumental-2022-20220726091410-500x500.jpg",
    "audioUrl": "https://aac.saavncdn.com/128/90ff6de0d0627ff7d9a489c747cd5b92_320.mp4"
  },
  {
    "id": "90s-3",
    "title": "Smells Like Teen Spirit",
    "artist": "Nirvana",
    "year": 1991,
    "era": "90s",
    "region": "usa",
    "image": "https://c.saavncdn.com/574/Null-and-Void-Instrumental-2021-20210927003730-500x500.jpg",
    "audioUrl": "https://aac.saavncdn.com/574/7aa663eff6d56930c5e995e1b22b8bad_320.mp4"
  },
  {
    "id": "90s-4",
    "title": "Wonderwall",
    "artist": "Oasis",
    "year": 1995,
    "era": "90s",
    "region": "europe",
    "image": "https://c.saavncdn.com/052/ZZang-KARAOKE-2024-Old-POP-Vol-48-Instrumental-2024-20260710135618-500x500.jpg",
    "audioUrl": "https://aac.saavncdn.com/052/ed8d095d1bef77e53ecf94d893dbe334_320.mp4"
  },
  {
    "id": "90s-5",
    "title": "First Love",
    "artist": "Utada Hikaru",
    "year": 1999,
    "era": "90s",
    "region": "japan",
    "image": "https://c.saavncdn.com/959/MOODBOARD-Punjabi-2025-20250729174756-500x500.jpg",
    "audioUrl": "https://aac.saavncdn.com/959/ee6eac5e4df46d0081bc9d487085a670_320.mp4"
  },
  {
    "id": "2000s-1",
    "title": "Kal Ho Naa Ho",
    "artist": "Sonu Nigam",
    "year": 2003,
    "era": "2000s",
    "region": "india",
    "image": "https://c.saavncdn.com/587/Kal-Ho-Naa-Ho-Hindi-2003-20190516130956-500x500.jpg",
    "audioUrl": "https://aac.saavncdn.com/587/d3bd1ed49eb108d2425e4875cc3ad86e_320.mp4"
  },
  {
    "id": "2000s-2",
    "title": "Dus Bahane",
    "artist": "KK, Shaan",
    "year": 2005,
    "era": "2000s",
    "region": "india",
    "image": "https://c.saavncdn.com/759/Dus-Hindi-2005-20241205141700-500x500.jpg",
    "audioUrl": "https://aac.saavncdn.com/441/e47a32711e63aedfcf666d72136d55dd_320.mp4"
  },
  {
    "id": "2000s-3",
    "title": "Rock Your Body",
    "artist": "Justin Timberlake",
    "year": 2002,
    "era": "2000s",
    "region": "usa",
    "image": "https://c.saavncdn.com/866/Rock-Your-Body-Instrumental-2024-20260424121302-500x500.jpg",
    "audioUrl": "https://aac.saavncdn.com/866/35b18569b073a0280c49e0e1d903b968_320.mp4"
  },
  {
    "id": "2000s-4",
    "title": "Mr. Brightside",
    "artist": "The Killers",
    "year": 2004,
    "era": "2000s",
    "region": "usa",
    "image": "https://c.saavncdn.com/689/Instrumental-Covers-Instrumental-2026-20260525163102-500x500.jpg",
    "audioUrl": "https://aac.saavncdn.com/689/86fe4d8f456a44c2dee7d206795d1088_320.mp4"
  },
  {
    "id": "2000s-5",
    "title": "Sakura Drops",
    "artist": "Utada Hikaru",
    "year": 2002,
    "era": "2000s",
    "region": "japan",
    "image": "https://c.saavncdn.com/040/Polarity-Instrumental-2021-20260526150320-500x500.jpg",
    "audioUrl": "https://aac.saavncdn.com/040/26188f6dc4a7ab95f47ecd994b52273a_320.mp4"
  },
  {
    "id": "modern-1",
    "title": "Kesariya",
    "artist": "Arijit Singh",
    "year": 2022,
    "era": "modern",
    "region": "india",
    "image": "https://c.saavncdn.com/871/Brahmastra-Original-Motion-Picture-Soundtrack-Hindi-2022-20221006155213-500x500.jpg",
    "audioUrl": "https://aac.saavncdn.com/871/c2febd353f3a076a406fa37510f31f9f_320.mp4"
  },
  {
    "id": "modern-2",
    "title": "Apna Bana Le",
    "artist": "Arijit Singh",
    "year": 2022,
    "era": "modern",
    "region": "india",
    "image": "https://c.saavncdn.com/228/Sachin-Jigar-Bollywood-Hits-Hindi-2026-20260630213800-500x500.jpg",
    "audioUrl": "https://aac.saavncdn.com/228/bed7fe5f8fe04ae6432bcb0717e2b74e_320.mp4"
  },
  {
    "id": "modern-3",
    "title": "Blinding Lights",
    "artist": "The Weeknd",
    "year": 2019,
    "era": "modern",
    "region": "usa",
    "image": "https://c.saavncdn.com/341/Ultra-Gaming-Mode-Vol-10-Instrumental-2026-20260115125448-500x500.jpg",
    "audioUrl": "https://aac.saavncdn.com/341/9872b384f066988e9bd957d6d68ee394_320.mp4"
  },
  {
    "id": "modern-4",
    "title": "Levitating",
    "artist": "Dua Lipa",
    "year": 2020,
    "era": "modern",
    "region": "usa",
    "image": "https://c.saavncdn.com/552/Chill-Pop-Covers-Mellow-Piano-Famous-Pop-Songs-For-Stress-Relief-Instrumental-2025-20250821045214-500x500.jpg",
    "audioUrl": "https://aac.saavncdn.com/552/01a84873ab1ee3298a45176c8cdbd6d7_320.mp4"
  },
  {
    "id": "modern-5",
    "title": "Lemon",
    "artist": "Kenshi Yonezu",
    "year": 2018,
    "era": "modern",
    "region": "japan",
    "image": "https://c.saavncdn.com/467/Drive-Thru-Punjabi-2022-20240708054744-500x500.jpg",
    "audioUrl": "https://aac.saavncdn.com/467/c1f149509d4ee7d20c0c4474090ab5f1_320.mp4"
  },
  {
    "id": "modern-6",
    "title": "Stay",
    "artist": "The Kid LAROI & Justin Bieber",
    "year": 2021,
    "era": "modern",
    "region": "usa",
    "image": "https://c.saavncdn.com/543/ZZang-KARAOKE-Greatest-POP-Vol-9-Instrumental-2024-20260120071413-500x500.jpg",
    "audioUrl": "https://aac.saavncdn.com/543/960a993e6eeedfa63ad9efff2f94b01a_320.mp4"
  }
];

export const getEraFromYear = (year: number): '90s' | '2000s' | 'modern' => {
  if (year >= 1990 && year < 2000) return '90s';
  if (year >= 2000 && year < 2010) return '2000s';
  return 'modern';
};

export const getSongsForEra = (era: '90s' | '2000s' | 'modern', region?: string): Song[] => {
  return songs.filter(song => {
    const eraMatch = song.era === era;
    const regionMatch = !region || !song.region || song.region === region;
    return eraMatch && regionMatch;
  });
};
