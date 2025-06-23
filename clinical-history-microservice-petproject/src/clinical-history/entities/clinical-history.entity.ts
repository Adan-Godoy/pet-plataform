import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ClinicalHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  petId: string;

  @Column()
  userId: string;

  @Column()
  description: string;

  @Column()
  diagnosis: string;

  @Column()
  treatmentType: string;

  @Column()
  date: Date;

  @Column()
  veterinarianName: string;

  @Column()
  veterinaryClinic: string;
}
