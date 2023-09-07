import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User as userEntity } from 'src/typeORM';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(userEntity) private readonly  userRepository: Repository<userEntity>) {}
    
    createUser(createUserDto: CreateUserDto) {
        const newUser = this.userRepository.create(createUserDto);
        return this.userRepository.save(newUser);
    }
    
    findUserByUsername(username: string): Promise<userEntity> {
        return this.userRepository.findOne({
            where: { 
                username: username
            }
        
        });
    }

    async validateUserByUsernameAndId(username: string, id: number): Promise<boolean> {
        const user =  await this.userRepository.findOne({
            where: { 
                id: id,
                username: username
            }
        });
        return user !== null;
    }

    async getUsersBySearch(partialUsername: string): Promise<userEntity[]> {
        const matchedUsers = await this.userRepository
                .createQueryBuilder("user")
                .where("user.username LIKE :username", {username: `%${partialUsername}%`})
                .getMany()
                
        return matchedUsers;
    }

    async getUserById(id: number): Promise<userEntity> {
        return await this.userRepository.findOne({
            where: {
                id: id
            }
        });
    }

    async updateProfileImage(username: string, imageName: string): Promise<void> {
        const userDB = await this.findUserByUsername(username);

        await this.userRepository.update(userDB.id, {profile_image: imageName});
    }
}
