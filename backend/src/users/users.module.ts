import { Module } from '@nestjs/common';
import { UsersService } from './services/users/users.service';
import { UsersController } from './controllers/users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities, { Conversation, User } from 'src/typeORM';


/*
in a terminal pointing to the ~ directory
type mysql -u root -p
enter password: bar20041708A

type USE users;
and then show tables; to see the tables
type describe user; to see the table

*/

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  providers: [
    {
      provide: "USERS_SERVICE",
      useClass: UsersService
    } 
  ],
  controllers: [UsersController]
})
export class UsersModule {}
