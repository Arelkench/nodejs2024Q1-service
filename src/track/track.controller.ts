import { Controller, Get, Header } from '@nestjs/common';
import { TrackService } from './track.service';
import { Track } from '../db/models/track.model';

@Controller('track')
export class TrackController {
  constructor(private trackService: TrackService) {}


}
