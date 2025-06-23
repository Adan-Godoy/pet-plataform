package com.petplataform.msmascotas.grpc;

import com.google.protobuf.Empty;
import com.petplataform.msmascotas.grpc.generated.*;
import com.petplataform.msmascotas.model.Pet;
import com.petplataform.msmascotas.service.PetBusinessService;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import net.devh.boot.grpc.server.service.GrpcService;

import java.util.List;
import java.util.stream.Collectors;

@GrpcService // Anotación que registra esta clase como un servicio gRPC
@RequiredArgsConstructor
public class PetGrpcService extends PetServiceGrpc.PetServiceImplBase {

    private final PetBusinessService petBusinessService;

    @Override
    public void createPet(CreatePetRequest request, StreamObserver<PetResponse> responseObserver) {
        Pet newPet = new Pet(null, request.getName(), request.getBreed(), request.getAge(), request.getPhotoUrl(), request.getOwnerId());
        Pet createdPet = petBusinessService.createPet(newPet);

        responseObserver.onNext(toPetResponse(createdPet));
        responseObserver.onCompleted();
    }

    @Override
    public void getPetById(PetIdRequest request, StreamObserver<PetResponse> responseObserver) {
        petBusinessService.getPetById(request.getId())
                .ifPresentOrElse(
                        pet -> {
                            responseObserver.onNext(toPetResponse(pet));
                            responseObserver.onCompleted();
                        },
                        () -> responseObserver.onError(Status.NOT_FOUND
                                .withDescription("Mascota no encontrada con ID: " + request.getId())
                                .asRuntimeException())
                );
    }

    @Override
    public void getPetsByOwner(OwnerIdRequest request, StreamObserver<PetListResponse> responseObserver) {
        List<Pet> pets = petBusinessService.getPetsByOwner(request.getOwnerId());

        List<PetResponse> petResponses = pets.stream()
                .map(this::toPetResponse)
                .collect(Collectors.toList());

        PetListResponse response = PetListResponse.newBuilder()
                .addAllPets(petResponses)
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void updatePet(UpdatePetRequest request, StreamObserver<PetResponse> responseObserver) {
        Pet petData = new Pet(null, request.getName(), request.getBreed(), request.getAge(), request.getPhotoUrl(), null);

        petBusinessService.updatePet(request.getId(), petData)
                .ifPresentOrElse(
                        updatedPet -> {
                            responseObserver.onNext(toPetResponse(updatedPet));
                            responseObserver.onCompleted();
                        },
                        () -> responseObserver.onError(Status.NOT_FOUND
                                .withDescription("No se pudo actualizar, mascota no encontrada con ID: " + request.getId())
                                .asRuntimeException())
                );
    }

    @Override
    public void deletePet(PetIdRequest request, StreamObserver<Empty> responseObserver) {
        try {
            petBusinessService.deletePet(request.getId());
            responseObserver.onNext(Empty.getDefaultInstance());
            responseObserver.onCompleted();
        } catch (Exception e) {
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Error al eliminar la mascota: " + e.getMessage())
                    .asRuntimeException());
        }
    }


    // Método helper para convertir nuestra entidad Pet a la respuesta gRPC PetResponse
    private PetResponse toPetResponse(Pet pet) {
        return PetResponse.newBuilder()
                .setId(pet.getId())
                .setName(pet.getName())
                .setBreed(pet.getBreed())
                .setAge(pet.getAge())
                .setPhotoUrl(pet.getPhotoUrl())
                .setOwnerId(pet.getOwnerId())
                .build();
    }
}