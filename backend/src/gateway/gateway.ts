import { Inject, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { Conversation as convEntity, User as userEntity } from 'src/typeORM';
import { GroupMember as groupMemberEntity } from 'src/typeORM';
import { UsersService } from 'src/users/services/users/users.service';
import { Repository } from 'typeorm';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class MyGateWay implements OnModuleInit {
  constructor(
    @Inject('USERS_SERVICE') private readonly userService: UsersService,
    @InjectRepository(userEntity)
    private readonly userRepository: Repository<userEntity>,
    @InjectRepository(groupMemberEntity)
    private readonly groupMemberRespository: Repository<groupMemberEntity>,
  ) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('connected');
    });
  }

  @SubscribeMessage('register')
  async onRegisterUser(@MessageBody() body: any) {
    const userDB = await this.userService.findUserByUsername(body.username);
    await this.userRepository.update(userDB.id, { socketId: body.socketId });
  }

  @SubscribeMessage('newConversation')
  async onNewConversationStart(@MessageBody() conversation: convEntity) {
    console.log(conversation);
    let groupMembers = await this.groupMemberRespository.find({
        where: {
            conversationId: conversation.id
        }
      })

    groupMembers.forEach(async (member) => {
        let user = await this.userService.getUserById(member.userId);
        if ((user.username !== conversation.ownerUsername &&  conversation.chatType === 'group') || user.username === conversation.username) {
            try {
              console.log(user);
                this.server.to(user.socketId).emit("onNewConversation", conversation);
            }
            catch {
                console.error();
            }
        }        
    })

  }

  @SubscribeMessage('newMessage')
  async onNewMessage(@MessageBody() msg: any) {
    let groupMembers = await this.groupMemberRespository.find({
        where: {
            conversationId: msg.conversationId
        }
    })

    groupMembers.forEach(async (member) => {
        let user = await this.userService.getUserById(member.userId);
        if (user.username !== msg.from_user) {
            try {
                this.server.to(user.socketId).emit("onMessage", msg);
            }
            catch {
                console.error();
            }
        }        
    })
  }
}
