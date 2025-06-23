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
    // 1. El patrón debe ser un objeto que coincida con @MessagePattern
    const pattern = { cmd: 'create_clinical_history' };
    const payload = input;
    
    return await lastValueFrom(this.client.send(pattern, payload));
  }

  async findByPetId(petId: string) {
    const pattern = { cmd: 'get_clinical_history_by_pet' };
    const payload = petId;

    return await lastValueFrom(this.client.send(pattern, payload));
  }

  async findByUserId(userId: string) {
    const pattern = { cmd: 'get_clinical_history_by_user' };
    const payload = userId;

    return await lastValueFrom(this.client.send(pattern, payload));
  }

  async update(id: string, input: UpdateClinicalHistoryDto) {
    const pattern = { cmd: 'update_clinical_history' };
    // 2. El payload debe ser un objeto con 'id' y 'dto', como espera el microservicio
    const payload = { id, dto: input }; 

    return await lastValueFrom(this.client.send(pattern, payload));
  }

  async remove(id: string) {
    const pattern = { cmd: 'delete_clinical_history' };
    const payload = id;

    // Usamos send para esperar una respuesta (o un error), lo cual es bueno.
    await lastValueFrom(this.client.send(pattern, payload));
    return true; // Si no hay error, la operación fue exitosa.
  }
}
