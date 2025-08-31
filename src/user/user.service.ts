import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const userAlreadyExists = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (userAlreadyExists) {
      throw new ConflictException('Email Already exists');
    }
    return this.prismaService.user.create({
      data: createUserDto,
    });
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  findOne(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.prismaService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
      omit: {
        id: true,
      },
    });
  }

  async remove(id: string) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
    if (!userExists) {
      throw new BadRequestException('User does not exists');
    }
    return this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }
}
