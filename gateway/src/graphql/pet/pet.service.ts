import { Inject, Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PET_SERVICE_NAME } from 'src/grpc-ms/pet.client';

// Tipos de gRPC (los que se envían/reciben del microservicio)
import {
  PetServiceClient,
  PET_SERVICE_NAME as PET_PROTO_SERVICE_NAME,
  PetResponse,
} from 'src/proto/src/proto/pet';

// DTOs de GraphQL (los que se usan en el resolver y la lógica del gateway)
import { CreatePetInput } from './dto/create-pet.input';
import { UpdatePetInput } from './dto/update-pet.input';
import { Pet } from './dto/pet.dto';

@Injectable()
export class PetGraphQLService implements OnModuleInit {
  private petMicroservice: PetServiceClient;

  constructor(@Inject(PET_SERVICE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.petMicroservice =
      this.client.getService<PetServiceClient>(PET_PROTO_SERVICE_NAME);
  }

  // RECIBE un DTO de GraphQL y DEVUELVE un DTO de GraphQL
  async createPet(createPetInput: CreatePetInput): Promise<Pet> {
    // 1. Convierte el input de GraphQL al request de gRPC
    // (en este caso, los campos se llaman igual, así que es directo)
    const grpcRequest = createPetInput;

    // 2. Llama al microservicio gRPC
    const grpcResponse = await firstValueFrom(
      this.petMicroservice.createPet(grpcRequest),
    );

    // 3. Convierte la respuesta de gRPC de vuelta al DTO de GraphQL y la devuelve
    return this.mapGrpcResponseToDto(grpcResponse);
  }

  async findOneById(id: string): Promise<Pet> {
    try {
      const grpcResponse = await firstValueFrom(
        this.petMicroservice.getPetById({ id }),
      );
      return this.mapGrpcResponseToDto(grpcResponse);
    } catch (error) {
      // Manejar el caso de que gRPC devuelva un error (ej. NOT_FOUND)
      if (error.code === 5) { // 5 es el código gRPC para NOT_FOUND
        throw new NotFoundException(`Pet with ID ${id} not found`);
      }
      throw error; // Relanzar otros errores
    }
  }

  async findByOwner(ownerId: string): Promise<Pet[]> {
    const { pets } = await firstValueFrom(
      this.petMicroservice.getPetsByOwner({ ownerId }),
    );
    // Mapea cada item de la respuesta gRPC a nuestro DTO Pet
    return (pets || []).map(this.mapGrpcResponseToDto);
  }

  // Aquí el input viene combinado desde el resolver
  async updatePet(updateData: { id: string } & UpdatePetInput): Promise<Pet> {
    const grpcResponse = await firstValueFrom(
      this.petMicroservice.updatePet(updateData),
    );
    return this.mapGrpcResponseToDto(grpcResponse);
  }

  async deletePet(id: string): Promise<void> {
    await firstValueFrom(this.petMicroservice.deletePet({ id }));
  }

  /**
   * Método helper privado para mapear la respuesta gRPC al DTO de GraphQL.
   * Útil para no repetir código.
   */
  private mapGrpcResponseToDto(grpcResponse: PetResponse): Pet {
    const petDto = new Pet();
    petDto.id = grpcResponse.id;
    petDto.name = grpcResponse.name;
    petDto.breed = grpcResponse.breed;
    petDto.age = grpcResponse.age;
    petDto.photoUrl = grpcResponse.photoUrl;
    petDto.ownerId = grpcResponse.ownerId;
    return petDto;
  }
}