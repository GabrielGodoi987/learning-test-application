import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserEntity } from './entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException } from '@nestjs/common';

const mockPrismaService = {
  user: {
    findMany: jest.fn(),
    findOne: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
};

describe('UserService', () => {
  let service: UserService;
  let mockUsers: UserEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);

    mockUsers = [
      {
        id: 'a1f3c9c2-9b62-4a55-8f12-8d82d02c3d01',
        name: 'Gabriel Godoi',
        email: 'gabriel.godoi@example.com',
        password: 'hashed_password_1',
      },
      {
        id: 'b2d7e8a1-4c2f-46e3-9c1b-1f92b1a1d111',
        name: 'Maria Souza',
        email: 'maria.souza@example.com',
        password: 'hashed_password_2',
      },
      {
        id: 'c3f9a7d2-1e24-45a6-91b7-8c3f43b2f222',
        name: 'João Pereira',
        email: 'joao.pereira@example.com',
        password: 'hashed_password_3',
      },
    ];
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toEqual(mockUsers);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return an user', () => {});
    it('should return 404 user not found', () => {});
  });

  describe('create', () => {
    it('should create an user', async () => {
      const newUser: UserEntity = {
        id: 'd9a11e95-9239-4769-9fc8-6087124fbec1',
        name: 'Roberto Fernandes',
        email: 'roberto.fernandes@example.com',
        password: 'hashed_password_4',
      };

      jest.spyOn(mockPrismaService.user, 'create').mockReturnValue(newUser);

      const result = await service.create(newUser);

      expect(result).toEqual(newUser);
    });

    it('should return user already exists error', async () => {
      const userAlreadyExists = {
        id: 'c3f9a7d2-1e24-45a6-91b7-8c3f43b2f222',
        name: 'João Pereira',
        email: 'joao.pereira@example.com',
        password: 'hashed_password_3',
      };

      jest
        .spyOn(mockPrismaService.user, 'create')
        .mockReturnValue(userAlreadyExists);

      const result = await service.create(userAlreadyExists);

      expect(result).toEqual(userAlreadyExists);
    });
  });

  describe('update', () => {
    let id: string;
    let updateData: UpdateUserDto;
    beforeEach(() => {
      id = 'c3f9a7d2-1e24-45a6-91b7-8c3f43b2f222';
      updateData = {
        name: 'João Pereira Augusto',
        email: 'joao.pereira2@example.com',
        password: 'hashed_password_3',
      };
    });
    it('should update an user', async () => {
      jest.spyOn(mockPrismaService.user, 'update').mockReturnValue({
        ...updateData,
      });

      const result = await service.update(id, updateData);

      expect(result).toEqual(updateData);
    });

    it('should return an bad request exception', async () => {
      id = 'abc';
      jest.spyOn(mockPrismaService.user, 'update').mockReturnValue({
        ...updateData,
      });

      const result = await service.update(id, updateData);

      expect(result).toEqual(updateData);
    });
  });

  describe('remove', () => {
    it('should throw BadRequestException if user does not exist', async () => {
      const notExistentId = 'abcd';
      const rejectMessage = 'User does not exists';

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.remove(notExistentId)).rejects.toThrow(
        new BadRequestException(rejectMessage),
      );

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: notExistentId },
      });

      expect(mockPrismaService.user.delete).not.toHaveBeenCalled();
    });

    it('should delete a user', async () => {
      const id = 'a1f3c9c2-9b62-4a55-8f12-8d82d02c3d01';
      const user = {
        id: 'a1f3c9c2-9b62-4a55-8f12-8d82d02c3d01',
        name: 'Gabriel Godoi',
        email: 'gabriel.godoi@example.com',
        password: 'hashed_password_1',
      };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      mockPrismaService.user.delete.mockResolvedValue(user);

      const deleteUser = await service.remove(id);

      expect(deleteUser).toEqual(user);
    });
  });
});
