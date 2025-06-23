import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ClinicalHistoryService } from './clinical-history.service';
import { ClinicalHistoryDto } from './dto/clinical-history.dto';
import { CreateClinicalHistoryDto } from './dto/create-clinical-history.dto';
import { UpdateClinicalHistoryDto } from './dto/update-clinical-history.dto';

@Resolver(() => ClinicalHistoryDto)
export class ClinicalHistoryResolver {
  constructor(private readonly service: ClinicalHistoryService) {}

  @Mutation(() => ClinicalHistoryDto)
  createClinicalHistory(@Args('input') input: CreateClinicalHistoryDto) {
    return this.service.create(input);
  }

  @Query(() => [ClinicalHistoryDto])
  getClinicalHistoryByPetId(@Args('petId') petId: string) {
    return this.service.findByPetId(petId);
  }

  @Query(() => [ClinicalHistoryDto])
  getClinicalHistoryByUserId(@Args('userId') userId: string) {
    return this.service.findByUserId(userId);
  }

  @Mutation(() => ClinicalHistoryDto)
  updateClinicalHistory(
    @Args('id') id: string,
    @Args('input') input: UpdateClinicalHistoryDto,
  ) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean)
  deleteClinicalHistory(@Args('id') id: string) {
    return this.service.remove(id);
  }
}
