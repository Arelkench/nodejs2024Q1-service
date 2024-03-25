import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}
  async create(createTrackDto: CreateTrackDto) {
    try {
      return await this.prisma.track.create({
        data: createTrackDto,
      });
    } catch {
      throw new NotFoundException('Track not found');
    }
  }
  async update(id: string, updateTrackDto: UpdateTrackDto) {
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
  async findAll() {
    return this.prisma.track.findMany();
  }
  async findOne(id: string) {
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
