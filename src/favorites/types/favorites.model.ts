import { Album, Artist, Track } from '@prisma/client';

export type Favorites = {
  artists: Artist[]; // favorite artists ids
  albums: Album[]; // favorite albums ids
  tracks: Track[]; // favorite tracks ids
};
