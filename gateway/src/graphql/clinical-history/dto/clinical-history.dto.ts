import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class ClinicalHistoryDto {
  @Field(() => ID)
  id: string;

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