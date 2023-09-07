import { Exclude } from 'class-transformer';

export class UserType {
    id: number;
    profile_image: string;
    username: string
}
export class SerializedUser {
    id: number;
    username: string;
    profile_image: string;

    @Exclude()
    socketId: string;

    @Exclude()
    password: string;

    constructor(partial: Partial<SerializedUser>) {
        Object.assign(this, partial);
      }
}