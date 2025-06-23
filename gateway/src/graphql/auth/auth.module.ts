import { ClientsModule, Transport } from '@nestjs/microservices';
import { userClientOptions } from '../../grpc-ms/user.client';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        ...userClientOptions,
      },
    ]),
  ],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
