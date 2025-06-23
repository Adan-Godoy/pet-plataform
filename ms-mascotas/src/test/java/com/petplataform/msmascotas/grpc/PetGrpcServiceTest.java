package com.petplataform.msmascotas.grpc;

import com.google.protobuf.Empty;
import com.petplataform.msmascotas.grpc.generated.*;
import com.petplataform.msmascotas.model.Pet;
import com.petplataform.msmascotas.repository.PetRepository;
import com.petplataform.msmascotas.service.PetBusinessService;
import io.grpc.ManagedChannel;
import io.grpc.StatusRuntimeException;
import io.grpc.inprocess.InProcessChannelBuilder;
import io.grpc.inprocess.InProcessServerBuilder;
import io.grpc.testing.GrpcCleanupRule;
import org.junit.Rule; // ¡IMPORTANTE! Usamos la anotación de JUnit 4
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith; // Importante para la compatibilidad
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

// Extendemos con Mockito para que @Mock funcione
@ExtendWith(MockitoExtension.class)
class PetGrpcServiceTest {

    // Usamos @Rule de JUnit 4, que es lo que GrpcCleanupRule espera.
    // El motor de JUnit Vintage lo recogerá.
    @Rule
    public final GrpcCleanupRule grpcCleanup = new GrpcCleanupRule();

    @Mock
    private PetRepository petRepository;

    private PetServiceGrpc.PetServiceBlockingStub blockingStub;

    @BeforeEach
    void setUp() throws IOException {
        // La creación manual del servicio, servidor y cliente sigue siendo la misma.
        PetBusinessService petBusinessService = new PetBusinessService(petRepository);
        PetGrpcService petGrpcService = new PetGrpcService(petBusinessService);

        String serverName = InProcessServerBuilder.generateName();

        grpcCleanup.register(InProcessServerBuilder
                .forName(serverName).directExecutor().addService(petGrpcService).build().start());

        ManagedChannel channel = grpcCleanup.register(InProcessChannelBuilder
                .forName(serverName).directExecutor().build());

        blockingStub = PetServiceGrpc.newBlockingStub(channel);
    }

    // Los tests @Test siguen siendo de JUnit 5 y no cambian en absoluto.
    @Test
    @DisplayName("Debería crear una mascota exitosamente")
    void createPet_shouldReturnCreatedPet() {
        // Given
        Pet petToCreate = new Pet("pet-id-123", "Lassie", "Collie", 3, "url.com/lassie.jpg", "owner-789");
        when(petRepository.save(any(Pet.class))).thenReturn(petToCreate);
        CreatePetRequest request = CreatePetRequest.newBuilder()
                .setName("Lassie").setBreed("Collie").setAge(3)
                .setPhotoUrl("url.com/lassie.jpg").setOwnerId("owner-789").build();
        // When
        PetResponse response = blockingStub.createPet(request);
        // Then
        assertNotNull(response);
        assertEquals("pet-id-123", response.getId());
        assertEquals("Lassie", response.getName());
    }

    @Test
    @DisplayName("Debería obtener una mascota existente por ID")
    void getPetById_whenPetExists_shouldReturnPet() {
        // Given
        Pet existingPet = new Pet("pet-id-123", "Lassie", "Collie", 3, "url.com/lassie.jpg", "owner-789");
        when(petRepository.findById("pet-id-123")).thenReturn(Optional.of(existingPet));
        PetIdRequest request = PetIdRequest.newBuilder().setId("pet-id-123").build();
        // When
        PetResponse response = blockingStub.getPetById(request);
        // Then
        assertNotNull(response);
        assertEquals("pet-id-123", response.getId());
    }

    @Test
    @DisplayName("Debería lanzar NOT_FOUND si la mascota no existe")
    void getPetById_whenPetDoesNotExist_shouldThrowNotFound() {
        // Given
        when(petRepository.findById("non-existent-id")).thenReturn(Optional.empty());
        PetIdRequest request = PetIdRequest.newBuilder().setId("non-existent-id").build();
        // When & Then
        StatusRuntimeException exception = assertThrows(StatusRuntimeException.class, () -> {
            blockingStub.getPetById(request);
        });
        assertEquals("NOT_FOUND", exception.getStatus().getCode().toString());
    }

    @Test
    @DisplayName("Debería actualizar una mascota existente")
    void updatePet_whenPetExists_shouldReturnUpdatedPet() {
        // Given
        Pet updatedData = new Pet("pet-id-123", "Buddy Actualizado", "Labrador", 6, "url.com/new.jpg", "owner-789");

        // Simula que primero se encuentra la mascota original
        when(petRepository.findById("pet-id-123")).thenReturn(Optional.of(new Pet("pet-id-123", "Buddy", "Labrador", 5, "url.com/old.jpg", "owner-789")));
        // Simula que al guardarla, se devuelve la mascota con los datos actualizados
        when(petRepository.save(any(Pet.class))).thenReturn(updatedData);

        UpdatePetRequest request = UpdatePetRequest.newBuilder()
                .setId("pet-id-123")
                .setName("Buddy Actualizado")
                .setBreed("Labrador")
                .setAge(6)
                .setPhotoUrl("url.com/new.jpg")
                .build();

        // When
        PetResponse response = blockingStub.updatePet(request);

        // Then
        assertNotNull(response);
        assertEquals("Buddy Actualizado", response.getName());
        assertEquals(6, response.getAge());
    }

    @Test
    @DisplayName("Debería lanzar NOT_FOUND al intentar actualizar una mascota inexistente")
    void updatePet_whenPetDoesNotExist_shouldThrowNotFound() {
        // Given
        when(petRepository.findById("non-existent-id")).thenReturn(Optional.empty());

        UpdatePetRequest request = UpdatePetRequest.newBuilder()
                .setId("non-existent-id")
                .setName("Fantasma")
                .build();

        // When & Then
        StatusRuntimeException exception = assertThrows(StatusRuntimeException.class, () -> {
            blockingStub.updatePet(request);
        });
        assertEquals("NOT_FOUND", exception.getStatus().getCode().toString());
    }

    @Test
    @DisplayName("Debería eliminar una mascota sin errores")
    void deletePet_shouldCompleteWithoutError() {
        // Given
        PetIdRequest request = PetIdRequest.newBuilder().setId("pet-id-to-delete").build();

        // When & Then
        // assertDoesNotThrow se asegura de que la llamada se complete sin excepciones
        assertDoesNotThrow(() -> {
            Empty response = blockingStub.deletePet(request);
            assertNotNull(response); // Podemos verificar que la respuesta no es nula
        });
    }

    @Test
    @DisplayName("Debería devolver una lista de mascotas para un dueño")
    void getPetsByOwner_shouldReturnPetList() {
        // Given
        Pet pet1 = new Pet("id1", "Max", "Beagle", 3, "", "owner-123");
        Pet pet2 = new Pet("id2", "Lucy", "Poodle", 5, "", "owner-123");
        when(petRepository.findByOwnerId("owner-123")).thenReturn(List.of(pet1, pet2));

        OwnerIdRequest request = OwnerIdRequest.newBuilder().setOwnerId("owner-123").build();

        // When
        PetListResponse response = blockingStub.getPetsByOwner(request);

        // Then
        assertNotNull(response);
        assertEquals(2, response.getPetsCount());
        assertEquals("Max", response.getPets(0).getName());
    }

    @Test
    @DisplayName("Debería devolver una lista vacía si el dueño no tiene mascotas")
    void getPetsByOwner_whenNoPets_shouldReturnEmptyList() {
        // Given
        when(petRepository.findByOwnerId("owner-without-pets")).thenReturn(Collections.emptyList());

        OwnerIdRequest request = OwnerIdRequest.newBuilder().setOwnerId("owner-without-pets").build();

        // When
        PetListResponse response = blockingStub.getPetsByOwner(request);

        // Then
        assertNotNull(response);
        assertEquals(0, response.getPetsCount());
    }
}