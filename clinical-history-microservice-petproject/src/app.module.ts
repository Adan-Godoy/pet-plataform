import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClinicalHistoryModule } from './clinical-history/clinical-history.module';
import { ClinicalHistory } from './clinical-history/entities/clinical-history.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt( '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres', 
      database: process.env.DB_NAME || 'clinical_history',
      entities: [ClinicalHistory],
      synchronize: true, 
    }),
    TypeOrmModule.forFeature([ClinicalHistory]),
    ClinicalHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
