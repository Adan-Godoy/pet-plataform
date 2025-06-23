import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Pet {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  breed: string;

  @Field(() => Int, { nullable: true }) 
  age: number;

  @Field({ nullable: true })
  photoUrl?: string;

  @Field(() => ID)
  ownerId: string;
}