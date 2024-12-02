import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeckDocument } from './deck.schema';
import { RabbitMQService } from './rabbitmq/rabbitmq.service';

@Injectable()
export class DeckCompletoService {
    constructor(
        private readonly httpService: HttpService,
        @InjectModel('Deck') private deckModel: Model<DeckDocument>,
        private readonly rabbitMQService: RabbitMQService, // Adicionado RabbitMQService
    ) {}

    async getAllDecks(): Promise<DeckDocument[]> {
        try {
            const decks = await this.deckModel.find().exec();
            return decks;
        } catch (error) {
            throw new Error(`Erro ao buscar os decks: ${error.message}`);
        }
    }

    async getCommanderAndDeck(nomeComandante: string) {
        const commanderUrl = `https://api.magicthegathering.io/v1/cards?name=${encodeURIComponent(nomeComandante)}`;

        const commanderResponse = await this.httpService.get(commanderUrl).toPromise();
        const commander = commanderResponse.data.cards[0];

        if (!commanderResponse.data.cards || commanderResponse.data.cards.length === 0) {
            throw new Error('Comandante não encontrado!');
        }

        let deckUrl = '';
        if (commander.colors && commander.colors.length > 0) {
            const colors = commander.colors.join(',');
            deckUrl = `https://api.magicthegathering.io/v1/cards?colors=${colors}&pageSize=99`;
        } else {
            deckUrl = `https://api.magicthegathering.io/v1/cards?pageSize=99`;
        }

        const deckResponse = await this.httpService.get(deckUrl).toPromise();
        const deck = deckResponse.data.cards.map(card => ({
            name: card.name,
            imageUrl: card.imageUrl,
            manaCost: card.manaCost,
            type: card.type,
        }));

        const deckJson = {
            commander: {
                name: commander.name,
                imageUrl: commander.imageUrl,
                manaCost: commander.manaCost,
                type: commander.type,
                playerId: '',
            },
            deck,
        };

        const createdDeck = new this.deckModel(deckJson);
        await createdDeck.save();

        // Enviar mensagem para RabbitMQ
        await this.rabbitMQService.sendMessage('import_deck', {
            commander: deckJson.commander,
            deck: deckJson.deck,
        });

        return deckJson;
    }

    async getDeckByName(name: string): Promise<DeckDocument> {
        try {
            const deck = await this.deckModel.findOne({ 'commander.name': name }).exec();
            if (!deck) {
                throw new Error('Deck não encontrado!');
            }
            return deck;
        } catch (error) {
            throw new Error(`Erro ao buscar o deck: ${error.message}`);
        }
    }

    async updateDeckByName(name: string, updateData: Partial<DeckDocument>): Promise<DeckDocument> {
        try {
            const updatedDeck = await this.deckModel.findOneAndUpdate({ 'commander.name': name }, updateData, { new: true }).exec();
            if (!updatedDeck) {
                throw new Error('Deck não encontrado para atualização!');
            }
            return updatedDeck;
        } catch (error) {
            throw new Error(`Erro ao atualizar o deck: ${error.message}`);
        }
    }

    async deleteDeckByName(name: string): Promise<void> {
        try {
            const result = await this.deckModel.findOneAndDelete({ 'commander.name': name }).exec();
            if (!result) {
                throw new Error('Deck não encontrado para exclusão!');
            }
        } catch (error) {
            throw new Error(`Erro ao excluir o deck: ${error.message}`);
        }
    }
}
