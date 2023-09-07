import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { UserType } from "src/users/types/User";

export class CreateGroupDto {
    @IsNotEmpty()
    @Type(() => UserType)
    initialUsers: UserType[];

    @IsNotEmpty()
    groupName: string;
}