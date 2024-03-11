import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PlayersModule } from './players/players.module';
import { ArtistModule } from './artist/artist.module';
import { TrackModule } from './track/track.module';
import { AlbumModule } from './album/album.module';
import { FavoritesModule } from './favorites/favorites.module';
import { DbModule } from './db/db.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, ArtistModule, TrackModule, AlbumModule, FavoritesModule, DbModule, PlayersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
