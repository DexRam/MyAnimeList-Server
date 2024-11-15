export interface User {
  email: string;
  username?: string;
  password: string;
}

export interface Anime {
  id: number;
  title: string;
  description: string;
  rating: number;
}
