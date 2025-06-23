import { Transport, ClientOptions } from '@nestjs/microservices';
import { join } from 'path';

export const userClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'user',
    protoPath: join(process.cwd(), 'src/proto/user.proto'),
    url: process.env.USER_GRPC_URL, //cambiarrr
  },
};
