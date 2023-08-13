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

    const name = (await this.userService.getUserById(payload.senderId)).name;
    await this.userService.createUserNoti(payload.receiverId, { description: '' + payload.senderId + '|' + name + ' sent you a message.', isRead: 0, type: 'message' });
    this.server.emit('recNoti', { id: payload.receiverId });
  }

  @SubscribeMessage('followUser')
  async handleFollowUser(client: Socket, payload: { userId: number, id: number }){
    await this.userService.followUser(payload.userId, payload.id);

    const name = (await this.userService.getUserById(payload.userId)).name;
    await this.userService.createUserNoti(payload.id, { description: '' + payload.userId + '|' + name + ' has started following you.', isRead: 0, type: 'follower'});
    this.server.emit('recNoti', { id: payload.id });
  }

  @SubscribeMessage('commentAndReact')
  async handleComment(client: Socket, payload: { postId: number, userId: number, description?: string, type?: string }){
    if(payload.type === "delete"){
      await this.userService.deleteReact(payload.postId, payload.userId);
      this.server.emit('recCR', { id: payload.postId });
    }else {
      this.userService.createComment(payload.postId, payload.userId, { description: payload.description });
      this.server.emit('recCR', { id: payload.postId });
    }
  }

  afterInit(server: Server){
    console.log("Start socket server!!!");
  }
}