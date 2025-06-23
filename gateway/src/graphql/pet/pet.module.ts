import { Module } from '@nestjs/common';
import { PetGraphQLService } from './pet.service';
import { PetResolver } from './pet.resolver';
import { PetClientModule } from 'src/grpc-ms/pet.client';

@Module({
  imports: [PetClientModule], // Importamos la configuración del cliente gRPC
  providers: [PetResolver, PetGraphQLService],
})
export class PetModule {}