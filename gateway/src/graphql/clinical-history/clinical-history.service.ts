import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateClinicalHistoryDto } from './dto/create-clinical-history.dto';
import { UpdateClinicalHistoryDto } from './dto/update-clinical-history.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ClinicalHistoryService {
  constructor(
    @Inject('CLINICAL_HISTORY_SERVICE') private client: ClientProxy,
  ) {}

  async create(input: CreateClinicalHistoryDto) {
    return await lastValueFrom(this.client.send('createClinicalHistory', input));
  }

  async findByPetId(petId: string) {
    return await lastValueFrom(this.client.send('getClinicalHistoryByPetId', petId));
  }

  async findByUserId(userId: string) {
    return await lastValueFrom(this.client.send('getClinicalHistoryByUserId', userId));
  }

  async update(id: string, input: UpdateClinicalHistoryDto) {
    return await lastValueFrom(this.client.send('updateClinicalHistory', { id, ...input }));
  }

  async remove(id: string) {
    return await lastValueFrom(this.client.send('deleteClinicalHistory', id));
  }
}
