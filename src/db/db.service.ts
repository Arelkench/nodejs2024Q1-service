import { Injectable } from '@nestjs/common';
import { User } from './models/user.model';
import { Track } from './models/track.model';
import { Artist } from './models/artist.model';
import { Album } from './models/album.model';
import { Favorites } from './models/favorites.model';

@Injectable()
export class DbService {
  public users: User[] = [];

  public tracks: Track[] = [];

  public artists: Artist[] = [];

  public albums: Album[] = [];

  public favs: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };
}
