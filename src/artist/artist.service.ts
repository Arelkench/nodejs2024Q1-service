import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Artist } from '@prisma/client';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}
  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    return this.prisma.artist.create({ data: createArtistDto });
  }
  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist: Artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return this.prisma.artist.update({
      where: { id },
      data: updateArtistDto,
    });
  }
  async findAll(): Promise<Artist[]> {
    return this.prisma.artist.findMany();
  }
  async findOne(id: string): Promise<Artist> {
    const artist: Artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }
  async remove(id: string) {
    try {
      await this.prisma.artist.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException('Artist not found');
    }
  }
}
