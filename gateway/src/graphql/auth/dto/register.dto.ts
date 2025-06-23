import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RegisterDto {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  name: string;

  @Field()
  lastName: string;
}
