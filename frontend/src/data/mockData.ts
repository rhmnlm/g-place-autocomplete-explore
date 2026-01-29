import type { Category, Location, CategoryType } from '../types';

export const categories: Category[] = [
  { id: 'cafes', label: 'Cafes', color: '#4CAF50' },
  { id: 'parks', label: 'Parks', color: '#8BC34A' },
  { id: 'restaurants', label: 'Restaurants', color: '#2196F3' },
  { id: 'museums', label: 'Museums', color: '#9E9E9E' },
  { id: 'other', label: 'Other', color: '#FF9800' },
];

export const favoriteLocations: Location[] = [
  {
    id: '1',
    name: 'Central Park',
    category: 'parks',
    latitude: 40.7829,
    longitude: -73.9654,
    address: 'New York, NY 10024',
  },
  {
    id: '2',
    name: 'The Daily Grind',
    category: 'cafes',
    latitude: 40.7484,
    longitude: -73.9857,
    address: '123 Broadway, New York, NY',
  },
  {
    id: '3',
    name: 'Magnolia Park',
    category: 'parks',
    latitude: 40.7614,
    longitude: -73.9776,
    address: 'Manhattan, NY',
  },
  {
    id: '4',
    name: 'Claremont Park',
    category: 'parks',
    latitude: 40.8401,
    longitude: -73.9093,
    address: 'Bronx, NY',
  },
  {
    id: '5',
    name: 'Mavi Theatre',
    category: 'other',
    latitude: 40.7580,
    longitude: -73.9855,
    address: 'Times Square, NY',
  },
  {
    id: '6',
    name: 'Art Institute',
    category: 'museums',
    latitude: 40.7794,
    longitude: -73.9632,
    address: 'Museum Mile, NY',
  },
  {
    id: '7',
    name: 'Claremont',
    category: 'restaurants',
    latitude: 40.7527,
    longitude: -73.9772,
    address: 'Midtown, NY',
  },
  {
    id: '8',
    name: 'Bank Valley',
    category: 'other',
    latitude: 40.7074,
    longitude: -74.0113,
    address: 'Financial District, NY',
  },
];

export const getCategoryById = (id: CategoryType): Category | undefined => {
  return categories.find((cat) => cat.id === id);
};

export const getLocationsByCategory = (categoryId: CategoryType): Location[] => {
  return favoriteLocations.filter((loc) => loc.category === categoryId);
};
