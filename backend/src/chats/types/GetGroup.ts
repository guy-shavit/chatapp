import { IsNumberString } from "class-validator";

export class GetGroupType {
    @IsNumberString()
    id: string;
}