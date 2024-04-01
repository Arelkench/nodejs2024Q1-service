import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Track } from '@prisma/client';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}
  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    try {
      return await this.prisma.track.create({
        data: createTrackDto,
      });
    } catch {
      throw new NotFoundException('Track not found');
    }
  }
  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return this.prisma.track.update({
      where: { id },
      data: updateTrackDto,
    });
  }
  async findAll(): Promise<Track[]> {
    return this.prisma.track.findMany();
  }
  async findOne(id: string): Promise<Track> {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }
  async remove(id: string) {
    try {
      await this.prisma.track.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Track not found');
    }
  }
}
