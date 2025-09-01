import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { randomUUID } from 'crypto';

const mockUserService = {
  create: jest.fn(),
  update: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

describe('UserController', () => {
  let userController: UserController;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    userController = moduleRef.get<UserController>(UserController);
  });

  describe('create', () => {
    it('should create an user', async () => {
      const user = {
        name: 'Gabriel',
        email: 'gabriel@gmail.com',
        password: '123abc',
      };
      const id = randomUUID();

      jest.spyOn(mockUserService, 'create').mockResolvedValue({
        id,
        ...user,
      });

      const result = await userController.create(user);

      expect(result).toEqual({
        id,
        ...user,
      });
      expect(mockUserService.create).toHaveBeenCalledTimes(1);
      expect(mockUserService.create).toHaveBeenCalled();
      expect(mockUserService.create).toHaveBeenCalledWith(user);
    });

    it('should return a conflict exception', () => {});
  });
});
