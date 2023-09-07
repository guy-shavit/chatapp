import { Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from './typeORM';
import { UsersModule } from './users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { join } from 'path';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      entities: entities,
      database: 'chatApp',
      // synchronize: true,
  }),
    AuthModule,
    ChatsModule,
    ServeStaticModule.forRoot(
    {
      rootPath: join(__dirname, '..', 'profileImages'),
      renderPath: '/profileImages',
    },
    {
      rootPath: join(__dirname, '..', 'profileImagesGroups'),
      renderPath: '/profileImagesGroups',
    },
    ),
    GatewayModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
