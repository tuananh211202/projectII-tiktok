import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Noti } from 'src/typeorm/entities/Noti';
import { Follow } from 'src/typeorm/entities/Follow';
import { Message } from 'src/typeorm/entities/Message';
import { GoogleService } from 'src/google/google.service';
import { Post } from 'src/typeorm/entities/Post';

@Module({
  imports: [TypeOrmModule.forFeature([User, Noti, Follow, Message, Post])],
  controllers: [UsersController],
  providers: [UsersService, GoogleService],
  exports: [UsersService]
})
export class UsersModule {}
