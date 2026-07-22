export interface Property {
  id: string;
  title: string;
  city: string;
  locality: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  rent: number;
  deposit: number;
  furnishing: 'Fully-Furnished' | 'Semi-Furnished' | 'Unfurnished';
  available: boolean;
  availableFrom: string;
  area: number;
  description: string;
  amenities: string[];
  images: string[];
  ownerId: string;
  ownerName?: string;
  postedAt: string;
  averageRating?: number;
  totalReviews?: number;
}

export interface PropertyFilter {
  city?: string;
  type?: string;
  bedrooms?: number;
  furnishing?: string;
  minRent?: number;
  maxRent?: number;
  available?: boolean;
  search?: string;
  favoritesOnly?: boolean;
  favoriteIds?: string[];
  ownerId?: string;
}
