import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

// El nombre del token que usaremos para inyectar el cliente
export const PET_SERVICE_NAME = 'PET_SERVICE';
// El nombre del paquete que definimos en el .proto
const PET_PACKAGE_NAME = 'pet';

export const PetClientModule = ClientsModule.register([
  {
    name: PET_SERVICE_NAME,
    transport: Transport.GRPC,
    options: {
      // 'ms-mascotas' será el nombre del servicio en Docker Compose.
      // NestJS se conectará a 'ms-mascotas:9090'
      url: process.env.PET_GRPC_URL,
      package: PET_PACKAGE_NAME,
      protoPath: join(process.cwd(), 'src/proto/pet.proto'),
    },
  },
]);