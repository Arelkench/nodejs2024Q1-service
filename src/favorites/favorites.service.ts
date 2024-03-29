import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Favorites } from '../db/models/favorites.model';
import { Entity } from '../db/models/Entity.model';
import { Artist } from '../db/models/artist.model';
import { Album } from '../db/models/album.model';
import { Track } from '../db/models/track.model';

@Injectable()
export class FavoritesService {
  constructor(private dbService: DbService) {}

  public findAll(): Favorites {
    console.log(this.dbService.favorites);
    return this.dbService.favorites;
  }

  public add(entityName: Entity, id: string): void {
    const entity = this.findEntity(entityName, id);

    const entityInFavs = this.dbService.favorites[entityName].find(
      (entity: Artist | Album | Track) => entity.id === id,
    );

    if (!entityInFavs) {
      this.dbService.favorites[entityName].push(entity);
    }
  }

  public delete(entityName: Entity, id: string): void {
    const entity = this.dbService.favorites[entityName].find(
      (entity: Artist | Album | Track) => entity.id === id,
    );

    if (!entity) {
      throw new NotFoundException(`${entityName} with this ID not found`);
    }

    const entityIndex = this.dbService.favorites[entityName].indexOf(entity);

    this.dbService.favorites[entityName].splice(entityIndex, 1);
  }

  private findEntity(entityName: Entity, id: string): Artist | Album | Track {
    const entity = this.dbService[entityName].find(
      (entity: Artist | Album | Track) => entity.id === id,
    );

    if (!entity) {
      throw new UnprocessableEntityException(
        `${entityName} with this ID doesn't exist`,
      );
    }

    return entity;
  }
}
