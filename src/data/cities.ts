export interface City {
  id: string;
  name: string;
  videoId: string;
  region: string;
}

export const cities: City[] = [
  {
    id: 'mumbai',
    name: 'Mumbai',
    videoId: 'ZRgQ8SYt3Q4',
    region: 'india',
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    videoId: 'QyxMNPNuWpQ',
    region: 'japan',
  },
  {
    id: 'la',
    name: 'Los Angeles',
    videoId: 'wCcMcaiRqhY',
    region: 'usa',
  },
  {
    id: 'paris',
    name: 'Paris',
    videoId: 'VCtGDwSQyJ0',
    region: 'europe',
  },
  {
    id: 'dubai',
    name: 'Dubai',
    videoId: 'z_s7RdHHX5w',
    region: 'middle-east',
  },
  {
    id: 'nyc',
    name: 'New York',
    videoId: 'EyxYUYwuTKk',
    region: 'usa',
  },
];
