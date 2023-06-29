import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { CreateUserDto } from 'src/dtos/CreateUser.dto';
import { UsersService } from './users.service';
import { CreateUserNotiDto } from 'src/dtos/CreateUserNoti.dto';
import { GetNotiDto } from 'src/dtos/GetNoti.dto';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService){}

    @Public()
    @Post('signup')
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @Post(':id/notis')
    createUserNoti(@Param('id', ParseIntPipe) id: number, @Body() createUserNotiDto: CreateUserNotiDto){
        return this.userService.createUserNoti(id, createUserNotiDto);
    }

    @Get(':id/notis')
    getAllNoti(@Param('id', ParseIntPipe) id: number){
        return this.userService.getAllNoti(id);
    }
}
