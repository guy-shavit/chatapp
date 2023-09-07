import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities, { User } from 'src/typeORM';
import { UsersService } from 'src/users/services/users/users.service';
import { ChatsController } from './controllers/chats/chats.controller';
import { ChatsService } from './services/chats/chats.service';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [ChatsController],
  providers: [
    {
      provide: "CHATS_SERVICE",
      useClass: ChatsService
    },
    {
      provide: "USERS_SERVICE",
      useClass: UsersService
    }
  ]
})
export class ChatsModule {}
