import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserDto } from './dto/user.dto';

interface LoginResponse {
  accessToken: string;
}

interface UserGrpcService {
  Register(data: RegisterDto): Observable<UserDto>;
  Login(data: LoginDto): Observable<LoginResponse>;
  GetProfile(data: { userId: string }): Observable<UserDto>;
}

@Injectable()
export class AuthService implements OnModuleInit {
  private userService: UserGrpcService;

  constructor(@Inject('USER_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserGrpcService>('UserService');
  }

  async register(input: RegisterDto): Promise<UserDto> {
    return await lastValueFrom(this.userService.Register(input));
  }

  async login(input: LoginDto): Promise<string> {
    const result = await lastValueFrom(this.userService.Login(input));
    return result.accessToken;
  }

  async getProfile(userId: string): Promise<UserDto> {
    return await lastValueFrom(this.userService.GetProfile({ userId }));
  }
}
