import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';

// Test para el servicio de usuarios
describe('UserService', () => {
  let service: UserService;

  const mockUser = {
    id: 'uuid-123',
    email: 'test@mail.com',
    password: '123456',
    name: 'Test',
    lastName: 'User',
  };

  // Mock del repositorio de usuarios, para simular las operaciones de base de datos
  const mockRepo = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockResolvedValue(mockUser),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn().mockResolvedValue(null),
  };

  // Mock del servicio JWT, para simular la generación de tokens
  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('fake-token'),
  };

  // Configuración del entorno de pruebas
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockRepo },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  // Verifica que el servicio se haya creado correctamente
  it('should register a user', async () => {
    const hashed = await bcrypt.hash(mockUser.password, 10);
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve(hashed));

    const result = await service.register(mockUser);
    expect(result.email).toBe(mockUser.email);
    expect(mockRepo.create).toHaveBeenCalled();
    expect(mockRepo.save).toHaveBeenCalled();
  });

  // Verifica el proceso de login
  it('should login successfully', async () => {
    const hashed = await bcrypt.hash(mockUser.password, 10);
    mockRepo.findOne.mockResolvedValue({ ...mockUser, password: hashed });

    (jest.spyOn(bcrypt, 'compare') as unknown as jest.Mock).mockResolvedValue(true);

    const result = await service.login({ email: mockUser.email, password: mockUser.password });
    expect(result.accessToken).toBe('fake-token');
  });

  // verifica que el login falle con credenciales incorrectas
  it('should fail login with wrong user', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(
      service.login({ email: 'wrong', password: '123' })
    ).rejects.toThrow(UnauthorizedException);
  });

  // Verifica que se pueda obtener el perfil del usuario
  it('should get profile', async () => {
    mockRepo.findOne.mockResolvedValue(mockUser); 
    const result = await service.getProfile({ userId: mockUser.id });
    expect(result.name).toBe(mockUser.name);
  });

  // Verifica que se lance una excepción si el perfil no se encuentra
  it('should throw if profile not found', async () => {
    mockRepo.findOne.mockResolvedValue(null); // Simula user no existente
    await expect(service.getProfile({ userId: 'bad-id' })).rejects.toThrow(NotFoundException);
  });

  // Verifica que se pueda actualizar un usuario
  it('should update a user', async () => {
    const newData = { name: 'NuevoNombre' };
    mockRepo.findOneBy.mockResolvedValue({ ...mockUser });
    mockRepo.save.mockResolvedValue({ ...mockUser, ...newData });

    const result = await service.updateUser(mockUser.id, newData);
    expect(result.name).toBe('NuevoNombre');
  });

  // Verifica si se puede eliminar un usuario
  it('should delete a user', async () => {
    mockRepo.findOneBy.mockResolvedValue({ ...mockUser });
    const result = await service.deleteUser(mockUser.id);
    expect(result.message).toBe('User deleted successfully');
  });

  // verifica actualización de contraseña
  it('should hash password when updating it', async () => {
    const newData = { password: 'newpass123' };
    const hashed = await bcrypt.hash(newData.password, 10);

    mockRepo.findOneBy.mockResolvedValue({ ...mockUser });
    mockRepo.save.mockResolvedValue({ ...mockUser, password: hashed });

    (jest.spyOn(bcrypt, 'hash') as unknown as jest.Mock).mockResolvedValue(hashed);

    const result = await service.updateUser(mockUser.id, newData);
    expect(mockRepo.save).toHaveBeenCalled();
    });
});
