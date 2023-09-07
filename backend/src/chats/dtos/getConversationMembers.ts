import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { UserType } from "src/users/types/User";

export class getConversationMembersDto {
    @IsNotEmpty()
    @Type(() => UserType)
    members: UserType[];

    @IsNotEmpty()
    @IsString()
    ownerUsername: string;
}