import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { User } from './typeorm/entities/User';
import { Noti } from './typeorm/entities/Noti';
import { Follow } from './typeorm/entities/Follow';
import { Message } from './typeorm/entities/Message';
import { CorsModule } from './cors/cors.module';
import { ChatGateway } from './chat/chat.gateway';
// import { SocketModule } from '@nestjs/platform-socket.io';
import { GoogleService } from './google/google.service';
import { Post } from './typeorm/entities/Post';
import { Comment } from './typeorm/entities/Comment';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '123456',
    database: 'project_tiktok',
    entities: [User, Noti, Follow, Message, Post, Comment],
    synchronize: true,
  }), AuthModule, UsersModule, CorsModule],
  controllers: [AppController],
  providers: [AppService, ChatGateway, GoogleService],
})
export class AppModule {}
