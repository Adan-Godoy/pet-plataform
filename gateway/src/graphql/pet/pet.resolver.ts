import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { PetGraphQLService } from './pet.service';
// --- ¡CAMBIO IMPORTANTE! Importamos desde nuestros archivos DTO ---
import { Pet } from './dto/pet.dto';
import { CreatePetInput } from './dto/create-pet.input';
import { UpdatePetInput } from './dto/update-pet.input';

@Resolver(() => Pet) // El resolver ahora se asocia con nuestro DTO Pet
export class PetResolver {
  constructor(private readonly petService: PetGraphQLService) {}

  @Mutation(() => Pet, { name: 'createPet' })
  createPet(@Args('input') input: CreatePetInput): Promise<Pet> {
    // La respuesta del servicio gRPC debe ser mapeada a nuestro DTO Pet
    return this.petService.createPet(input);
  }

  @Query(() => [Pet], { name: 'petsByOwner' })
  findByOwner(@Args('ownerId', { type: () => ID }) ownerId: string): Promise<Pet[]> {
    return this.petService.findByOwner(ownerId);
  }
  
  @Query(() => Pet, { name: 'pet', nullable: true })
  findOne(@Args('id', { type: () => ID }) id: string): Promise<Pet> {
    return this.petService.findOneById(id);
  }

  @Mutation(() => Pet, { name: 'updatePet' })
  updatePet(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdatePetInput,
  ): Promise<Pet> {
    return this.petService.updatePet({ id, ...input });
  }

  @Mutation(() => Boolean, { name: 'deletePet' })
  async deletePet(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    await this.petService.deletePet(id);
    return true;
  }
}