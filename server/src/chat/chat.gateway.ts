import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Socket, Server } from "socket.io";
import { CreateMessageDto } from 'src/dtos/CreateMessage.dto';

import { UsersService } from 'src/modules/users/users.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor(private userService: UsersService){}

  @WebSocketServer() server: Server;

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: CreateMessageDto){
    await this.userService.createMessage(payload);
    this.server.emit('recMessage', payload);
  }

  afterInit(server: Server){
    console.log("Start socket server!!!");
  }

  // handleDisconnect(client: Socket){
  //   console.log("Disconnect");
  // }

  // handleConnection(client: Socket){
  //   console.log("Connect");
  // }
}

// TODO: change payload recMessage