import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClinicalHistory } from './entities/clinical-history.entity';
import { CreateClinicalHistoryDto } from './dto/create-clinical-history.dto';
import { UpdateClinicalHistoryDto } from './dto/update-clinical-history.dto';

@Injectable()
export class ClinicalHistoryService {
  constructor(
    @InjectRepository(ClinicalHistory)
    private readonly historyRepo: Repository<ClinicalHistory>,
  ) {}

  async create(dto: CreateClinicalHistoryDto) {
    const history = this.historyRepo.create(dto);
    return await this.historyRepo.save(history);
  }

  async findByPetId(petId: string) {
    return await this.historyRepo.find({ where: { petId } });
  }

  async findByUserId(userId: string) {
    return await this.historyRepo.find({ where: { userId } });
  }

  async update(id: string, dto: UpdateClinicalHistoryDto) {
    const history = await this.historyRepo.findOne({ where: { id } });
    if (!history) throw new NotFoundException('History not found');
    Object.assign(history, dto);
    return await this.historyRepo.save(history);
  }

  async remove(id: string) {
    const history = await this.historyRepo.findOne({ where: { id } });
    if (!history) throw new NotFoundException('History not found');
    return await this.historyRepo.remove(history);
  }
}
