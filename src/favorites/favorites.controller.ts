import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favsService: FavoritesService) {}
  @Get()
  getAll() {
    return this.favsService.findAll();
  }

  @Post('artist/:id')
  addArtist(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.addArtist(id);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteArtist(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.deleteArtist(id);
  }

  @Post('album/:id')
  addAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.addAlbum(id);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.deleteAlbum(id);
  }

  @Post('track/:id')
  addTack(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.addTrack(id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTrack(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.deleteTrack(id);
  }
}
