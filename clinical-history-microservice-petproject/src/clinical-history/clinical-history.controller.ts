import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ClinicalHistoryService } from './clinical-history.service';
import { CreateClinicalHistoryDto } from './dto/create-clinical-history.dto';
import { UpdateClinicalHistoryDto } from './dto/update-clinical-history.dto';

@Controller()
export class ClinicalHistoryController {
  constructor(private readonly clinicalHistoryService: ClinicalHistoryService) {}

  @MessagePattern({ cmd: 'create_clinical_history' })
  create(dto: CreateClinicalHistoryDto) {
    return this.clinicalHistoryService.create(dto);
  }

  @MessagePattern({ cmd: 'get_clinical_history_by_pet' })
  findByPetId(petId: string) {
    return this.clinicalHistoryService.findByPetId(petId);
  }

  @MessagePattern({ cmd: 'get_clinical_history_by_user' })
  findByUserId(userId: string) {
    return this.clinicalHistoryService.findByUserId(userId);
  }

  @MessagePattern({ cmd: 'update_clinical_history' })
  update(data: { id: string; dto: UpdateClinicalHistoryDto }) {
    return this.clinicalHistoryService.update(data.id, data.dto);
  }

  @MessagePattern({ cmd: 'delete_clinical_history' })
  remove(id: string) {
    return this.clinicalHistoryService.remove(id);
  }
}
