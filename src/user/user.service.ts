import {
  BadRequestException,
  ForbiddenException,
  HttpCode,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { DbService } from '../db/db.service';
import { User } from '../db/models/user.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(private dbService: DbService) {}
  create(createUserDto: CreateUserDto) {
    const user: User = {
      id: uuidv4(),
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...createUserDto,
    };

    this.dbService.users.push(user);

    return user;
  }
  @HttpCode(204)
  findAll() {
    return this.dbService.users;
  }
  @HttpCode(204)
  findOne(id: string) {
    if (!id) {
      throw new BadRequestException('Invalid user ID provided');
    }
    const user = this.dbService.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User with this ID not found');
    }
    return user;
  }

  update(id: string, updateUserDto: UpdatePasswordDto) {
    const { oldPassword, newPassword } = updateUserDto;
    const user = this.dbService.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User with this ID not found');
    }
    if (oldPassword !== user.password) {
      throw new ForbiddenException('Old password is incorrect');
    }
    user.password = newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    return user;
  }

  remove(id: string) {
    const user = this.dbService.users.find((user) => user.id === id);
    const userIndex = this.dbService.users.indexOf(user);
    this.dbService.users.splice(userIndex, 1);
  }
}
