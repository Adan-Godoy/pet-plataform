export class CreateClinicalHistoryDto {
  petId: string;
  userId: string;
  description: string;
  diagnosis: string;
  treatment: string;
  date: Date;
  veterinarianName: string;
  veterinaryClinic: string;
}
