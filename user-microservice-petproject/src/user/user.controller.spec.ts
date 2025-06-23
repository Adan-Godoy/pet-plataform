import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

// Test para el controlador de usuarios
describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    register: jest.fn().mockResolvedValue({
      id: 'uuid',
      email: 'test@mail.com',
      name: 'Test',
      lastName: 'User',
    }),
    login: jest.fn().mockResolvedValue({
      accessToken: 'fake-token',
    }),
    getProfile: jest.fn().mockResolvedValue({
      id: 'uuid',
      email: 'test@mail.com',
      name: 'Test',
    }),
    updateUser: jest.fn().mockResolvedValue({
      id: 'uuid',
      email: 'new@mail.com',
      name: 'Updated',
      lastName: 'User',
    }),
    deleteUser: jest.fn().mockResolvedValue({
      message: 'User deleted successfully',
    }),
  };

  // Mock del servicio de usuarios, para simular las respuestas esperadas
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  // Verifica que el controlador se haya creado correctamente
  it('should call register', async () => {
    const result = await controller.register({
      email: 'test@mail.com',
      password: '123456',
      name: 'Test',
      lastName: 'User',
    });
    expect(result.email).toBe('test@mail.com');
    expect(service.register).toHaveBeenCalled();
  });

  // Verifica que el controlador llame al método de inicio de sesión
  it('should call login', async () => {
    const result = await controller.login({
      email: 'test@mail.com',
      password: '123456',
    });
    expect(result.accessToken).toBe('fake-token');
    expect(service.login).toHaveBeenCalled();
  });

  // Verifica que el controlador llame al método de obtener perfil
  it('should call getProfile', async () => {
    const result = await controller.getProfile({ userId: 'uuid' });
    expect(result.name).toBe('Test');
    expect(service.getProfile).toHaveBeenCalled();
  });

  // Verifica que el controlador llame al método de actualización de usuario
  it('should call updateUser', async () => {
    const result = await controller.updateUser({
      id: 'uuid',
      name: 'Updated',
      email: 'new@mail.com',
    });
    expect(result.name).toBe('Updated');
    expect(service.updateUser).toHaveBeenCalled();
  });

  //verifica que el controlador llame al método de eliminación de usuario
  it('should call deleteUser', async () => {
    const result = await controller.deleteUser({ id: 'uuid' });
    expect(result.message).toBe('User deleted successfully');
    expect(service.deleteUser).toHaveBeenCalled();
  });
});
