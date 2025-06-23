import { Test, TestingModule } from '@nestjs/testing';
import { ClinicalHistoryController } from './clinical-history.controller';
import { ClinicalHistoryService } from './clinical-history.service';
import { CreateClinicalHistoryDto } from './dto/create-clinical-history.dto';

describe('ClinicalHistoryController', () => {
  let controller: ClinicalHistoryController;
  let service: ClinicalHistoryService;

  const mockClinicalHistory = {
    id: '1',
    petId: 'pet123',
    userId: 'user123',
    description: 'Consulta de rutina',
    diagnosis: 'Sano',
    treatmentType: 'Ninguno',
    treatment: 'Ninguno',
    date: new Date('2024-01-01'),
    veterinarianName: 'Dra. López',
    veterinaryClinic: 'VetClinic Norte',
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockClinicalHistory),
    findByPetId: jest.fn().mockResolvedValue([mockClinicalHistory]),
    findByUserId: jest.fn().mockResolvedValue([mockClinicalHistory]),
    update: jest.fn().mockResolvedValue({ ...mockClinicalHistory, diagnosis: 'Mejorado' }),
    remove: jest.fn().mockResolvedValue(mockClinicalHistory),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClinicalHistoryController],
      providers: [{ provide: ClinicalHistoryService, useValue: mockService }],
    }).compile();

    controller = module.get<ClinicalHistoryController>(ClinicalHistoryController);
    service = module.get<ClinicalHistoryService>(ClinicalHistoryService);
  });

  it('debe crear historia clínica', async () => {
    const dto: CreateClinicalHistoryDto = mockClinicalHistory;
    const result = await controller.create(dto);
    expect(result).toEqual(mockClinicalHistory);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('debe retornar historias por mascota', async () => {
    const result = await controller.findByPetId('pet123');
    expect(result).toEqual([mockClinicalHistory]);
  });

  it('debe retornar historias por usuario', async () => {
    const result = await controller.findByUserId('user123');
    expect(result).toEqual([mockClinicalHistory]);
  });

  it('debe actualizar historia', async () => {
    const result = await controller.update({ id: '1', dto: { diagnosis: 'Mejorado' } });
    expect(result.diagnosis).toBe('Mejorado');
  });

  it('debe eliminar historia', async () => {
    const result = await controller.remove('1');
    expect(result).toEqual(mockClinicalHistory);
  });
});
