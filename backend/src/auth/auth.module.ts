import { Module } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
import { AuthController } from './controllers/auth/auth.controller';
import { UsersService } from 'src/users/services/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeORM';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/strategy.local';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/strategy.jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
    })
  ],
  providers: [ 
    {
      provide: "AUTH_SERVICE", // this token allows as to inject the AuthService class into other class and use an interface as type hint instead of the class itself
      useClass: AuthService
    },
    {
      provide: "USERS_SERVICE",
      useClass: UsersService
    },
    LocalStrategy,
    JwtStrategy
  ],
  controllers: [AuthController]
})

export class AuthModule {}
