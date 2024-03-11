import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from '../db/db.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from '../db/models/album.model';

@Injectable()
export class AlbumService {
  constructor(private dbService: DbService) {}
  create(createAlbumDto: CreateAlbumDto) {
    const album: Album = {
      id: uuidv4(),
      ...createAlbumDto,
    };
    this.dbService.albums.push(album);
    return album;
  }
  findAll() {
    return this.dbService.albums;
  }
  findOne(id: string) {
    if (!id) {
      throw new BadRequestException('Invalid album ID provided');
    }
    const album = this.dbService.albums.find((album) => album.id === id);
    if (!album) {
      throw new NotFoundException('Album with this ID not found');
    }
    return album;
  }
  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    const album = this.dbService.albums.find((album) => album.id === id);
    if (!album) {
      throw new NotFoundException('Album with this ID not found');
    }
    return Object.assign(album, updateAlbumDto);
  }
  remove(id: string) {
    if (!id) {
      throw new BadRequestException('Invalid album ID provided');
    }
    const album = this.dbService.albums.find((album) => album.id === id);
    if (!album) {
      throw new HttpException(
        'Album with this ID not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const albumIndex = this.dbService.albums.indexOf(album);

    this.dbService.albums.splice(albumIndex, 1);
    this.dbService.tracks
      .filter((track) => track.albumId === album.id)
      .forEach((track) => (track.albumId = null));
    const albumInFavs = this.dbService.favorites.albums.find(
      (album) => album.id === id,
    );
    if (albumInFavs) {
      const albumIndex = this.dbService.favorites.albums.indexOf(albumInFavs);
      this.dbService.favorites.albums.splice(albumIndex, 1);
    }
  }
}
