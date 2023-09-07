import { Body, Controller, Inject, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';

@Controller('auth')
export class AuthController {
    constructor(@Inject('AUTH_SERVICE') private readonly authService: AuthService) {}

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        return req.user;
    }

    @Post('signUp')
    @UsePipes(ValidationPipe)
    signUp(@Body() createUserDto: CreateUserDto) {
        return this.authService.validateUserExists(createUserDto.username, createUserDto.password);
    }
}
