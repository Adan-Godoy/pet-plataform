import { Test, TestingModule } from '@nestjs/testing';
import { ClinicalHistoryService } from './clinical-history.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClinicalHistory } from './entities/clinical-history.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ClinicalHistoryService', () => {
  let service: ClinicalHistoryService;
  let repo: Repository<ClinicalHistory>;

  const mockClinicalHistory: ClinicalHistory = {
    id: '1',
    petId: 'pet123',
    userId: 'user123',
    description: 'Consulta de rutina',
    diagnosis: 'Sano',
    treatmentType: 'Reposo',
    date: new Date('2024-01-01'),
    veterinarianName: 'Dra. López',
    veterinaryClinic: 'VetClinic Norte',
  };

  const mockRepo = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockResolvedValue(mockClinicalHistory),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn().mockResolvedValue(mockClinicalHistory),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClinicalHistoryService,
        { provide: getRepositoryToken(ClinicalHistory), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<ClinicalHistoryService>(ClinicalHistoryService);
    repo = module.get(getRepositoryToken(ClinicalHistory));
  });

  it('debe crear una historia clínica', async () => {
    const dto = { ...mockClinicalHistory };
    const result = await service.create(dto);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalled();
    expect(result).toEqual(mockClinicalHistory);
  });

  it('debe retornar historias por ID de mascota', async () => {
    repo.find = jest.fn().mockResolvedValue([mockClinicalHistory]);
    const result = await service.findByPetId('pet123');
    expect(result).toEqual([mockClinicalHistory]);
  });

  it('debe retornar historias por ID de usuario', async () => {
    repo.find = jest.fn().mockResolvedValue([mockClinicalHistory]);
    const result = await service.findByUserId('user123');
    expect(result).toEqual([mockClinicalHistory]);
  });

  it('debe actualizar una historia si existe', async () => {
    repo.findOne = jest.fn().mockResolvedValue(mockClinicalHistory);
    repo.save = jest.fn().mockResolvedValue({ ...mockClinicalHistory, diagnosis: 'Nuevo diagnóstico' });

    const result = await service.update('1', { diagnosis: 'Nuevo diagnóstico' } as any);
    expect(result.diagnosis).toBe('Nuevo diagnóstico');
  });

  it('debe lanzar error si no encuentra historia para actualizar', async () => {
    repo.findOne = jest.fn().mockResolvedValue(null);
    await expect(service.update('999', {} as any)).rejects.toThrow(NotFoundException);
  });

  it('debe eliminar una historia si existe', async () => {
    repo.findOne = jest.fn().mockResolvedValue(mockClinicalHistory);
    const result = await service.remove('1');
    expect(result).toEqual(mockClinicalHistory);
  });

  it('debe lanzar error si no encuentra historia para eliminar', async () => {
    repo.findOne = jest.fn().mockResolvedValue(null);
    await expect(service.remove('999')).rejects.toThrow(NotFoundException);
  });
});
