import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from '../db/db.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { Artist } from './types/artist.model';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistService {
  constructor(private dbService: DbService) {}
  create(createArtistDto: CreateArtistDto) {
    const artist: Artist = {
      id: uuidv4(),
      ...createArtistDto,
    };
    this.dbService.artists.push(artist);
    return artist;
  }
  findAll() {
    return this.dbService.artists;
  }
  findOne(id: string) {
    if (!id) {
      throw new BadRequestException('Invalid artist ID provided');
    }
    const artist = this.dbService.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new NotFoundException('Artist with this ID not found');
    }
    return artist;
  }
  update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = this.dbService.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new NotFoundException('Artist with this ID not found');
    }
    return Object.assign(artist, updateArtistDto);
  }
  remove(id: string) {
    if (!id) {
      throw new BadRequestException('Invalid artist ID provided');
    }
    const artist = this.dbService.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new NotFoundException('Artist with this ID not found');
    }
    const artistIndex = this.dbService.artists.indexOf(artist);
    this.dbService.artists.splice(artistIndex, 1);

    this.dbService.tracks
      .filter((track) => track.artistId === artist.id)
      .forEach((track) => (track.artistId = null));

    this.dbService.albums
      .filter((album) => album.artistId === artist.id)
      .forEach((album) => (album.artistId = null));
    const artistInFavs = this.dbService.favorites.artists.find(
      (artist) => artist.id === id,
    );
    if (artistInFavs) {
      const artistIndex =
        this.dbService.favorites.artists.indexOf(artistInFavs);
      this.dbService.favorites.artists.splice(artistIndex, 1);
    }
  }
}
