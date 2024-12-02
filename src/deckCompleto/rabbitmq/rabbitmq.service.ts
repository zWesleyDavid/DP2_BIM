import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService {
    private client: ClientProxy;

    constructor() {
        this.client = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: ['amqp://localhost:5672'], // Atualize conforme necessário
                queue: 'deck_import_queue',
                queueOptions: {
                    durable: true,
                },
            },
        });
    }

    sendMessage(pattern: string, payload: any) {
        return this.client.emit(pattern, payload);
    }
}
