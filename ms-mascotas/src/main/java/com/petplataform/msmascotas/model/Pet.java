package com.petplataform.msmascotas.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data // Genera getters, setters, toString, etc.
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "pets") // Nombre de la colección en MongoDB
public class Pet {

    @Id
    private String id;

    private String name;
    private String breed;
    private int age;
    private String photoUrl;
    private String ownerId; // Vincula la mascota con su dueño
}