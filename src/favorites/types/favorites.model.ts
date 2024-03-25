import { Artist } from '../../artist/types/artist.model';
import { Album } from '../../album/types/album.model';
import { Track } from '../../track/types/track.type';

export type Favorites = {
  artists: Artist[]; // favorite artists ids
  albums: Album[]; // favorite albums ids
  tracks: Track[]; // favorite tracks ids
};
