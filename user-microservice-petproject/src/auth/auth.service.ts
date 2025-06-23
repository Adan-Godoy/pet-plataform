import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signPayload(payload: any) {
    return this.jwtService.signAsync(payload);
  }

  async verifyToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }
}
