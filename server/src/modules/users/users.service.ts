import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { CreateUserNotiParams, CreateUserParams, GetNotiParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Noti } from 'src/typeorm/entities/Noti';

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Noti) private notiRepository: Repository<Noti>
  ){}

  async createUser(userDetails: CreateUserParams){
    const user = await this.userRepository.findOneBy({ username: userDetails.username });
    if(!user){
      userDetails.password = await bcrypt.hash(userDetails.password, 10);
      const newUser = this.userRepository.create({ 
        ...userDetails, 
        createAt: new Date() 
      });
      return this.userRepository.save(newUser);
    } else {
      throw new HttpException(
        'User already exists!!!',
        HttpStatus.CONFLICT
      );
    }
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
}