import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signIn(username, pass) {
    const user = await this.usersService.findOne(username);
    if(!user){
      throw new HttpException(
        'User not found!!!',
        HttpStatus.BAD_REQUEST
      );
    }
    const is_equal = await bcrypt.compare(pass, user?.password);
    if(!is_equal){
      throw new HttpException(
        'Wrong password!!!',
        HttpStatus.UNAUTHORIZED
      );
    }
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user_id: user.id
    };
  }
}