import {
  Controller,
  Get,
  Inject,
  UseGuards,
  Req,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateGroupDto } from 'src/chats/dtos/createGroup';
import { ChatsService } from 'src/chats/services/chats/chats.service';
import { SerializedUser } from 'src/users/types/User';
import { Conversation as convEntity } from 'src/typeORM';
import { User as userEntity } from 'src/typeORM';
import { diskStorage } from 'multer';
import { parse } from 'path';
import { getConversationMembersDto } from 'src/chats/dtos/getConversationMembers';
import { ChatSearchQueryType } from 'src/chats/types/GetChatsSearchQuery';
import { StartDMType } from 'src/chats/types/startDM';
import { GetChatMessagesType } from 'src/chats/types/GetChatMessages';
import { StoreMessageType } from 'src/chats/types/StoreMessage';
import { GetGroupType } from 'src/chats/types/GetGroup';
import { GetUsersSearchQuery } from 'src/chats/types/GetUsersSeachQuery';

export const storage = {
  storage: diskStorage({
    destination: 'profileImagesGroups',
    filename: (req, file, cd) => {
      const filename: string = req.query['groupId'].toString();
      const extension: string = parse(file.originalname).ext;

      cd(null, `${filename}${extension}`);
    },
  }),
};

@Controller('chats')
export class ChatsController {
  constructor(
    @Inject('CHATS_SERVICE') private readonly chatService: ChatsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('getSearchChats')
  async getChatsOnSearch(
    @Query() query: ChatSearchQueryType,
    @Req() req: Request,
  ): Promise<SerializedUser[] | convEntity[]> {
    if (query.chatQuery === null || query.chatQuery === '') {
      return [];
    }

    const chats = await this.chatService.getChatSearch(
      req['user'].username,
      query.chatQuery,
    );

    // console.log(chats);

    return chats.map(
      (chat: userEntity | convEntity) => new SerializedUser(chat),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('getChatsOnSiteLoad')
  async getChatsOnLoad(@Req() req: Request): Promise<convEntity[]> {
    const chats = await this.chatService.getMyChatsOnLoad(req['user'].username);

    return chats;
  }

  @UseGuards(JwtAuthGuard)
  @Post('startDM')
  async startDM(@Body() data: StartDMType, @Req() req: Request) {
    const username = req['user'].username;
    let username_2: string = data.username;

    const DMConversation = await this.chatService.startNewDMConversation(
      username,
      username_2,
    );

    let usernames = DMConversation.username.split(' ');
    usernames = usernames.filter((name) => name !== req['user'].username);
    DMConversation.username = usernames[0];

    return DMConversation;
  }

  @UseGuards(JwtAuthGuard)
  @Get('getChatMessages')
  async getChatMessages(@Query() query: GetChatMessagesType) {
    const convId = query['conversationId'];

    return this.chatService.getMessages(convId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('storeMessage')
  async storeMessage(@Body() data: StoreMessageType, @Req() req: Request) {
    const msg = await this.chatService.storeMessage(
      req['user'].username,
      data.message,
      data.conversationId,
    );

    return msg;
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('getMyDMUsers')
  async getAllDMUsers(@Req() req: Request) {
    const users = await this.chatService.getMyDMUsers(req['user'].username);

    return users.map((user) => new SerializedUser(user));
  }

  @UseGuards(JwtAuthGuard)
  @Get('getNewUsersBySearch')
  async getNewUsersBySearch(
    @Req() req: Request,
    @Query() query: GetUsersSearchQuery ): Promise<SerializedUser[]> {
    const users: userEntity[] = await this.chatService.getNewUsersBySearch(
      req['user'].username,
      query.username,
    );

    return users.map((user) => new SerializedUser(user));
  }

  @UseGuards(JwtAuthGuard)
  // @UsePipes(ValidationPipe)
  @Post('createGroup')
  async createGroup(
    @Body() createGroupDto: CreateGroupDto,
    @Req() req: Request,
  ) {
    const conversation = await this.chatService.createGroupChat(
      req['user'].username,
      createGroupDto.groupName,
      createGroupDto.initialUsers,
    );
    return conversation;
  }

  @UseGuards(JwtAuthGuard)
  @Post('uploadGroupProfileImage')
  @UseInterceptors(FileInterceptor('picture', storage))
  uploadGroupProfileImage(@UploadedFile() file: Express.Multer.File) {
    const groupId = file.filename.split('.')[0];
    this.chatService.updateGroupProfileImage(parseInt(groupId), file.filename);
    return { image: file.filename };
  }

  @UseGuards(JwtAuthGuard)
  @Get('getGroup')
  async getGroup(@Query() query: GetGroupType) {
    const groupId = parseInt(query.id);

    return await this.chatService.getGroup(groupId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getConversationMembers')
  async getConversationMembers(
    @Query() query: Record<string, number>,
  ): Promise<getConversationMembersDto> {
    const dto = await this.chatService.getConversationUsers(query['id']);

    const serializedUsers = dto.members.map((user) => new SerializedUser(user));

    return { members: serializedUsers, ownerUsername: dto.ownerUsername };
  }
}
