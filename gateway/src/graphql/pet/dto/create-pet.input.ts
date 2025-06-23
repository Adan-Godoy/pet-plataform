import { InputType, Field, ID, Int } from '@nestjs/graphql';

@InputType()
export class CreatePetInput {
  @Field()
  name: string;

  @Field()
  breed: string;

  @Field(() => Int)
  age: number;

  @Field({ nullable: true })
  photoUrl?: string;

  @Field(() => ID)
  ownerId: string;
}