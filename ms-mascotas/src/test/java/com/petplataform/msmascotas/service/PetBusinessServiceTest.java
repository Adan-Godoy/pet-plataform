package com.petplataform.msmascotas.service;

import com.petplataform.msmascotas.model.Pet;
import com.petplataform.msmascotas.repository.PetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class) // Habilita la integración de Mockito con JUnit 5
class PetBusinessServiceTest {

    @Mock // Crea un mock (simulacro) de PetRepository
    private PetRepository petRepository;

    @InjectMocks // Crea una instancia de PetBusinessService e inyecta los mocks declarados arriba
    private PetBusinessService petBusinessService;

    private Pet pet;

    @BeforeEach
    void setUp() {
        // Preparamos un objeto Pet de prueba que usaremos en varios tests
        pet = new Pet("pet-id-123", "Buddy", "Golden Retriever", 2, "url.com/buddy.jpg", "owner-456");
    }

    @Test
    @DisplayName("Debería crear una mascota exitosamente")
    void shouldCreatePetSuccessfully() {
        // Given (Dado que...)
        // Cuando se llame a petRepository.save con cualquier objeto Pet...
        when(petRepository.save(any(Pet.class))).thenReturn(pet);

        // When (Cuando...)
        // Llamamos al método que queremos probar
        Pet createdPet = petBusinessService.createPet(new Pet());

        // Then (Entonces...)
        // Verificamos que el resultado no es nulo y tiene los datos esperados
        assertNotNull(createdPet);
        assertEquals("Buddy", createdPet.getName());

        // Verificamos que el método save del repositorio fue llamado exactamente 1 vez
        verify(petRepository).save(any(Pet.class));
    }

    @Test
    @DisplayName("Debería devolver una mascota cuando se encuentra por su ID")
    void shouldReturnPetWhenFoundById() {
        // Given
        when(petRepository.findById("pet-id-123")).thenReturn(Optional.of(pet));

        // When
        Optional<Pet> foundPet = petBusinessService.getPetById("pet-id-123");

        // Then
        assertTrue(foundPet.isPresent()); // Verificamos que el Optional no está vacío
        assertEquals("Buddy", foundPet.get().getName());
        verify(petRepository).findById("pet-id-123");
    }

    @Test
    @DisplayName("Debería devolver un Optional vacío si la mascota no se encuentra por su ID")
    void shouldReturnEmptyOptionalWhenPetNotFound() {
        // Given
        when(petRepository.findById("non-existent-id")).thenReturn(Optional.empty());

        // When
        Optional<Pet> foundPet = petBusinessService.getPetById("non-existent-id");

        // Then
        assertFalse(foundPet.isPresent()); // Verificamos que el Optional está vacío
        verify(petRepository).findById("non-existent-id");
    }
}