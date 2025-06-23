import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdatePetInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  breed?: string;

  @Field(() => Int, { nullable: true })
  age?: number;

  @Field({ nullable: true })
  photoUrl?: string;
}