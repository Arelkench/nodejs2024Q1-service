import {
  ForbiddenException,
  HttpCode,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PrismaService } from '../prisma/prisma.service';

const userSelectFields = {
  id: true,
  login: true,
  version: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: {
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...createUserDto,
      },
      select: userSelectFields,
    });

    return {
      ...user,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
  async update(id: string, updateUserDto: UpdatePasswordDto) {
    const { oldPassword, newPassword } = updateUserDto;
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User with this ID not found');
    }
    if (oldPassword !== user.password) {
      throw new ForbiddenException('Old password is incorrect');
    }
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { password: newPassword, version: user.version + 1 },
      select: userSelectFields,
    });
    return this.convertDate(updatedUser);
  }
  @HttpCode(204)
  async findAll() {
    const users = await this.prisma.user.findMany({
      select: userSelectFields,
    });

    return users.map((user) => this.convertDate(user));
  }

  @HttpCode(204)
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userSelectFields,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.convertDate(user);
  }

  async remove(id: string) {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch {
      throw new NotFoundException('User not found');
    }
  }
  convertDate(user) {
    return {
      ...user,
      createdAt: new Date(user.createdAt).getTime(),
      updatedAt: new Date(user.updatedAt).getTime(),
    };
  }
}
