import { Module } from '@nestjs/common';
import { DeckCompletoService } from './deckcompleto.service';
import { DeckCompletoController } from './deckcompleto.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DeckSchema } from './deck.schema';
import { HttpModule } from '@nestjs/axios';
import { RabbitMQService } from './rabbitmq/rabbitmq.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Deck', schema: DeckSchema }]),
        HttpModule,
    ],
    controllers: [DeckCompletoController],
    providers: [DeckCompletoService, RabbitMQService],
})
export class DeckCompletoModule {}
