import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Noti } from 'src/typeorm/entities/Noti';
import { Follow } from 'src/typeorm/entities/Follow';
import { Message } from 'src/typeorm/entities/Message';

@Module({
  imports: [TypeOrmModule.forFeature([User, Noti, Follow, Message])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
