import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GroupMember } from "./GroupMember";
import { Message } from "./Message";

// this is a table in the users database 
@Entity()
export class Conversation {
    @PrimaryGeneratedColumn('increment',{
        type: 'bigint',
        name: 'conversation_id'
    })
    id: number;

    @Column({
        nullable: true,
        name: 'owner_username'
    })
    ownerUsername: string;

    @Column({
        nullable: false,
        default: '',
        name: 'conversation_name'
    })
    username: string;

    @Column({
        default: 'default.jpg'
    })
    profile_image: string

    @Column({
        nullable: false,
        name: 'chat_type'
    })
    chatType: 'dm' | 'group'

    @OneToMany(() => Message, (message) => message.conversation)
    messages: Message[];

    @OneToMany(() => GroupMember, (groupMember) => groupMember.conversation)
    groupMembers: GroupMember[];

}