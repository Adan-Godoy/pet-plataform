import { Module } from '@nestjs/common';
import { ClinicalHistoryService } from './clinical-history.service';
import { ClinicalHistoryResolver } from './clinical-history.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CLINICAL_HISTORY_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@rabbitmq:5672'],
          queue: 'clinical_history_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  providers: [ClinicalHistoryResolver, ClinicalHistoryService],
})
export class ClinicalHistoryModule {}
