import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { CreateUserDto } from 'src/dtos/CreateUser.dto';
import { UsersService } from './users.service';
import { CreateUserNotiDto } from 'src/dtos/CreateUserNoti.dto';
import { GetNotiDto } from 'src/dtos/GetNoti.dto';
import { CreateMessageDto } from 'src/dtos/CreateMessage.dto';
import { UpdateUserDto } from 'src/dtos/UpdateUser.dto';
import { UpdatePasswordDto } from 'src/dtos/UpdatePassword.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GoogleService } from 'src/google/google.service';
import { UploadPost } from 'src/dtos/UploadPost.dto';
import { CreateCommentDto } from 'src/dtos/CreateComment.dto';

@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService,
        private googleService: GoogleService
    ){}

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

    @Put('profile/:id')
    updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto){
        return this.userService.updateUser(id, updateUserDto);
    }

    @Put('profile/password/:id')
    updatePassword(@Param('id', ParseIntPipe) id: number, @Body() updatePasswordDto: UpdatePasswordDto){
        return this.userService.updatePassword(id, updatePasswordDto);
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

    // Đánh dấu thông báo đã đọc
    @Put(':id/notis')
    setNotiIsRead(@Param('id', ParseIntPipe) id: number){
        return this.userService.setNotiIsRead(id);
    }

    // // Theo dõi một người
    // @Post(':userId/follow/:id')
    // followUser(@Param('userId', ParseIntPipe) userId: number, @Param('id', ParseIntPipe) id: number){
    //     return this.userService.followUser(userId, id);
    // }

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

    // upload video to google drive and get it's id
    @Post('/upload')
    @UseInterceptors(FileInterceptor('video', { dest: './uploads' }))
    async uploadVideo(@UploadedFile() file){
        return this.googleService.uploadFile(file);
    }

    // upload post
    @Post(':id/post')
    async uploadPost(@Param('id', ParseIntPipe) id: number, @Body() uploadPostDto: UploadPost){
        return this.userService.uploadPost(id, uploadPostDto);
    }

    // get all post
    @Get(':id/post')
    async getAllPostById(@Param('id', ParseIntPipe) id: number){
        return this.userService.getAllPostById(id);
    }

    // get following post
    @Get('post/:id')
    async getAllFollowingPost(@Param('id', ParseIntPipe) id: number){
        return this.userService.getAllFollowingPost(id);
    }

    // get Post by postId
    @Get('watch/:id')
    async getPostByPostId(@Param('id', ParseIntPipe) id: number){
        return this.userService.getPostByPostId(id);
    }

    // create Comment
    @Post('comment/:postId/:userId')
    async createComment(@Param('postId', ParseIntPipe) postId: number, @Param('userId', ParseIntPipe) userId: number, @Body() commentDto: CreateCommentDto){
        return this.userService.createComment(postId, userId, commentDto);
    }

    // get all comment
    @Get('comment/:postId')
    async getAllComment(@Param('postId', ParseIntPipe) postId: number){
        return this.userService.getAllComment(postId);
    }

    // get all react
    @Get('react/:postId')
    async getAllReact(@Param('postId', ParseIntPipe) postId: number){
        return this.userService.getAllReact(postId);
    }

    // delete react
    @Delete('react/:postId/:userId')
    async deleteReact(@Param('postId', ParseIntPipe) postId: number, @Param('userId', ParseIntPipe) userId: number){
        return this.userService.deleteReact(postId, userId);
    }
}


// TODO: change api data(add notis from + createAt for sort) + set read by id + set all read by type