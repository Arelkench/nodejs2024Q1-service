import { Injectable } from '@nestjs/common';
import { User } from '../user/types/user.type';
import { Track } from '../track/types/track.type';
import { Artist } from '../artist/types/artist.model';
import { Album } from '../album/types/album.model';
import { Favorites } from '../favorites/types/favorites.model';

@Injectable()
export class DbService {
  public users: User[] = [];

  public tracks: Track[] = [];

  public artists: Artist[] = [];

  public albums: Album[] = [];

  public favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };
}
