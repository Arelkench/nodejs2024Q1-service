import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { Favorites } from '../db/models/favorites.model';
import { Entity } from '../db/models/Entity.model';

@Controller('favs')
export class FavoritesController {
  private entities = ['track', 'album', 'artist'];

  constructor(private readonly favouritesService: FavoritesService) {}

  @Get()
  findAll(): Favorites {
    return this.favouritesService.findAll();
  }

  @Post(':entity/:id')
  add(
    @Param('entity') entity: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): string {
    if (this.entities.includes(entity)) {
      this.favouritesService.add(this.convertToPlural(entity), id);
      return `${entity} successfully added to favorites`;
    } else {
      throw new BadRequestException('Invalid entity');
    }
  }

  @Delete(':entity/:id')
  @HttpCode(204)
  delete(
    @Param('entity') entity: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): string {
    if (this.entities.includes(entity)) {
      this.favouritesService.delete(this.convertToPlural(entity), id);
      return `${entity} successfully deleted from favorites`;
    } else {
      throw new BadRequestException('Invalid entity');
    }
  }

  private convertToPlural(entityName: string): Entity {
    return `${entityName}s` as Entity;
  }
}
