import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../services/auth/auth.service";

// this class will handle the password and username authentication which are stored locally on the database
@Injectable()
export class LocalStrategy  extends PassportStrategy(Strategy) {
    
    constructor(@Inject('AUTH_SERVICE') private readonly authService: AuthService) {
        super()
    }

    async validate(username: string, password: string) {
        const user_creds = await this.authService.validateUser(username, password);

        if (!user_creds) {
            throw new UnauthorizedException();
        }
        return user_creds;
    }

}