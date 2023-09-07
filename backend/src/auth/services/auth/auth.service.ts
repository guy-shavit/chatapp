import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        @Inject('USERS_SERVICE') private readonly userService: UsersService,
        private jwtService: JwtService) {}

    async validateUser(username: string, password: string) {
        const userDB = await this.userService.findUserByUsername(username);
        if (userDB && userDB.password == password) {

            const payload = { username: username, userId: userDB.id};
            return {
                username: username,
                access_token: this.jwtService.sign(payload),
                statusCode: HttpStatus.OK
            };

        }

        return null;
    }

    async validateUserExists(username: string, password: string) {
        const usernameWithoutWhiteSpaces = username.replace(" ", "_");

        const user = await this.userService.findUserByUsername(usernameWithoutWhiteSpaces);

        if (!user){
            await this.userService.createUser({username: usernameWithoutWhiteSpaces, password: password});
            
            return {statusCode: HttpStatus.OK};
        }
        
        throw new HttpException("username already exists", HttpStatus.CONFLICT);
    }

}
