import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ComandanteModule } from './comandante/comandante.module';
import { DeckCompletoModule } from './deckCompleto/deckcompleto.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ComandanteModule,
    MongooseModule.forRoot('mongodb://localhost:27017/MTG'),
    DeckCompletoModule,
    ConfigModule.forRoot({isGlobal: true}),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
