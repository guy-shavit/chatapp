import { Body, ClassSerializerInterceptor, Controller, Get, Inject, Post, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/services/users/users.service';
import { diskStorage } from 'multer';
import { parse } from 'path';
import { SerializedUser } from 'src/users/types/User';

export const storage = {
    storage: diskStorage({
        destination: 'profileImages',
        filename: (req, file, cd) => {
            const filename: string = req.user['username'];
            const extension: string = parse(file.originalname).ext;

            cd(null, `${filename}${extension}`);
        }
    })
}
@Controller('users')
export class UsersController {
    constructor(@Inject("USERS_SERVICE") private readonly userSerice: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Post('uploadProfileImage')
    @UseInterceptors(FileInterceptor('picture', storage))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        const username = file.filename.split(".")[0];

        this.userSerice.updateProfileImage(username ,file.filename);
        return {image: file.filename};
    }

    @UseGuards(JwtAuthGuard)
    @Get('getProfileImage')
    async updateProfileImage(@Req() req: Request){    
        const userDB = await this.userSerice.findUserByUsername(req['user'].username);
        
        return {image: userDB.profile_image};
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Get('getMe')
    async createUser(@Req() req: Request) {
        const user =  await this.userSerice.findUserByUsername(req['user'].username);
        return new SerializedUser(user);
    }


}
