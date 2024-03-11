import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsNumber()
  year: number;
  @IsString()
  @IsNotEmpty()
  artistId: string | null; // refers to Artist
}
