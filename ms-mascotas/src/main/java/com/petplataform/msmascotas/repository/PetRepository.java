package com.petplataform.msmascotas.repository;

import com.petplataform.msmascotas.model.Pet;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PetRepository extends MongoRepository<Pet, String> {

    // Spring Data creará la implementación de este método automáticamente
    // para buscar todas las mascotas por el ID del dueño.
    List<Pet> findByOwnerId(String ownerId);
}
