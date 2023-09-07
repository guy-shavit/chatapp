import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConversationMembersDto } from 'src/chats/dtos/getConversationMembers';
import { Conversation as convEntity } from 'src/typeORM';
import { User as userEntity } from 'src/typeORM';
import { GroupMember as groupMemberEntity } from 'src/typeORM';
import { Message as msgEntity } from 'src/typeORM';
import { UsersService } from 'src/users/services/users/users.service';
import { UserType } from 'src/users/types/User';
import { Repository } from 'typeorm';

export const asyncFilter = async (arr: any[], afunc) => {
  const results = await Promise.all(arr.map(afunc));

  return arr.filter((_v, index) => results[index]);
};

@Injectable()
export class ChatsService {
  constructor(
    @Inject('USERS_SERVICE') private readonly userService: UsersService,
    @InjectRepository(convEntity)
    private readonly convRepository: Repository<convEntity>,
    @InjectRepository(msgEntity)
    private readonly msgRepository: Repository<msgEntity>,
    @InjectRepository(groupMemberEntity)
    private readonly groupMemberRepository: Repository<groupMemberEntity>,
  ) {}

  async getMyChatsOnLoad(username: string): Promise<convEntity[]> {
    ` Only returns little details about the chat
        so when the page is loaded the user will have a list of his chats,
        and only when he selects certain chat the server will send all the information related to it.`;

    const userDB = await this.userService.findUserByUsername(username);

    const groupMembers: groupMemberEntity[] =
      await this.groupMemberRepository.find({
        where: {
          user: userDB,
        },
      });
    const conversations: convEntity[] = [];

    for (let i = 0; i < groupMembers.length; i++) {
      let member = groupMembers[i];

      let conv = await this.convRepository.findOne({
        where: {
          id: member.conversationId,
        },
      });
      if (conv.chatType === 'dm') {
        let usernames = conv.username.split(' ');
        usernames = usernames.filter((name) => name !== username);
        conv.username = usernames[0];

        let secondGroupMember = await this.groupMemberRepository
          .createQueryBuilder('group_member')
          .where('group_member.conversationId = :conversationId', {
            conversationId: `${conv.id}`,
          })
          .andWhere('group_member.group_member_id != :memberId', {
            memberId: `${member.id}`,
          })
          .getOne();

        const user = await this.userService.getUserById(
          secondGroupMember.userId,
        );
        conv.profile_image = user.profile_image;
      }

      conversations.push(conv);
    }

    return conversations;
  }

  async getUsersExistingDM(
    user_1: userEntity,
    user_2: userEntity,
  ): Promise<convEntity | null> {
    const user1groupMembers = await this.groupMemberRepository.find({
      where: {
        user: user_1,
      },
      relations: {
        user: true,
      },
    });
    let conversation: convEntity;
    let relatedGroupMembers: groupMemberEntity[];

    let conv: convEntity | null = null;

    for (let i = 0; i < user1groupMembers.length; i++) {
      let groupMember = user1groupMembers[i];

      conversation = await this.convRepository.findOne({
        where: {
          id: groupMember.conversationId,
          chatType: 'dm',
        },
      });
      if (conversation === null) {
        continue;
      }
      relatedGroupMembers = await this.groupMemberRepository.find({
        where: {
          conversation: conversation,
        },
      });
      relatedGroupMembers.forEach((relatedGroupMember) => {
        if (relatedGroupMember.userId === user_2.id) {
          conv = conversation;
          return ;
        }
      });
      if (conv !== null) {
        break;
      }
    }

    return conv;
  }

  async ValidateUser(username: string, id: number) {
    const IsSecondUserExists =
      await this.userService.validateUserByUsernameAndId(username, id);

    if (!IsSecondUserExists) {
      return new HttpException('User does not exists', HttpStatus.BAD_REQUEST);
    }
  }

  async getMyDMUsers(username: string): Promise<userEntity[]> {
    const userDB = await this.userService.findUserByUsername(username);

    const groupMembers = await this.groupMemberRepository.find({
      where: {
        user: userDB,
      },
    });
    const users: userEntity[] = [];
    for (let i = 0; i < groupMembers.length; i++) {
      let member = groupMembers[i];

      let conv = await this.convRepository.findOne({
        where: {
          id: member.conversationId,
        },
      });

      if (conv.chatType === 'group') {
        continue;
      }

      let secondGroupMember = await this.groupMemberRepository
        .createQueryBuilder('group_member')
        .where('group_member.conversationId = :conversationId', {
          conversationId: `${conv.id}`,
        })
        .andWhere('group_member.group_member_id != :memberId', {
          memberId: `${member.id}`,
        })
        .getOne();

      let user = await this.userService.getUserById(secondGroupMember.userId);

      users.push(user);
    }
    return users;
  }

  async getNewUsersBySearch(ownerUsername: string, partialUsername: string) {
    if (partialUsername === '') {
      return [];
    }

    const user = await this.userService.findUserByUsername(ownerUsername);

    const users: userEntity[] = await this.userService.getUsersBySearch(
      partialUsername,
    );

    // searches if the user attends in the search results and removes him
    let index = -1;
    users.some((object, idx) => {
      if (object.username == ownerUsername) {
        index = idx;
        return true;
      }
    });
    if (index !== -1) {
      users.splice(index, 1);
    }

    const newUsers: userEntity[] = [];

    for (let i=0; i<users.length; i++) {
      let conv: convEntity = await this.getUsersExistingDM(user, users[i]);
      if (conv === null) {
        newUsers.push(users[i]);
      }
    }

    return newUsers;

  }

  async startNewDMConversation(
    initiatorUsername: string,
    secondUserUsername: string,
  ): Promise<convEntity> {
    const userDB_1 = await this.userService.findUserByUsername(
      initiatorUsername,
    );
    const userDB_2 = await this.userService.findUserByUsername(
      secondUserUsername,
    );

    let existingConv = await this.getUsersExistingDM(userDB_1, userDB_2);

    if (existingConv !== null) {
      return existingConv;
    }

    const conv = this.convRepository.create({
      username: `${initiatorUsername} ${secondUserUsername}`,
      chatType: 'dm',
      profile_image: userDB_2.profile_image,
    });
    const createdConv = await this.convRepository.save(conv);

    const groupMember_1 = this.groupMemberRepository.create({
      joinedDatetime: new Date(),
      user: userDB_1,
      conversation: createdConv,
    });
    await this.groupMemberRepository.save(groupMember_1);

    const groupMember_2 = this.groupMemberRepository.create({
      joinedDatetime: new Date(),
      user: userDB_2,
      conversation: createdConv,
    });
    await this.groupMemberRepository.save(groupMember_2);

    return conv;
  }

  async getChatSearch(
    ownerUsername: string,
    partialChatName: string,
  ): Promise<UserType[] | convEntity[]> {
    const user = await this.userService.findUserByUsername(ownerUsername);

    const users: userEntity[] = await this.userService.getUsersBySearch(
      partialChatName,
    );

    // searche
    let index = -1;
    users.some((object, idx) => {
      if (object.username == ownerUsername) {
        index = idx;
        return true;
      }
    });
    if (index !== -1) {
      users.splice(index, 1);
    }
    const DMsConvs: convEntity[] = [];

    for (let i=0; i<users.length; i++) {
      let conv: convEntity = await this.getUsersExistingDM(user, users[i]);
      if (conv !== null) {
        DMsConvs.push(conv);
      }
    }
    // groups that the users patricipate in
    let groups: convEntity[] = await this.convRepository
      .createQueryBuilder('conversation')
      .where('conversation.conversation_name LIKE :conversation_name', {
        conversation_name: `%${partialChatName}%`,
      })
      .andWhere('conversation.chatType= :chatType', {
        chatType: 'group',
      })
      .getMany();

    const filteredGroups = await asyncFilter(
      groups,
      async (group: convEntity) => {
        const isExists = await this.groupMemberRepository.findOne({
          where: {
            conversationId: group.id,
            user: user,
          },
        });

        return isExists !== null;
      },
    );

    return [...DMsConvs, ...filteredGroups];
  }

  async getMessages(conversationId: number): Promise<msgEntity[]> {
    const conversation = await this.convRepository.findOne({
      where: {
        id: conversationId,
      },
    });
    const messages: msgEntity[] = await this.msgRepository.find({
      where: {
        conversation: conversation,
      },
    });

    return messages;
  }

  async storeMessage(
    username: string,
    message: string,
    conversationId: number,
  ): Promise<msgEntity> {
    const conversation = await this.convRepository.findOne({
      where: {
        id: conversationId,
      },
    });

    const msg = this.msgRepository.create({
      from_user: username,
      text: message,
      sent_datetime: new Date(),
      conversation: conversation,
    });

    return await this.msgRepository.save(msg);
  }

  async createGroupChat(
    creatorUsername: string,
    title: string,
    initialUsers: UserType[],
  ): Promise<convEntity> {
    const conv = this.convRepository.create({
      ownerUsername: creatorUsername,
      username: title,
      chatType: 'group',
      profile_image: 'default.jpg',
    });
    const createdConv = await this.convRepository.save(conv);

    initialUsers.forEach(async (user) => {
      let userDB = await this.userService.findUserByUsername(user.username);

      const groupMember = this.groupMemberRepository.create({
        joinedDatetime: new Date(),
        user: userDB,
        conversation: createdConv,
      });
      await this.groupMemberRepository.save(groupMember);
    });

    return createdConv;
  }

  async updateGroupProfileImage(
    groupId: number,
    imageName: string,
  ): Promise<void> {
    await this.convRepository.update(groupId, { profile_image: imageName });
  }

  async getGroup(groupId: number): Promise<convEntity> {
    return await this.convRepository.findOne({
      where: {
        id: groupId,
      },
    });
  }

  async getConversationUsers(
    groupId: number,
  ): Promise<getConversationMembersDto> {
    const conversation = await this.convRepository.findOne({
      where: {
        id: groupId,
      },
    });

    const members = await this.groupMemberRepository.find({
      where: {
        conversation: conversation,
      },
    });

    const users = [];
    let user: userEntity;
    for (let i = 0; i < members.length; i++) {
      user = await this.userService.getUserById(members[i].userId);
      users.push(user);
    }

    return { members: users, ownerUsername: conversation.ownerUsername };
  }
}
