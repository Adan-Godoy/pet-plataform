import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateClinicalHistoryDto {
  @Field()
  petId: string;

  @Field()
  userId: string;

  @Field()
  description: string;

  @Field()
  diagnosis: string;

  @Field()
  treatmentType: string;

  @Field()
  date: Date;

  @Field()
  veterinarianName: string;

  @Field()
  veterinaryClinic: string;
}