import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const defaultId = '1';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll() {
    const favs = await this.prisma.favorites.findUnique({
      where: { id: '1' },
      select: { artists: true, albums: true, tracks: true },
    });

    if (!favs) {
      return { artists: [], albums: [], tracks: [] };
    }

    return favs;
  }

  async addArtist(id: string) {
    try {
      return await this.prisma.artist.update({
        where: { id },
        data: {
          favorites: {
            connectOrCreate: {
              where: { id: defaultId },
              create: { id: defaultId },
            },
          },
        },
      });
    } catch {
      throw new UnprocessableEntityException("Artist doesn't exist");
    }
  }

  async deleteArtist(id: string) {
    try {
      return this.prisma.artist.update({
        where: { id },
        data: {
          favorites: {
            disconnect: { id: defaultId },
          },
        },
      });
    } catch {
      throw new UnprocessableEntityException("Artist doesn't exist");
    }
  }

  async addAlbum(id: string) {
    try {
      return await this.prisma.album.update({
        where: { id },
        data: {
          favorites: {
            connectOrCreate: {
              where: { id: defaultId },
              create: { id: defaultId },
            },
          },
        },
      });
    } catch {
      throw new UnprocessableEntityException("Album doesn't exist");
    }
  }

  async deleteAlbum(id: string) {
    try {
      return await this.prisma.album.update({
        where: { id },
        data: {
          favorites: {
            disconnect: { id: defaultId },
          },
        },
      });
    } catch {
      throw new UnprocessableEntityException("Album doesn't exist");
    }
  }

  async addTrack(id: string) {
    try {
      return await this.prisma.track.update({
        where: { id },
        data: {
          favorites: {
            connectOrCreate: {
              where: { id: defaultId },
              create: { id: defaultId },
            },
          },
        },
      });
    } catch {
      throw new UnprocessableEntityException("Track doesn't exist");
    }
  }

  async deleteTrack(id: string) {
    try {
      return this.prisma.track.update({
        where: { id },
        data: {
          favorites: {
            disconnect: { id: defaultId },
          },
        },
      });
    } catch {
      throw new UnprocessableEntityException("Track doesn't exist");
    }
  }
}
