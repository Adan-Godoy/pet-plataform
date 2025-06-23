package com.petplataform.msmascotas.service;

import com.petplataform.msmascotas.model.Pet;
import com.petplataform.msmascotas.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor // Inyecta las dependencias final vía constructor (Lombok)
public class PetBusinessService {

    private final PetRepository petRepository;

    public List<Pet> getPetsByOwner(String ownerId) {
        return petRepository.findByOwnerId(ownerId);
    }

    public Optional<Pet> getPetById(String id) {
        return petRepository.findById(id);
    }

    public Pet createPet(Pet pet) {
        // Aquí podrías añadir validaciones antes de guardar
        return petRepository.save(pet);
    }

    public Optional<Pet> updatePet(String id, Pet updatedPetData) {
        return petRepository.findById(id).map(pet -> {
            pet.setName(updatedPetData.getName());
            pet.setBreed(updatedPetData.getBreed());
            pet.setAge(updatedPetData.getAge());
            pet.setPhotoUrl(updatedPetData.getPhotoUrl());
            return petRepository.save(pet);
        });
    }

    public void deletePet(String id) {
        petRepository.deleteById(id);
    }
}