import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserDto } from './dto/user.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Resolver(() => UserDto)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => UserDto)
  async register(@Args('input') input: RegisterDto): Promise<UserDto> {
    return this.authService.register(input);
  }

  @Mutation(() => LoginResponseDto)
  async login(@Args('input') input: LoginDto): Promise<LoginResponseDto> {
    const accessToken = await this.authService.login(input);
    return { accessToken };
  }

  @Query(() => UserDto)
  async getProfile(@Args('userId') userId: string): Promise<UserDto> {
    return this.authService.getProfile(userId);
  }
}
