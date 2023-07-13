import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Socket, Server } from "socket.io";
import { CreateMessageDto } from 'src/dtos/CreateMessage.dto';
import { CreateUserNotiDto } from 'src/dtos/CreateUserNoti.dto';

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

    const senderName = (await this.userService.getUserById(payload.senderId)).username;
    await this.userService.createUserNoti(payload.receiverId, { description: '' + senderName + ' sent you some messages.'});
    this.server.emit('recNoti', { id: payload.receiverId });
  }

  @SubscribeMessage('followUser')
  async handleFollowUser(client: Socket, payload: { userId: number, id: number }){
    await this.userService.followUser(payload.userId, payload.id);

    const userName = (await this.userService.getUserById(payload.userId)).username;
    await this.userService.createUserNoti(payload.id, { description: '' + userName + ' has started following you.'});
    this.server.emit('recNoti', { id: payload.id });
  }

  afterInit(server: Server){
    console.log("Start socket server!!!");
  }
}