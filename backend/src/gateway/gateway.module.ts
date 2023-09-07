import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from 'src/typeORM';
import { UsersService } from 'src/users/services/users/users.service';
import { MyGateWay } from './gateway';

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    providers: [
        MyGateWay,
        {
          provide: "USERS_SERVICE",
          useClass: UsersService
        }
    ]
})
export class GatewayModule {}
