import {
  BadRequestException,
  HttpCode,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { DbService } from '../db/db.service';
import { Track } from '../db/models/track.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TrackService {
  constructor(private dbService: DbService) {}
  create(createTrackDto: CreateTrackDto) {
    const track: Track = {
      id: uuidv4(),
      ...createTrackDto,
    };
    this.dbService.tracks.push(track);
    return track;
  }
  findAll() {
    return this.dbService.tracks;
  }
  findOne(id: string) {
    if (!id) {
      throw new BadRequestException('Invalid user ID provided');
    }
    const track = this.dbService.tracks.find((track) => track.id === id);
    if (!track) {
      throw new NotFoundException('Track with this ID not found');
    }
    return track;
  }
  update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = this.dbService.tracks.find((track) => track.id === id);
    if (!track) {
      throw new NotFoundException('Track with this ID not found');
    }
    return Object.assign(track, updateTrackDto);
  }
  remove(id: string) {
    if (!id) {
      throw new BadRequestException('Invalid track ID provided');
    }
    const track = this.dbService.tracks.find((track) => track.id === id);
    if (!track) {
      throw new NotFoundException('Track with this ID not found');
    }
    const trackIndex = this.dbService.tracks.indexOf(track);
    this.dbService.tracks.splice(trackIndex, 1);
  }
}
