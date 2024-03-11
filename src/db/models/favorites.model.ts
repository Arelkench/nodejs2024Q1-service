import { Artist } from './artist.model';
import { Album } from './album.model';
import { Track } from './track.model';

export type Favorites = {
  artists: Artist[]; // favorite artists ids
  albums: Album[]; // favorite albums ids
  tracks: Track[]; // favorite tracks ids
};
