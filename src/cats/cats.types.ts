export interface CatStats {
  strength: number;
  agility: number;
  intelligence: number;
  perception: number;
  luck: number;
}

export interface CatProfile {
  id: string;
  name: string;
  breed: string;
  description: string;
  imageUrl: string;
  stats: CatStats;
  owner?: string;
}

export interface CreateCatDto {
  name: string;
  breed: string;
  description: string;
  imageUrl: string;
  stats: CatStats;
}

export interface UpdateCatDto {
  name?: string;
  breed?: string;
  description?: string;
  imageUrl?: string;
  stats?: CatStats;
  owner?: string | null;
}
