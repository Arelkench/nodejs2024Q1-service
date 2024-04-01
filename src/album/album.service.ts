import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Album } from '@prisma/client';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}
  async create(createAlbumDto: CreateAlbumDto) {
    return this.prisma.album.create({ data: createAlbumDto });
  }
  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    try {
      return await this.prisma.album.update({
        where: { id },
        data: updateAlbumDto,
      });
    } catch {
      throw new NotFoundException('Album not found');
    }
  }
  async findAll(): Promise<Album[]> {
    return this.prisma.album.findMany();
  }
  async findOne(id: string): Promise<Album> {
    const album: Album = await this.prisma.album.findUnique({
      where: { id },
    });
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }
  async remove(id: string) {
    try {
      await this.prisma.album.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Album not found');
    }
  }
}
