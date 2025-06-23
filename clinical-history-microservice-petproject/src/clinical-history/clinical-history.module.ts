import { Module } from '@nestjs/common';
import { ClinicalHistoryService } from './clinical-history.service';
import { ClinicalHistoryController } from './clinical-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicalHistory } from './entities/clinical-history.entity';


@Module({
  imports: [TypeOrmModule.forFeature([ClinicalHistory])],
  controllers: [ClinicalHistoryController],
  providers: [ClinicalHistoryService],
})
export class ClinicalHistoryModule {}
