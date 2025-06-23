import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './graphql/auth/auth.module';
import { ClinicalHistoryModule } from './graphql/clinical-history/clinical-history.module';
import { PetModule } from './graphql/pet/pet.module';
import { DateTimeScalar } from './common/scalars/date.scalar';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      introspection: true,
      sortSchema: true,
      
    }),

    AuthModule, ClinicalHistoryModule, PetModule,
  ],
  controllers: [AppController],
  providers: [AppService, DateTimeScalar],
})
export class AppModule {}
