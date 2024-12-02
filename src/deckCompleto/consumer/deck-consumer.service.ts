import { Injectable } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Injectable()
export class DeckConsumerService {
  @EventPattern('import_deck')
  async handleDeckImport(payload: any) {
    console.log('Mensagem recebida para importação de deck:', payload);
    // Adicione aqui a lógica para processar o deck
  }
}
