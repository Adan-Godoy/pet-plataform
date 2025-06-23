import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import { HttpToRpcExceptionInterceptor } from './common/interceptors/http-to-rcp-exeption.interceptor'; 

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: join(__dirname, '../src/proto/user.proto'), 
      url: '0.0.0.0:50051',
    },
  });

  // --- APLICA EL INTERCEPTOR GLOBALMENTE ---
  app.useGlobalInterceptors(new HttpToRpcExceptionInterceptor());

  await app.listen();
}
bootstrap();
