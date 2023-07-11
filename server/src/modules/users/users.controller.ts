import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { CreateUserDto } from 'src/dtos/CreateUser.dto';
import { UsersService } from './users.service';
import { CreateUserNotiDto } from 'src/dtos/CreateUserNoti.dto';
import { GetNotiDto } from 'src/dtos/GetNoti.dto';
import { CreateMessageDto } from 'src/dtos/CreateMessage.dto';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService){}

    // Đăng ký
    @Public()
    @Post('signup')
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    // Lay thong tin nguoi dung theo id
    @Public()
    @Get('profile/:id')
    getUser(@Param('id', ParseIntPipe) id: number){
        return this.userService.getUserById(id);
    }

    // Tạo thông báo cho id
    @Post(':id/notis')
    createUserNoti(@Param('id', ParseIntPipe) id: number, @Body() createUserNotiDto: CreateUserNotiDto){
        return this.userService.createUserNoti(id, createUserNotiDto);
    }

    // Lấy thông báo theo id
    @Get(':id/notis')
    getAllNoti(@Param('id', ParseIntPipe) id: number){
        return this.userService.getAllNoti(id);
    }

    // Theo dõi một người
    @Post(':userId/follow/:id')
    followUser(@Param('userId', ParseIntPipe) userId: number, @Param('id', ParseIntPipe) id: number){
        return this.userService.followUser(userId, id);
    }

    // Huỷ theo dõi một người
    @Delete(':userId/follow/:id')
    unfollowUser(@Param('userId', ParseIntPipe) userId: number, @Param('id', ParseIntPipe) id: number){
        return this.userService.unfollowUser(userId, id);
    }

    // Lấy danh sách người đang theo dõi mình
    @Get(':id/followers')
    getAllFollowers(@Param('id', ParseIntPipe) id: number){
        return this.userService.getAllFollowers(id);
    }

    // Lấy danh sách người mình đang theo dõi
    @Get(':id/following')
    getAllFollowing(@Param('id', ParseIntPipe) id: number){
        return this.userService.getAllFollowing(id);
    }

    // Tạo tin nhắn giữa 2 người
    @Post('message')
    createMessage(@Body() createMessageDto: CreateMessageDto){
        return this.userService.createMessage(createMessageDto);
    }

    // Lấy tin nhắn giữa 2 người
    @Get('message/:senderId/:receiverId')
    getMessage(@Param('senderId', ParseIntPipe) senderId: number, @Param('receiverId', ParseIntPipe) receiverId: number){
        return this.userService.getMessage(senderId, receiverId);
    }
}
