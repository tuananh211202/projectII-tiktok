import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { CreateMessageParams, CreateUserNotiParams, CreateUserParams, GetNotiParams, UpdatePasswordParams, UpdateUserParams, UploadPostParams } from 'src/utils/types';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Noti } from 'src/typeorm/entities/Noti';
import { Follow } from 'src/typeorm/entities/Follow';
import { Message } from 'src/typeorm/entities/Message';
import { Post } from 'src/typeorm/entities/Post';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Noti) private notiRepository: Repository<Noti>,
    @InjectRepository(Follow) private followRepository: Repository<Follow>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ){}

  async createUser(userDetails: CreateUserParams){
    const user = await this.userRepository.findOneBy({ username: userDetails.username });
    const userByName = await this.userRepository.findOneBy({ name: userDetails.name });
    if(!user && !userByName){
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

  async updateUser(id: number, updateUserDetails: UpdateUserParams){
    let user = await this.userRepository.findOneBy({ id: id })
    if(!user){
      throw new HttpException(
        'User not found!!!',
        HttpStatus.BAD_REQUEST
      );
    }
    user = { ...user, ...updateUserDetails };
    await this.userRepository.save(user);
  }

  async updatePassword(id: number, updatePasswordDetails: UpdatePasswordParams){
    let user = await this.userRepository.findOneBy({ id: id });
    if(!user){
      throw new HttpException(
        'User not found!!!',
        HttpStatus.BAD_REQUEST
      );
    }
    const is_equal = await bcrypt.compare(updatePasswordDetails.old_password, user.password);
    if(!is_equal){
      throw new HttpException(
        'Wrong password!!!',
        HttpStatus.UNAUTHORIZED
      );
    }
    user.password = await bcrypt.hash(updatePasswordDetails.password, 10);
    await this.userRepository.save(user);
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
    const currentNoti = await this.notiRepository.find({
      where: {
        description: notiDetails.description,
        isRead: 0
      }
    });
    if(currentNoti.length === 0){
      const newNoti = this.notiRepository.create({...notiDetails, user});
      return this.notiRepository.save(newNoti);
    }
    return null;
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

    return notis.reverse();
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

  async uploadPost(id: number, postDetails: UploadPostParams){
    const user = await this.userRepository.findOneBy({ id });
    if(!user){
      throw new HttpException(
        'User not found!!!',
        HttpStatus.BAD_REQUEST
      );
    }
    const newPost = this.postRepository.create({ 
      ...postDetails, 
      react: 0,
      user 
    });

    return this.postRepository.save(newPost);
  }

  async getAllPostById(id: number){
    const user = await this.userRepository.findOneBy({ id });
    if(!user){
      throw new HttpException(
        'User not found!!!',
        HttpStatus.BAD_REQUEST
      );
    }
    const posts = await this.postRepository.find({
      where: { user: user }
    });
    return posts;
  }

  async setNotiIsRead(id: number){
    let noti = await this.notiRepository.findOneBy({ id });
    if(!noti){
      throw new HttpException(
        'Noti not found!!!',
        HttpStatus.BAD_REQUEST
      );
    }

    if(noti.isRead === 0) noti.isRead = 1;
    this.notiRepository.save(noti);
  }

  async getAllFollowingPost(id: number){
    const user = await this.userRepository.findOneBy({ id });
    if(!user){
      throw new HttpException(
        'User not found!!!',
        HttpStatus.BAD_REQUEST
      );
    }

    const following = await this.followRepository.find({
      where: {
        followers: user
      },
      relations: ["following"]
    });

    const posts = await this.postRepository.find({
      where: {
        user: In(following.map(u => u.following.id))
      },
      relations: ["user"]
    });

    return posts.map(item => {
      return {
        ...item,
        user: {
          id: item.user.id,
          name: item.user.name
        }
      }
    }).reverse();
  }

}