import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { CreateMessageParams, CreateUserNotiParams, CreateUserParams, GetNotiParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Noti } from 'src/typeorm/entities/Noti';
import { Follow } from 'src/typeorm/entities/Follow';
import { Message } from 'src/typeorm/entities/Message';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Noti) private notiRepository: Repository<Noti>,
    @InjectRepository(Follow) private followRepository: Repository<Follow>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ){}

  async createUser(userDetails: CreateUserParams){
    const user = await this.userRepository.findOneBy({ username: userDetails.username });
    if(!user){
      userDetails.password = await bcrypt.hash(userDetails.password, 10);
      const newUser = this.userRepository.create({ 
        ...userDetails, 
        createAt: new Date() 
      });
      this.userRepository.save(newUser);
      throw new HttpException(
        'Signup successfully!!!',
        HttpStatus.CREATED
      )
    } else {
      throw new HttpException(
        'User already exists!!!',
        HttpStatus.CONFLICT
      );
    }
  }

  async getUserById(id: number){
    const user = await this.userRepository.findOneBy({ id: id });
    if(!user){
      throw new HttpException(
        'User not found!!!',
        HttpStatus.BAD_REQUEST
      );
    }
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      description: user.description
    };
  }

  async findOne(username: string){
    return this.userRepository.findOneBy({ username: username });
  }

  async createUserNoti(id: number, notiDetails: CreateUserNotiParams){
    const user = await this.userRepository.findOneBy({ id });
    if(!user){
      throw new HttpException(
        'User not found!!!',
        HttpStatus.BAD_REQUEST
      );
    }
    const newNoti = this.notiRepository.create({...notiDetails, user});
    return this.notiRepository.save(newNoti);
  }

  async getAllNoti(id: number){
    const user = await this.userRepository.findOneBy({ id });
    if(!user){
      throw new HttpException(
        'User not found!!!',
        HttpStatus.BAD_REQUEST
      );
    }
    const notis = await this.notiRepository.findBy({ user });

    return notis;
  }

  async followUser(userId: number, id: number){
    const user = await this.userRepository.findOneBy({ id: userId });
    const followedUser = await this.userRepository.findOneBy({ id });
    if(!user || !followedUser){
      throw new HttpException(
        'User not found!!!',
        HttpStatus.BAD_REQUEST
      );
    }
    const newFollow = this.followRepository.create({ followers: user, following: followedUser });
    this.followRepository.save(newFollow);
    this.createUserNoti(id, {
      description: "Người dùng " + user.name + " đã theo dõi bạn"
    });
    throw new HttpException(
      'Add following successfully',
      HttpStatus.CREATED
    )
  }

  async unfollowUser(userId: number, id: number){
    const user = await this.userRepository.findOneBy({ id: userId });
    const followedUser = await this.userRepository.findOneBy({ id });
    if(!user || !followedUser){
      throw new HttpException(
        'User not found!!!',
        HttpStatus.BAD_REQUEST
      );
    }
    this.followRepository.delete({ followers: user, following: followedUser });
    throw new HttpException(
      'Unfollow successfully',
      HttpStatus.OK
    )
  }

  async getAllFollowers(id: number){
    const user = await this.userRepository.findOneBy({ id });
    if(!user){
      throw new HttpException(
        'User not found!!!',
        HttpStatus.BAD_REQUEST
      );
    }
    const followers = await this.followRepository.find({
      where: {following: user },
      relations: [ 'followers' ]
    });
    return followers.map(item => {
      return {
        id: item.id,
        user: {
          id: item.followers.id,
          name: item.followers.name
        }
      }
    });
  }

  async getAllFollowing(id: number){
    const user = await this.userRepository.findOneBy({ id });
    if(!user){
      throw new HttpException(
        'User not found!!!',
        HttpStatus.BAD_REQUEST
      );
    }
    const following = await this.followRepository.find({ 
      where: {followers: user},
      relations: [ 'following' ]
    });
    return following.map(item => {
      return {
        id: item.id,
        user: {
          id: item.following.id,
          name: item.following.name
        }
      }
    });
  }

  async createMessage(messageDetails: CreateMessageParams){
    const sender = await this.userRepository.findOneBy({ id: messageDetails.senderId });
    const receiver = await this.userRepository.findOneBy({ id: messageDetails.receiverId });
    if(!sender || !receiver){
      throw new HttpException(
        'User not found!!!',
        HttpStatus.BAD_REQUEST
      );
    }
    const newMessage = this.messageRepository.create({ 
      description: messageDetails.description, 
      sender: sender, receiver: receiver, 
      createAt: new Date() 
    });
    this.messageRepository.save(newMessage);
  }

  async getMessage(senderId: number, receiverId: number){
    const sender = await this.userRepository.findOneBy({ id: senderId });
    const receiver = await this.userRepository.findOneBy({ id: receiverId });
    if(!sender || !receiver){
      throw new HttpException(
        'User not found!!!',
        HttpStatus.BAD_REQUEST
      );
    }
    const messages = await this.messageRepository.find({
      where: [
        {sender: sender, receiver: receiver},
        {sender: receiver, receiver: sender},
      ],
      order: { createAt: "ASC" },
      relations: [ 'sender', 'receiver' ]
    });
    return messages.map(message => {
      return {
        description: message.description,
        createAt: message.createAt,
        sender: message.sender.id,
        receiver: message.receiver.id
      }
    })
  }

}