import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateClinicalHistoryDto } from './create-clinical-history.dto';

@InputType()
export class UpdateClinicalHistoryDto extends PartialType(CreateClinicalHistoryDto) {}
