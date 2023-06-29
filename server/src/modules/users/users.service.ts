import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { CreateUserParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
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
}