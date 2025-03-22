import {
  WebSocketGateway as NestWebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@NestWebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class WebSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit() {
    console.log("Initialized");
  }

  handleConnection(client: Socket) {
    console.log(`Client id: ${client.id} connected`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliend id:${client.data.name} disconnected`);
  }

  @SubscribeMessage("ping")
  handleMessage(client: Socket, payload: string): void {
    console.log(`Message from ${client.id}: ${payload}`);
    this.server.emit("pong", {
      message: `${client.data.name}: ${payload}`,
      id: client.id,
    });
  }

  @SubscribeMessage("setName")
  handleName(client: Socket, payload: string): void {
    client.data.name = payload;
    this.server.emit("nameSet", {
      message: `${client.data.name} is set to ${client.id}`,
      id: client.id,
    });
  }
}
