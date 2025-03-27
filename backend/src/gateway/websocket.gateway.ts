import {
  WebSocketGateway as NestWebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventEntity } from 'src/common/entities/event.entity';

@NestWebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private readonly connections: Map<string, Socket> = new Map();

  afterInit() {
    console.log('Initialized');
  }

  handleConnection(client: Socket) {
    if (!this.connections.has(client.id)) {
      this.connections.set(client.id, client);
    }
  }

  handleDisconnect(client: Socket) {
    if (this.connections.has(client.id)) {
      this.connections.delete(client.id);
    }
  }

  emitNewEvents(events: EventEntity[]) {
    this.server.emit('newRelatedEvents', events);
  }

  @SubscribeMessage('ping')
  handleMessage(client: Socket, payload: string): void {
    this.server.emit('pong', {
      message: `${client.data.name}: ${payload}`,
      id: client.id,
    });
  }

  @SubscribeMessage('setName')
  handleName(client: Socket, payload: string): void {
    client.data.name = payload;
    this.server.emit('nameSet', {
      message: `${client.data.name} is set to ${client.id}`,
      id: client.id,
    });
  }
}
